-- =====================================================================================
-- SouvLucky backend — run once in Supabase: Dashboard → SQL Editor → New query → paste → Run.
--
-- Rules (edit the constants in the functions below to change them):
--   • 10 stamps fill a card; a full card becomes a "Free Gyro" reward.
--   • One stamp per customer every 2 hours.
--   • New members get a "Free Gyro" welcome reward.
--   • Birthdays: a "Free Baklava (with any purchase)" reward, valid 7 days, granted at 06:00 SAST.
--   • Only staff (profiles.is_staff = true) can add stamps or redeem rewards, via a scanned QR code.
-- =====================================================================================

create extension if not exists pg_cron;
create extension if not exists pg_net;

-- ─── Tables ──────────────────────────────────────────────────────────────────────────

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  name text not null default '',
  member_code text not null unique,
  birthday_day smallint check (birthday_day between 1 and 31),
  birthday_month smallint check (birthday_month between 1 and 12),
  marketing_opt_in boolean not null default false,
  marketing_opt_in_at timestamptz,
  stamps smallint not null default 0 check (stamps between 0 and 10),
  cards_completed integer not null default 0,
  last_stamp_at timestamptz,
  is_staff boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.rewards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  kind text not null check (kind in ('welcome', 'card', 'birthday')),
  title text not null,
  details text,
  created_at timestamptz not null default now(),
  expires_at timestamptz,
  redeemed_at timestamptz,
  redeemed_by uuid references public.profiles (id) on delete set null,
  branch_id text
);
create index rewards_user_idx on public.rewards (user_id);

create table public.stamp_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  staff_id uuid references public.profiles (id) on delete set null,
  branch_id text,
  created_at timestamptz not null default now()
);
create index stamp_events_user_idx on public.stamp_events (user_id);

-- Short-lived codes behind the customer's rotating QR code.
create table public.scan_tokens (
  token text primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  expires_at timestamptz not null
);

-- News & events shown in the app. Add rows in Table Editor → posts.
-- Set notify = true to send a push notification to everyone when the post is published.
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text not null default '',
  body text not null default '',
  image_url text,
  branch_id text check (branch_id in ('parkmore', 'prison-break')),
  event_date date,
  published boolean not null default true,
  notify boolean not null default false,
  published_at timestamptz not null default now()
);

create table public.push_tokens (
  token text primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  platform text,
  updated_at timestamptz not null default now()
);

-- ─── Row level security ──────────────────────────────────────────────────────────────

alter table public.profiles enable row level security;
alter table public.rewards enable row level security;
alter table public.stamp_events enable row level security;
alter table public.scan_tokens enable row level security;
alter table public.posts enable row level security;
alter table public.push_tokens enable row level security;

create policy "Members read their own profile" on public.profiles for select to authenticated using (id = auth.uid());
create policy "Members edit their own profile" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
-- Members may only change these columns; stamps, staff flag etc. change through the functions below.
revoke update on public.profiles from anon, authenticated;
grant update (name, birthday_day, birthday_month, marketing_opt_in) on public.profiles to authenticated;

create policy "Members read their own rewards" on public.rewards for select to authenticated using (user_id = auth.uid());
create policy "Members read their own stamps" on public.stamp_events for select to authenticated using (user_id = auth.uid());
create policy "Anyone reads published posts" on public.posts for select to anon, authenticated using (published);
create policy "Members manage their own push tokens" on public.push_tokens for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
-- scan_tokens: no policies — only reachable through the functions below.

-- Live updates for the customer's card.
alter publication supabase_realtime add table public.profiles, public.rewards;

-- ─── New member: profile + welcome gift ─────────────────────────────────────────────

create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  opt_in boolean := coalesce((meta ->> 'marketing_opt_in')::boolean, false);
  code text;
begin
  loop
    code := 'SL-' || upper(substr(md5(gen_random_uuid()::text), 1, 4)) || '-' || upper(substr(md5(gen_random_uuid()::text), 1, 4));
    exit when not exists (select 1 from public.profiles where member_code = code);
  end loop;

  insert into public.profiles (id, email, name, member_code, birthday_day, birthday_month, marketing_opt_in, marketing_opt_in_at)
  values (
    new.id, new.email, coalesce(meta ->> 'name', ''), code,
    nullif(meta ->> 'birthday_day', '')::smallint,
    nullif(meta ->> 'birthday_month', '')::smallint,
    opt_in,
    case when opt_in then now() end
  );

  insert into public.rewards (user_id, kind, title, details)
  values (new.id, 'welcome', 'Free Gyro', 'Welcome to the SouvLucky family!');
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Record when marketing consent was given (POPIA), and stop members changing a birthday once it's
-- set (so the birthday reward can't be claimed repeatedly). The dashboard can still change it.
create function public.track_marketing_consent() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.marketing_opt_in is distinct from old.marketing_opt_in then
    new.marketing_opt_in_at := case when new.marketing_opt_in then now() end;
  end if;
  if current_user = 'authenticated'
     and old.birthday_month is not null
     and (new.birthday_day is distinct from old.birthday_day or new.birthday_month is distinct from old.birthday_month) then
    raise exception 'Your birthday is already saved — contact SouvLucky to change it';
  end if;
  return new;
end $$;

create trigger profiles_marketing_consent before update on public.profiles
  for each row execute function public.track_marketing_consent();

-- ─── Push notifications (Expo push service) ─────────────────────────────────────────

-- Sends a notification to the given members (null = everyone). Server-side only.
create function public.send_push(p_user_ids uuid[], p_title text, p_body text, p_data jsonb default '{}'::jsonb)
returns void language plpgsql security definer set search_path = '' as $$
declare
  batch jsonb;
begin
  for batch in
    select jsonb_agg(jsonb_build_object('to', token, 'title', p_title, 'body', p_body, 'sound', 'default', 'data', p_data))
    from (
      select token, (row_number() over () - 1) / 100 as grp   -- Expo accepts 100 messages per request
      from public.push_tokens
      where p_user_ids is null or user_id = any (p_user_ids)
    ) t
    group by grp
  loop
    perform net.http_post(
      url := 'https://exp.host/--/api/v2/push/send',
      body := batch,
      headers := '{"Content-Type": "application/json"}'::jsonb
    );
  end loop;
end $$;

-- New published post with notify = true → notify everyone.
create function public.notify_new_post() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.published and new.notify and (tg_op = 'INSERT' or not old.published or not old.notify) then
    perform public.send_push(null, new.title, nullif(new.summary, ''), jsonb_build_object('postId', new.id));
  end if;
  return new;
end $$;

create trigger posts_notify after insert or update of published, notify on public.posts
  for each row execute function public.notify_new_post();

-- ─── Customer: rotating QR code ─────────────────────────────────────────────────────

create function public.create_scan_token() returns text
language plpgsql security definer set search_path = '' as $$
declare
  t text := replace(gen_random_uuid()::text, '-', '');
begin
  if auth.uid() is null then
    raise exception 'Please sign in first';
  end if;
  delete from public.scan_tokens where expires_at < now();
  insert into public.scan_tokens (token, user_id, expires_at) values (t, auth.uid(), now() + interval '2 minutes');
  return t;
end $$;

-- ─── Staff: look up, stamp, redeem ──────────────────────────────────────────────────

create function public.assert_staff() returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not exists (select 1 from public.profiles where id = auth.uid() and is_staff) then
    raise exception 'Only SouvLucky staff can do this' using errcode = '42501';
  end if;
end $$;

create function public.scan_token_user(p_token text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  uid uuid;
begin
  select user_id into uid from public.scan_tokens where token = p_token and expires_at > now();
  if uid is null then
    raise exception 'This code has expired — ask the customer to refresh their code';
  end if;
  return uid;
end $$;

-- What staff see after scanning: the customer, their card and any rewards they can redeem.
create function public.staff_lookup(p_token text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  uid uuid;
  result jsonb;
begin
  perform public.assert_staff();
  uid := public.scan_token_user(p_token);
  select jsonb_build_object(
    'name', p.name,
    'memberCode', p.member_code,
    'stamps', p.stamps,
    'lastStampAt', p.last_stamp_at,
    'rewards', coalesce((
      select jsonb_agg(jsonb_build_object('id', r.id, 'kind', r.kind, 'title', r.title, 'details', r.details, 'expiresAt', r.expires_at) order by r.created_at)
      from public.rewards r
      where r.user_id = p.id and r.redeemed_at is null and (r.expires_at is null or r.expires_at > now())
    ), '[]'::jsonb)
  ) into result
  from public.profiles p where p.id = uid;
  return result;
end $$;

create function public.staff_add_stamp(p_token text, p_branch text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  card_size constant int := 10;
  cooldown constant interval := interval '2 hours';
  uid uuid;
  p public.profiles;
begin
  perform public.assert_staff();
  uid := public.scan_token_user(p_token);
  select * into p from public.profiles where id = uid for update;

  if p.stamps >= card_size then
    raise exception 'Card is full — redeem the free gyro first';
  end if;
  if p.last_stamp_at > now() - cooldown then
    raise exception 'Already stamped today at % — one stamp per visit',
      to_char(p.last_stamp_at at time zone 'Africa/Johannesburg', 'HH24:MI');
  end if;

  insert into public.stamp_events (user_id, staff_id, branch_id) values (uid, auth.uid(), p_branch);
  update public.profiles set stamps = stamps + 1, last_stamp_at = now() where id = uid;

  if p.stamps + 1 = card_size then
    insert into public.rewards (user_id, kind, title, details)
    values (uid, 'card', 'Free Gyro', 'Loyalty card complete — ten evil eyes!');
  end if;

  return public.staff_lookup(p_token);
end $$;

create function public.staff_redeem_reward(p_token text, p_reward_id uuid, p_branch text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  uid uuid;
  k text;
begin
  perform public.assert_staff();
  uid := public.scan_token_user(p_token);

  update public.rewards
     set redeemed_at = now(), redeemed_by = auth.uid(), branch_id = p_branch
   where id = p_reward_id and user_id = uid and redeemed_at is null and (expires_at is null or expires_at > now())
  returning kind into k;

  if k is null then
    raise exception 'This reward has already been used or has expired';
  end if;
  if k = 'card' then
    update public.profiles set stamps = 0, cards_completed = cards_completed + 1 where id = uid;
  end if;

  return public.staff_lookup(p_token);
end $$;

-- ─── Birthdays ──────────────────────────────────────────────────────────────────────

create function public.grant_birthday_rewards() returns integer
language plpgsql security definer set search_path = '' as $$
declare
  today date := (now() at time zone 'Africa/Johannesburg')::date;
  feb_has_28 boolean := extract(day from (date_trunc('year', today) + interval '2 months - 1 day')) = 28;
  m record;
  granted int := 0;
begin
  for m in
    select p.id from public.profiles p
    where p.birthday_month = extract(month from today)
      and (p.birthday_day = extract(day from today)
           -- 29 February birthdays are celebrated on the 28th in non-leap years
           or (p.birthday_month = 2 and p.birthday_day = 29 and extract(day from today) = 28 and feb_has_28))
      and not exists (
        select 1 from public.rewards r
        where r.user_id = p.id and r.kind = 'birthday' and r.created_at > now() - interval '300 days')
  loop
    insert into public.rewards (user_id, kind, title, details, expires_at)
    values (m.id, 'birthday', 'Free Baklava', 'Happy birthday! A free baklava with any purchase.',
            (today + 7)::timestamp at time zone 'Africa/Johannesburg');
    perform public.send_push(array[m.id], 'Happy birthday from SouvLucky! 🎂',
            'A free baklava is waiting for you — valid for 7 days with any purchase.', '{"screen": "rewards"}'::jsonb);
    granted := granted + 1;
  end loop;
  return granted;
end $$;

-- Every day at 04:00 UTC = 06:00 South African time.
select cron.schedule('souvlucky-birthdays', '0 4 * * *', $$select public.grant_birthday_rewards()$$);

-- ─── Account deletion (required by the App Store) ───────────────────────────────────

create function public.delete_my_account() returns void
language plpgsql security definer set search_path = '' as $$
begin
  delete from auth.users where id = auth.uid();
end $$;

-- ─── Who may call what ──────────────────────────────────────────────────────────────

revoke execute on all functions in schema public from public, anon, authenticated;
grant execute on function public.create_scan_token() to authenticated;
grant execute on function public.staff_lookup(text) to authenticated;
grant execute on function public.staff_add_stamp(text, text) to authenticated;
grant execute on function public.staff_redeem_reward(text, uuid, text) to authenticated;
grant execute on function public.delete_my_account() to authenticated;

-- ─── Post images ────────────────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public) values ('posts', 'posts', true) on conflict (id) do nothing;

-- ─── Starter posts ──────────────────────────────────────────────────────────────────

insert into public.posts (title, summary, body, branch_id, event_date, published_at) values
  ('Halloween at Prison Break',
   'Spooky season at Prison Break Market — come find us for a Greek treat.',
   E'Join us at Prison Break Market this Halloween.\n\nMore details coming soon — keep an eye on this page and your notifications.',
   'prison-break', '2026-10-31', now()),
  ('Welcome to the new SouvLucky app',
   'Collect evil eyes, save your favourite dishes and hear about events first.',
   E'Opa! Our new app is here.\n\nCollect an evil eye every time you visit — ten eyes earn you a free gyro. Save your favourite dishes, find your nearest SouvLucky and be the first to hear about events.',
   null, null, now() - interval '9 days');

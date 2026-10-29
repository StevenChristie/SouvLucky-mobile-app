# SouvLucky Mobile App 🧿

The loyalty and digital-menu app for **SouvLucky Greek Kitchen** (Parkmore & Prison Break Market, Johannesburg).
Built with Expo SDK 58, Expo Router and Reanimated 4.

## Run it

```bash
npm install
npx expo start
```

Scan the QR code with **Expo Go** (iOS or Android). Press `w` for the web version.

Useful scripts: `npm run typecheck`, `npm run lint`.

## Features

| Area | What it does |
| --- | --- |
| **Video splash** | `assets/video/splash.mp4` plays on launch, hands off seamlessly from the native splash, can be tapped to skip, and has a 6-second safety cap. |
| **Accounts** | Join or sign in with email; customers receive a 6-digit code (no passwords). Sign-up asks for name, optional birthday (day/month) and a separate marketing opt-in. |
| **Home** | Greeting, loyalty progress, News & events, popular dishes, Order on Uber Eats, branch open/closed status, Instagram and TikTok. |
| **News & events** | Posts written in Supabase appear in the app immediately. |
| **Menu** | Search, "Saved" favourites, sticky category chips, a detail sheet per dish. |
| **Rewards** | The Evil Eye card (10 stamps → free gyro), welcome gyro, birthday baklava, confetti, live updates while the customer waits. |
| **Member pass** | A QR code that refreshes every 50 s; staff scan it to stamp or redeem. |
| **Staff scanner** | Staff-only screen: scan a pass, add a stamp, redeem rewards. Rules are enforced in the database. |
| **Account** | Add a birthday (once), email opt-in/out, socials, sign out, delete account. |
| **Visit** | Map, swipeable branch cards, directions, call, Uber Eats. |

## Backend (Supabase)

Project: `uklodhqpzdyrflrdqocf` (Europe). Connection settings live in `.env` (public values only — never add the `service_role` key).

**Set up once:** run [`supabase/schema.sql`](supabase/schema.sql) in Supabase → SQL Editor. It creates the tables, security rules, staff functions, the daily birthday job (06:00 SAST) and push notifications.

**Rules** (constants in `schema.sql`): 10 stamps per card · one stamp per customer every 2 hours · welcome gift = Free Gyro · birthday = Free Baklava with any purchase, valid 7 days.

### Day-to-day

- **Make someone staff:** they sign up in the app, then run
  `update profiles set is_staff = true where email = 'name@example.com';`
  Staff see "Staff: scan a customer" on the Rewards tab. Set it back to `false` when they leave.
- **Post news or an event:** Table Editor → `posts` → Insert row. For a photo, upload it to Storage → `posts`, copy its public URL into `image_url`. Tick `notify` to send a push notification to everyone.
- **Email list:** run
  `select name, email from profiles where marketing_opt_in order by created_at;`
  and export to CSV (or connect a mailing tool). Only email people who opted in, and always include an unsubscribe link.
- **See activity:** `stamp_events` (who stamped whom, where, when) and `rewards` (issued and redeemed).

## Project structure

```
src/
  app/                    Expo Router routes
    _layout.tsx           fonts, session, auth guards (Stack.Protected), video splash, notification taps
    welcome.tsx           join / sign in
    verify.tsx            6-digit email code
    redeem.tsx            member pass (rotating QR)
    staff.tsx             staff scanner
    account.tsx           profile, birthday, email preferences, delete account
    news/[id].tsx         post detail
    menu/[id].tsx         dish detail
    (tabs)/               Home · Menu · Rewards · Visit
  components/             UI building blocks (brand/, menu/, news/, ui/)
  data/                   menu, branches (hours, Uber Eats links), socials
  lib/                    supabase client, session store, news, push notifications
  theme/                  colours, type and spacing sampled from the splash video
supabase/schema.sql       the whole backend
```

## Editing content

- **Menu:** `src/data/menu.ts` (prices in Rand; `veg` / `popular` flags).
- **Branches, hours & Uber Eats links:** `src/data/locations.ts`.
- **Instagram / TikTok:** `src/data/socials.ts`.
- **Colours & fonts:** `src/theme/index.ts`.
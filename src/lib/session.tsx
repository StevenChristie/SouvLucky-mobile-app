import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Session as AuthSession } from "@supabase/supabase-js";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { registerForPushNotifications } from "./push";
import { supabase } from "./supabase";

export const STAMPS_PER_CARD = 10;

/** Day and month only — enough for the birthday reward, without storing the year. */
export type Birthday = { day: number; month: number };

export type Member = {
  id: string;
  name: string;
  email: string;
  memberCode: string;
  birthday: Birthday | null;
  /** Agreed to receive news, events and offers by email (POPIA: must be opt-in). */
  marketingOptIn: boolean;
  isStaff: boolean;
  /** Profile photo — kept on this device only. */
  avatar: string | null;
};

export type Reward = {
  id: string;
  kind: "welcome" | "card" | "birthday";
  title: string;
  details: string | null;
  expiresAt: string | null;
};

export type SignUpDetails = { name: string; birthday: Birthday | null; marketingOptIn: boolean };

type ProfileRow = {
  id: string;
  email: string;
  name: string;
  member_code: string;
  birthday_day: number | null;
  birthday_month: number | null;
  marketing_opt_in: boolean;
  is_staff: boolean;
  stamps: number;
  cards_completed: number;
};

type Local = { favourites: string[]; avatars: Record<string, string> };
const LOCAL_KEY = "@souvlucky/local/v1";
const NO_REWARDS: Reward[] = [];

type Session = {
  /** The saved login and profile have been checked — safe to decide which screen to show. */
  hydrated: boolean;
  member: Member | null;
  stamps: number;
  cardsCompleted: number;
  /** Rewards that can still be redeemed. */
  rewards: Reward[];
  favourites: string[];
  /** True for the rest of the app session right after joining — drives the welcome celebration. */
  justJoined: boolean;
  /** Emails a 6-digit login code. Pass `signUp` details to create an account. */
  requestCode: (email: string, signUp?: SignUpDetails) => Promise<void>;
  verifyCode: (email: string, code: string) => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  updateProfile: (patch: { name?: string; birthday?: Birthday | null; marketingOptIn?: boolean }) => Promise<void>;
  setAvatar: (uri: string | null) => void;
  toggleFavourite: (itemId: string) => void;
  dismissJustJoined: () => void;
  refresh: () => Promise<void>;
};

const SessionContext = createContext<Session | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthSession | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [local, setLocal] = useState<Local>({ favourites: [], avatars: {} });
  const [hydrated, setHydrated] = useState(false);
  const [justJoined, setJustJoined] = useState(false);
  const joining = useRef(false);
  const userId = auth?.user.id ?? null;

  // ── Local (device-only) data ──
  useEffect(() => {
    AsyncStorage.getItem(LOCAL_KEY)
      .then((raw) => raw && setLocal({ favourites: [], avatars: {}, ...JSON.parse(raw) }))
      .catch(() => {});
  }, []);
  const saveLocal = useCallback((fn: (l: Local) => Local) => {
    setLocal((prev) => {
      const next = fn(prev);
      AsyncStorage.setItem(LOCAL_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  // ── Loading the member's data ──
  const load = useCallback(async (uid: string) => {
    const [p, r] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", uid).single<ProfileRow>(),
      supabase
        .from("rewards")
        .select("id, kind, title, details, expires_at")
        .eq("user_id", uid)
        .is("redeemed_at", null)
        .order("created_at"),
    ]);
    if (p.error) throw p.error;
    setProfile(p.data);
    const now = Date.now();
    setRewards(
      (r.data ?? [])
        .filter((x) => !x.expires_at || Date.parse(x.expires_at) > now)
        .map((x) => ({ id: x.id, kind: x.kind, title: x.title, details: x.details, expiresAt: x.expires_at })),
    );
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAuth(data.session);
      if (!data.session) setHydrated(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => setAuth(session));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) return;
    // Fetches from Supabase; state is only set once the request resolves.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load(userId)
      .catch((e) => console.warn("Could not load your SouvLucky account", e))
      .finally(() => setHydrated(true));

    // Live updates: staff stamping the card or redeeming a reward shows up instantly.
    const channel = supabase
      .channel(`member-${userId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles", filter: `id=eq.${userId}` }, () => load(userId))
      .on("postgres_changes", { event: "*", schema: "public", table: "rewards", filter: `user_id=eq.${userId}` }, () => load(userId))
      .subscribe();

    registerForPushNotifications(userId).catch((e) => console.warn("Push notifications unavailable", e));

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, load]);

  // ── Actions ──
  const actions = useMemo(
    () => ({
      requestCode: async (email: string, signUp?: SignUpDetails) => {
        joining.current = !!signUp;
        const { error } = await supabase.auth.signInWithOtp({
          email: email.trim().toLowerCase(),
          options: signUp
            ? {
                shouldCreateUser: true,
                data: {
                  name: signUp.name.trim(),
                  birthday_day: signUp.birthday?.day ?? null,
                  birthday_month: signUp.birthday?.month ?? null,
                  marketing_opt_in: signUp.marketingOptIn,
                },
              }
            : { shouldCreateUser: false },
        });
        if (error) {
          if (!signUp && /signups? not allowed|not found/i.test(error.message)) {
            throw new Error("There's no account with that email yet — tap “Join the family” to create one.");
          }
          throw error;
        }
      },
      verifyCode: async (email: string, code: string) => {
        const { data, error } = await supabase.auth.verifyOtp({ email: email.trim().toLowerCase(), token: code.trim(), type: "email" });
        if (error) throw error;
        // A brand-new account was created a moment ago — celebrate it.
        const created = data.user?.created_at ? Date.parse(data.user.created_at) : 0;
        if (joining.current && Date.now() - created < 15 * 60 * 1000) setJustJoined(true);
      },
      signOut: async () => {
        await supabase.auth.signOut();
      },
      deleteAccount: async () => {
        const { error } = await supabase.rpc("delete_my_account");
        if (error) throw error;
        await supabase.auth.signOut();
      },
      updateProfile: async (patch: { name?: string; birthday?: Birthday | null; marketingOptIn?: boolean }) => {
        const { data } = await supabase.auth.getUser();
        if (!data.user) return;
        const row: Record<string, unknown> = {};
        if (patch.name !== undefined) row.name = patch.name.trim();
        if (patch.birthday !== undefined) {
          row.birthday_day = patch.birthday?.day ?? null;
          row.birthday_month = patch.birthday?.month ?? null;
        }
        if (patch.marketingOptIn !== undefined) row.marketing_opt_in = patch.marketingOptIn;
        const { error } = await supabase.from("profiles").update(row).eq("id", data.user.id);
        if (error) throw error;
        await load(data.user.id);
      },
      dismissJustJoined: () => setJustJoined(false),
    }),
    [load],
  );

  const setAvatar = useCallback(
    (uri: string | null) => {
      if (!userId) return;
      saveLocal((l) => {
        const avatars = { ...l.avatars };
        if (uri) avatars[userId] = uri;
        else delete avatars[userId];
        return { ...l, avatars };
      });
    },
    [userId, saveLocal],
  );

  const toggleFavourite = useCallback(
    (id: string) =>
      saveLocal((l) => ({ ...l, favourites: l.favourites.includes(id) ? l.favourites.filter((f) => f !== id) : [...l.favourites, id] })),
    [saveLocal],
  );

  const refresh = useCallback(async () => {
    if (userId) await load(userId);
  }, [userId, load]);

  // Data from a previous login is ignored as soon as the user signs out or switches account.
  const current = profile && profile.id === userId ? profile : null;
  const currentRewards = current ? rewards : NO_REWARDS;

  const member = useMemo<Member | null>(
    () =>
      current && {
        id: current.id,
        name: current.name,
        email: current.email,
        memberCode: current.member_code,
        birthday: current.birthday_day && current.birthday_month ? { day: current.birthday_day, month: current.birthday_month } : null,
        marketingOptIn: current.marketing_opt_in,
        isStaff: current.is_staff,
        avatar: local.avatars[current.id] ?? null,
      },
    [current, local.avatars],
  );

  const value = useMemo<Session>(
    () => ({
      hydrated,
      member,
      stamps: current?.stamps ?? 0,
      cardsCompleted: current?.cards_completed ?? 0,
      rewards: currentRewards,
      favourites: local.favourites,
      justJoined,
      ...actions,
      setAvatar,
      toggleFavourite,
      refresh,
    }),
    [hydrated, member, current, currentRewards, local.favourites, justJoined, actions, setAvatar, toggleFavourite, refresh],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside <SessionProvider>");
  return ctx;
}

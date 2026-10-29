import "react-native-url-polyfill/auto";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { AppState, Platform } from "react-native";

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error("Missing EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY — see .env");
}

export const supabase = createClient(url, anonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Refresh the session only while the app is in the foreground.
if (Platform.OS !== "web") {
  AppState.addEventListener("change", (state) => {
    if (state === "active") supabase.auth.startAutoRefresh();
    else supabase.auth.stopAutoRefresh();
  });
}

/** Turns a Supabase/Postgres error into a sentence suitable for showing to people. */
export function friendlyError(error: unknown): string {
  const message = (error as { message?: string } | null)?.message ?? String(error);
  if (/rate limit/i.test(message)) return "Too many attempts — please wait a minute and try again.";
  if (/expired|invalid.*(otp|token)/i.test(message)) return "That code is wrong or has expired. Check your email or request a new code.";
  if (/network|fetch/i.test(message)) return "Can't reach SouvLucky right now — check your internet connection.";
  return message;
}

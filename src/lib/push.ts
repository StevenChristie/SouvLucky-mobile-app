import Constants, { ExecutionEnvironment } from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { Platform } from "react-native";

import { supabase } from "./supabase";

// Show notifications as banners while the app is open too.
Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false }),
});

/**
 * Asks for permission and saves this phone's Expo push token against the member, so the backend
 * can notify them (birthdays, new events). Does nothing where push isn't available: web, simulators,
 * Expo Go, or before the project is linked to EAS (`npx eas init`).
 */
export async function registerForPushNotifications(userId: string) {
  if (Platform.OS === "web" || !Device.isDevice) return;
  if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) return; // Expo Go
  const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
  if (!projectId) return;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "SouvLucky",
      // Re-exported with `export *`, which the import plugin can't follow; TypeScript checks it.
      // eslint-disable-next-line import/namespace
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  let { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") ({ status } = await Notifications.requestPermissionsAsync());
  if (status !== "granted") return;

  const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
  await supabase
    .from("push_tokens")
    .upsert({ token, user_id: userId, platform: Platform.OS, updated_at: new Date().toISOString() });
}

/**
 * Opens the right screen when a notification is tapped: `{ postId }` → that post,
 * `{ screen: "rewards" }` → Rewards. Mount once, inside the navigator, after sign-in.
 */
export function useOpenNotificationTaps(enabled: boolean) {
  const response = Notifications.useLastNotificationResponse();
  const handled = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled || !response) return;
    const id = response.notification.request.identifier;
    if (handled.current === id) return;
    handled.current = id;
    const data = response.notification.request.content.data as { postId?: string; screen?: string } | undefined;
    if (data?.postId) router.push({ pathname: "/news/[id]", params: { id: data.postId } });
    else if (data?.screen === "rewards") router.navigate("/rewards");
  }, [enabled, response]);
}

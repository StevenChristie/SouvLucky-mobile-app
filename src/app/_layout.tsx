import { GFSDidot_400Regular, useFonts } from "@expo-google-fonts/gfs-didot";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { VideoSplash } from "@/components/VideoSplash";
import { useOpenNotificationTaps } from "@/lib/push";
import { SessionProvider, useSession } from "@/lib/session";
import { colors } from "@/theme";

// Keep the native (plain cream) splash up until the splash video has its first frame.
SplashScreen.preventAutoHideAsync().catch(() => {});
SplashScreen.setOptions({ fade: true, duration: 200 });

const sheet = {
  presentation: "formSheet",
  sheetGrabberVisible: true,
  sheetCornerRadius: 28,
  contentStyle: { backgroundColor: colors.cream },
} as const;

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.cream }}>
      <SafeAreaProvider>
        <SessionProvider>
          <RootNavigator />
        </SessionProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function RootNavigator() {
  const [fontsLoaded, fontError] = useFonts({ GFSDidot: GFSDidot_400Regular });
  const { hydrated, member } = useSession();
  const [splashDone, setSplashDone] = useState(false);
  const appReady = (fontsLoaded || !!fontError) && hydrated;
  const signedIn = !!member;
  useOpenNotificationTaps(appReady && signedIn);

  return (
    <>
      <StatusBar style="dark" />
      {appReady && (
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.cream } }}>
          <Stack.Protected guard={signedIn}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="menu/[id]" options={{ ...sheet, sheetAllowedDetents: [0.72, 1] }} />
            <Stack.Screen name="news/[id]" options={{ ...sheet, sheetAllowedDetents: [0.9] }} />
            <Stack.Screen name="redeem" options={{ ...sheet, sheetAllowedDetents: [1] }} />
            <Stack.Screen name="account" options={{ ...sheet, sheetAllowedDetents: [0.9] }} />
            <Stack.Protected guard={!!member?.isStaff}>
              <Stack.Screen name="staff" options={{ presentation: "fullScreenModal" }} />
            </Stack.Protected>
          </Stack.Protected>
          <Stack.Protected guard={!signedIn}>
            <Stack.Screen name="welcome" options={{ animation: "fade" }} />
            <Stack.Screen name="verify" />
          </Stack.Protected>
          <Stack.Screen name="terms" options={{ ...sheet, sheetAllowedDetents: [0.6, 1] }} />
        </Stack>
      )}
      {!splashDone && <VideoSplash appReady={appReady} onFinish={() => setSplashDone(true)} />}
    </>
  );
}

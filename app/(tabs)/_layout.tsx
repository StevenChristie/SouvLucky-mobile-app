import AsyncStorage from "@react-native-async-storage/async-storage";
import { Tabs, useSegments } from "expo-router"; // Changed useRoute to useSegments
import React, { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  useColorScheme();

  // Initialize as false so the nav bar is hidden by default for new users
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const segments = useSegments();

  // Wrapped in useCallback to fix the ESLint missing dependency warning
  const checkLogin = useCallback(async () => {
    const savedUser = await AsyncStorage.getItem("@souvlucky_session");
    setIsLoggedIn(!!savedUser);
  }, []);

  useEffect(() => {
    checkLogin();
    // Poll to catch state changes from the index page
    const unsubscribe = setInterval(checkLogin, 500);
    return () => clearInterval(unsubscribe);
  }, [checkLogin]); // Added checkLogin as dependency

  // Determine if we are on the index page.
  // Segments for (tabs)/index.tsx will typically look like ["(tabs)"] or ["(tabs)", "index"]
  const isHomeScreen =
    segments.length <= 1 || segments[segments.length - 1] === "index";
  const shouldHideNavBar = !isLoggedIn && isHomeScreen;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#B0C4DE",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          // Dynamic display property
          display: shouldHideNavBar ? "none" : "flex",
          // Keep the tab bar flush with the bottom edge so it doesn't overlap content.
          position: "relative",
          height: 70,
          backgroundColor: "#003366",
          borderRadius: 0,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.12,
          shadowRadius: 16,
          elevation: 8,
          borderTopWidth: 0,
          paddingBottom: Platform.OS === "ios" ? 20 : 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginBottom: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={26}
              name={focused ? "house.fill" : "house"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Menu",
          tabBarLabel: "Menu",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={26}
              name={focused ? "list.bullet.indent" : "list.bullet"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="rewards"
        options={{
          title: "Rewards",
          tabBarLabel: "Rewards",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={26}
              name={focused ? "gift.fill" : "gift"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="locations"
        options={{
          title: "Locations",
          tabBarLabel: "Locations",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={26}
              name={focused ? "map.fill" : "map"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

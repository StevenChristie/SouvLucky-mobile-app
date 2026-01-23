import AsyncStorage from "@react-native-async-storage/async-storage";
import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      const savedUser = await AsyncStorage.getItem("@souvlucky_session");
      setIsLoggedIn(!!savedUser);
    };
    checkStatus();

    // Frequency adjusted for smoother UI response
    const interval = setInterval(checkStatus, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#003366", // SouvLucky Navy
        tabBarInactiveTintColor: "#95A5A6",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          // Hide the whole bar if not logged in
          display: isLoggedIn ? "flex" : "none",

          // --- IMPROVED FLOATING DESIGN ---
          position: "absolute",
          bottom: Platform.OS === "ios" ? 30 : 20,
          left: 15,
          right: 15,
          height: 65,
          backgroundColor: "#FFFFFF",
          borderRadius: 25,

          // Shadow for Depth
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 5,

          // Remove default border
          borderTopWidth: 0,
          paddingBottom: Platform.OS === "ios" ? 0 : 5,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
          marginBottom: 5,
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
          // Hides tab entirely from the UI if not logged in
          tabBarButton: isLoggedIn ? HapticTab : () => null,
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
        name="locations"
        options={{
          title: "Locations",
          tabBarLabel: "Locations",
          tabBarButton: isLoggedIn ? HapticTab : () => null,
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={26}
              name={focused ? "map.fill" : "map"}
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
          tabBarButton: isLoggedIn ? HapticTab : () => null,
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={26}
              name={focused ? "gift.fill" : "gift"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

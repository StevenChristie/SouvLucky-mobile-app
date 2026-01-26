import AsyncStorage from "@react-native-async-storage/async-storage";
import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  // Hook call kept for theme compatibility
  useColorScheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      const savedUser = await AsyncStorage.getItem("@souvlucky_session");
      setIsLoggedIn(!!savedUser);
    };
    checkStatus();

    // Polling status to sync login state
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
          display: "flex",
          position: "absolute",
          bottom: Platform.OS === "ios" ? 30 : 20,
          left: 15,
          right: 15,
          height: 65,
          backgroundColor: "#FFFFFF",
          borderRadius: 25,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 5,
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
      {/* 1. HOME SCREEN */}
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

      {/* 2. MENU SCREEN */}
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

      {/* 3. REWARDS SCREEN - MOVED UP */}
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

      {/* 4. LOCATIONS SCREEN - NOW LAST */}
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

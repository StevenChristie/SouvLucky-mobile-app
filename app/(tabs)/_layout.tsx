import AsyncStorage from "@react-native-async-storage/async-storage";
import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
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

    const interval = setInterval(checkStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          // Hide the whole bar if not logged in
          display: isLoggedIn ? "flex" : "none",
          position: Platform.OS === "ios" ? "absolute" : "relative",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: "Menu",
          tabBarLabel: "Menu",
          // If not logged in, we return null to the button to hide the tab completely
          tabBarButton: isLoggedIn ? HapticTab : () => null,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="list.bullet" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="locations"
        options={{
          title: "Locations",
          tabBarLabel: "Locations",
          tabBarButton: isLoggedIn ? HapticTab : () => null,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="map.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="rewards"
        options={{
          title: "Rewards",
          tabBarLabel: "Rewards",
          tabBarButton: isLoggedIn ? HapticTab : () => null,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="gift.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

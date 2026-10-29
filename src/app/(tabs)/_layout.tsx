import { Tabs } from "expo-router/js-tabs";

import { TabBar } from "@/components/TabBar";
import { colors } from "@/theme";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.cream }, animation: "shift" }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="menu" options={{ title: "Menu" }} />
      <Tabs.Screen name="rewards" options={{ title: "Rewards" }} />
      <Tabs.Screen name="locations" options={{ title: "Visit" }} />
    </Tabs>
  );
}

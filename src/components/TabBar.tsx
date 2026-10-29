import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import type { BottomTabBarProps } from "expo-router/js-tabs";
import { useEffect, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { haptic } from "@/lib/haptics";
import { TAB_BAR_HEIGHT } from "@/lib/layout";
import { colors, radius, shadow } from "@/theme";

type IconName = keyof typeof Ionicons.glyphMap;

const ICONS: Record<string, [active: IconName, idle: IconName]> = {
  index: ["home", "home-outline"],
  menu: ["restaurant", "restaurant-outline"],
  rewards: ["gift", "gift-outline"],
  locations: ["location", "location-outline"],
};

export function TabBar({ state, descriptors, emitter, navigateToTab }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const [width, setWidth] = useState(0);
  const tabWidth = width / state.routes.length;
  const x = useSharedValue(0);

  useEffect(() => {
    x.set(withSpring(state.index * tabWidth, { damping: 18, stiffness: 180, mass: 0.7 }));
  }, [state.index, tabWidth, x]);

  const indicator = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  return (
    <View style={[styles.wrap, { bottom: Math.max(insets.bottom, 12) }]} pointerEvents="box-none">
      <View style={[styles.bar, shadow.lifted]} onLayout={(e) => setWidth(e.nativeEvent.layout.width - 12)}>
        {Platform.OS === "ios" ? (
          <BlurView intensity={40} tint="light" style={[StyleSheet.absoluteFill, styles.blur]} />
        ) : null}
        <View style={[StyleSheet.absoluteFill, styles.tint]} />

        {width > 0 && <Animated.View style={[styles.indicator, { width: tabWidth }, indicator]} />}

        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const { options } = descriptors[route.key];
          const label = options.title ?? route.name;
          const [activeIcon, idleIcon] = ICONS[route.name] ?? ["ellipse", "ellipse-outline"];

          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              aria-selected={focused}
              accessibilityLabel={label}
              style={styles.tab}
              onPress={() => {
                const event = emitter.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
                if (!focused && !event.defaultPrevented) {
                  haptic.select();
                  navigateToTab(route.key);
                }
              }}
              onLongPress={() => emitter.emit({ type: "tabLongPress", target: route.key })}
            >
              <Ionicons name={focused ? activeIcon : idleIcon} size={22} color={focused ? colors.white : colors.aegean} />
              <Text style={[styles.label, { color: focused ? colors.white : colors.aegean }]} numberOfLines={1}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "absolute", left: 16, right: 16 },
  bar: {
    height: TAB_BAR_HEIGHT,
    borderRadius: radius.pill,
    flexDirection: "row",
    padding: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.7)",
  },
  blur: { borderRadius: radius.pill, overflow: "hidden" },
  tint: {
    borderRadius: radius.pill,
    backgroundColor: Platform.OS === "ios" ? "rgba(251,248,242,0.78)" : colors.parchment,
  },
  indicator: {
    position: "absolute",
    top: 6,
    left: 6,
    bottom: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.aegean,
  },
  tab: { flex: 1, alignItems: "center", justifyContent: "center", gap: 2 },
  label: { fontSize: 11, fontWeight: "700", letterSpacing: 0.3 },
});

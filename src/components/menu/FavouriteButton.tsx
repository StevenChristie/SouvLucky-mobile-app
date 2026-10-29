import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring } from "react-native-reanimated";

import { haptic } from "@/lib/haptics";
import { useSession } from "@/lib/session";
import { colors } from "@/theme";

export function FavouriteButton({ itemId, size = 22 }: { itemId: string; size?: number }) {
  const { favourites, toggleFavourite } = useSession();
  const active = favourites.includes(itemId);
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Pressable
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={active ? "Remove from favourites" : "Add to favourites"}
      onPress={() => {
        haptic.select();
        scale.set(withSequence(withSpring(1.35, { damping: 6, stiffness: 400 }), withSpring(1)));
        toggleFavourite(itemId);
      }}
    >
      <Animated.View style={style}>
        <Ionicons name={active ? "heart" : "heart-outline"} size={size} color={active ? colors.terracotta : colors.muted} />
      </Animated.View>
    </Pressable>
  );
}

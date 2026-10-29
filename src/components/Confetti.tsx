import { useEffect, useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";

import { colors } from "@/theme";

const { width: W, height: H } = Dimensions.get("window");
const PALETTE = [colors.aegean, colors.sky, colors.gold, colors.white, colors.terracotta];

function Piece({ seed }: { seed: number }) {
  const rand = (n: number) => {
    const x = Math.sin(seed * 9301 + n * 49297) * 233280;
    return x - Math.floor(x);
  };
  const t = useSharedValue(0);
  const startX = W / 2 + (rand(1) - 0.5) * 80;
  const endX = rand(2) * W;
  const peak = H * (0.15 + rand(3) * 0.25);
  const spin = (rand(4) - 0.5) * 1080;
  const size = 6 + rand(5) * 7;

  useEffect(() => {
    t.set(withDelay(rand(6) * 150, withTiming(1, { duration: 1800 + rand(7) * 900, easing: Easing.out(Easing.quad) })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => {
    const p = t.value;
    // Up to the peak, then drift down past the bottom of the screen.
    const y = p < 0.3 ? H * 0.55 - (H * 0.55 - peak) * (p / 0.3) : peak + (H + 40 - peak) * ((p - 0.3) / 0.7);
    return {
      opacity: p < 0.9 ? 1 : (1 - p) * 10,
      transform: [{ translateX: startX + (endX - startX) * p }, { translateY: y }, { rotate: `${spin * p}deg` }],
    };
  });

  return (
    <Animated.View
      style={[
        styles.piece,
        { width: size, height: size * (rand(8) > 0.5 ? 1 : 2.2), backgroundColor: PALETTE[seed % PALETTE.length], borderRadius: rand(9) > 0.6 ? size : 2 },
        style,
      ]}
    />
  );
}

/** A one-shot celebration burst. Re-mount (change `key`) to fire again. */
export function Confetti({ count = 70 }: { count?: number }) {
  const seeds = useMemo(() => Array.from({ length: count }, (_, i) => i + 1), [count]);
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {seeds.map((s) => (
        <Piece key={s} seed={s} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  piece: { position: "absolute", left: 0, top: 0 },
});

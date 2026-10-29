import { useEffect, useImperativeHandle, type Ref } from "react";
import { View } from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { colors } from "@/theme";

export type EvilEyeHandle = { look: () => void; blink: () => void };

type Props = {
  size?: number;
  /** Pop in with a spring when first shown. */
  popIn?: boolean;
  popDelay?: number;
  /** Blink every few seconds on its own. */
  idleBlink?: boolean;
  ref?: Ref<EvilEyeHandle>;
};

/** The nazar — drawn with nested circles so it scales crisply and can blink and glance around. */
export function EvilEye({ size = 44, popIn, popDelay = 0, idleBlink, ref }: Props) {
  const scale = useSharedValue(popIn ? 0 : 1);
  const lid = useSharedValue(1);
  const gaze = useSharedValue(0);

  useImperativeHandle(ref, () => ({
    look: () => {
      gaze.set(withSequence(withTiming(-1, { duration: 220 }), withTiming(1, { duration: 360 }), withSpring(0)));
    },
    blink: () => {
      lid.set(withSequence(withTiming(0.08, { duration: 80 }), withTiming(1, { duration: 120 })));
    },
  }));

  useEffect(() => {
    if (popIn) scale.set(withDelay(popDelay, withSpring(1, { damping: 9, stiffness: 180 })));
  }, [popIn, popDelay, scale]);

  useEffect(() => {
    if (!idleBlink) return;
    const wait = 2500 + Math.random() * 4000;
    lid.set(withRepeat(withSequence(withDelay(wait, withTiming(0.08, { duration: 80 })), withTiming(1, { duration: 120 })), -1));
    return () => cancelAnimation(lid);
  }, [idleBlink, lid]);

  const outer = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const eye = useAnimatedStyle(() => ({ transform: [{ scaleY: lid.value }] }));
  const iris = useAnimatedStyle(() => ({ transform: [{ translateX: gaze.value * size * 0.1 }] }));

  const ring = (ratio: number, color: string) => ({
    width: size * ratio,
    height: size * ratio,
    borderRadius: size,
    backgroundColor: color,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  });

  return (
    <Animated.View style={[ring(1, colors.aegeanDeep), outer]}>
      <Animated.View style={[ring(0.8, colors.white), eye]}>
        <Animated.View style={[ring(0.6, colors.sky), iris]}>
          <View style={ring(0.36, colors.ink)}>
            <View style={[ring(0.12, colors.white), { position: "absolute", top: size * 0.05, right: size * 0.05 }]} />
          </View>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

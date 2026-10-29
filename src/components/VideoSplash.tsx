import * as SplashScreen from "expo-splash-screen";
import { useVideoPlayer, VideoView } from "expo-video";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import Animated, { Easing, FadeIn, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";

import { colors } from "@/theme";

const SPLASH_VIDEO = require("@assets/video/splash.mp4");

/** Hard ceiling so a stalled or failed video can never trap the user on the splash. */
const MAX_SPLASH_MS = 6000;
const NATIVE_SPLASH_FALLBACK_MS = 1500;

type Props = {
  /** Fonts and saved session are loaded — the app underneath can be revealed. */
  appReady: boolean;
  onFinish: () => void;
};

export function VideoSplash({ appReady, onFinish }: Props) {
  const insets = useSafeAreaInsets();
  const [videoDone, setVideoDone] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const nativeHidden = useRef(false);
  const leaving = useRef(false);

  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  const player = useVideoPlayer(SPLASH_VIDEO, (p) => {
    p.muted = true;
    p.loop = false;
    p.play();
  });

  const hideNativeSplash = useCallback(() => {
    if (nativeHidden.current) return;
    nativeHidden.current = true;
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  useEffect(() => {
    const ended = player.addListener("playToEnd", () => setVideoDone(true));
    const status = player.addListener("statusChange", ({ status }) => {
      // Some platforms (notably web) ignore the play() issued before the view mounts.
      if (status === "readyToPlay" && !player.playing && player.currentTime === 0) player.play();
      if (status === "error") {
        hideNativeSplash();
        setVideoDone(true);
      }
    });
    const fallback = setTimeout(hideNativeSplash, NATIVE_SPLASH_FALLBACK_MS);
    const ceiling = setTimeout(() => setVideoDone(true), MAX_SPLASH_MS);
    const skipHint = setTimeout(() => setShowSkip(true), 900);
    return () => {
      ended.remove();
      status.remove();
      clearTimeout(fallback);
      clearTimeout(ceiling);
      clearTimeout(skipHint);
    };
  }, [player, hideNativeSplash]);

  useEffect(() => {
    if (!videoDone || !appReady || leaving.current) return;
    leaving.current = true;
    hideNativeSplash();
    scale.set(withTiming(1.06, { duration: 520, easing: Easing.out(Easing.cubic) }));
    opacity.set(
      withTiming(0, { duration: 520, easing: Easing.out(Easing.quad) }, (finished) => {
        if (finished) scheduleOnRN(onFinish);
      }),
    );
  }, [videoDone, appReady, hideNativeSplash, onFinish, opacity, scale]);

  const fade = useAnimatedStyle(() => ({ opacity: opacity.value, transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.root, fade]} pointerEvents={videoDone ? "none" : "auto"}>
      <Pressable style={StyleSheet.absoluteFill} onPress={() => setVideoDone(true)} accessibilityLabel="Skip intro">
        <VideoView
          player={player}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          nativeControls={false}
          allowsPictureInPicture={false}
          onFirstFrameRender={hideNativeSplash}
        />
      </Pressable>
      {showSkip && !videoDone && (
        <Animated.View entering={FadeIn.duration(400)} style={[styles.skipWrap, { top: insets.top + 12 }]} pointerEvents="none">
          <Text style={styles.skip}>Tap to skip</Text>
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { backgroundColor: colors.cream, zIndex: 100 },
  skipWrap: { position: "absolute", right: 20 },
  skip: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.6,
    color: colors.aegean,
    opacity: 0.7,
  },
});

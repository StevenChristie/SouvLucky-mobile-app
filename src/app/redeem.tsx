import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { Easing, FadeIn, useAnimatedStyle, useSharedValue, withTiming, ZoomIn } from "react-native-reanimated";

import { GreekKey } from "@/components/brand/Decor";
import { QrCode } from "@/components/QrCode";
import { Button } from "@/components/ui/Button";
import { haptic } from "@/lib/haptics";
import { STAMPS_PER_CARD, useSession } from "@/lib/session";
import { friendlyError, supabase } from "@/lib/supabase";
import { colors, fonts, radius, space, type } from "@/theme";

/** The QR refreshes well before the server-side code expires (2 minutes). */
const REFRESH_MS = 50_000;

type Celebration = { title: string; body: string } | null;

export default function MemberPassScreen() {
  const { member, stamps, rewards } = useSession();
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [celebration, setCelebration] = useState<Celebration>(null);
  const timer = useSharedValue(1);

  const refresh = useCallback(async () => {
    const { data, error: e } = await supabase.rpc("create_scan_token");
    if (e) {
      setError(friendlyError(e));
      return;
    }
    setError(null);
    setToken(data as string);
    timer.set(1);
    timer.set(withTiming(0, { duration: REFRESH_MS, easing: Easing.linear }));
  }, [timer]);

  useEffect(() => {
    const first = setTimeout(refresh, 0);
    const every = setInterval(refresh, REFRESH_MS);
    return () => {
      clearTimeout(first);
      clearInterval(every);
    };
  }, [refresh]);

  // Staff actions arrive via realtime: celebrate when a stamp lands or a reward is used.
  const prev = useRef({ stamps, rewardIds: rewards.map((r) => r.id) });
  useEffect(() => {
    const before = prev.current;
    const usedReward = before.rewardIds.find((id) => !rewards.some((r) => r.id === id));
    if (stamps > before.stamps) {
      haptic.success();
      setCelebration({
        title: "Evil eye added!",
        body: stamps >= STAMPS_PER_CARD ? "Your card is full — your next gyro is free!" : `${stamps} of ${STAMPS_PER_CARD} collected`,
      });
    } else if (usedReward) {
      haptic.success();
      setCelebration({ title: "Enjoy!", body: "Your reward has been redeemed. Kali orexi!" });
    }
    prev.current = { stamps, rewardIds: rewards.map((r) => r.id) };
  }, [stamps, rewards]);

  useEffect(() => {
    if (!celebration) return;
    const t = setTimeout(() => router.back(), 2600);
    return () => clearTimeout(t);
  }, [celebration]);

  const timerStyle = useAnimatedStyle(() => ({ width: `${timer.value * 100}%` }));

  if (celebration) {
    return (
      <View style={styles.center}>
        <Animated.View entering={ZoomIn.springify().damping(10)} style={styles.success}>
          <Ionicons name="checkmark" size={56} color={colors.white} />
        </Animated.View>
        <Animated.Text entering={FadeIn.delay(200)} style={[type.title, styles.textCenter, { marginTop: space.xl }]}>
          {celebration.title}
        </Animated.Text>
        <Text style={[type.body, styles.textCenter, { marginTop: space.xs }]}>{celebration.body}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.root}>
      <GreekKey opacity={0.8} />
      <Text style={[type.title, styles.textCenter, { marginTop: space.lg }]}>Your member pass</Text>
      <Text style={[type.body, styles.textCenter, { marginTop: space.xs }]}>
        Show this to a staff member when you pay — they&apos;ll scan it to add your stamp or redeem a reward.
      </Text>

      <View style={styles.pass}>
        <Text style={styles.name}>{member?.name}</Text>
        <View style={styles.qrWrap}>
          {token ? <QrCode value={`souvlucky:${token}`} size={220} /> : error ? null : <ActivityIndicator color={colors.aegean} style={{ height: 220 }} />}
          {error && (
            <View style={styles.qrError}>
              <Ionicons name="cloud-offline-outline" size={32} color={colors.muted} />
              <Text style={[type.caption, styles.textCenter]}>{error}</Text>
              <Button label="Try again" variant="secondary" onPress={refresh} style={{ height: 44 }} />
            </View>
          )}
        </View>
        <View style={styles.timerTrack}>
          <Animated.View style={[styles.timerFill, timerStyle]} />
        </View>
        <Text style={type.caption}>Code refreshes automatically · {member?.memberCode}</Text>

        <View style={styles.progress}>
          <Text style={styles.progressText}>
            {stamps}/{STAMPS_PER_CARD} evil eyes
          </Text>
        </View>
      </View>

      {rewards.length > 0 && (
        <View style={{ marginTop: space.lg, gap: space.sm }}>
          <Text style={type.overline}>Ready to redeem</Text>
          {rewards.map((r) => (
            <View key={r.id} style={styles.reward}>
              <Ionicons name={r.kind === "birthday" ? "gift" : "star"} size={18} color={colors.gold} />
              <Text style={[type.label, { flex: 1 }]}>{r.title}</Text>
              <Text style={type.caption}>{r.kind === "welcome" ? "Welcome gift" : r.kind === "birthday" ? "Birthday" : "Full card"}</Text>
            </View>
          ))}
        </View>
      )}

      <Button label="Done" variant="ghost" onPress={() => router.back()} style={{ marginTop: space.lg }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { padding: space.xl, paddingTop: space.xxl },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: space.xl },
  textCenter: { textAlign: "center" },
  pass: {
    marginTop: space.xl,
    alignItems: "center",
    paddingVertical: space.xl,
    paddingHorizontal: space.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.parchment,
    borderWidth: 1.5,
    borderColor: colors.aegean,
    gap: space.md,
  },
  name: { fontFamily: fonts.display, fontSize: 26, color: colors.ink },
  qrWrap: { minHeight: 220, minWidth: 220, alignItems: "center", justifyContent: "center", borderRadius: radius.sm, overflow: "hidden" },
  qrError: { width: 220, alignItems: "center", gap: space.sm, padding: space.md },
  timerTrack: { width: 220, height: 4, borderRadius: 2, backgroundColor: colors.sand, overflow: "hidden" },
  timerFill: { height: 4, backgroundColor: colors.aegean },
  progress: { backgroundColor: colors.skySoft, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 6 },
  progressText: { color: colors.aegean, fontWeight: "700" },
  reward: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
    backgroundColor: colors.goldSoft,
  },
  success: { width: 110, height: 110, borderRadius: 55, backgroundColor: colors.olive, alignItems: "center", justifyContent: "center" },
});

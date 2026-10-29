import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SectionTitle } from "@/components/brand/Decor";
import { Confetti } from "@/components/Confetti";
import { StampCard } from "@/components/StampCard";
import { Button } from "@/components/ui/Button";
import { PressableScale } from "@/components/ui/PressableScale";
import { useTabBarSpace } from "@/lib/layout";
import { STAMPS_PER_CARD, useSession, type Reward } from "@/lib/session";
import { colors, fonts, radius, shadow, space, type } from "@/theme";

const STEPS: [keyof typeof Ionicons.glyphMap, string, string][] = [
  ["restaurant-outline", "Order in store", "Visit either SouvLucky branch and order anything."],
  ["qr-code-outline", "Show your pass", "Tap “Show my pass” when you pay — staff scan your QR code."],
  ["eye-outline", "Collect evil eyes", "One eye per visit — ten eyes earn a free gyro."],
];

const TICKET_LABEL: Record<Reward["kind"], string> = { welcome: "Welcome gift", birthday: "Happy birthday", card: "Card complete" };

export default function RewardsScreen() {
  const insets = useSafeAreaInsets();
  const bottomSpace = useTabBarSpace();
  const { member, stamps, rewards, cardsCompleted } = useSession();
  const full = stamps >= STAMPS_PER_CARD;

  // Fire confetti whenever the card goes from not-full to full.
  const [burst, setBurst] = useState(0);
  const wasFull = useRef(full);
  useEffect(() => {
    if (full && !wasFull.current) setBurst((b) => b + 1);
    wasFull.current = full;
  }, [full]);

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + space.md, paddingBottom: bottomSpace }} showsVerticalScrollIndicator={false}>
        <View style={styles.pad}>
          <Text style={type.overline}>The Evil Eye Club</Text>
          <Text style={[type.hero, { marginTop: 2 }]}>Rewards</Text>
        </View>

        <Animated.View entering={FadeInDown.duration(500)} style={[styles.pad, { marginTop: space.xl }]}>
          <StampCard key={`card-${cardsCompleted}`} stamps={stamps} memberName={member?.name ?? ""} />
        </Animated.View>

        <View style={[styles.pad, { marginTop: space.lg }]}>
          <Button
            label={full ? "Claim your free gyro" : "Show my pass"}
            icon={full ? "gift" : "qr-code-outline"}
            variant={full ? "gold" : "primary"}
            onPress={() => router.push("/redeem")}
          />
          {member?.isStaff && (
            <Button label="Staff: scan a customer" variant="ghost" icon="scan" onPress={() => router.push("/staff")} style={{ marginTop: space.xs }} />
          )}
        </View>

        {rewards.map((reward, i) => (
          <Animated.View key={reward.id} entering={FadeInDown.duration(500).delay(120 + i * 80)} style={[styles.pad, { marginTop: i === 0 ? space.xl : space.md }]}>
            <PressableScale style={[styles.ticket, shadow.soft]} onPress={() => router.push("/redeem")}>
              <View style={styles.ticketLeft}>
                <Ionicons name={reward.kind === "birthday" ? "gift" : "star"} size={26} color={colors.white} />
              </View>
              <View style={styles.perforation}>
                {Array.from({ length: 7 }, (_, i) => (
                  <View key={i} style={styles.hole} />
                ))}
              </View>
              <View style={styles.ticketBody}>
                <Text style={styles.ticketOverline}>{TICKET_LABEL[reward.kind]}</Text>
                <Text style={styles.ticketTitle}>1 × {reward.title}</Text>
                <Text style={type.caption}>
                  {reward.kind === "birthday" ? "With any purchase · " : ""}
                  {reward.expiresAt ? `Valid until ${new Date(reward.expiresAt).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}` : "Show your pass at the counter"}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.gold} style={{ marginRight: space.lg }} />
            </PressableScale>
          </Animated.View>
        ))}

        <View style={[styles.pad, { marginTop: space.xxl }]}>
          <SectionTitle overline="Simple as ena, dio, tria" title="How it works" />
          <View style={{ gap: space.md }}>
            {STEPS.map(([icon, title, body], i) => (
              <Animated.View key={title} entering={FadeInDown.duration(400).delay(200 + i * 80)} style={styles.step}>
                <View style={styles.stepIcon}>
                  <Ionicons name={icon} size={20} color={colors.aegean} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={type.label}>{title}</Text>
                  <Text style={[type.caption, { marginTop: 2, fontSize: 13 }]}>{body}</Text>
                </View>
              </Animated.View>
            ))}
          </View>
        </View>

        {cardsCompleted > 0 && (
          <View style={[styles.pad, styles.stat]}>
            <Ionicons name="trophy" size={18} color={colors.gold} />
            <Text style={type.body}>
              {cardsCompleted} {cardsCompleted === 1 ? "card" : "cards"} completed — efcharistó!
            </Text>
          </View>
        )}
      </ScrollView>

      {burst > 0 && <Confetti key={burst} />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.cream },
  pad: { paddingHorizontal: space.xl },
  ticket: { flexDirection: "row", alignItems: "center", backgroundColor: colors.parchment, borderRadius: radius.md, overflow: "hidden" },
  ticketLeft: { width: 72, alignSelf: "stretch", backgroundColor: colors.gold, alignItems: "center", justifyContent: "center" },
  perforation: { width: 10, alignSelf: "stretch", justifyContent: "space-evenly", alignItems: "center", marginLeft: -5 },
  hole: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.cream },
  ticketBody: { flex: 1, paddingVertical: space.lg, paddingHorizontal: space.md },
  ticketOverline: { ...type.overline, color: "#8A6A2A" },
  ticketTitle: { fontFamily: fonts.display, fontSize: 22, color: colors.ink, marginVertical: 2 },
  step: { flexDirection: "row", alignItems: "center", gap: space.md, padding: space.md, borderRadius: radius.md, backgroundColor: colors.parchment },
  stepIcon: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.skySoft, alignItems: "center", justifyContent: "center" },
  stat: { flexDirection: "row", alignItems: "center", gap: space.sm, marginTop: space.xl, justifyContent: "center" },
});

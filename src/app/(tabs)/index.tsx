import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useMemo } from "react";
import { FlatList, Linking, Modal, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import Animated, {
  FadeInDown,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  ZoomIn,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Avatar } from "@/components/Avatar";
import { EvilEye } from "@/components/brand/EvilEye";
import { SectionTitle, Waves } from "@/components/brand/Decor";
import { Confetti } from "@/components/Confetti";
import { FavouriteButton } from "@/components/menu/FavouriteButton";
import { MenuThumb } from "@/components/menu/MenuItemRow";
import { NewsCard } from "@/components/news/NewsCard";
import { OrderOnline } from "@/components/OrderOnline";
import { Button } from "@/components/ui/Button";
import { PressableScale } from "@/components/ui/PressableScale";
import { BRANCHES, openStatus } from "@/data/locations";
import { formatPrice, POPULAR } from "@/data/menu";
import { SOCIALS } from "@/data/socials";
import { useTabBarSpace } from "@/lib/layout";
import { useNews } from "@/lib/news";
import { STAMPS_PER_CARD, useSession } from "@/lib/session";
import { colors, fonts, radius, shadow, space, type } from "@/theme";

const HERO = require("@assets/images/photos/food-spread.jpg");
const MASCOT = require("@assets/images/brand/mascot.png");

function greeting(now = new Date()) {
  const h = now.getHours();
  if (h < 12) return "Kalimera";
  if (h >= 17) return "Kalispera";
  return "Yassas";
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const bottomSpace = useTabBarSpace();
  const { posts } = useNews();
  const newsCardWidth = Math.min(width * 0.78, 340);
  const { member, stamps, rewards, justJoined, dismissJustJoined } = useSession();
  const firstName = member?.name.split(" ")[0] ?? "";

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });
  const heroImage = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(scrollY.value, [-200, 0, 300], [-60, 0, 80]) },
      { scale: interpolate(scrollY.value, [-200, 0], [1.3, 1], "clamp") },
    ],
  }));

  const statuses = useMemo(() => BRANCHES.map((b) => ({ branch: b, status: openStatus(b) })), []);

  return (
    <View style={styles.root}>
      <Animated.ScrollView onScroll={onScroll} scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + space.md }]}>
          <View style={{ flex: 1 }}>
            <Text style={type.overline}>{greeting()}</Text>
            <Text style={[type.title, { marginTop: 2 }]} numberOfLines={1}>
              {firstName}
            </Text>
          </View>
          <Avatar size={52} onPress={() => router.push("/account")} />
        </View>

        {/* Hero */}
        <Animated.View entering={FadeInDown.duration(500)} style={styles.heroWrap}>
          <PressableScale style={[styles.hero, shadow.lifted]} onPress={() => router.navigate("/menu")} scaleTo={0.98}>
            <Animated.View style={[StyleSheet.absoluteFill, heroImage]}>
              <Image source={HERO} style={StyleSheet.absoluteFill} contentFit="cover" transition={300} />
            </Animated.View>
            <LinearGradient colors={["rgba(29,42,87,0.05)", "rgba(29,42,87,0.6)", "rgba(29,42,87,0.92)"]} locations={[0, 0.45, 1]} style={StyleSheet.absoluteFill} />
            <View style={styles.heroText}>
              <Text style={styles.heroOverline}>Greek Kitchen · Johannesburg</Text>
              <Text style={styles.heroTitle}>Get a taste{"\n"}of Greece</Text>
              <View style={styles.heroCta}>
                <Text style={styles.heroCtaText}>Explore the menu</Text>
                <Ionicons name="arrow-forward" size={16} color={colors.ink} />
              </View>
            </View>
          </PressableScale>
        </Animated.View>

        {/* Rewards snapshot */}
        <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.section}>
          <PressableScale style={[styles.rewardCard, shadow.soft]} onPress={() => router.navigate("/rewards")}>
            <EvilEye size={48} idleBlink />
            <View style={{ flex: 1 }}>
              <Text style={type.label}>
                {stamps >= STAMPS_PER_CARD ? "Your free gyro is ready!" : `${stamps} of ${STAMPS_PER_CARD} evil eyes`}
              </Text>
              <View style={styles.segments}>
                {Array.from({ length: STAMPS_PER_CARD }, (_, i) => (
                  <View key={i} style={[styles.segment, i < stamps && styles.segmentOn]} />
                ))}
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.muted} />
          </PressableScale>

          {rewards.length > 0 && (
            <PressableScale style={styles.giftBanner} onPress={() => router.navigate("/rewards")}>
              <Ionicons name="gift" size={22} color={colors.white} />
              <Text style={styles.giftText}>
                {rewards.length === 1
                  ? `Your ${rewards[0].title.toLowerCase()} is waiting — show your pass in store`
                  : `You have ${rewards.length} rewards waiting — show your pass in store`}
              </Text>
              <Ionicons name="chevron-forward" size={18} color={colors.white} />
            </PressableScale>
          )}
        </Animated.View>

        {/* News & events */}
        {posts.length > 0 && (
          <>
            <View style={styles.section}>
              <SectionTitle overline="What's on" title="News & events" />
            </View>
            <FlatList
              horizontal
              data={posts}
              keyExtractor={(p) => p.id}
              showsHorizontalScrollIndicator={false}
              snapToInterval={newsCardWidth + space.md}
              decelerationRate="fast"
              contentContainerStyle={{ paddingHorizontal: space.xl, gap: space.md }}
              renderItem={({ item }) => <NewsCard post={item} width={newsCardWidth} />}
            />
          </>
        )}

        {/* Popular */}
        <View style={styles.section}>
          <SectionTitle overline="Crowd favourites" title="Popular right now" />
        </View>
        <Animated.FlatList
          horizontal
          data={POPULAR}
          keyExtractor={(i) => i.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: space.xl, gap: space.md }}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInDown.duration(450).delay(150 + index * 60)}>
              <PressableScale
                style={[styles.popCard, shadow.soft]}
                onPress={() => router.push({ pathname: "/menu/[id]", params: { id: item.id } })}
              >
                <MenuThumb item={item} size={96} />
                <Text style={styles.popName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.popPrice}>{formatPrice(item.price)}</Text>
              </PressableScale>
              {/* Sibling of the card, not a child, so buttons are never nested. */}
              <View style={styles.popFav}>
                <FavouriteButton itemId={item.id} size={20} />
              </View>
            </Animated.View>
          )}
        />

        {/* Order online */}
        <View style={[styles.section, { marginTop: space.xxl }]}>
          <OrderOnline />
        </View>

        {/* Visit */}
        <View style={[styles.section, { marginTop: space.xxl }]}>
          <SectionTitle overline="Come say yassas" title="Visit us" />
          <View style={{ gap: space.md }}>
            {statuses.map(({ branch, status }) => (
              <PressableScale key={branch.id} style={[styles.branchRow, shadow.soft]} onPress={() => router.navigate("/locations")}>
                <Image source={branch.photo} style={styles.branchPhoto} contentFit="cover" />
                <View style={{ flex: 1 }}>
                  <Text style={type.label}>{branch.name}</Text>
                  <View style={styles.statusRow}>
                    <View style={[styles.dot, { backgroundColor: status.open ? colors.olive : colors.terracotta }]} />
                    <Text style={type.caption}>{status.label}</Text>
                  </View>
                </View>
                <Ionicons name="navigate-circle" size={30} color={colors.aegean} />
              </PressableScale>
            ))}
          </View>
        </View>

        <Waves style={{ marginTop: space.xxl }} />
        <View style={[styles.footer, { paddingBottom: bottomSpace }]}>
          <View style={styles.socials}>
            {SOCIALS.map((s) => (
              <PressableScale key={s.id} style={styles.social} onPress={() => Linking.openURL(s.url)} accessibilityLabel={`SouvLucky on ${s.label}`}>
                <Ionicons name={s.icon} size={22} color={colors.white} />
              </PressableScale>
            ))}
          </View>
          <Text style={styles.footerText}>MEMBER {member?.memberCode}</Text>
          <Button label="My account" variant="secondary" icon="person-circle-outline" onPress={() => router.push("/account")} style={{ marginTop: space.md, height: 44 }} />
        </View>
      </Animated.ScrollView>

      <WelcomeCelebration visible={justJoined} name={firstName} onClose={dismissJustJoined} />
    </View>
  );
}

function WelcomeCelebration({ visible, name, onClose }: { visible: boolean; name: string; onClose: () => void }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.modalScrim}>
        <Animated.View entering={ZoomIn.springify().damping(14)} style={[styles.modalCard, shadow.lifted]}>
          <Image source={MASCOT} style={styles.mascot} contentFit="contain" />
          <Text style={[type.title, { textAlign: "center" }]}>Welcome to the family, {name}!</Text>
          <Text style={[type.body, { textAlign: "center", marginTop: space.sm }]}>
            We&apos;ve added a <Text style={{ fontWeight: "800", color: colors.aegean }}>FREE gyro</Text> to your rewards. Show it at the counter on your next visit.
          </Text>
          <Button
            label="See my rewards"
            icon="gift"
            onPress={() => {
              onClose();
              router.navigate("/rewards");
            }}
            style={{ marginTop: space.xl, alignSelf: "stretch" }}
          />
          <Button label="Maybe later" variant="ghost" onPress={onClose} style={{ marginTop: space.xs }} />
        </Animated.View>
        {visible && <Confetti />}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.cream },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: space.xl, paddingBottom: space.lg, gap: space.md },
  heroWrap: { paddingHorizontal: space.xl },
  hero: { height: 240, borderRadius: radius.lg, overflow: "hidden", backgroundColor: colors.aegeanDeep },
  heroText: { position: "absolute", left: space.xl, right: space.xl, bottom: space.xl },
  heroOverline: { ...type.overline, color: colors.sky },
  heroTitle: { fontFamily: fonts.display, fontSize: 34, lineHeight: 38, color: colors.white, marginTop: 4 },
  heroCta: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    marginTop: space.md,
    backgroundColor: colors.cream,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  heroCtaText: { fontWeight: "700", color: colors.ink, fontSize: 13 },
  section: { paddingHorizontal: space.xl, marginTop: space.xl },
  rewardCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.lg,
    padding: space.lg,
    backgroundColor: colors.parchment,
    borderRadius: radius.md,
  },
  segments: { flexDirection: "row", gap: 4, marginTop: space.sm },
  segment: { flex: 1, height: 6, borderRadius: 3, backgroundColor: colors.sand },
  segmentOn: { backgroundColor: colors.aegean },
  giftBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    marginTop: space.md,
    padding: space.lg,
    borderRadius: radius.md,
    backgroundColor: colors.gold,
  },
  giftText: { flex: 1, color: colors.white, fontWeight: "700", fontSize: 14 },
  popCard: { width: 150, padding: space.md, borderRadius: radius.md, backgroundColor: colors.parchment, alignItems: "center" },
  popFav: { position: "absolute", top: 10, right: 10, zIndex: 1 },
  popName: { fontSize: 14, fontWeight: "700", color: colors.ink, textAlign: "center", marginTop: space.md, minHeight: 36 },
  popPrice: { fontSize: 14, fontWeight: "800", color: colors.aegean, marginTop: 2 },
  branchRow: { flexDirection: "row", alignItems: "center", gap: space.md, padding: space.md, borderRadius: radius.md, backgroundColor: colors.parchment },
  branchPhoto: { width: 56, height: 56, borderRadius: radius.sm },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  footer: { backgroundColor: colors.aegean, marginTop: -1, paddingTop: space.sm, alignItems: "center" },
  socials: { flexDirection: "row", gap: space.md, marginBottom: space.md },
  social: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: { color: colors.sky, fontSize: 12, letterSpacing: 1 },
  modalScrim: { flex: 1, backgroundColor: colors.scrim, alignItems: "center", justifyContent: "center", padding: space.xl },
  modalCard: { backgroundColor: colors.cream, borderRadius: radius.xl, padding: space.xl, alignItems: "center", width: "100%", maxWidth: 380 },
  mascot: { width: 150, height: 150, marginBottom: space.md },
});

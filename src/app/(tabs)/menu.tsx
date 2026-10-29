import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, type NativeScrollEvent, type NativeSyntheticEvent, type ScrollViewInstance } from "react-native";
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GreekKey } from "@/components/brand/Decor";
import { MenuItemRow } from "@/components/menu/MenuItemRow";
import { MENU } from "@/data/menu";
import { haptic } from "@/lib/haptics";
import { useTabBarSpace } from "@/lib/layout";
import { useSession } from "@/lib/session";
import { colors, radius, space, type } from "@/theme";

const MASCOT = require("@assets/images/brand/mascot.png");
const CHIP_BAR_HEIGHT = 58;

export default function MenuScreen() {
  const insets = useSafeAreaInsets();
  const bottomSpace = useTabBarSpace();
  const { favourites } = useSession();

  const [query, setQuery] = useState("");
  const [savedOnly, setSavedOnly] = useState(false);
  const [active, setActive] = useState(MENU[0].id);

  const scrollRef = useRef<ScrollViewInstance>(null);
  const chipsRef = useRef<ScrollViewInstance>(null);
  const sectionY = useRef<Record<string, number>>({});
  const chipX = useRef<Record<string, number>>({});
  // While a chip-triggered scroll animates, ignore scroll-spy updates so the chips don't flicker.
  const spyPaused = useRef(false);

  const sections = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MENU.map((c) => ({
      ...c,
      items: c.items.filter(
        (i) =>
          (!savedOnly || favourites.includes(i.id)) &&
          (!q || i.name.toLowerCase().includes(q) || i.desc?.toLowerCase().includes(q) || c.title.toLowerCase().includes(q)),
      ),
    })).filter((c) => c.items.length > 0);
  }, [query, savedOnly, favourites]);

  const highlight = (id: string) => {
    setActive(id);
    const x = chipX.current[id];
    if (x !== undefined) chipsRef.current?.scrollTo({ x: Math.max(0, x - space.xl), animated: true });
  };

  const jumpTo = (id: string) => {
    haptic.select();
    spyPaused.current = true;
    setTimeout(() => (spyPaused.current = false), 600);
    highlight(id);
    const y = sectionY.current[id];
    if (y !== undefined) scrollRef.current?.scrollTo({ y: y - CHIP_BAR_HEIGHT, animated: true });
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (spyPaused.current) return;
    const y = e.nativeEvent.contentOffset.y + CHIP_BAR_HEIGHT + 24;
    let current = sections[0]?.id;
    for (const s of sections) if ((sectionY.current[s.id] ?? Infinity) <= y) current = s.id;
    if (current && current !== active) highlight(current);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView
        ref={scrollRef}
        stickyHeaderIndices={[1]}
        onScroll={onScroll}
        scrollEventThrottle={32}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomSpace }}
      >
        {/* 0 — title + search */}
        <View style={styles.top}>
          <Text style={type.overline}>SouvLucky Greek Kitchen</Text>
          <Text style={[type.hero, { marginTop: 2 }]}>The Menu</Text>
          <View style={styles.search}>
            <Ionicons name="search" size={18} color={colors.muted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search gyros, meze, platters…"
              placeholderTextColor={colors.muted}
              style={styles.searchInput}
              returnKeyType="search"
              clearButtonMode="while-editing"
              autoCorrect={false}
            />
            {!!query && (
              <Pressable onPress={() => setQuery("")} hitSlop={10} accessibilityLabel="Clear search">
                <Ionicons name="close-circle" size={18} color={colors.muted} />
              </Pressable>
            )}
          </View>
        </View>

        {/* 1 — sticky category chips */}
        <View style={styles.chipBar}>
          <ScrollView ref={chipsRef} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
            <Chip
              label="Saved"
              icon={savedOnly ? "heart" : "heart-outline"}
              active={savedOnly}
              tone="terracotta"
              onPress={() => {
                haptic.select();
                setSavedOnly((s) => !s);
              }}
            />
            {sections.map((c) => (
              <View key={c.id} onLayout={(e) => (chipX.current[c.id] = e.nativeEvent.layout.x)}>
                <Chip label={c.title} active={active === c.id} onPress={() => jumpTo(c.id)} />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* 2… — sections */}
        {sections.map((c) => (
          <Animated.View
            key={c.id}
            layout={LinearTransition.duration(250)}
            entering={FadeIn.duration(250)}
            style={styles.section}
            onLayout={(e) => (sectionY.current[c.id] = e.nativeEvent.layout.y)}
          >
            <View style={styles.sectionHeader}>
              <Ionicons name={c.icon as keyof typeof Ionicons.glyphMap} size={18} color={colors.aegean} />
              <Text style={type.heading}>{c.title}</Text>
              <View style={styles.rule} />
              <Text style={type.caption}>{c.items.length}</Text>
            </View>
            {c.items.map((item) => (
              <MenuItemRow key={item.id} item={item} />
            ))}
          </Animated.View>
        ))}

        {sections.length === 0 && (
          <View style={styles.empty}>
            <Image source={MASCOT} style={{ width: 130, height: 130 }} contentFit="contain" />
            <Text style={[type.heading, { marginTop: space.md }]}>{savedOnly ? "No favourites yet" : "Nothing found"}</Text>
            <Text style={[type.body, { textAlign: "center", marginTop: space.xs }]}>
              {savedOnly ? "Tap the heart on any dish to save it here." : `We couldn't find "${query}". Try another dish.`}
            </Text>
          </View>
        )}

        {sections.length > 0 && <GreekKey opacity={0.5} style={{ marginTop: space.lg, paddingHorizontal: space.xl }} />}
      </ScrollView>
    </View>
  );
}

function Chip({
  label,
  active,
  onPress,
  icon,
  tone = "aegean",
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  tone?: "aegean" | "terracotta";
}) {
  const bg = tone === "terracotta" ? colors.terracotta : colors.aegean;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      aria-selected={active}
      style={[styles.chip, active && { backgroundColor: bg, borderColor: bg }]}
    >
      {icon && <Ionicons name={icon} size={14} color={active ? colors.white : bg} />}
      <Text style={[styles.chipText, active && { color: colors.white }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.cream },
  top: { paddingHorizontal: space.xl, paddingTop: space.md, paddingBottom: space.md },
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    marginTop: space.lg,
    height: 48,
    paddingHorizontal: space.lg,
    borderRadius: radius.pill,
    backgroundColor: colors.parchment,
    borderWidth: 1,
    borderColor: colors.line,
  },
  searchInput: { flex: 1, fontSize: 15, color: colors.ink, height: "100%" },
  chipBar: { height: CHIP_BAR_HEIGHT, backgroundColor: colors.cream, justifyContent: "center", borderBottomWidth: 1, borderBottomColor: colors.line },
  chips: { paddingHorizontal: space.xl, gap: space.sm, alignItems: "center" },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    height: 36,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.parchment,
  },
  chipText: { fontSize: 13, fontWeight: "700", color: colors.aegean },
  section: { paddingHorizontal: space.xl, paddingTop: space.xl },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: space.sm, marginBottom: space.md },
  rule: { flex: 1, height: 1, backgroundColor: colors.line, marginHorizontal: space.xs },
  empty: { alignItems: "center", paddingHorizontal: space.xxl, paddingTop: space.xxl },
});

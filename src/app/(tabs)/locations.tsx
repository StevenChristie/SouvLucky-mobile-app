import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo, useRef, useState } from "react";
import { FlatList, Linking, Platform, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BranchMap } from "@/components/BranchMap";
import { openUberEats } from "@/components/OrderOnline";
import { Button } from "@/components/ui/Button";
import { BRANCHES, openStatus, type Branch } from "@/data/locations";
import { haptic } from "@/lib/haptics";
import { useTabBarSpace } from "@/lib/layout";
import { colors, radius, shadow, space, type } from "@/theme";

function openDirections(b: Branch) {
  const { latitude, longitude } = b.coords;
  const label = encodeURIComponent(b.name);
  const url =
    Platform.OS === "ios"
      ? `http://maps.apple.com/?daddr=${latitude},${longitude}&q=${label}`
      : Platform.OS === "android"
        ? `geo:0,0?q=${latitude},${longitude}(${label})`
        : `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  Linking.openURL(url);
}

export default function LocationsScreen() {
  const insets = useSafeAreaInsets();
  const bottomSpace = useTabBarSpace();
  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList<Branch>>(null);
  const [active, setActive] = useState(0);

  const cardWidth = width - space.xl * 2;
  const snap = cardWidth + space.md;
  const statuses = useMemo(() => BRANCHES.map((b) => openStatus(b)), []);

  const focus = (index: number, scrollList = false) => {
    setActive(index);
    haptic.select();
    if (scrollList) listRef.current?.scrollToIndex({ index, animated: true });
  };

  return (
    <View style={styles.root}>
      <BranchMap branches={BRANCHES} active={active} onSelect={(i) => focus(i, true)} padding={{ top: insets.top + 60, bottom: bottomSpace + 310 }} />

      <LinearGradient colors={[colors.cream, "rgba(243,237,225,0)"]} style={[styles.topFade, { height: insets.top + 90 }]} pointerEvents="none" />
      <View style={[styles.title, { top: insets.top + space.md }]} pointerEvents="none">
        <Text style={type.overline}>Two homes in Joburg</Text>
        <Text style={type.title}>Visit us</Text>
      </View>

      <View style={[styles.cards, { bottom: bottomSpace - space.md }]}>
        <FlatList
          ref={listRef}
          data={BRANCHES}
          horizontal
          keyExtractor={(b) => b.id}
          showsHorizontalScrollIndicator={false}
          snapToInterval={snap}
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: space.xl, gap: space.md }}
          getItemLayout={(_, index) => ({ length: snap, offset: snap * index, index })}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / snap);
            if (index !== active && BRANCHES[index]) focus(index);
          }}
          renderItem={({ item, index }) => {
            const status = statuses[index];
            return (
              <View style={[styles.card, shadow.lifted, { width: cardWidth }]}>
                <View style={styles.cardTop}>
                  <Image source={item.photo} style={styles.photo} contentFit="cover" />
                  <View style={{ flex: 1 }}>
                    <Text style={type.heading} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <View style={[styles.status, { backgroundColor: status.open ? "rgba(110,139,78,0.14)" : "rgba(212,107,69,0.12)" }]}>
                      <View style={[styles.dot, { backgroundColor: status.open ? colors.olive : colors.terracotta }]} />
                      <Text style={[styles.statusText, { color: status.open ? colors.olive : colors.terracotta }]}>{status.label}</Text>
                    </View>
                  </View>
                </View>
                <Info icon="location-outline" text={item.address} />
                <Info icon="time-outline" text={item.hoursLabel} />
                <View style={styles.actions}>
                  <Button label="Directions" icon="navigate" onPress={() => openDirections(item)} style={{ flex: 1 }} />
                  <Button
                    label="Call"
                    icon="call"
                    variant="secondary"
                    onPress={() => Linking.openURL(`tel:${item.phone.replace(/\s/g, "")}`)}
                    style={{ flex: 1 }}
                  />
                </View>
                {item.uberEatsUrl && (
                  <Button label="Order on Uber Eats" icon="bicycle" variant="ghost" onPress={() => openUberEats(item)} />
                )}
              </View>
            );
          }}
        />
        <View style={styles.dots}>
          {BRANCHES.map((b, i) => (
            <View key={b.id} style={[styles.pageDot, i === active && styles.pageDotActive]} />
          ))}
        </View>
      </View>
    </View>
  );
}

function Info({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  return (
    <View style={styles.info}>
      <Ionicons name={icon} size={17} color={colors.aegean} />
      <Text style={[type.body, { flex: 1, fontSize: 14 }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.cream },
  topFade: { position: "absolute", top: 0, left: 0, right: 0 },
  title: { position: "absolute", left: space.xl },
  cards: { position: "absolute", left: 0, right: 0 },
  card: { backgroundColor: colors.cream, borderRadius: radius.lg, padding: space.lg, gap: space.sm },
  cardTop: { flexDirection: "row", gap: space.md, alignItems: "center", marginBottom: space.xs },
  photo: { width: 64, height: 64, borderRadius: radius.sm },
  status: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", gap: 6, marginTop: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill },
  statusText: { fontSize: 12, fontWeight: "700" },
  dot: { width: 7, height: 7, borderRadius: 4 },
  info: { flexDirection: "row", gap: space.sm, alignItems: "flex-start" },
  actions: { flexDirection: "row", gap: space.sm, marginTop: space.sm },
  dots: { flexDirection: "row", justifyContent: "center", gap: 6, marginTop: space.md },
  pageDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "rgba(64,87,155,0.3)" },
  pageDotActive: { width: 18, backgroundColor: colors.aegean },
});

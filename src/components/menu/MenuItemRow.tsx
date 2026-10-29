import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { EvilEye } from "@/components/brand/EvilEye";
import { PressableScale } from "@/components/ui/PressableScale";
import { formatPrice, type MenuItem } from "@/data/menu";
import { colors, radius, shadow, space } from "@/theme";
import { FavouriteButton } from "./FavouriteButton";

export function MenuThumb({ item, size }: { item: MenuItem; size: number }) {
  return (
    <View style={[styles.thumb, { width: size, height: size, borderRadius: size / 2 }]}>
      {item.image ? (
        <Image source={item.image} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
      ) : (
        <EvilEye size={size * 0.42} />
      )}
    </View>
  );
}

export function MenuItemRow({ item }: { item: MenuItem }) {
  // The heart sits beside (not inside) the pressable row so buttons are never nested.
  return (
    <View style={[styles.row, shadow.soft]}>
      <PressableScale
        style={styles.rowMain}
        onPress={() => router.push({ pathname: "/menu/[id]", params: { id: item.id } })}
        accessibilityLabel={`${item.name}, ${formatPrice(item.price)}`}
      >
        <MenuThumb item={item} size={68} />
        <View style={styles.body}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={2}>
              {item.name}
            </Text>
            {item.veg && <Ionicons name="leaf" size={13} color={colors.olive} accessibilityLabel="Vegetarian" />}
          </View>
          {item.desc && (
            <Text style={styles.desc} numberOfLines={2}>
              {item.desc}
            </Text>
          )}
          <View style={styles.footer}>
            <Text style={styles.price}>{formatPrice(item.price)}</Text>
            {item.popular && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Popular</Text>
              </View>
            )}
          </View>
        </View>
      </PressableScale>
      <FavouriteButton itemId={item.id} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: space.lg,
    backgroundColor: colors.parchment,
    borderRadius: radius.md,
    marginBottom: space.md,
  },
  rowMain: { flex: 1, flexDirection: "row", alignItems: "center", gap: space.md, padding: space.md },
  thumb: {
    backgroundColor: colors.skySoft,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.white,
  },
  body: { flex: 1 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  name: { fontSize: 16, fontWeight: "700", color: colors.ink, flexShrink: 1 },
  desc: { fontSize: 13, lineHeight: 18, color: colors.muted, marginTop: 2 },
  footer: { flexDirection: "row", alignItems: "center", gap: space.sm, marginTop: 6 },
  price: { fontSize: 15, fontWeight: "800", color: colors.aegean },
  badge: { backgroundColor: colors.goldSoft, paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.pill },
  badgeText: { fontSize: 11, fontWeight: "700", color: "#8A6A2A" },
});

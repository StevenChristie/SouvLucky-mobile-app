import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";

import { GreekKey } from "@/components/brand/Decor";
import { FavouriteButton } from "@/components/menu/FavouriteButton";
import { MenuThumb } from "@/components/menu/MenuItemRow";
import { Button } from "@/components/ui/Button";
import { formatPrice, getMenuItem } from "@/data/menu";
import { colors, radius, space, type } from "@/theme";

export default function MenuItemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = getMenuItem(id);

  if (!item) {
    return (
      <View style={styles.missing}>
        <Text style={type.heading}>Dish not found</Text>
        <Button label="Back to menu" variant="secondary" onPress={() => router.back()} style={{ marginTop: space.lg }} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.topRow}>
        <View style={styles.categoryPill}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <FavouriteButton itemId={item.id} size={26} />
      </View>

      <Animated.View entering={ZoomIn.springify().damping(14)} style={styles.plate}>
        <View style={styles.plateRim}>
          <MenuThumb item={item} size={170} />
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(400).delay(120)}>
        <Text style={[type.title, styles.center]}>{item.name}</Text>
        <Text style={styles.price}>{formatPrice(item.price)}</Text>
        {item.desc && <Text style={[type.body, styles.center, { marginTop: space.sm }]}>{item.desc}</Text>}

        <View style={styles.tags}>
          {item.veg && <Tag icon="leaf" label="Vegetarian" color={colors.olive} />}
          {item.popular && <Tag icon="flame" label="Popular" color={colors.gold} />}
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(400).delay(220)} style={styles.stampHint}>
        <GreekKey opacity={0.6} />
        <View style={styles.stampRow}>
          <Ionicons name="eye" size={20} color={colors.aegean} />
          <Text style={[type.body, { flex: 1 }]}>Order in store and show your rewards card to collect an evil eye.</Text>
        </View>
      </Animated.View>

      <Button label="Earn a stamp for this visit" icon="qr-code-outline" onPress={() => router.replace({ pathname: "/redeem", params: { type: "stamp" } })} />
    </ScrollView>
  );
}

function Tag({ icon, label, color }: { icon: keyof typeof Ionicons.glyphMap; label: string; color: string }) {
  return (
    <View style={[styles.tag, { borderColor: color }]}>
      <Ionicons name={icon} size={13} color={color} />
      <Text style={[styles.tagText, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: space.xl, paddingTop: space.xxl, gap: space.lg },
  missing: { flex: 1, alignItems: "center", justifyContent: "center", padding: space.xl },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  categoryPill: { backgroundColor: colors.skySoft, paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.pill },
  categoryText: { color: colors.aegean, fontWeight: "700", fontSize: 12, letterSpacing: 0.4 },
  plate: { alignItems: "center" },
  plateRim: {
    padding: 14,
    borderRadius: 200,
    backgroundColor: colors.parchment,
    borderWidth: 2,
    borderColor: colors.sky,
  },
  center: { textAlign: "center" },
  price: { textAlign: "center", fontSize: 20, fontWeight: "800", color: colors.aegean, marginTop: space.xs },
  tags: { flexDirection: "row", justifyContent: "center", gap: space.sm, marginTop: space.md },
  tag: { flexDirection: "row", alignItems: "center", gap: 4, borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  tagText: { fontSize: 12, fontWeight: "700" },
  stampHint: { backgroundColor: colors.parchment, borderRadius: radius.md, padding: space.lg, gap: space.md },
  stampRow: { flexDirection: "row", gap: space.md, alignItems: "center" },
});

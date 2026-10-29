import { Ionicons } from "@expo/vector-icons";
import { Linking, StyleSheet, Text, View } from "react-native";

import { PressableScale } from "@/components/ui/PressableScale";
import { BRANCHES, type Branch } from "@/data/locations";
import { colors, radius, shadow, space, type } from "@/theme";

/** Opens the branch's Uber Eats store — in the Uber Eats app if installed, otherwise the website. */
export const openUberEats = (branch: Branch) => branch.uberEatsUrl && Linking.openURL(branch.uberEatsUrl);

/** "Order on Uber Eats" card with a button per branch that delivers. */
export function OrderOnline() {
  const branches = BRANCHES.filter((b) => b.uberEatsUrl);
  if (branches.length === 0) return null;

  return (
    <View style={[styles.card, shadow.soft]}>
      <View style={styles.header}>
        <View style={styles.icon}>
          <Ionicons name="bicycle" size={22} color={colors.white} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={type.label}>Craving SouvLucky at home?</Text>
          <Text style={[type.caption, { marginTop: 2 }]}>Order delivery on Uber Eats</Text>
        </View>
      </View>
      <View style={styles.buttons}>
        {branches.map((b) => (
          <PressableScale key={b.id} style={styles.button} onPress={() => openUberEats(b)} accessibilityLabel={`Order from ${b.name} on Uber Eats`}>
            <Text style={styles.buttonText}>{b.short}</Text>
            <Ionicons name="open-outline" size={14} color={colors.aegean} />
          </PressableScale>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.parchment, borderRadius: radius.md, padding: space.lg, gap: space.md },
  header: { flexDirection: "row", alignItems: "center", gap: space.md },
  icon: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.olive, alignItems: "center", justifyContent: "center" },
  buttons: { flexDirection: "row", gap: space.sm },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 42,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.aegean,
  },
  buttonText: { fontWeight: "700", color: colors.aegean, fontSize: 14 },
});

import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { EvilEye, type EvilEyeHandle } from "@/components/brand/EvilEye";
import { GreekKey } from "@/components/brand/Decor";
import { haptic } from "@/lib/haptics";
import { STAMPS_PER_CARD } from "@/lib/session";
import { colors, fonts, radius, shadow, space } from "@/theme";

const EYE = 46;

/** The digital loyalty card — framed like the splash artwork, one evil eye per stamp. */
export function StampCard({ stamps, memberName }: { stamps: number; memberName: string }) {
  const eyes = useRef<(EvilEyeHandle | null)[]>([]);

  return (
    <View style={[styles.card, shadow.soft]}>
      <View style={styles.innerFrame}>
        <GreekKey style={{ marginBottom: space.md }} />

        <View style={styles.headerRow}>
          <View>
            <Text style={styles.cardTitle}>Loyalty Card</Text>
            <Text style={styles.cardSub}>{memberName}</Text>
          </View>
          <View style={styles.countPill}>
            <Text style={styles.countText}>
              {stamps}/{STAMPS_PER_CARD}
            </Text>
          </View>
        </View>

        <View style={styles.grid}>
          {Array.from({ length: STAMPS_PER_CARD }, (_, i) => {
            const filled = i < stamps;
            const isReward = i === STAMPS_PER_CARD - 1;
            return (
              <Pressable
                key={i}
                style={styles.spot}
                disabled={!filled}
                accessibilityLabel={filled ? `Stamp ${i + 1} collected` : `Stamp ${i + 1} empty`}
                onPress={() => {
                  haptic.tap();
                  eyes.current[i]?.look();
                }}
              >
                {filled ? (
                  <EvilEye
                    ref={(r) => {
                      eyes.current[i] = r;
                    }}
                    size={EYE}
                    popIn
                    popDelay={i * 70}
                    idleBlink
                  />
                ) : (
                  <View style={[styles.empty, isReward && styles.emptyReward]}>
                    {isReward ? (
                      <Ionicons name="gift" size={20} color={colors.gold} />
                    ) : (
                      <Text style={styles.emptyNum}>{i + 1}</Text>
                    )}
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.footnote}>
          {stamps >= STAMPS_PER_CARD
            ? "Card complete — your free gyro is waiting!"
            : `${STAMPS_PER_CARD - stamps} more ${STAMPS_PER_CARD - stamps === 1 ? "eye" : "eyes"} to a free gyro · tap an eye`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.parchment,
    borderRadius: radius.lg,
    padding: 6,
    borderWidth: 1.5,
    borderColor: colors.aegean,
  },
  innerFrame: {
    borderRadius: radius.lg - 5,
    borderWidth: 1,
    borderColor: colors.line,
    padding: space.lg,
  },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: space.lg },
  cardTitle: { fontFamily: fonts.display, fontSize: 24, color: colors.ink },
  cardSub: { fontSize: 13, color: colors.muted, marginTop: 2 },
  countPill: { backgroundColor: colors.skySoft, paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.pill },
  countText: { color: colors.aegean, fontWeight: "800", fontSize: 14 },
  grid: { flexDirection: "row", flexWrap: "wrap", rowGap: space.lg },
  spot: { width: "20%", alignItems: "center", justifyContent: "center", height: EYE + 4 },
  empty: {
    width: EYE,
    height: EYE,
    borderRadius: EYE,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "rgba(64,87,155,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyReward: { borderColor: colors.gold, backgroundColor: colors.goldSoft, borderStyle: "solid" },
  emptyNum: { color: "rgba(64,87,155,0.45)", fontWeight: "700" },
  footnote: { marginTop: space.lg, textAlign: "center", fontSize: 13, color: colors.inkSoft },
});

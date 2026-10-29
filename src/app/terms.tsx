import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { GreekKey } from "@/components/brand/Decor";
import { Button } from "@/components/ui/Button";
import { colors, space, type } from "@/theme";

const TERMS = [
  ["Eligibility", "A valid email address is required to join the SouvLucky Family loyalty programme."],
  ["Welcome gift", "New members receive one free gyro. The welcome gift is a one-time offer and cannot be exchanged for cash."],
  ["Stamps", "Collect one evil eye per visit (at most one every two hours). Ten eyes complete a card, which can be redeemed for a free gyro."],
  ["Birthday treat", "Members who add their birthday receive a free baklava with any purchase, valid for 7 days from their birthday."],
  ["Redemption", "Stamps and rewards are added and redeemed in store by a SouvLucky staff member scanning your member pass."],
  [
    "Privacy",
    "We store your name, email, birthday and rewards securely to run the loyalty programme. We only send you news and offers by email if you opt in, and you can opt out or delete your account at any time in the app.",
  ],
];

export default function TermsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <GreekKey opacity={0.8} />
      <Text style={[type.title, { marginTop: space.lg }]}>Terms of Use</Text>
      <Text style={[type.body, { marginTop: space.xs }]}>Welcome to the SouvLucky Family! By registering, you agree to:</Text>

      <View style={{ marginTop: space.lg, gap: space.lg }}>
        {TERMS.map(([title, body], i) => (
          <View key={title} style={styles.row}>
            <Text style={styles.num}>{i + 1}</Text>
            <View style={{ flex: 1 }}>
              <Text style={type.label}>{title}</Text>
              <Text style={[type.body, { marginTop: 2 }]}>{body}</Text>
            </View>
          </View>
        ))}
      </View>

      <Button label="Got it" onPress={() => router.back()} style={{ marginTop: space.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: space.xl, paddingTop: space.xxl },
  row: { flexDirection: "row", gap: space.md },
  num: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.skySoft,
    color: colors.aegean,
    textAlign: "center",
    lineHeight: 26,
    fontWeight: "800",
    overflow: "hidden",
  },
});

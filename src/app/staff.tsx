import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { BRANCHES } from "@/data/locations";
import { haptic } from "@/lib/haptics";
import { STAMPS_PER_CARD } from "@/lib/session";
import { friendlyError, supabase } from "@/lib/supabase";
import { colors, fonts, radius, space, type } from "@/theme";

const BRANCH_KEY = "@souvlucky/staff-branch";

type Customer = {
  name: string;
  memberCode: string;
  stamps: number;
  lastStampAt: string | null;
  rewards: { id: string; kind: string; title: string; details: string | null; expiresAt: string | null }[];
};

export default function StaffScannerScreen() {
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [branch, setBranch] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const scanning = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(BRANCH_KEY).then((b) => b && setBranch(b));
  }, []);

  const chooseBranch = (id: string) => {
    haptic.select();
    setBranch(id);
    AsyncStorage.setItem(BRANCH_KEY, id).catch(() => {});
  };

  const reset = () => {
    setToken(null);
    setCustomer(null);
    setMessage(null);
    scanning.current = false;
  };

  const onScan = async (data: string) => {
    if (scanning.current || !data.startsWith("souvlucky:")) return;
    scanning.current = true;
    haptic.tap();
    const t = data.slice("souvlucky:".length);
    setBusy(true);
    const { data: result, error } = await supabase.rpc("staff_lookup", { p_token: t });
    setBusy(false);
    if (error) {
      haptic.warn();
      setMessage({ ok: false, text: friendlyError(error) });
      setTimeout(() => (scanning.current = false), 1500);
      return;
    }
    setToken(t);
    setCustomer(result as Customer);
    setMessage(null);
  };

  const run = async (fn: "staff_add_stamp" | "staff_redeem_reward", args: Record<string, unknown>, success: string) => {
    if (!token) return;
    setBusy(true);
    const { data, error } = await supabase.rpc(fn, { p_token: token, p_branch: branch, ...args });
    setBusy(false);
    if (error) {
      haptic.warn();
      setMessage({ ok: false, text: friendlyError(error) });
      return;
    }
    haptic.success();
    setCustomer(data as Customer);
    setMessage({ ok: true, text: success });
  };

  // ── Choose branch first ──
  if (!branch) {
    return (
      <View style={[styles.page, { paddingTop: insets.top + space.xl }]}>
        <Text style={type.overline}>Staff</Text>
        <Text style={[type.title, { marginTop: 2 }]}>Which branch are you at?</Text>
        <View style={{ gap: space.md, marginTop: space.xl }}>
          {BRANCHES.map((b) => (
            <Button key={b.id} label={b.name} icon="storefront" variant="secondary" onPress={() => chooseBranch(b.id)} />
          ))}
        </View>
        <Button label="Close" variant="ghost" onPress={() => router.back()} style={{ marginTop: space.lg }} />
      </View>
    );
  }

  // ── Camera permission ──
  if (!permission?.granted) {
    return (
      <View style={[styles.page, styles.centered, { paddingTop: insets.top }]}>
        <Ionicons name="camera" size={48} color={colors.aegean} />
        <Text style={[type.heading, { marginTop: space.md, textAlign: "center" }]}>Camera access needed</Text>
        <Text style={[type.body, { textAlign: "center", marginTop: space.xs }]}>The camera is used to scan customers&apos; member passes.</Text>
        <Button label="Allow camera" icon="camera" onPress={requestPermission} style={{ marginTop: space.xl, alignSelf: "stretch" }} />
        <Button label="Close" variant="ghost" onPress={() => router.back()} style={{ marginTop: space.sm }} />
      </View>
    );
  }

  const branchName = BRANCHES.find((b) => b.id === branch)?.short ?? branch;
  const full = (customer?.stamps ?? 0) >= STAMPS_PER_CARD;

  return (
    <View style={styles.root}>
      {!customer && (
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={({ data }) => onScan(data)}
        />
      )}

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + space.sm }]}>
        <Pressable onPress={() => router.back()} hitSlop={12} accessibilityLabel="Close scanner">
          <Ionicons name="close" size={28} color={customer ? colors.ink : colors.white} />
        </Pressable>
        <Pressable onPress={() => setBranch(null)} style={styles.branchPill} accessibilityLabel="Change branch">
          <Ionicons name="storefront" size={14} color={colors.aegean} />
          <Text style={styles.branchText}>{branchName}</Text>
        </Pressable>
      </View>

      {!customer ? (
        <>
          <View style={styles.frame} pointerEvents="none" />
          <View style={[styles.hint, { bottom: insets.bottom + space.xxl }]}>
            {busy ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.hintText}>{message?.text ?? "Scan the customer's member pass"}</Text>
            )}
          </View>
        </>
      ) : (
        <ScrollView contentContainerStyle={[styles.result, { paddingTop: insets.top + 64, paddingBottom: insets.bottom + space.xl }]}>
          <Animated.View entering={FadeInDown.duration(300)}>
            <Text style={type.overline}>Customer</Text>
            <Text style={styles.customerName}>{customer.name || "SouvLucky member"}</Text>
            <Text style={type.caption}>{customer.memberCode}</Text>

            <View style={styles.stampsRow}>
              {Array.from({ length: STAMPS_PER_CARD }, (_, i) => (
                <View key={i} style={[styles.stampDot, i < customer.stamps && styles.stampDotOn]} />
              ))}
            </View>
            <Text style={type.label}>
              {customer.stamps}/{STAMPS_PER_CARD} stamps
              {customer.lastStampAt ? ` · last ${new Date(customer.lastStampAt).toLocaleString("en-ZA", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}` : ""}
            </Text>

            {message && (
              <Animated.View entering={FadeIn} style={[styles.message, { backgroundColor: message.ok ? "rgba(110,139,78,0.15)" : "rgba(196,73,61,0.12)" }]}>
                <Ionicons name={message.ok ? "checkmark-circle" : "alert-circle"} size={20} color={message.ok ? colors.olive : colors.danger} />
                <Text style={[type.label, { flex: 1, color: message.ok ? colors.olive : colors.danger }]}>{message.text}</Text>
              </Animated.View>
            )}

            <Button
              label={full ? "Card full — redeem below" : "Add a stamp"}
              icon="eye"
              disabled={busy || full}
              onPress={() => run("staff_add_stamp", {}, "Stamp added")}
              style={{ marginTop: space.xl }}
            />

            {customer.rewards.length > 0 && (
              <View style={{ marginTop: space.xl, gap: space.sm }}>
                <Text style={type.overline}>Rewards to redeem</Text>
                {customer.rewards.map((r) => (
                  <View key={r.id} style={styles.reward}>
                    <View style={{ flex: 1 }}>
                      <Text style={type.label}>{r.title}</Text>
                      {!!r.details && <Text style={type.caption}>{r.details}</Text>}
                    </View>
                    <Button
                      label="Redeem"
                      variant="gold"
                      disabled={busy}
                      onPress={() => run("staff_redeem_reward", { p_reward_id: r.id }, `${r.title} redeemed`)}
                      style={{ height: 44 }}
                    />
                  </View>
                ))}
              </View>
            )}

            <Button label="Scan next customer" icon="scan" variant="secondary" onPress={reset} style={{ marginTop: space.xl }} />
          </Animated.View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink },
  page: { flex: 1, backgroundColor: colors.cream, padding: space.xl },
  centered: { alignItems: "center", justifyContent: "center" },
  header: { position: "absolute", top: 0, left: 0, right: 0, zIndex: 2, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: space.lg },
  branchPill: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: colors.cream, paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.pill },
  branchText: { color: colors.aegean, fontWeight: "700", fontSize: 13 },
  frame: {
    position: "absolute",
    alignSelf: "center",
    top: "28%",
    width: 250,
    height: 250,
    borderRadius: radius.lg,
    borderWidth: 3,
    borderColor: colors.white,
  },
  hint: { position: "absolute", left: space.xl, right: space.xl, alignItems: "center" },
  hintText: { color: colors.white, fontSize: 15, fontWeight: "600", textAlign: "center", backgroundColor: "rgba(0,0,0,0.45)", paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill, overflow: "hidden" },
  result: { flexGrow: 1, backgroundColor: colors.cream, paddingHorizontal: space.xl },
  customerName: { fontFamily: fonts.display, fontSize: 30, color: colors.ink, marginTop: 2 },
  stampsRow: { flexDirection: "row", gap: 6, marginTop: space.lg, marginBottom: space.sm },
  stampDot: { flex: 1, height: 10, borderRadius: 5, backgroundColor: colors.sand },
  stampDotOn: { backgroundColor: colors.aegean },
  message: { flexDirection: "row", alignItems: "center", gap: space.sm, padding: space.md, borderRadius: radius.md, marginTop: space.lg },
  reward: { flexDirection: "row", alignItems: "center", gap: space.md, padding: space.md, borderRadius: radius.md, backgroundColor: colors.goldSoft },
});

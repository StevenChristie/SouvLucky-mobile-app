import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Linking, Platform, ScrollView, StyleSheet, Switch, Text, View } from "react-native";

import { Avatar } from "@/components/Avatar";
import { GreekKey } from "@/components/brand/Decor";
import { Button } from "@/components/ui/Button";
import { BirthdayField, formatBirthday, parseBirthday } from "@/components/ui/Form";
import { SOCIALS } from "@/data/socials";
import { haptic } from "@/lib/haptics";
import { useSession } from "@/lib/session";
import { friendlyError } from "@/lib/supabase";
import { colors, radius, space, type } from "@/theme";

/** Asks before doing something destructive; uses `confirm()` on web where Alert has no buttons. */
function confirmAction(title: string, message: string, action: string, onConfirm: () => void) {
  if (Platform.OS === "web") {
    if (globalThis.confirm?.(`${title}\n\n${message}`)) onConfirm();
    return;
  }
  Alert.alert(title, message, [
    { text: "Cancel", style: "cancel" },
    { text: action, style: "destructive", onPress: onConfirm },
  ]);
}

export default function AccountScreen() {
  const { member, updateProfile, signOut, deleteAccount } = useSession();
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!member) return null;

  const birthday = parseBirthday(day, month);

  const saveBirthday = async () => {
    if (!birthday) {
      setError("Please enter a valid day and month");
      return;
    }
    setSaving(true);
    try {
      await updateProfile({ birthday });
      haptic.success();
      setError(null);
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setSaving(false);
    }
  };

  const toggleMarketing = async (value: boolean) => {
    haptic.select();
    try {
      await updateProfile({ marketingOptIn: value });
    } catch (e) {
      setError(friendlyError(e));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.root}>
      <View style={styles.header}>
        <Avatar size={72} />
        <View style={{ flex: 1 }}>
          <Text style={type.heading}>{member.name}</Text>
          <Text style={type.caption}>{member.email}</Text>
          <Text style={[type.caption, { marginTop: 2 }]}>Member {member.memberCode}</Text>
        </View>
      </View>

      <GreekKey opacity={0.5} style={{ marginVertical: space.lg }} />

      {/* Birthday — can be set once, so the reward can't be claimed repeatedly. */}
      <Text style={type.overline}>Birthday</Text>
      {member.birthday ? (
        <View style={styles.row}>
          <Ionicons name="gift-outline" size={20} color={colors.aegean} />
          <Text style={[type.label, { flex: 1 }]}>{formatBirthday(member.birthday)}</Text>
          <Text style={type.caption}>Free baklava on your birthday 🎂</Text>
        </View>
      ) : (
        <View style={{ gap: space.sm, marginTop: space.sm }}>
          <BirthdayField
            day={day}
            month={month}
            onChangeDay={setDay}
            onChangeMonth={setMonth}
            hint="Add your birthday for a free baklava every year. It can't be changed later."
          />
          <Button label={saving ? "Saving…" : "Save birthday"} variant="secondary" disabled={saving || !day || !month} onPress={saveBirthday} />
        </View>
      )}

      <Text style={[type.overline, { marginTop: space.xl }]}>Emails</Text>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={type.label}>News, events & offers</Text>
          <Text style={type.caption}>Hear about events like Halloween at Prison Break</Text>
        </View>
        <Switch
          value={member.marketingOptIn}
          onValueChange={toggleMarketing}
          trackColor={{ true: colors.aegean, false: colors.sand }}
          thumbColor={colors.white}
          accessibilityLabel="Receive news, events and offers by email"
        />
      </View>

      <Text style={[type.overline, { marginTop: space.xl }]}>Follow us</Text>
      <View style={{ gap: space.sm, marginTop: space.sm }}>
        {SOCIALS.map((s) => (
          <Button key={s.id} label={`${s.label} · ${s.handle}`} icon={s.icon} variant="secondary" onPress={() => Linking.openURL(s.url)} />
        ))}
      </View>

      {member.isStaff && (
        <>
          <Text style={[type.overline, { marginTop: space.xl }]}>Staff</Text>
          <Button label="Open staff scanner" icon="scan" onPress={() => router.replace("/staff")} style={{ marginTop: space.sm }} />
        </>
      )}

      {error && <Text style={styles.error}>{error}</Text>}

      <View style={{ marginTop: space.xxl, gap: space.sm }}>
        <Button
          label="Sign out"
          icon="log-out-outline"
          variant="secondary"
          onPress={() => confirmAction("Sign out?", "Your stamps are saved to your account — sign back in any time with your email.", "Sign out", signOut)}
        />
        <Button
          label="Delete my account"
          variant="ghost"
          onPress={() =>
            confirmAction(
              "Delete your account?",
              "This permanently deletes your account, stamps and rewards. This can't be undone.",
              "Delete",
              () => deleteAccount().catch((e) => setError(friendlyError(e))),
            )
          }
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { padding: space.xl, paddingTop: space.xxl, paddingBottom: space.xxl },
  header: { flexDirection: "row", alignItems: "center", gap: space.lg },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.lg,
    borderRadius: radius.md,
    backgroundColor: colors.parchment,
    marginTop: space.sm,
  },
  error: { color: colors.danger, marginTop: space.lg, textAlign: "center" },
});

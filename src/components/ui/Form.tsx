import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputInstance } from "react-native";

import { haptic } from "@/lib/haptics";
import type { Birthday } from "@/lib/session";
import { colors, radius, space } from "@/theme";

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Parses day/month inputs: `null` if both are blank, `undefined` if not a real date. */
export function parseBirthday(day: string, month: string): Birthday | null | undefined {
  if (!day.trim() && !month.trim()) return null;
  const d = Number(day);
  const m = Number(month);
  if (!Number.isInteger(d) || !Number.isInteger(m) || m < 1 || m > 12 || d < 1 || d > DAYS_IN_MONTH[m - 1]) return undefined;
  return { day: d, month: m };
}

/** "12 Mar" */
export const formatBirthday = (b: Birthday) => `${b.day} ${MONTHS[b.month - 1]}`;

type FieldProps = React.ComponentProps<typeof TextInput> & {
  icon: keyof typeof Ionicons.glyphMap;
  error?: string;
  ref?: React.Ref<TextInputInstance>;
};

export function Field({ icon, error, ref, ...input }: FieldProps) {
  const [focused, setFocused] = useState(false);
  return (
    <View>
      <View style={[styles.field, focused && styles.fieldFocused, !!error && styles.fieldError]}>
        <Ionicons name={icon} size={19} color={focused ? colors.aegean : colors.muted} />
        <TextInput
          ref={ref}
          {...input}
          placeholderTextColor={colors.muted}
          style={styles.input}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

export function Checkbox({
  checked,
  onChange,
  error,
  children,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  error?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Pressable
      style={styles.checkRow}
      onPress={() => {
        haptic.select();
        onChange(!checked);
      }}
      accessibilityRole="checkbox"
      aria-checked={checked}
    >
      <View style={[styles.checkbox, checked && styles.checkboxOn, error && styles.checkboxError]}>
        {checked && <Ionicons name="checkmark" size={16} color={colors.white} />}
      </View>
      <Text style={styles.checkText}>{children}</Text>
    </Pressable>
  );
}

/** DD / MM inputs. `error` shows a message instead of the hint. */
export function BirthdayField({
  day,
  month,
  onChangeDay,
  onChangeMonth,
  error,
  hint = "Optional — we'll treat you on your birthday 🎂",
}: {
  day: string;
  month: string;
  onChangeDay: (v: string) => void;
  onChangeMonth: (v: string) => void;
  error?: string;
  hint?: string;
}) {
  const monthRef = useRef<TextInputInstance>(null);
  return (
    <View>
      <View style={[styles.field, !!error && styles.fieldError]}>
        <Ionicons name="gift-outline" size={19} color={colors.muted} />
        <Text style={styles.birthdayLabel}>Birthday</Text>
        <TextInput
          value={day}
          onChangeText={(v) => {
            const digits = v.replace(/\D/g, "");
            onChangeDay(digits);
            if (digits.length === 2) monthRef.current?.focus();
          }}
          placeholder="DD"
          placeholderTextColor={colors.muted}
          keyboardType="number-pad"
          maxLength={2}
          style={styles.birthdayInput}
          accessibilityLabel="Birthday day"
        />
        <Text style={styles.birthdaySlash}>/</Text>
        <TextInput
          ref={monthRef}
          value={month}
          onChangeText={(v) => onChangeMonth(v.replace(/\D/g, ""))}
          placeholder="MM"
          placeholderTextColor={colors.muted}
          keyboardType="number-pad"
          maxLength={2}
          style={styles.birthdayInput}
          accessibilityLabel="Birthday month"
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    height: 56,
    paddingHorizontal: space.lg,
    borderRadius: radius.md,
    backgroundColor: colors.parchment,
    borderWidth: 1.5,
    borderColor: colors.line,
  },
  fieldFocused: { borderColor: colors.aegean, backgroundColor: colors.white },
  fieldError: { borderColor: colors.danger },
  input: { flex: 1, fontSize: 16, color: colors.ink, height: "100%" },
  error: { color: colors.danger, fontSize: 12, marginTop: 4, marginLeft: space.sm },
  hint: { color: colors.muted, fontSize: 12, marginTop: 4, marginLeft: space.sm },
  checkRow: { flexDirection: "row", alignItems: "center", gap: space.md, paddingVertical: space.xs },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: colors.aegean,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxOn: { backgroundColor: colors.aegean },
  checkboxError: { borderColor: colors.danger },
  checkText: { flex: 1, fontSize: 14, lineHeight: 20, color: colors.inkSoft },
  birthdayLabel: { flex: 1, fontSize: 16, color: colors.muted },
  birthdayInput: { width: 44, height: "100%", textAlign: "center", fontSize: 16, color: colors.ink },
  birthdaySlash: { fontSize: 16, color: colors.muted },
});

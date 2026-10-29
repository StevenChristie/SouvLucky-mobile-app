import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, type StyleProp, type ViewStyle } from "react-native";

import { colors, radius } from "@/theme";
import { PressableScale } from "./PressableScale";

type Variant = "primary" | "secondary" | "gold" | "ghost";

type Props = {
  label: string;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: Variant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

const palette: Record<Variant, { bg: string; fg: string; border?: string }> = {
  primary: { bg: colors.aegean, fg: colors.white },
  secondary: { bg: colors.parchment, fg: colors.aegean, border: colors.line },
  gold: { bg: colors.gold, fg: colors.white },
  ghost: { bg: "transparent", fg: colors.aegean },
};

export function Button({ label, onPress, icon, variant = "primary", disabled, style }: Props) {
  const p = palette[variant];
  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={label}
      aria-disabled={disabled}
      style={[
        styles.base,
        { backgroundColor: p.bg, borderColor: p.border ?? p.bg, opacity: disabled ? 0.45 : 1 },
        variant === "ghost" && styles.ghost,
        style,
      ]}
    >
      {icon && <Ionicons name={icon} size={19} color={p.fg} />}
      <Text style={[styles.label, { color: p.fg }]}>{label}</Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 54,
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  ghost: { height: 44, borderWidth: 0 },
  label: { fontSize: 15, fontWeight: "700", letterSpacing: 0.4 },
});

import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View, type TextInputInstance } from "react-native";
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSequence, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EvilEye } from "@/components/brand/EvilEye";
import { GreekKey } from "@/components/brand/Decor";
import { haptic } from "@/lib/haptics";
import { useSession } from "@/lib/session";
import { friendlyError } from "@/lib/supabase";
import { colors, radius, space, type } from "@/theme";

/** Matches Supabase → Authentication → Email OTP length (6 by default). */
const CODE_LENGTH = 6;
const RESEND_AFTER_S = 60;

export default function VerifyScreen() {
  const insets = useSafeAreaInsets();
  const { email = "", mode } = useLocalSearchParams<{ email: string; mode?: string }>();
  const { verifyCode, requestCode } = useSession();
  const [code, setCode] = useState("");
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wait, setWait] = useState(RESEND_AFTER_S);
  const inputRef = useRef<TextInputInstance>(null);
  const shake = useSharedValue(0);

  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  const submit = async (value: string) => {
    if (value.length !== CODE_LENGTH || checking) return;
    setChecking(true);
    setError(null);
    try {
      // On success the session updates and the navigator moves on to the app by itself.
      await verifyCode(email, value);
      haptic.success();
    } catch (e) {
      haptic.warn();
      setError(friendlyError(e));
      setCode("");
      shake.set(withSequence(withTiming(-10, { duration: 50 }), withTiming(10, { duration: 50 }), withTiming(-6, { duration: 50 }), withTiming(0, { duration: 50 })));
      setChecking(false);
    }
  };

  const resend = async () => {
    setError(null);
    try {
      await requestCode(email);
      setWait(RESEND_AFTER_S);
      haptic.success();
    } catch (e) {
      setError(friendlyError(e));
    }
  };

  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shake.value }] }));

  return (
    <KeyboardAvoidingView style={[styles.root, { paddingTop: insets.top + space.md }]} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Pressable onPress={() => router.back()} hitSlop={12} style={styles.back} accessibilityLabel="Back">
        <Ionicons name="chevron-back" size={26} color={colors.aegean} />
      </Pressable>

      <Animated.View entering={FadeInDown.duration(500)} style={styles.content}>
        <EvilEye size={72} idleBlink />
        <Text style={[type.title, styles.center, { marginTop: space.lg }]}>Check your email</Text>
        <Text style={[type.body, styles.center, { marginTop: space.xs }]}>
          We sent a {CODE_LENGTH}-digit code to{"\n"}
          <Text style={{ fontWeight: "700", color: colors.ink }}>{email}</Text>
        </Text>

        <Pressable onPress={() => inputRef.current?.focus()} accessibilityLabel="Enter your code">
          <Animated.View style={[styles.boxes, shakeStyle]}>
            {Array.from({ length: CODE_LENGTH }, (_, i) => {
              const active = i === code.length && !checking;
              return (
                <View key={i} style={[styles.box, active && styles.boxActive, !!error && styles.boxError]}>
                  <Text style={styles.digit}>{code[i] ?? ""}</Text>
                </View>
              );
            })}
          </Animated.View>
        </Pressable>

        {/* One real input behind the boxes, so paste and SMS/email autofill work. */}
        <TextInput
          ref={inputRef}
          value={code}
          onChangeText={(v) => {
            const digits = v.replace(/\D/g, "").slice(0, CODE_LENGTH);
            setCode(digits);
            if (digits.length === CODE_LENGTH) submit(digits);
          }}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete="one-time-code"
          autoFocus
          maxLength={CODE_LENGTH}
          style={styles.hiddenInput}
          accessibilityLabel={`${CODE_LENGTH}-digit code`}
        />

        <View style={styles.status}>
          {checking ? (
            <ActivityIndicator color={colors.aegean} />
          ) : error ? (
            <Text style={styles.error}>{error}</Text>
          ) : (
            <Text style={type.caption}>{mode === "join" ? "Almost there — your free gyro is waiting!" : "Opa, welcome back!"}</Text>
          )}
        </View>

        <Pressable onPress={resend} disabled={wait > 0} style={styles.resend} accessibilityRole="button">
          <Text style={[styles.resendText, wait > 0 && { color: colors.muted }]}>
            {wait > 0 ? `Resend code in ${wait}s` : "Resend code"}
          </Text>
        </Pressable>
        <Text style={[type.caption, styles.center]}>Can&apos;t find it? Check your spam or promotions folder.</Text>
      </Animated.View>

      <GreekKey opacity={0.5} style={{ marginTop: "auto", marginBottom: insets.bottom + space.lg, paddingHorizontal: space.xl }} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.cream },
  back: { paddingHorizontal: space.lg, paddingVertical: space.sm, alignSelf: "flex-start" },
  content: { alignItems: "center", paddingHorizontal: space.xl, marginTop: space.xl },
  center: { textAlign: "center" },
  boxes: { flexDirection: "row", gap: 10, marginTop: space.xl },
  box: {
    width: 46,
    height: 58,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.parchment,
    alignItems: "center",
    justifyContent: "center",
  },
  boxActive: { borderColor: colors.aegean, backgroundColor: colors.white },
  boxError: { borderColor: colors.danger },
  digit: { fontSize: 26, fontWeight: "700", color: colors.ink },
  hiddenInput: { position: "absolute", opacity: 0, width: 1, height: 1 },
  status: { minHeight: 44, justifyContent: "center", marginTop: space.md },
  error: { color: colors.danger, textAlign: "center", fontSize: 14 },
  resend: { paddingVertical: space.sm },
  resendText: { color: colors.aegean, fontWeight: "700", fontSize: 15 },
});

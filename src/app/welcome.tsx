import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import { useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View, type TextInputInstance } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Logo, Waves } from "@/components/brand/Decor";
import { Button } from "@/components/ui/Button";
import { BirthdayField, Checkbox, EMAIL_PATTERN, Field, parseBirthday } from "@/components/ui/Form";
import { haptic } from "@/lib/haptics";
import { useSession } from "@/lib/session";
import { friendlyError } from "@/lib/supabase";
import { colors, space, type } from "@/theme";

const HERO = require("@assets/images/photos/santorini.jpg");

type Mode = "join" | "signin";

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const { requestCode } = useSession();
  const [mode, setMode] = useState<Mode>("join");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [touched, setTouched] = useState(false);
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const emailRef = useRef<TextInputInstance>(null);

  const joining = mode === "join";
  const nameOk = name.trim().length >= 2;
  const emailOk = EMAIL_PATTERN.test(email.trim());
  const birthday = parseBirthday(birthDay, birthMonth);
  const birthdayOk = birthday !== undefined;
  const valid = joining ? nameOk && emailOk && birthdayOk && agreed : emailOk;

  const submit = async () => {
    setTouched(true);
    setServerError(null);
    if (!valid || sending) {
      haptic.warn();
      return;
    }
    setSending(true);
    try {
      await requestCode(email, joining ? { name, birthday: birthday ?? null, marketingOptIn } : undefined);
      haptic.success();
      router.push({ pathname: "/verify", params: { email: email.trim().toLowerCase(), mode } });
    } catch (e) {
      haptic.warn();
      setServerError(friendlyError(e));
    } finally {
      setSending(false);
    }
  };

  const switchMode = () => {
    haptic.select();
    setMode(joining ? "signin" : "join");
    setTouched(false);
    setServerError(null);
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
        <View style={styles.hero}>
          <Image source={HERO} style={StyleSheet.absoluteFill} contentFit="cover" transition={300} />
          <LinearGradient colors={["rgba(243,237,225,0)", "rgba(243,237,225,0.35)", colors.cream]} locations={[0.35, 0.7, 1]} style={StyleSheet.absoluteFill} />
        </View>

        <View style={styles.body}>
          <Animated.View entering={FadeInDown.duration(600).delay(100)} style={{ alignItems: "center" }}>
            <Logo width={220} />
          </Animated.View>

          <Animated.View key={mode} entering={FadeIn.duration(300)}>
            <Text style={[type.title, styles.center, { marginTop: space.lg }]}>{joining ? "Join the family" : "Welcome back"}</Text>
            <Text style={[type.body, styles.center, { marginTop: space.xs }]}>
              {joining ? "Register today and your first gyro is on us 🌯" : "We'll email you a 6-digit code to sign in."}
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(600).delay(340)} style={{ marginTop: space.xl, gap: space.md }}>
            {joining && (
              <Field
                icon="person-outline"
                placeholder="Your name"
                value={name}
                onChangeText={setName}
                error={touched && !nameOk ? "Please enter your name" : undefined}
                textContentType="name"
                autoComplete="name"
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
              />
            )}
            <Field
              ref={emailRef}
              icon="mail-outline"
              placeholder="Email address"
              value={email}
              onChangeText={setEmail}
              error={touched && !emailOk ? "Please enter a valid email" : undefined}
              keyboardType="email-address"
              textContentType="emailAddress"
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType={joining ? "next" : "send"}
              onSubmitEditing={joining ? undefined : submit}
            />

            {joining && (
              <>
                <BirthdayField
                  day={birthDay}
                  month={birthMonth}
                  onChangeDay={setBirthDay}
                  onChangeMonth={setBirthMonth}
                  error={touched && !birthdayOk ? "Please enter a valid day and month" : undefined}
                />
                <Checkbox checked={agreed} onChange={setAgreed} error={touched && !agreed}>
                  I agree to the{" "}
                  <Link href="/terms" style={styles.link}>
                    Terms & Conditions
                  </Link>
                </Checkbox>
                <Checkbox checked={marketingOptIn} onChange={setMarketingOptIn}>
                  Send me news, events and offers by email. You can unsubscribe at any time.
                </Checkbox>
              </>
            )}

            {serverError && <Text style={styles.serverError}>{serverError}</Text>}

            <Button
              label={sending ? "Sending your code…" : joining ? "Join the family" : "Email me a code"}
              icon={joining ? "sparkles" : "mail"}
              onPress={submit}
              disabled={sending}
              style={{ marginTop: space.sm, opacity: valid ? 1 : 0.6 }}
            />

            <Pressable onPress={switchMode} style={styles.switch} accessibilityRole="button">
              <Text style={styles.switchText}>
                {joining ? "Already a member? " : "New here? "}
                <Text style={styles.link}>{joining ? "Sign in" : "Join the family"}</Text>
              </Text>
            </Pressable>
          </Animated.View>
        </View>

        <Waves style={{ marginTop: "auto" }} />
        <View style={{ height: insets.bottom, backgroundColor: colors.aegean }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.cream },
  hero: { height: 260 },
  body: { paddingHorizontal: space.xl, marginTop: -70 },
  center: { textAlign: "center" },
  link: { color: colors.aegean, fontWeight: "700", textDecorationLine: "underline" },
  serverError: { color: colors.danger, fontSize: 14, textAlign: "center" },
  switch: { alignItems: "center", paddingVertical: space.sm },
  switchText: { fontSize: 14, color: colors.inkSoft },
});

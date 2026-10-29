import { Image } from "expo-image";
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";

import { space, type } from "@/theme";

const WAVES = require("@assets/images/brand/waves.png");
const GREEK_KEY = require("@assets/images/brand/greek-key.png");
const LOGO = require("@assets/images/brand/logo.png");

/** The Aegean waves from the splash video, full-width. */
export function Waves({ style, height }: { style?: StyleProp<ViewStyle>; height?: number }) {
  return (
    <View style={[{ width: "100%", height: height, aspectRatio: height ? undefined : 964 / 316 }, style]} pointerEvents="none">
      <Image source={WAVES} style={StyleSheet.absoluteFill} contentFit="fill" />
    </View>
  );
}

/** The meander (Greek key) band from the splash video. */
export function GreekKey({ style, opacity = 1 }: { style?: StyleProp<ViewStyle>; opacity?: number }) {
  return (
    <View style={[{ width: "100%", aspectRatio: 908 / 95, opacity }, style]} pointerEvents="none">
      <Image source={GREEK_KEY} style={StyleSheet.absoluteFill} contentFit="fill" />
    </View>
  );
}

export function Logo({ width = 200 }: { width?: number }) {
  return <Image source={LOGO} style={{ width, aspectRatio: 528 / 172 }} contentFit="contain" accessibilityLabel="SouvLucky Greek Kitchen" />;
}

/** Overline + display heading used to open each section of a screen. */
export function SectionTitle({ overline, title, right }: { overline?: string; title: string; right?: React.ReactNode }) {
  return (
    <View style={styles.sectionRow}>
      <View style={{ flex: 1 }}>
        {overline && <Text style={type.overline}>{overline}</Text>}
        <Text style={[type.heading, { marginTop: overline ? 2 : 0 }]}>{title}</Text>
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionRow: { flexDirection: "row", alignItems: "flex-end", marginBottom: space.md, gap: space.md },
});

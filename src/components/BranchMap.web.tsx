import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";

import type { BranchMapProps } from "./BranchMap";

/** react-native-maps has no web build — show the active branch's photo instead. */
export function BranchMap({ branches, active }: BranchMapProps) {
  return (
    <>
      <Image source={branches[active].photo} style={StyleSheet.absoluteFill} contentFit="cover" transition={400} />
      <LinearGradient colors={["rgba(29,42,87,0)", "rgba(29,42,87,0.35)"]} style={StyleSheet.absoluteFill} />
    </>
  );
}

import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { StyleSheet, Text, View } from "react-native";

import { PressableScale } from "@/components/ui/PressableScale";
import { useSession } from "@/lib/session";
import { colors } from "@/theme";

/** Member photo (or initial). Tap to choose a new photo from the library, unless `onPress` is given. */
export function Avatar({ size = 52, onPress }: { size?: number; onPress?: () => void }) {
  const { member, setAvatar } = useSession();

  const pick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
    });
    if (!result.canceled) setAvatar(result.assets[0].uri);
  };

  return (
    <PressableScale
      onPress={onPress ?? pick}
      accessibilityLabel={onPress ? "My account" : "Change profile photo"}
      style={{ width: size, height: size }}
    >
      <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}>
        {member?.avatar ? (
          <Image source={{ uri: member.avatar }} style={StyleSheet.absoluteFill} contentFit="cover" />
        ) : (
          <Text style={[styles.initial, { fontSize: size * 0.42 }]}>{member?.name.charAt(0).toUpperCase() ?? "S"}</Text>
        )}
      </View>
      <View style={styles.camera}>
        <Ionicons name="camera" size={11} color={colors.white} />
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  circle: {
    backgroundColor: colors.aegean,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: colors.white,
  },
  initial: { color: colors.white, fontWeight: "700" },
  camera: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.gold,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.cream,
  },
});

import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { PressableScale } from "@/components/ui/PressableScale";
import { BRANCHES } from "@/data/locations";
import { formatEventDate, postImage, type Post } from "@/data/posts";
import { colors, fonts, radius, shadow, space } from "@/theme";

export function NewsCard({ post, width }: { post: Post; width: number }) {
  const branch = BRANCHES.find((b) => b.id === post.branchId);
  return (
    <PressableScale
      style={[styles.card, shadow.soft, { width }]}
      onPress={() => router.push({ pathname: "/news/[id]", params: { id: post.id } })}
      accessibilityLabel={post.title}
    >
      <View style={styles.imageWrap}>
        <Image source={postImage(post.image)} style={StyleSheet.absoluteFill} contentFit="cover" transition={250} />
        <LinearGradient colors={["rgba(29,42,87,0)", "rgba(29,42,87,0.75)"]} locations={[0.4, 1]} style={StyleSheet.absoluteFill} />
        {post.eventDate && (
          <View style={styles.datePill}>
            <Ionicons name="calendar" size={12} color={colors.aegean} />
            <Text style={styles.dateText}>{formatEventDate(post.eventDate)}</Text>
          </View>
        )}
        {branch && <Text style={styles.branch}>{branch.short}</Text>}
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {post.title}
        </Text>
        <Text style={styles.summary} numberOfLines={2}>
          {post.summary}
        </Text>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.md, backgroundColor: colors.parchment, overflow: "hidden" },
  imageWrap: { height: 150, backgroundColor: colors.skySoft },
  datePill: {
    position: "absolute",
    top: space.md,
    left: space.md,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: colors.cream,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  dateText: { fontSize: 12, fontWeight: "800", color: colors.aegean },
  branch: { position: "absolute", left: space.md, bottom: space.sm, color: colors.white, fontSize: 12, fontWeight: "700", letterSpacing: 0.6 },
  body: { padding: space.md },
  title: { fontFamily: fonts.display, fontSize: 20, lineHeight: 24, color: colors.ink },
  summary: { fontSize: 13, lineHeight: 18, color: colors.muted, marginTop: 4 },
});

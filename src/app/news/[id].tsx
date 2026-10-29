import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { openUberEats } from "@/components/OrderOnline";
import { Button } from "@/components/ui/Button";
import { BRANCHES } from "@/data/locations";
import { formatEventDate, postImage } from "@/data/posts";
import { usePost } from "@/lib/news";
import { colors, radius, space, type } from "@/theme";

export default function NewsPostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { post, loading } = usePost(id);

  if (!post && loading) {
    return (
      <View style={styles.missing}>
        <ActivityIndicator color={colors.aegean} />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.missing}>
        <Text style={type.heading}>Post not found</Text>
        <Button label="Back" variant="secondary" onPress={() => router.back()} style={{ marginTop: space.lg }} />
      </View>
    );
  }

  const branch = BRANCHES.find((b) => b.id === post.branchId);

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: space.xxl }}>
      <Image source={postImage(post.image)} style={styles.hero} contentFit="cover" transition={250} />

      <Animated.View entering={FadeInDown.duration(400)} style={styles.content}>
        <View style={styles.metaRow}>
          {post.eventDate && (
            <View style={styles.pill}>
              <Ionicons name="calendar" size={13} color={colors.aegean} />
              <Text style={styles.pillText}>{formatEventDate(post.eventDate)}</Text>
            </View>
          )}
          {branch && (
            <View style={styles.pill}>
              <Ionicons name="location" size={13} color={colors.aegean} />
              <Text style={styles.pillText}>{branch.short}</Text>
            </View>
          )}
        </View>

        <Text style={[type.title, { marginTop: space.md }]}>{post.title}</Text>
        {post.body.split(/\n\s*\n/).map((para, i) => (
          <Text key={i} style={[type.body, { marginTop: space.md, fontSize: 16, lineHeight: 24 }]}>
            {para.trim()}
          </Text>
        ))}

        {branch && (
          <View style={{ marginTop: space.xl, gap: space.sm }}>
            <Button label={`Visit ${branch.short}`} icon="navigate" onPress={() => router.navigate("/locations")} />
            {branch.uberEatsUrl && <Button label="Order on Uber Eats" icon="bicycle" variant="secondary" onPress={() => openUberEats(branch)} />}
          </View>
        )}
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  missing: { flex: 1, alignItems: "center", justifyContent: "center", padding: space.xl },
  hero: { width: "100%", height: 240, backgroundColor: colors.skySoft },
  content: { padding: space.xl },
  metaRow: { flexDirection: "row", gap: space.sm, flexWrap: "wrap" },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: colors.skySoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  pillText: { color: colors.aegean, fontWeight: "700", fontSize: 13 },
});

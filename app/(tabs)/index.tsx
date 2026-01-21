import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";

// 1. Import Font Loaders
import { GFSDidot_400Regular, useFonts } from "@expo-google-fonts/gfs-didot";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 2. Load the GFS Didot Greek Font
  let [fontsLoaded] = useFonts({
    GreekFont: GFSDidot_400Regular,
  });

  const [user, setUser] = useState({
    name: "",
    email: "",
    punches: 0,
    profileImage: null as string | null,
  });

  useEffect(() => {
    checkSession();
    const interval = setInterval(checkSession, 1000);
    return () => clearInterval(interval);
  }, []);

  const checkSession = async () => {
    const savedUser = await AsyncStorage.getItem("@souvlucky_session");
    const savedStamps = await AsyncStorage.getItem("@souvlucky_stamps");
    const savedImage = await AsyncStorage.getItem("@profile_image");

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser({
        ...parsedUser,
        punches: savedStamps ? parseInt(savedStamps) : 0,
        profileImage: savedImage || null,
      });
      setIsLoggedIn(true);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      await AsyncStorage.setItem("@profile_image", imageUri);
      setUser({ ...user, profileImage: imageUri });
    }
  };

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSignUp = async () => {
    if (!user.name.trim() || !user.email.trim()) {
      Alert.alert("Required", "Please enter your name and email.");
      return;
    }
    if (!validateEmail(user.email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    const sessionData = { name: user.name, email: user.email };
    await AsyncStorage.setItem(
      "@souvlucky_session",
      JSON.stringify(sessionData),
    );
    await AsyncStorage.setItem("@souvlucky_stamps", "0");
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    setIsLoggedIn(false);
    setUser({ name: "", email: "", punches: 0, profileImage: null });
  };

  // 3. Prevent rendering until fonts are loaded
  if (!fontsLoaded) return null;

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.authContainer}>
        <StatusBar barStyle="dark-content" />
        <ScrollView
          contentContainerStyle={styles.authScroll}
          keyboardShouldPersistTaps="handled"
        >
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          {/* Applied Greek Font */}
          <Text style={[styles.authTitle, { fontFamily: "GreekFont" }]}>
            SouvLucky Family
          </Text>
          <Text style={styles.authSub}>
            Register and get your first Gyro on us! 🌯
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Your Name"
            placeholderTextColor="#95A5A6"
            onChangeText={(t) => setUser({ ...user, name: t })}
          />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#95A5A6"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={(t) => setUser({ ...user, email: t })}
          />
          <TouchableOpacity style={styles.primaryBtn} onPress={handleSignUp}>
            <Text style={styles.primaryBtnText}>JOIN THE FAMILY</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <ImageBackground
      source={require("../../assets/images/table.png")}
      style={styles.bgImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" />
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.profileHeader}>
              <AnimatedCircularProgress
                size={125}
                width={8}
                fill={(user.punches / 10) * 100}
                tintColor="#00bfff"
                backgroundColor="rgba(255,255,255,0.2)"
                rotation={0}
                lineCap="round"
              >
                {() => (
                  <TouchableOpacity
                    onPress={pickImage}
                    style={styles.avatarWrapper}
                  >
                    {user.profileImage ? (
                      <Image
                        source={{ uri: user.profileImage }}
                        style={styles.profilePic}
                      />
                    ) : (
                      <View style={styles.avatarCircle}>
                        <Text style={styles.avatarText}>
                          {user.name ? user.name.charAt(0).toUpperCase() : "S"}
                        </Text>
                      </View>
                    )}
                    <View style={styles.cameraIcon}>
                      <Ionicons name="camera" size={16} color="#FFF" />
                    </View>
                  </TouchableOpacity>
                )}
              </AnimatedCircularProgress>

              {/* Applied Greek Font to Greeting */}
              <Text style={[styles.userName, { fontFamily: "GreekFont" }]}>
                Yassas, {user.name}!
              </Text>

              <View style={styles.statusBadge}>
                <Text style={styles.memberStatus}>
                  {user.punches === 10
                    ? "REWARD READY 🎁"
                    : `${user.punches}/10 EYES COLLECTED`}
                </Text>
              </View>
            </View>

            <View style={styles.dashGrid}>
              <TouchableOpacity
                style={styles.dashCard}
                onPress={() => router.push("/explore")}
              >
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: "rgba(0, 51, 102, 0.1)" },
                  ]}
                >
                  <Ionicons
                    name="restaurant-outline"
                    size={28}
                    color="#003366"
                  />
                </View>
                <Text style={styles.cardLabel}>The Menu</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dashCard}
                onPress={() => router.push("/rewards")}
              >
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: "rgba(230, 126, 34, 0.1)" },
                  ]}
                >
                  <Ionicons name="gift-outline" size={28} color="#E67E22" />
                </View>
                <Text style={styles.cardLabel}>My Rewards</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Text style={styles.logoutText}>LOGOUT</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: { flex: 1 },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)" },
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 40 },
  authContainer: { flex: 1, backgroundColor: "#FFF" },
  authScroll: {
    alignItems: "center",
    paddingHorizontal: "10%",
    paddingTop: 60,
  },
  logo: { width: width * 0.35, height: width * 0.35, marginBottom: 20 },
  authTitle: { fontSize: 32, color: "#003366", textAlign: "center" },
  authSub: {
    textAlign: "center",
    color: "#7F8C8D",
    marginTop: 10,
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 55,
    backgroundColor: "#F4F7F9",
    borderRadius: 15,
    paddingHorizontal: 20,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  primaryBtn: {
    width: "100%",
    height: 60,
    backgroundColor: "#003366",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  primaryBtnText: { color: "#FFF", fontWeight: "900", letterSpacing: 1 },

  profileHeader: { alignItems: "center", marginTop: 60 },
  avatarWrapper: {
    width: 105,
    height: 105,
    justifyContent: "center",
    alignItems: "center",
  },
  profilePic: { width: 105, height: 105, borderRadius: 52.5 },
  avatarCircle: {
    width: 105,
    height: 105,
    borderRadius: 52.5,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontSize: 44, fontWeight: "900", color: "#003366" },
  cameraIcon: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#003366",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },

  userName: { fontSize: 34, color: "#FFF", marginTop: 15, textAlign: "center" },
  statusBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 12,
  },
  memberStatus: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },
  dashGrid: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginTop: 40,
  },
  dashCard: {
    width: "42%",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingVertical: 25,
    borderRadius: 25,
    alignItems: "center",
    elevation: 5,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  cardLabel: { fontWeight: "700", color: "#003366", fontSize: 15 },
  logoutBtn: { alignSelf: "center", marginTop: 60, opacity: 0.8 },
  logoutText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 1,
    textDecorationLine: "underline",
  },
});

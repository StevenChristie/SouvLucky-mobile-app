import { GFSDidot_400Regular, useFonts } from "@expo-google-fonts/gfs-didot";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  Modal,
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

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  let [fontsLoaded] = useFonts({ GreekFont: GFSDidot_400Regular });

  const [user, setUser] = useState({
    name: "",
    email: "",
    punches: 0,
    profileImage: null as string | null,
  });

  const checkSession = useCallback(async () => {
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
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

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

  const handleSignUp = async () => {
    if (!agreed) {
      Alert.alert(
        "Agreement Required",
        "Please agree to the Terms & Conditions.",
      );
      return;
    }
    if (!user.name.trim() || !user.email.trim()) {
      Alert.alert("Required", "Please enter your name and email.");
      return;
    }

    const sessionData = { name: user.name, email: user.email };
    await AsyncStorage.setItem(
      "@souvlucky_session",
      JSON.stringify(sessionData),
    );
    await AsyncStorage.setItem("@souvlucky_stamps", "0");
    await AsyncStorage.setItem("@souvlucky_welcome_eligible", "true");

    setIsLoggedIn(true);
    setShowWelcomeModal(true);
    router.replace("/");
  };

  const handleLogout = async () => {
    try {
      const keysToClear = [
        "@souvlucky_session",
        "@souvlucky_stamps",
        "@profile_image",
        "@souvlucky_welcome_eligible",
      ];
      await AsyncStorage.multiRemove(keysToClear);

      setIsLoggedIn(false);
      setUser({ name: "", email: "", punches: 0, profileImage: null });
      setAgreed(false);
      router.replace("/");
      Alert.alert("App Reset", "All data cleared.");
    } catch {
      Alert.alert("Error", "Failed to reset app data.");
    }
  };

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
          <Text style={styles.authSub}>
            Register and get your first Gyro on us! 🌯
          </Text>

          {/* NAME INPUT WITH AUTOFILL */}
          <TextInput
            style={styles.input}
            placeholder="Your Name"
            placeholderTextColor="#95A5A6"
            autoCapitalize="words"
            textContentType="name"
            autoComplete="name"
            onChangeText={(t) => setUser({ ...user, name: t })}
          />

          {/* EMAIL INPUT WITH AUTOFILL & SAVED PASSWORDS */}
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#95A5A6"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
            autoComplete="email"
            onChangeText={(t) => setUser({ ...user, email: t })}
          />

          <View style={styles.termsRow}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setAgreed(!agreed)}
            >
              {agreed && (
                <Ionicons name="checkmark" size={18} color="#003366" />
              )}
            </TouchableOpacity>
            <Text style={styles.termsText}>
              I agree to the{" "}
              <Text
                style={styles.termsLink}
                onPress={() => setShowTermsModal(true)}
              >
                Terms & Conditions
              </Text>
            </Text>
          </View>

          <TouchableOpacity style={styles.primaryBtn} onPress={handleSignUp}>
            <Text style={styles.primaryBtnText}>JOIN THE FAMILY</Text>
          </TouchableOpacity>
        </ScrollView>

        <Modal
          visible={showTermsModal}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.legalCard}>
              <Text style={[styles.legalTitle, { fontFamily: "GreekFont" }]}>
                Terms of Use
              </Text>
              <ScrollView style={styles.legalScroll}>
                <Text style={styles.legalText}>
                  Welcome to the SouvLucky Family! By registering, you agree to:
                  {"\n\n"}1. Eligibility: A valid email is required.
                  {"\n\n"}2. Rewards: The Welcome Gift is a one-time offer.
                  {"\n\n"}3. Privacy: Data is strictly for reward tracking.
                </Text>
              </ScrollView>
              <TouchableOpacity
                style={styles.dismissBtn}
                onPress={() => setShowTermsModal(false)}
              >
                <Text style={styles.dismissBtnText}>CLOSE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
          <TouchableOpacity style={styles.debugResetBtn} onPress={handleLogout}>
            <Ionicons name="refresh-circle" size={20} color="#FFF" />
            <Text style={styles.debugResetText}>DEBUG: RESET APP</Text>
          </TouchableOpacity>
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
                          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </Text>
                      </View>
                    )}
                    <View style={styles.cameraIcon}>
                      <Ionicons name="camera" size={16} color="#FFF" />
                    </View>
                  </TouchableOpacity>
                )}
              </AnimatedCircularProgress>
              <Text style={[styles.userName, { fontFamily: "GreekFont" }]}>
                Yassas, {user.name}!
              </Text>
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

          <Modal visible={showWelcomeModal} transparent animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.welcomeModalCard}>
                <Ionicons name="sparkles" size={40} color="#003366" />
                <Text style={[styles.modalTitle, { fontFamily: "GreekFont" }]}>
                  You&apos;re in the Family!
                </Text>
                <Text style={styles.modalText}>
                  We&apos;ve dropped a{" "}
                  <Text style={{ fontWeight: "bold" }}>FREE Gyro</Text> into
                  your rewards!
                </Text>
                <TouchableOpacity
                  style={styles.dismissBtn}
                  onPress={() => setShowWelcomeModal(false)}
                >
                  <Text style={styles.dismissBtnText}>GOT IT!</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: { flex: 1 },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 120 },
  authContainer: { flex: 1, backgroundColor: "#FFF" },
  authScroll: {
    alignItems: "center",
    paddingHorizontal: "10%",
    paddingTop: 30,
  },
  logo: { width: width * 0.85, height: width * 0.6, marginBottom: -10 },
  authSub: {
    textAlign: "center",
    color: "#7F8C8D",
    marginBottom: 40,
    fontSize: 16,
  },
  input: {
    width: "100%",
    height: 55,
    backgroundColor: "#F4F7F9",
    borderRadius: 15,
    paddingHorizontal: 20,
    marginBottom: 15,
    fontSize: 16,
    color: "#2C3E50",
    borderWidth: 1,
    borderColor: "#EEE",
  },
  termsRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#003366",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  termsText: { color: "#7F8C8D", fontSize: 13 },
  termsLink: {
    color: "#003366",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  primaryBtn: {
    width: "100%",
    height: 60,
    backgroundColor: "#003366",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryBtnText: { color: "#FFF", fontWeight: "900" },
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
  userName: { fontSize: 34, color: "#FFF", marginTop: 15 },
  dashGrid: {
    flexDirection: "row",
    justifyContent: "space-evenly",
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
  logoutBtn: { alignSelf: "center", marginTop: 60 },
  logoutText: { color: "#FFF", textDecorationLine: "underline" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  legalCard: {
    width: "85%",
    maxHeight: "70%",
    backgroundColor: "#FFF",
    borderRadius: 25,
    padding: 25,
    alignItems: "center",
  },
  legalTitle: { fontSize: 24, color: "#003366", marginBottom: 15 },
  legalScroll: { width: "100%", marginBottom: 15 },
  legalText: { fontSize: 14, color: "#2C3E50", lineHeight: 20 },
  welcomeModalCard: {
    width: "85%",
    backgroundColor: "#FFF",
    borderRadius: 35,
    padding: 30,
    alignItems: "center",
  },
  modalTitle: { fontSize: 26, color: "#003366", marginBottom: 10 },
  modalText: { fontSize: 15, textAlign: "center", marginBottom: 20 },
  dismissBtn: {
    backgroundColor: "#003366",
    paddingVertical: 16,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
  },
  dismissBtnText: { color: "#FFF", fontWeight: "900" },
  debugResetBtn: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 999,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(231, 76, 60, 0.8)",
    padding: 8,
    borderRadius: 12,
  },
  debugResetText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "900",
    marginLeft: 5,
  },
});

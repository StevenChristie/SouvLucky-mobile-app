import { homeStyles as styles } from "@/styles/styles";
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

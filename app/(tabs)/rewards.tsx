import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  ImageBackground,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
// 1. Import Moti for micro-animations
import { View as MotiView } from "moti";

const { width } = Dimensions.get("window");

const EvilEye = ({ filled, isLast }: { filled: boolean; isLast: boolean }) => {
  if (!filled) {
    return (
      <View style={[styles.eyeOuter, styles.eyeGhost]}>
        {isLast ? (
          <Ionicons name="gift" size={24} color="rgba(0, 51, 102, 0.2)" />
        ) : (
          <View style={styles.eyeIrisGhost} />
        )}
      </View>
    );
  }

  // 2. Wrap the filled eye in a MotiView for a "pop" effect
  return (
    <MotiView
      from={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", damping: 12 }}
      style={styles.eyeOuter}
    >
      <View style={styles.eyeWhite}>
        <View style={styles.eyeIris} />
      </View>
    </MotiView>
  );
};

export default function RewardsScreen() {
  const [punches, setPunches] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [hasWelcomeGyro, setHasWelcomeGyro] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const totalSpots = 10;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const savedUser = await AsyncStorage.getItem("@souvlucky_session");
      if (!savedUser) {
        setIsLoggedIn(false);
        return;
      }
      setIsLoggedIn(true);
      const savedStamps = await AsyncStorage.getItem("@souvlucky_stamps");
      if (savedStamps) setPunches(parseInt(savedStamps));

      const voucherClaimed = await AsyncStorage.getItem("@welcome_claimed");
      if (voucherClaimed !== "true") setHasWelcomeGyro(true);
    } catch (e) {
      console.log("Error loading data:", e);
    }
  };

  const addStamp = async () => {
    if (punches < totalSpots) {
      const newCount = punches + 1;
      setPunches(newCount);
      await AsyncStorage.setItem("@souvlucky_stamps", newCount.toString());

      if (newCount === totalSpots) {
        setShowConfetti(true);
        Alert.alert("OPA! 🎉", "Free Gyro Earned! Show this to staff.");
      }
    }
  };

  const resetCard = async () => {
    setPunches(0);
    setShowConfetti(false);
    await AsyncStorage.setItem("@souvlucky_stamps", "0");
    setShowQR(false);
  };

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.lockedContainer}>
        <Ionicons name="lock-closed" size={80} color="#003366" />
        <Text style={styles.lockedTitle}>Rewards Locked</Text>
        <Text style={styles.lockedSub}>
          Please register on the Home tab to start earning Evil Eyes.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <ImageBackground
      source={require("../../assets/images/BackGround.png")}
      style={styles.bgImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={{ alignItems: "center", paddingBottom: 50 }}
        >
          <View style={styles.header}>
            <Text style={styles.title}>SouvLucky Rewards</Text>
            <Text style={styles.subtitle}>
              {punches} of {totalSpots} Evil Eyes Collected
            </Text>
          </View>

          {hasWelcomeGyro && (
            <MotiView
              from={{ translateY: 20, opacity: 0 }}
              animate={{ translateY: 0, opacity: 1 }}
              transition={{ delay: 300 }}
            >
              <TouchableOpacity
                style={styles.welcomeCard}
                onPress={() => {
                  Alert.alert(
                    "Redeem Welcome Gift?",
                    "Staff: Tap redeem to process free meal.",
                    [
                      { text: "Cancel" },
                      {
                        text: "Redeem",
                        onPress: async () => {
                          setHasWelcomeGyro(false);
                          await AsyncStorage.setItem(
                            "@welcome_claimed",
                            "true",
                          );
                        },
                      },
                    ],
                  );
                }}
              >
                <Ionicons name="ribbon" size={30} color="#F1C40F" />
                <View style={{ marginLeft: 15, flex: 1 }}>
                  <Text style={styles.welcomeTitle}>Welcome Gift!</Text>
                  <Text style={styles.welcomeSub}>
                    Tap to redeem 1 FREE Gyro
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#F1C40F" />
              </TouchableOpacity>
            </MotiView>
          )}

          <View style={styles.glassCard}>
            <Text style={styles.cardTitle}>Loyalty Card</Text>
            <View style={styles.gridContainer}>
              <FlatList
                data={Array.from({ length: totalSpots })}
                keyExtractor={(_, i) => i.toString()}
                numColumns={5}
                scrollEnabled={false}
                columnWrapperStyle={styles.columnWrapper}
                renderItem={({ index }) => (
                  <View style={styles.spot}>
                    <EvilEye
                      filled={index < punches}
                      isLast={index === totalSpots - 1}
                    />
                  </View>
                )}
              />
            </View>
            <View style={styles.progressBarBg}>
              <MotiView
                animate={{ width: `${(punches / totalSpots) * 100}%` }}
                transition={{ type: "timing", duration: 500 }}
                style={styles.progressBarFill}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.scanButton,
              punches === totalSpots && { backgroundColor: "#E74C3C" },
            ]}
            onPress={() => setShowQR(true)}
          >
            <Ionicons
              name={punches === totalSpots ? "gift" : "qr-code"}
              size={22}
              color="#FFF"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.scanButtonText}>
              {punches === totalSpots ? "REDEEM FREE GYRO" : "EARN A STAMP"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.debugButton} onPress={addStamp}>
            <Text style={styles.debugText}>[Debug] Add Stamp</Text>
          </TouchableOpacity>
        </ScrollView>

        {showConfetti && (
          <ConfettiCannon
            count={200}
            origin={{ x: width / 2, y: -20 }}
            colors={["#003366", "#FFFFFF", "#00bfff"]}
            fadeOut={true}
          />
        )}

        <Modal visible={showQR} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.qrContainer}>
              <TouchableOpacity
                style={styles.closeModal}
                onPress={() => setShowQR(false)}
              >
                <Ionicons name="close" size={30} color="#333" />
              </TouchableOpacity>
              <Text style={styles.qrTitle}>
                {punches === totalSpots ? "Redeem" : "Earn"}
              </Text>
              <Ionicons name="qr-code" size={width * 0.4} color="#003366" />
              <Text style={styles.qrInstructions}>
                Ask staff to scan this code.
              </Text>
              {punches === totalSpots && (
                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={resetCard}
                >
                  <Text style={styles.resetText}>Finish Redemption</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: { flex: 1 },
  container: { flex: 1 },
  lockedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F7F9",
    padding: "10%",
  },
  lockedTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#003366",
    marginTop: 20,
  },
  lockedSub: {
    textAlign: "center",
    color: "#7F8C8D",
    marginTop: 10,
    lineHeight: 20,
  },
  header: {
    backgroundColor: "rgba(0, 51, 102, 0.8)",
    width: "100%",
    paddingVertical: 40,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: { fontSize: 26, fontWeight: "900", color: "#FFF" },
  subtitle: { fontSize: 15, color: "rgba(255,255,255,0.7)", marginTop: 5 },
  welcomeCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    width: "90%",
    padding: 20,
    borderRadius: 20,
    marginTop: 20,
    alignItems: "center",
    borderLeftWidth: 6,
    borderLeftColor: "#F1C40F",
    elevation: 5,
  },
  welcomeTitle: { fontWeight: "900", color: "#003366", fontSize: 16 },
  welcomeSub: { fontSize: 12, color: "#7F8C8D" },
  glassCard: {
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    width: "90%",
    borderRadius: 30,
    padding: 25,
    marginTop: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#003366",
    textAlign: "center",
  },
  gridContainer: { marginTop: 15, marginBottom: 20, width: "100%" },
  columnWrapper: { justifyContent: "space-between", marginBottom: 12 },
  spot: {
    width: width * 0.14,
    height: width * 0.14,
    justifyContent: "center",
    alignItems: "center",
  },
  eyeOuter: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
    backgroundColor: "#0056b3",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#003366",
  },
  eyeGhost: {
    backgroundColor: "rgba(0, 51, 102, 0.05)",
    borderColor: "rgba(0, 51, 102, 0.15)",
    borderStyle: "dashed",
  },
  eyeIrisGhost: {
    width: "30%",
    height: "30%",
    borderRadius: 100,
    backgroundColor: "rgba(0, 51, 102, 0.05)",
  },
  eyeWhite: {
    width: "60%",
    height: "60%",
    borderRadius: 100,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  eyeIris: {
    width: "45%",
    height: "45%",
    borderRadius: 100,
    backgroundColor: "#00bfff",
  },
  progressBarBg: {
    height: 10,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 5,
    overflow: "hidden",
    marginTop: 10,
  },
  progressBarFill: { height: "100%", backgroundColor: "#27AE60" },
  scanButton: {
    backgroundColor: "#003366",
    flexDirection: "row",
    width: "90%",
    paddingVertical: 18,
    borderRadius: 20,
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  scanButtonText: { color: "#FFF", fontSize: 16, fontWeight: "900" },
  debugButton: { marginTop: 20 },
  debugText: {
    color: "#FFF",
    fontSize: 11,
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 5,
    borderRadius: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  qrContainer: {
    backgroundColor: "#FFF",
    width: "85%",
    padding: 30,
    borderRadius: 30,
    alignItems: "center",
  },
  closeModal: { alignSelf: "flex-end" },
  qrTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#003366",
    marginBottom: 20,
  },
  qrInstructions: {
    fontSize: 14,
    color: "#7F8C8D",
    textAlign: "center",
    marginTop: 10,
  },
  resetButton: {
    marginTop: 20,
    backgroundColor: "#003366",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  resetText: { color: "#FFF", fontWeight: "700" },
});

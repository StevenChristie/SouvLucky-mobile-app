import { GFSDidot_400Regular, useFonts } from "@expo-google-fonts/gfs-didot";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View as MotiView } from "moti";
import React, { memo, useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
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

const { width } = Dimensions.get("window");

// MEMOIZED: Prevents unnecessary re-renders of existing stamps
// Named function used to resolve "Missing Display Name" warning
const EvilEye = memo(function EvilEye({
  filled,
  isLast,
}: {
  filled: boolean;
  isLast: boolean;
}) {
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

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "timing",
        duration: 300,
      }}
      style={styles.eyeOuter}
    >
      <View style={styles.eyeWhite}>
        <View style={styles.eyeIris} />
      </View>
    </MotiView>
  );
});

export default function RewardsScreen() {
  const [punches, setPunches] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [hasWelcomeGyro, setHasWelcomeGyro] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const totalSpots = 10;

  let [fontsLoaded] = useFonts({
    GreekFont: GFSDidot_400Regular,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [savedUser, savedStamps, voucherClaimed] = await Promise.all([
        AsyncStorage.getItem("@souvlucky_session"),
        AsyncStorage.getItem("@souvlucky_stamps"),
        AsyncStorage.getItem("@welcome_claimed"),
      ]);

      if (!savedUser) {
        setIsLoggedIn(false);
        return;
      }
      setIsLoggedIn(true);
      if (savedStamps) setPunches(parseInt(savedStamps));
      if (voucherClaimed !== "true") setHasWelcomeGyro(true);
    } catch (e) {
      console.log("Error loading data:", e);
    }
  };

  const handleRedeem = async () => {
    setHasWelcomeGyro(false);
    setShowRedeemModal(false);
    setShowConfetti(true);
    AsyncStorage.setItem("@welcome_claimed", "true");
  };

  const addStamp = useCallback(async () => {
    if (punches < totalSpots) {
      const newCount = punches + 1;
      setPunches(newCount);
      AsyncStorage.setItem("@souvlucky_stamps", newCount.toString());
      if (newCount === totalSpots) setShowConfetti(true);
    }
  }, [punches]);

  const resetCard = async () => {
    setPunches(0);
    setShowConfetti(false);
    setShowQR(false);
    AsyncStorage.setItem("@souvlucky_stamps", "0");
  };

  if (!fontsLoaded) return null;

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
            <Text style={[styles.title, { fontFamily: "GreekFont" }]}>
              SouvLucky Rewards
            </Text>
            <Text style={styles.subtitle}>
              {punches} of {totalSpots} Evil Eyes Collected
            </Text>
          </View>

          {hasWelcomeGyro && (
            <MotiView
              from={{ translateY: 20, opacity: 0 }}
              animate={{ translateY: 0, opacity: 1 }}
              transition={{ delay: 200 }}
            >
              <TouchableOpacity
                style={styles.welcomeCard}
                onPress={() => setShowRedeemModal(true)}
              >
                <View style={styles.giftIconContainer}>
                  <Ionicons name="gift" size={28} color="#FFF" />
                </View>
                <View style={{ marginLeft: 15, flex: 1 }}>
                  <Text
                    style={[styles.welcomeTitle, { fontFamily: "GreekFont" }]}
                  >
                    Welcome Gift!
                  </Text>
                  <Text style={styles.welcomeSub}>
                    Tap to redeem 1 FREE Gyro
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="#003366"
                  opacity={0.3}
                />
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

        <Modal visible={showRedeemModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <MotiView
              from={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={styles.redeemContainer}
            >
              <Image
                source={require("../../assets/images/gyroman.png")}
                style={styles.gyroImage}
                resizeMode="contain"
              />
              <Text style={[styles.redeemTitle, { fontFamily: "GreekFont" }]}>
                Redeem Gift?
              </Text>
              <Text style={styles.redeemSub}>
                Staff: Tap redeem to process free meal.
              </Text>
              <View style={styles.redeemActionRow}>
                <TouchableOpacity
                  style={styles.cancelActionBtn}
                  onPress={() => setShowRedeemModal(false)}
                >
                  <Text style={styles.cancelActionText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.confirmActionBtn}
                  onPress={handleRedeem}
                >
                  <Text style={styles.confirmActionText}>Redeem</Text>
                </TouchableOpacity>
              </View>
            </MotiView>
          </View>
        </Modal>

        {showConfetti && (
          <ConfettiCannon
            count={150}
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
  container: { flex: 1 },
  bgImage: { flex: 1 },
  header: {
    backgroundColor: "rgba(0, 51, 102, 0.85)",
    width: "100%",
    paddingVertical: 40,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: { fontSize: 28, color: "#FFF" },
  subtitle: { fontSize: 15, color: "rgba(255,255,255,0.7)", marginTop: 5 },
  welcomeCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    width: width * 0.9,
    padding: 20,
    borderRadius: 25,
    marginTop: 25,
    alignItems: "center",
    elevation: 10,
  },
  giftIconContainer: {
    backgroundColor: "#003366",
    padding: 10,
    borderRadius: 15,
  },
  welcomeTitle: { fontSize: 20, color: "#003366" },
  welcomeSub: { fontSize: 13, color: "#7F8C8D" },
  glassCard: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    width: width * 0.94,
    borderRadius: 35,
    paddingHorizontal: 15,
    paddingVertical: 35,
    marginTop: 20,
    elevation: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#003366",
    textAlign: "center",
    marginBottom: 25,
  },
  gridContainer: { width: "100%" },
  columnWrapper: { justifyContent: "space-around", marginBottom: 20 },
  spot: { width: width * 0.16, height: width * 0.16 },
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    alignItems: "center",
  },
  redeemContainer: {
    width: "85%",
    backgroundColor: "#FFF",
    borderRadius: 35,
    padding: 30,
    alignItems: "center",
  },
  gyroImage: { width: 200, height: 200, marginBottom: -20 },
  redeemTitle: { fontSize: 32, color: "#003366", marginBottom: 10 },
  redeemSub: {
    fontSize: 14,
    color: "#7F8C8D",
    textAlign: "center",
    marginBottom: 25,
  },
  redeemActionRow: {
    flexDirection: "row",
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    paddingTop: 20,
  },
  cancelActionBtn: { flex: 1, alignItems: "center" },
  cancelActionText: { color: "#7F8C8D", fontSize: 16, fontWeight: "600" },
  confirmActionBtn: {
    flex: 1,
    alignItems: "center",
    borderLeftWidth: 1,
    borderLeftColor: "#EEE",
  },
  confirmActionText: { color: "#003366", fontSize: 16, fontWeight: "800" },
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
  lockedSub: { textAlign: "center", color: "#7F8C8D", marginTop: 10 },
  debugButton: { marginTop: 20 },
  debugText: {
    color: "#FFF",
    fontSize: 11,
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 5,
    borderRadius: 5,
  },
});

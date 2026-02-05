import { GFSDidot_400Regular, useFonts } from "@expo-google-fonts/gfs-didot";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View as MotiView } from "moti";
import React, { memo, useEffect, useState } from "react";
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

const { width } = Dimensions.get("window");

type EyeState = "idle" | "looking" | "blinking" | "gone";

const EvilEye = memo(function EvilEye({
  filled,
  isLast,
  eyeState,
}: {
  filled: boolean;
  isLast: boolean;
  eyeState: EyeState;
}) {
  if (!filled) {
    return (
      <View style={styles.emptyEye}>
        {isLast ? (
          <Ionicons name="gift" size={24} color="rgba(0, 51, 102, 0.2)" />
        ) : (
          <View style={styles.eyePupilEmpty} />
        )}
      </View>
    );
  }

  return (
    <MotiView
      animate={{
        scale: eyeState === "gone" ? 0 : 1,
        opacity: eyeState === "gone" ? 0 : 1,
      }}
      transition={{ type: "timing", duration: 300 }}
      style={styles.filledEye}
    >
      <MotiView
        animate={{ scaleY: eyeState === "blinking" ? 0.05 : 1 }}
        transition={{ type: "timing", duration: 100 }}
        style={styles.eyeWhite}
      >
        <MotiView
          animate={{
            translateX: eyeState === "looking" ? [-12, 12, 0] : 0,
          }}
          transition={{ type: "timing", duration: 600 }}
          style={styles.eyePupil}
        />
      </MotiView>
    </MotiView>
  );
});

export default function RewardsScreen() {
  const [punches, setPunches] = useState(0);
  const [showQR, setShowQR] = useState(false);
  const [isWelcomeEligible, setIsWelcomeEligible] = useState(false);
  const [redeemingType, setRedeemingType] = useState<"stamp" | "welcome">(
    "stamp",
  );
  const [eyeState, setEyeState] = useState<EyeState>("idle");
  const totalSpots = 10;

  let [fontsLoaded] = useFonts({ GreekFont: GFSDidot_400Regular });

  const loadData = async () => {
    try {
      const savedStamps = await AsyncStorage.getItem("@souvlucky_stamps");
      const welcomeEligible = await AsyncStorage.getItem(
        "@souvlucky_welcome_eligible",
      );

      if (savedStamps) setPunches(parseInt(savedStamps));
      setIsWelcomeEligible(welcomeEligible === "true");
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenQR = (type: "stamp" | "welcome") => {
    setRedeemingType(type);
    setShowQR(true);
  };

  const startAnimationSequence = async () => {
    setShowQR(false);

    if (redeemingType === "welcome") {
      await AsyncStorage.setItem("@souvlucky_welcome_eligible", "false");
      setIsWelcomeEligible(false);
      Alert.alert("Opa!", "Your welcome gyro voucher has been redeemed.");
    } else {
      setEyeState("looking");
      setTimeout(() => setEyeState("blinking"), 1100);
      setTimeout(() => setEyeState("idle"), 1300);
      setTimeout(() => setEyeState("gone"), 2200);

      setTimeout(async () => {
        setPunches(0);
        setEyeState("idle");
        await AsyncStorage.setItem("@souvlucky_stamps", "0");
      }, 3000);
    }
  };

  if (!fontsLoaded) return null;

  return (
    <ImageBackground
      source={require("../../assets/images/BackGrond.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { fontFamily: "GreekFont" }]}>
              SouvLucky Rewards
            </Text>
            <Text style={styles.headerSub}>
              {punches} of {totalSpots} Evil Eyes Collected
            </Text>
          </View>

          {isWelcomeEligible && (
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={styles.welcomeCard}
            >
              <View style={styles.welcomeInfo}>
                <Ionicons name="star" size={24} color="#FFD700" />
                <View style={{ marginLeft: 12 }}>
                  <Text style={styles.welcomeTitle}>Welcome Gift!</Text>
                  <Text style={styles.welcomeSub}>1 x FREE GYRO VOUCHER</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.welcomeBtn}
                onPress={() => handleOpenQR("welcome")}
              >
                <Text style={styles.welcomeBtnText}>REDEEM</Text>
              </TouchableOpacity>
            </MotiView>
          )}

          <View style={styles.cardContainer}>
            <Text style={styles.cardTitle}>Loyalty Card</Text>
            <FlatList
              data={Array.from({ length: totalSpots })}
              keyExtractor={(_, i) => i.toString()}
              numColumns={5}
              scrollEnabled={false}
              columnWrapperStyle={styles.eyeRow}
              renderItem={({ index }) => (
                <View style={styles.eyeWrapper}>
                  <EvilEye
                    filled={index < punches}
                    isLast={index === totalSpots - 1}
                    eyeState={eyeState}
                  />
                </View>
              )}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.mainBtn,
              {
                backgroundColor: punches === totalSpots ? "#E74C3C" : "#003366",
              },
            ]}
            onPress={() => handleOpenQR("stamp")}
          >
            <Ionicons
              name={punches === totalSpots ? "gift" : "qr-code"}
              size={22}
              color="#FFF"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.mainBtnText}>
              {punches === totalSpots ? "REDEEM FULL CARD" : "EARN A STAMP"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.debugBtn}
            onPress={() => {
              const newCount = punches < totalSpots ? punches + 1 : punches;
              setPunches(newCount);
              AsyncStorage.setItem("@souvlucky_stamps", newCount.toString());
            }}
          >
            <Text style={styles.debugText}>[DEBUG] Add Stamp</Text>
          </TouchableOpacity>
        </ScrollView>

        <Modal visible={showQR} animationType="fade" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setShowQR(false)}
              >
                <Ionicons name="close" size={30} color="#333" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Scan at Counter</Text>
              <Ionicons name="qr-code" size={width * 0.5} color="#003366" />
              <TouchableOpacity
                style={styles.finishBtn}
                onPress={startAnimationSequence}
              >
                <Text style={styles.finishBtnText}>Finish Redemption</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: { alignItems: "center", paddingBottom: 100 },
  header: {
    backgroundColor: "rgba(0, 51, 102, 0.85)",
    width: "100%",
    paddingVertical: 40,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: { fontSize: 28, color: "#FFF" },
  headerSub: { fontSize: 15, color: "rgba(255,255,255,0.7)", marginTop: 5 },
  welcomeCard: {
    backgroundColor: "#FFF",
    width: width * 0.9,
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderLeftWidth: 5,
    borderLeftColor: "#E67E22",
  },
  welcomeInfo: { flexDirection: "row", alignItems: "center" },
  welcomeTitle: { fontWeight: "900", color: "#003366" },
  welcomeSub: { color: "#7F8C8D", fontSize: 12 },
  welcomeBtn: { backgroundColor: "#E67E22", padding: 10, borderRadius: 8 },
  welcomeBtnText: { color: "#FFF", fontWeight: "900", fontSize: 12 },
  cardContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    width: width * 0.94,
    borderRadius: 25,
    padding: 20,
    marginTop: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#003366",
    textAlign: "center",
    marginBottom: 20,
  },
  eyeRow: { justifyContent: "space-around", marginBottom: 15 },
  eyeWrapper: { width: width * 0.15, height: width * 0.15 },
  emptyEye: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  eyePupilEmpty: {
    width: "30%",
    height: "30%",
    borderRadius: 100,
    backgroundColor: "#eee",
  },
  filledEye: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
    backgroundColor: "#0056b3",
    justifyContent: "center",
    alignItems: "center",
  },
  eyeWhite: {
    width: "60%",
    height: "60%",
    borderRadius: 100,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  eyePupil: {
    width: "45%",
    height: "45%",
    borderRadius: 100,
    backgroundColor: "#00bfff",
  },
  mainBtn: {
    flexDirection: "row",
    width: "90%",
    padding: 18,
    borderRadius: 15,
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  mainBtnText: { color: "#FFF", fontWeight: "900" },
  debugBtn: { marginTop: 20, paddingHorizontal: 20 },
  debugText: {
    color: "#FFF",
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 8,
    borderRadius: 5,
    fontSize: 11,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFF",
    width: "80%",
    padding: 30,
    borderRadius: 25,
    alignItems: "center",
  },
  closeBtn: { alignSelf: "flex-end" },
  modalTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#003366",
    marginBottom: 20,
  },
  finishBtn: {
    marginTop: 20,
    backgroundColor: "#003366",
    padding: 15,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  finishBtnText: { color: "#FFF", fontWeight: "900" },
});

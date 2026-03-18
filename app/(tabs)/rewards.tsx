import { GFSDidot_400Regular, useFonts } from "@expo-google-fonts/gfs-didot";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View as MotiView } from "moti";
import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import "react-native-reanimated";

// Imports for Blog & Video
import { rewardsStyles as styles } from "@/styles/styles";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import YoutubePlayer from "react-native-youtube-iframe";

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

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["8%", "50%", "95%"], []);

  const [fontsLoaded] = useFonts({ GreekFont: GFSDidot_400Regular });
  const greekFont = fontsLoaded ? "GreekFont" : undefined;

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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { fontFamily: greekFont }]}>
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

        {/* BLOG DRAWER SECTION */}
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          handleIndicatorStyle={{ backgroundColor: "#FFF" }}
          backgroundStyle={{ backgroundColor: "#000" }}
        >
          <View style={styles.blogHandleArea}>
            <Ionicons name="chevron-up" size={20} color="#FFF" />
            <Text style={styles.blogHandleText}>SCROLL FOR BLOG FEATURES</Text>
          </View>

          <BottomSheetScrollView
            contentContainerStyle={styles.blogScrollContent}
          >
            <Text
              style={[styles.blogSectionTitle, { fontFamily: "GreekFont" }]}
            >
              The SouvLucky Blog
            </Text>

            <View style={styles.postCard}>
              <Text style={styles.postTitle}>Our New Souvlaki Process</Text>
              <View style={styles.videoWrapper}>
                <YoutubePlayer
                  height={(width - 70) * (9 / 16)}
                  play={false}
                  videoId={"jBvCgXWPNPA"}
                />
              </View>
              <Text style={styles.postText}>
                Opa! Watch how we prepare the freshest ingredients for your
                favorite Greek meals. Quality is at the heart of every SouvLucky
                wrap.
              </Text>
            </View>
          </BottomSheetScrollView>
        </BottomSheet>

        {/* REDEMPTION MODAL */}
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
      </View>
    </GestureHandlerRootView>
  );
}

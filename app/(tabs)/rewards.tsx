import { GFSDidot_400Regular, useFonts } from "@expo-google-fonts/gfs-didot";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View as MotiView } from "moti";
import React, { memo, useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  ImageBackground,
  Modal,
  SafeAreaView,
  ScrollView,
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
      <View
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 100,
          backgroundColor: "rgba(0, 51, 102, 0.05)",
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 2,
          borderColor: "rgba(0, 51, 102, 0.15)",
          borderStyle: "dashed",
        }}
      >
        {isLast ? (
          <Ionicons name="gift" size={24} color="rgba(0, 51, 102, 0.2)" />
        ) : (
          <View
            style={{
              width: "30%",
              height: "30%",
              borderRadius: 100,
              backgroundColor: "rgba(0, 51, 102, 0.05)",
            }}
          />
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
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 100,
        backgroundColor: "#0056b3",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#003366",
        overflow: "hidden",
      }}
    >
      <MotiView
        animate={{ scaleY: eyeState === "blinking" ? 0.05 : 1 }}
        transition={{ type: "timing", duration: 100 }}
        style={{
          width: "60%",
          height: "60%",
          borderRadius: 100,
          backgroundColor: "#FFF",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MotiView
          animate={{
            translateX: eyeState === "looking" ? [-12, 12, 0] : 0,
          }}
          transition={{ type: "timing", duration: 600 }}
          style={{
            width: "45%",
            height: "45%",
            borderRadius: 100,
            backgroundColor: "#00bfff",
          }}
        />
      </MotiView>
    </MotiView>
  );
});

export default function RewardsScreen() {
  const [punches, setPunches] = useState(0);
  const [showQR, setShowQR] = useState(false);
  const [eyeState, setEyeState] = useState<EyeState>("idle");
  const totalSpots = 10;

  let [fontsLoaded] = useFonts({ GreekFont: GFSDidot_400Regular });

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedStamps = await AsyncStorage.getItem("@souvlucky_stamps");
        if (savedStamps) setPunches(parseInt(savedStamps));
      } catch (e) {
        console.log(e);
      }
    };
    loadData();
  }, []);

  const addStamp = useCallback(async () => {
    if (punches < totalSpots) {
      const newCount = punches + 1;
      setPunches(newCount);
      await AsyncStorage.setItem("@souvlucky_stamps", newCount.toString());
    }
  }, [punches]);

  const startAnimationSequence = () => {
    setShowQR(false);

    // START: Look sequence
    setTimeout(() => setEyeState("looking"), 400);

    // BLINK: Triggers after the look (400ms delay + 600ms duration = 1000ms)
    setTimeout(() => setEyeState("blinking"), 1100);

    // OPEN: Give it a moment to stay open after the blink
    setTimeout(() => setEyeState("idle"), 1300);

    // POP: DOUBLE DELAY - Now waits until 2.2 seconds to vanish
    setTimeout(() => setEyeState("gone"), 2200);

    // RESET: Final data clear
    setTimeout(async () => {
      setPunches(0);
      setEyeState("idle");
      await AsyncStorage.setItem("@souvlucky_stamps", "0");
    }, 3000);
  };

  if (!fontsLoaded) return null;

  return (
    <ImageBackground
      source={require("../../assets/images/BackGround.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ alignItems: "center", paddingBottom: 50 }}
        >
          <View
            style={{
              backgroundColor: "rgba(0, 51, 102, 0.85)",
              width: "100%",
              paddingVertical: 40,
              alignItems: "center",
              borderBottomLeftRadius: 30,
              borderBottomRightRadius: 30,
            }}
          >
            <Text
              style={{ fontSize: 28, color: "#FFF", fontFamily: "GreekFont" }}
            >
              SouvLucky Rewards
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: "rgba(255,255,255,0.7)",
                marginTop: 5,
              }}
            >
              {punches} of {totalSpots} Evil Eyes Collected
            </Text>
          </View>

          <View
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.85)",
              width: width * 0.94,
              borderRadius: 35,
              paddingHorizontal: 15,
              paddingVertical: 35,
              marginTop: 20,
              elevation: 12,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "800",
                color: "#003366",
                textAlign: "center",
                marginBottom: 25,
              }}
            >
              Loyalty Card
            </Text>
            <View style={{ width: "100%" }}>
              <FlatList
                data={Array.from({ length: totalSpots })}
                keyExtractor={(_, i) => i.toString()}
                numColumns={5}
                scrollEnabled={false}
                columnWrapperStyle={{
                  justifyContent: "space-around",
                  marginBottom: 20,
                }}
                renderItem={({ index }) => (
                  <View style={{ width: width * 0.16, height: width * 0.16 }}>
                    <EvilEye
                      filled={index < punches}
                      isLast={index === totalSpots - 1}
                      eyeState={eyeState}
                    />
                  </View>
                )}
              />
            </View>
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: punches === totalSpots ? "#E74C3C" : "#003366",
              flexDirection: "row",
              width: "90%",
              paddingVertical: 18,
              borderRadius: 20,
              marginTop: 30,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => setShowQR(true)}
            disabled={eyeState !== "idle"}
          >
            <Ionicons
              name={punches === totalSpots ? "gift" : "qr-code"}
              size={22}
              color="#FFF"
              style={{ marginRight: 10 }}
            />
            <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "900" }}>
              {punches === totalSpots ? "REDEEM FREE GYRO" : "EARN A STAMP"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ marginTop: 20 }} onPress={addStamp}>
            <Text
              style={{
                color: "#FFF",
                fontSize: 11,
                backgroundColor: "rgba(0,0,0,0.3)",
                padding: 5,
                borderRadius: 5,
              }}
            >
              [Debug] Add Stamp
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <Modal visible={showQR} animationType="slide" transparent={true}>
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.75)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "#FFF",
                width: "85%",
                padding: 30,
                borderRadius: 30,
                alignItems: "center",
              }}
            >
              {eyeState === "idle" && (
                <TouchableOpacity
                  style={{ alignSelf: "flex-end" }}
                  onPress={() => setShowQR(false)}
                >
                  <Ionicons name="close" size={30} color="#333" />
                </TouchableOpacity>
              )}
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "800",
                  color: "#003366",
                  marginBottom: 20,
                }}
              >
                {punches === totalSpots ? "Redeem" : "Earn"}
              </Text>
              <Ionicons name="qr-code" size={width * 0.4} color="#003366" />
              <Text
                style={{
                  fontSize: 14,
                  color: "#7F8C8D",
                  textAlign: "center",
                  marginTop: 10,
                }}
              >
                Ask staff to scan this code.
              </Text>
              {punches === totalSpots && eyeState === "idle" && (
                <TouchableOpacity
                  style={{
                    marginTop: 20,
                    backgroundColor: "#003366",
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 10,
                  }}
                  onPress={startAnimationSequence}
                >
                  <Text style={{ color: "#FFF", fontWeight: "700" }}>
                    Finish Redemption
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
}

import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function LocationsScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const savedUser = await AsyncStorage.getItem("@souvlucky_session");
    setIsLoggedIn(!!savedUser);
  };

  // This allows users to tap a number to call the restaurant directly
  const makeCall = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  // --- HARD LOCK VIEW: Shows if user is not registered ---
  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.lockedContainer}>
        <Ionicons name="lock-closed" size={80} color="#003366" />
        <Text style={styles.lockedTitle}>Locations Locked</Text>
        <Text style={styles.lockedSub}>
          Please register on the Home tab to find our branches.
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
        <StatusBar barStyle="light-content" />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.mainTitle}>Our Locations</Text>
          </View>

          {/* PARKMORE BRANCH */}
          <View style={styles.card}>
            <Text style={styles.branchName}>SouvLucky Parkmore</Text>
            <Text style={styles.statusOpen}>Open Daily</Text>

            <View style={styles.infoRow}>
              <Ionicons name="location" size={20} color="#003366" />
              <Text style={styles.infoText}>
                130, 11th Street, Parkmore, Sandton
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="time" size={20} color="#003366" />
              <Text style={styles.infoText}>Mon - Sun: 10:00 - 20:00</Text>
            </View>

            <TouchableOpacity
              style={styles.callButton}
              onPress={() => makeCall("0816432195")}
            >
              <Ionicons name="call" size={20} color="#fff" />
              <Text style={styles.callButtonText}>Call: 081 643 2195</Text>
            </TouchableOpacity>
          </View>

          {/* PRISON BREAK MARKET BRANCH */}
          <View style={styles.card}>
            <Text style={styles.branchName}>Prison Break Market</Text>
            <Text style={styles.statusWeekend}>Thu - Sun Only</Text>

            <View style={styles.infoRow}>
              <Ionicons name="location" size={20} color="#003366" />
              <Text style={styles.infoText}>
                The Yard Eatery, 10 MacMillan Rd, Glenferness
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="time" size={20} color="#003366" />
              <Text style={styles.infoText}>Thu - Sun: 10:00 - 19:00</Text>
            </View>

            <TouchableOpacity
              style={styles.callButton}
              onPress={() => makeCall("0735293187")}
            >
              <Ionicons name="call" size={20} color="#fff" />
              <Text style={styles.callButtonText}>Call: 073 529 3187</Text>
            </TouchableOpacity>
          </View>

          {/* CATERING CONTACT */}
          <View style={styles.cateringCard}>
            <Text style={styles.cateringTitle}>Catering Services</Text>
            <Text style={styles.cateringText}>
              For events and corporate functions:
            </Text>
            <TouchableOpacity onPress={() => makeCall("0833262249")}>
              <Text style={styles.cateringLink}>083 326 2249</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: { flex: 1 },
  container: { flex: 1 },
  // Responsive Gating styles
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

  scrollContent: { paddingBottom: 40, alignItems: "center" },
  header: {
    backgroundColor: "rgba(0, 51, 102, 0.8)",
    width: "100%",
    paddingVertical: 40,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  mainTitle: { fontSize: 30, fontWeight: "900", color: "#FFF" },

  // Responsive Card width
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    width: "90%",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  branchName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#003366",
    marginBottom: 5,
  },
  statusOpen: {
    color: "#27ae60",
    fontWeight: "800",
    marginBottom: 15,
    fontSize: 12,
    letterSpacing: 1,
  },
  statusWeekend: {
    color: "#e67e22",
    fontWeight: "800",
    marginBottom: 15,
    fontSize: 12,
    letterSpacing: 1,
  },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  infoText: {
    fontSize: 15,
    color: "#2C3E50",
    marginLeft: 10,
    flexShrink: 1,
    fontWeight: "500",
  },
  callButton: {
    backgroundColor: "#003366",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 10,
  },
  callButtonText: {
    color: "#fff",
    fontWeight: "900",
    marginLeft: 10,
    fontSize: 16,
  },

  cateringCard: {
    width: "90%",
    padding: 25,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 20,
    marginTop: 10,
  },
  cateringTitle: { fontSize: 18, fontWeight: "800", color: "#003366" },
  cateringText: { color: "#7F8C8D", marginTop: 5, textAlign: "center" },
  cateringLink: {
    color: "#003366",
    fontWeight: "900",
    fontSize: 20,
    marginTop: 8,
  },
});

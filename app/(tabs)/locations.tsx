import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Linking,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

// Adjusts the map center so the marker isn't hidden by the info card
const CARD_HEIGHT_OFFSET = Platform.OS === "ios" ? 420 : 380;
const SAFE_BOTTOM = Platform.OS === "ios" ? 115 : 95;

const LOCATIONS = [
  {
    id: "parkmore",
    title: "SouvLucky Parkmore",
    label: "PARKMORE",
    address: "130 11th St, Parkmore, Johannesburg, 2196",
    hours: "Mon - Sun: 10:00 - 20:00",
    phone: "081 643 2195",
    phoneRaw: "0816432195",
    status: "Open Daily",
    coords: { latitude: -26.098904585234106, longitude: 28.04630114132294 },
  },
  {
    id: "prisonbreak",
    title: "Prison Break Market",
    label: "Prison Break",
    address: "Cnr. Main & 10 MacMillan Rd, Kyakami, 2191",
    hours: "Thu - Sun: 10:00 - 19:00",
    phone: "073 529 3187",
    phoneRaw: "0735293187",
    status: "Thu - Sun Only",
    coords: { latitude: -26.001806662951207, longitude: 28.040711120734926 },
  },
];

export default function LocationsScreen() {
  const [activeIdx, setActiveIdx] = useState(0);
  const current = LOCATIONS[activeIdx];

  const makeCall = (number: string) => Linking.openURL(`tel:${number}`);

  const openDirections = () => {
    const { latitude, longitude } = current.coords;
    const label = current.title;
    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q=",
    });
    const latLng = `${latitude},${longitude}`;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });
    if (url) Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        mapPadding={{ top: 0, right: 0, left: 0, bottom: CARD_HEIGHT_OFFSET }}
        region={{
          ...current.coords,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        }}
      >
        <Marker coordinate={current.coords} onPress={openDirections}>
          <View style={styles.markerContainer}>
            <Ionicons name="location" size={48} color="#003366" />
          </View>
        </Marker>
      </MapView>

      {/* TOP TOGGLE - BRANCH SELECTOR */}
      <SafeAreaView style={styles.overlayTop}>
        <View style={styles.tabBar}>
          {LOCATIONS.map((loc, index) => (
            <TouchableOpacity
              key={loc.id}
              activeOpacity={0.9}
              style={[
                styles.tab,
                activeIdx === index ? styles.activeTab : styles.inactiveTab,
              ]}
              onPress={() => setActiveIdx(index)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeIdx === index
                    ? styles.activeTabText
                    : styles.inactiveTabText,
                ]}
              >
                {loc.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>

      {/* BOTTOM INFO CARD */}
      <View style={[styles.overlayBottom, { bottom: SAFE_BOTTOM }]}>
        <View style={styles.card}>
          <Text style={styles.branchName}>{current.title}</Text>
          <Text
            style={activeIdx === 0 ? styles.statusOpen : styles.statusWeekend}
          >
            {current.status}
          </Text>

          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={18} color="#003366" />
            <Text style={styles.infoText}>{current.address}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={18} color="#003366" />
            <Text style={styles.infoText}>{current.hours}</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.fullButton, styles.directionsButton]}
              onPress={openDirections}
            >
              <Ionicons name="paper-plane" size={20} color="#fff" />
              <Text style={styles.buttonText}>Get Directions</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.fullButton, styles.callButton]}
              onPress={() => makeCall(current.phoneRaw)}
            >
              <Ionicons name="call" size={20} color="#fff" />
              <Text style={styles.buttonText}>Call: {current.phone}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },
  markerContainer: {
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  overlayTop: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 30,
    width: "100%",
    alignItems: "center",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 4,
    elevation: 5,
  },
  tab: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 10,
    minWidth: 140,
    alignItems: "center",
  },
  activeTab: { backgroundColor: "#003366" }, // Updated to Navy
  inactiveTab: { backgroundColor: "transparent" },
  tabText: { fontWeight: "800", fontSize: 13 },
  activeTabText: { color: "#FFF" },
  inactiveTabText: { color: "#555" },
  overlayBottom: { position: "absolute", width: "100%", paddingHorizontal: 16 },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 20,
    elevation: 10,
    shadowOpacity: 0.15,
  },
  branchName: {
    fontSize: 22,
    fontWeight: "900",
    color: "#003366",
    marginBottom: 2,
  },
  statusOpen: {
    color: "#27ae60",
    fontWeight: "bold",
    fontSize: 11,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  statusWeekend: {
    color: "#e67e22",
    fontWeight: "bold",
    fontSize: 11,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  infoText: {
    fontSize: 14,
    color: "#444",
    marginLeft: 10,
    flexShrink: 1,
    fontWeight: "500",
  },
  buttonContainer: { marginTop: 15 },
  fullButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
    width: "100%",
    marginBottom: 10,
  },
  directionsButton: { backgroundColor: "#7B8DFF" },
  callButton: { backgroundColor: "#003366", marginBottom: 0 },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 10,
    fontSize: 16,
  },
});

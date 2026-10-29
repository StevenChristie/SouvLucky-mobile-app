import { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

import { EvilEye } from "@/components/brand/EvilEye";
import type { Branch } from "@/data/locations";
import { colors, shadow } from "@/theme";

export type BranchMapProps = {
  branches: Branch[];
  active: number;
  onSelect: (index: number) => void;
  padding: { top: number; bottom: number };
};

const ZOOM = { latitudeDelta: 0.02, longitudeDelta: 0.02 };
// Frame both branches on first load, then fly to the active one.
const OVERVIEW = { latitude: -26.05, longitude: 28.043, latitudeDelta: 0.16, longitudeDelta: 0.16 };

export function BranchMap({ branches, active, onSelect, padding }: BranchMapProps) {
  const mapRef = useRef<MapView>(null);
  const ready = useRef(false);

  const flyTo = (index: number) => mapRef.current?.animateToRegion({ ...branches[index].coords, ...ZOOM }, 650);

  useEffect(() => {
    if (ready.current) flyTo(active);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <MapView
      ref={mapRef}
      style={StyleSheet.absoluteFill}
      initialRegion={OVERVIEW}
      onMapReady={() => {
        ready.current = true;
        setTimeout(() => flyTo(active), 400);
      }}
      mapPadding={{ top: padding.top, bottom: padding.bottom, left: 0, right: 0 }}
    >
      {branches.map((b, i) => (
        <Marker key={b.id} coordinate={b.coords} onPress={() => onSelect(i)} anchor={{ x: 0.5, y: 1 }}>
          <View style={styles.pin}>
            <View style={[styles.pinHead, i === active && styles.pinHeadActive]}>
              <EvilEye size={28} />
            </View>
            <View style={[styles.pinTail, i === active && { borderTopColor: colors.aegean }]} />
          </View>
        </Marker>
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  pin: { alignItems: "center" },
  pinHead: { padding: 4, borderRadius: 24, backgroundColor: colors.white, borderWidth: 2, borderColor: colors.white, ...shadow.soft },
  pinHeadActive: { borderColor: colors.aegean, transform: [{ scale: 1.15 }] },
  pinTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 9,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: colors.white,
    marginTop: -1,
  },
});

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native";
import { useState } from "react";
import { Colors } from "../../src/constants/colors";

const { width } = Dimensions.get("window");
const MAP_SIZE = Math.min(width - 32, 340);

const PINS = [
  { id: "1", x: 0.3, y: 0.25, heat: "High Heat", wicks: 22 },
  { id: "2", x: 0.7, y: 0.35, heat: "Medium Heat", wicks: 14 },
  { id: "3", x: 0.2, y: 0.65, heat: "Low Heat", wicks: 8 },
  { id: "4", x: 0.75, y: 0.7, heat: "High Heat", wicks: 30 },
  { id: "5", x: 0.55, y: 0.2, heat: "Medium Heat", wicks: 16 },
];

export default function MapScreen() {
  const [lit, setLit] = useState(false);
  const [selectedPin, setSelectedPin] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={styles.titleRow}>
        <View style={styles.decorLine} />
        <Text style={styles.title}>THE LANTERN MAP</Text>
        <View style={styles.decorLine} />
      </View>

      <View style={styles.mapContainer}>
        <View style={[styles.map, { width: MAP_SIZE, height: MAP_SIZE }]}>
          {[1, 2, 3, 4, 5].map((ring) => (
            <View
              key={ring}
              style={[
                styles.ring,
                {
                  width: (MAP_SIZE / 5) * ring,
                  height: (MAP_SIZE / 5) * ring,
                  borderRadius: (MAP_SIZE / 5) * ring * 0.5,
                },
              ]}
            />
          ))}
          <View style={[styles.userDot, lit && styles.userDotLit]} />
          {PINS.map((pin) => (
            <TouchableOpacity
              key={pin.id}
              style={[
                styles.pin,
                {
                  left: pin.x * MAP_SIZE - 12,
                  top: pin.y * MAP_SIZE - 12,
                },
              ]}
              onPress={() => setSelectedPin(selectedPin === pin.id ? null : pin.id)}
            >
              <View style={styles.pinGlow} />
              <Text style={styles.pinIcon}>🏮</Text>
              {selectedPin === pin.id && (
                <View style={styles.tooltip}>
                  <Text style={styles.tooltipHeat}>🔥 {pin.heat}</Text>
                  <Text style={styles.tooltipWicks}>{pin.wicks} wicks</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.litBtn, lit && styles.litBtnActive]}
          onPress={() => setLit((v) => !v)}
          activeOpacity={0.85}
        >
          <Text style={[styles.litBtnText, lit && styles.litBtnTextActive]}>
            {lit ? "🏮 YOUR LANTERN IS LIT" : "LIGHT YOUR LANTERN"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 10,
  },
  decorLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.goldBorder,
  },
  title: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.gold,
    letterSpacing: 3,
  },
  mapContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    backgroundColor: "#060614",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  ring: {
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(201,168,76,0.2)",
  },
  userDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.gold,
    zIndex: 10,
  },
  userDotLit: {
    shadowColor: Colors.gold,
    shadowOpacity: 0.9,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  pin: {
    position: "absolute",
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
  },
  pinGlow: {
    position: "absolute",
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(201,168,76,0.15)",
    top: -6,
    left: -6,
  },
  pinIcon: {
    fontSize: 18,
  },
  tooltip: {
    position: "absolute",
    bottom: 28,
    left: -40,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 100,
    alignItems: "center",
  },
  tooltipHeat: {
    color: Colors.gold,
    fontSize: 11,
    fontWeight: "700",
  },
  tooltipWicks: {
    color: Colors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 12,
  },
  litBtn: {
    borderWidth: 1.5,
    borderColor: Colors.gold,
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  litBtnActive: {
    backgroundColor: Colors.gold,
  },
  litBtnText: {
    color: Colors.gold,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 2,
  },
  litBtnTextActive: {
    color: "#1A1200",
  },
});

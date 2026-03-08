import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, Platform, Animated, Dimensions,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { router } from "expo-router";
import { Colors } from "../../src/constants/colors";

const { width } = Dimensions.get("window");
const MAP_SIZE = width - 32;
const CENTER = MAP_SIZE / 2;

const LANTERN_PINS = [
  { id: '1', x: 0.25, y: 0.3, heat: 'High Heat', wicks: 22 },
  { id: '2', x: 0.7, y: 0.2, heat: 'Warm', wicks: 14 },
  { id: '3', x: 0.65, y: 0.65, heat: 'Scorching', wicks: 35 },
  { id: '4', x: 0.2, y: 0.7, heat: 'Mild', wicks: 8 },
  { id: '5', x: 0.8, y: 0.5, heat: 'High Heat', wicks: 19 },
  { id: '6', x: 0.45, y: 0.15, heat: 'Warm', wicks: 11 },
];

function PulsingPin({ x, y, onPress }: { x: number; y: number; onPress: () => void }) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.6] });
  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.8, 0] });

  return (
    <TouchableOpacity
      style={[pinStyles.container, { left: x * MAP_SIZE - 14, top: y * MAP_SIZE - 14 }]}
      onPress={onPress}
      hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}
    >
      <Animated.View style={[pinStyles.pulse, { transform: [{ scale }], opacity }]} />
      <View style={pinStyles.dot} />
    </TouchableOpacity>
  );
}

const pinStyles = StyleSheet.create({
  container: { position: "absolute", width: 28, height: 28, alignItems: "center", justifyContent: "center" },
  pulse: {
    position: "absolute",
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.goldGlow,
    borderWidth: 1.5,
    borderColor: Colors.gold,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.gold,
    borderWidth: 2,
    borderColor: Colors.goldLight,
  },
});

export default function MapScreen() {
  const [isLit, setIsLit] = useState(false);
  const [tooltip, setTooltip] = useState<{ pin: typeof LANTERN_PINS[0] } | null>(null);
  const centerGlow = useRef(new Animated.Value(0)).current;
  const centerScale = useRef(new Animated.Value(1)).current;

  function toggleLit() {
    const newLit = !isLit;
    setIsLit(newLit);
    if (newLit) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(centerGlow, { toValue: 1, duration: 1000, useNativeDriver: true }),
          Animated.timing(centerGlow, { toValue: 0.5, duration: 1000, useNativeDriver: true }),
        ])
      ).start();
      Animated.spring(centerScale, { toValue: 1.4, useNativeDriver: true }).start();
    } else {
      centerGlow.stopAnimation();
      centerGlow.setValue(0);
      Animated.spring(centerScale, { toValue: 1, useNativeDriver: true }).start();
    }
  }

  const centerOpacity = centerGlow.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.9] });

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={styles.header}>
        <View style={styles.headerLine} />
        <Text style={styles.headerTitle}>THE LANTERN MAP</Text>
        <View style={styles.headerLine} />
      </View>

      <View style={styles.mapWrapper}>
        <View style={[styles.mapContainer, { width: MAP_SIZE, height: MAP_SIZE }]}>
          {/* Concentric circles */}
          {[0.85, 0.65, 0.45, 0.25].map((r, i) => (
            <View
              key={i}
              style={{
                position: "absolute",
                width: MAP_SIZE * r,
                height: MAP_SIZE * r,
                borderRadius: (MAP_SIZE * r) / 2,
                borderWidth: 1,
                borderColor: `rgba(201,168,76,${0.08 + i * 0.04})`,
                left: (MAP_SIZE - MAP_SIZE * r) / 2,
                top: (MAP_SIZE - MAP_SIZE * r) / 2,
              }}
            />
          ))}

          {/* Cross lines */}
          <View style={styles.crossH} />
          <View style={styles.crossV} />

          {/* Lantern pins */}
          {LANTERN_PINS.map((pin) => (
            <PulsingPin
              key={pin.id}
              x={pin.x}
              y={pin.y}
              onPress={() => setTooltip(tooltip?.pin.id === pin.id ? null : { pin })}
            />
          ))}

          {/* Center user dot */}
          <Animated.View
            style={[
              styles.centerGlow,
              { opacity: centerOpacity, transform: [{ scale: centerScale }] },
            ]}
          />
          <View style={styles.centerDot} />

          {/* Tooltip */}
          {tooltip && (
            <View style={[styles.tooltip, { left: tooltip.pin.x * MAP_SIZE - 60, top: tooltip.pin.y * MAP_SIZE - 90 }]}>
              <Text style={styles.tooltipHeat}>🔥 {tooltip.pin.heat} — {tooltip.pin.wicks} wicks</Text>
              <TouchableOpacity
                style={styles.tooltipBtn}
                onPress={() => router.push("/flicker/new" as any)}
              >
                <Text style={styles.tooltipBtnText}>Send Flicker</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <View style={styles.bottomArea}>
        <TouchableOpacity
          style={[styles.litBtn, isLit && styles.litBtnActive]}
          onPress={toggleLit}
          activeOpacity={0.85}
        >
          <Text style={[styles.litBtnText, isLit && styles.litBtnTextActive]}>
            {isLit ? "🕯 EXTINGUISH" : "🕯 LIGHT YOUR LANTERN"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  headerLine: { flex: 1, height: 1, backgroundColor: Colors.goldBorder },
  headerTitle: { color: Colors.gold, fontSize: 13, fontWeight: "700", letterSpacing: 3 },
  mapWrapper: { flex: 1, alignItems: "center", justifyContent: "center" },
  mapContainer: {
    borderRadius: 20,
    backgroundColor: "#080816",
    overflow: "visible",
    position: "relative",
  },
  crossH: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "50%",
    height: 1,
    backgroundColor: "rgba(201,168,76,0.1)",
  },
  crossV: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: "50%",
    width: 1,
    backgroundColor: "rgba(201,168,76,0.1)",
  },
  centerGlow: {
    position: "absolute",
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.goldGlow,
    left: CENTER - 24,
    top: CENTER - 24,
  },
  centerDot: {
    position: "absolute",
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.gold,
    borderWidth: 3,
    borderColor: Colors.goldLight,
    left: CENTER - 8,
    top: CENTER - 8,
  },
  tooltip: {
    position: "absolute",
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 10,
    width: 160,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    zIndex: 100,
  },
  tooltipHeat: { color: Colors.textCream, fontSize: 12, fontWeight: "600", marginBottom: 8 },
  tooltipBtn: {
    backgroundColor: Colors.gold,
    borderRadius: 20,
    paddingVertical: 6,
    alignItems: "center",
  },
  tooltipBtnText: { color: "#1A1200", fontSize: 12, fontWeight: "700" },
  bottomArea: { paddingHorizontal: 16, paddingBottom: 16 },
  litBtn: {
    borderRadius: 28,
    paddingVertical: 18,
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.gold,
    backgroundColor: "transparent",
  },
  litBtnActive: { backgroundColor: Colors.gold },
  litBtnText: { color: Colors.gold, fontSize: 15, fontWeight: "700", letterSpacing: 1 },
  litBtnTextActive: { color: "#1A1200" },
});

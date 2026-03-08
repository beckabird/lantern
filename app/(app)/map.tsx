import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Animated,
  Platform,
} from "react-native";
import { useRef, useEffect } from "react";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../src/constants/colors";

const MOCK_PINS = [
  { id: "1", latitude: 40.7128, longitude: -74.006, name: "Rooftop Dinner", wicks: 120 },
  { id: "2", latitude: 40.7158, longitude: -73.998, name: "Jazz Evening", wicks: 85 },
  { id: "3", latitude: 40.7089, longitude: -74.013, name: "Art Gallery Walk", wicks: 60 },
  { id: "4", latitude: 40.7195, longitude: -74.001, name: "Chef Experience", wicks: 250 },
  { id: "5", latitude: 40.7065, longitude: -73.991, name: "Sunset Sail", wicks: 180 },
];

function AnimatedLanternPin({ wicks }: { wicks: number }) {
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, [glow]);

  const glowOpacity = glow.interpolate({ inputRange: [0, 1], outputRange: [0.2, 0.7] });
  const glowScale = glow.interpolate({ inputRange: [0, 1], outputRange: [1, 1.3] });

  return (
    <View style={styles.markerContainer}>
      <Animated.View
        style={[
          styles.markerGlow,
          { opacity: glowOpacity, transform: [{ scale: glowScale }] },
        ]}
      />
      <View style={styles.markerBody}>
        <Text style={styles.markerEmoji}>🏮</Text>
      </View>
      <View style={styles.markerBadge}>
        <Text style={styles.markerBadgeText}>{wicks}w</Text>
      </View>
    </View>
  );
}

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Map</Text>
        <View style={styles.headerRight}>
          <Ionicons name="options-outline" size={22} color={Colors.gold} />
        </View>
      </View>

      <MapView
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={{
          latitude: 40.7128,
          longitude: -74.006,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        mapType="mutedStandard"
        customMapStyle={DARK_MAP_STYLE}
      >
        {MOCK_PINS.map((pin) => (
          <Marker
            key={pin.id}
            coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
            title={pin.name}
            anchor={{ x: 0.5, y: 1 }}
          >
            <AnimatedLanternPin wicks={pin.wicks} />
          </Marker>
        ))}
      </MapView>

      <View style={styles.legend}>
        <Ionicons name="flame-outline" size={12} color={Colors.gold} />
        <Text style={styles.legendText}>{MOCK_PINS.length} active dates nearby</Text>
      </View>
    </View>
  );
}

const DARK_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#0B0D1A" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8286A0" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0B0D1A" }] },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#181B2C" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0d1117" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#181B2C" }],
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 56 : 40,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.goldBorder,
    backgroundColor: Colors.background,
    zIndex: 10,
  },
  headerTitle: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 24,
    fontWeight: "700",
    color: Colors.gold,
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 56,
    height: 64,
  },
  markerGlow: {
    position: "absolute",
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.gold,
  },
  markerBody: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.cardBackground,
    borderWidth: 2,
    borderColor: Colors.gold,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  markerEmoji: {
    fontSize: 20,
  },
  markerBadge: {
    position: "absolute",
    bottom: 0,
    backgroundColor: Colors.gold,
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
    zIndex: 2,
  },
  markerBadgeText: {
    color: "#1A1200",
    fontSize: 9,
    fontWeight: "700",
  },
  legend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    position: "absolute",
    bottom: 24,
    alignSelf: "center",
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  legendText: {
    color: Colors.textMuted,
    fontSize: 12,
  },
});

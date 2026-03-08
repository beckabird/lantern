import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform,
  type DimensionValue,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { Colors } from "../../src/constants/colors";

const MOCK_LIT_USERS: {
  id: string;
  initials: string;
  distance: string;
  bids: number;
  top: DimensionValue;
  left: DimensionValue;
}[] = [
  { id: "1", initials: "A", distance: "0.4 km", bids: 3, top: "22%", left: "20%" },
  { id: "2", initials: "M", distance: "1.1 km", bids: 1, top: "36%", left: "55%" },
  { id: "3", initials: "S", distance: "2.3 km", bids: 5, top: "50%", left: "30%" },
  { id: "4", initials: "J", distance: "3.0 km", bids: 0, top: "64%", left: "65%" },
];

export default function MapScreen() {
  const [isLit, setIsLit] = useState(false);
  const [oilBalance] = useState(50);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.appName}>Lantern</Text>
          <Text style={styles.subtitle}>LANTERN MAP</Text>
        </View>
        <TouchableOpacity
          style={styles.oilBadge}
          onPress={() => router.push("/purchase-oil")}
          activeOpacity={0.8}
        >
          <Text style={styles.oilEmoji}>🕯️</Text>
          <Text style={styles.oilBalance}>{oilBalance}</Text>
          <Text style={styles.oilLabel}> wicks</Text>
        </TouchableOpacity>
      </View>

      {/* Map Placeholder */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapIcon}>🗺️</Text>
          <Text style={styles.mapHint}>Interactive map coming soon</Text>
          <Text style={styles.mapSubHint}>
            Go Lit below to appear on the map
          </Text>
        </View>

        {/* Lit user cards over map */}
        {isLit && (
          <View style={styles.mapOverlay}>
            {MOCK_LIT_USERS.map((u) => (
              <TouchableOpacity
                key={u.id}
                style={[
                  styles.userPin,
                  { top: u.top, left: u.left },
                ]}
                activeOpacity={0.8}
              >
                <View style={styles.pinCircle}>
                  <Text style={styles.pinInitials}>{u.initials}</Text>
                </View>
                {u.bids > 0 && (
                  <View style={styles.bidBadge}>
                    <Text style={styles.bidBadgeText}>{u.bids}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Bottom Panel */}
      <View style={styles.bottomPanel}>
        {isLit && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.nearbyList}
          >
            {MOCK_LIT_USERS.map((u) => (
              <TouchableOpacity key={u.id} style={styles.nearbyCard} activeOpacity={0.8}>
                <View style={styles.nearbyAvatar}>
                  <Text style={styles.nearbyInitials}>{u.initials}</Text>
                </View>
                <Text style={styles.nearbyDist}>{u.distance}</Text>
                {u.bids > 0 && (
                  <Text style={styles.nearbyBids}>{u.bids} bids</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <View style={styles.litRow}>
          <View style={styles.litInfo}>
            <Text style={styles.litTitle}>
              {isLit ? "You're Lit 🔥" : "Go Lit"}
            </Text>
            <Text style={styles.litBody}>
              {isLit
                ? "Others can see you on the map"
                : "Become visible to nearby people"}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.litToggle, isLit && styles.litToggleActive]}
            onPress={() => setIsLit((v) => !v)}
            activeOpacity={0.85}
          >
            <Text style={[styles.litToggleText, isLit && styles.litToggleTextActive]}>
              {isLit ? "UNLIT" : "GO LIT"}
            </Text>
          </TouchableOpacity>
        </View>

        {isLit && (
          <TouchableOpacity
            style={styles.flickerFab}
            onPress={() => router.push("/flicker/new")}
            activeOpacity={0.85}
          >
            <Text style={styles.flickerFabText}>🕯️ Send Flicker</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  appName: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 22,
    fontWeight: "700",
    color: Colors.gold,
  },
  subtitle: {
    fontSize: 10,
    color: Colors.textMuted,
    letterSpacing: 2,
    marginTop: 2,
  },
  oilBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  oilEmoji: {
    fontSize: 14,
  },
  oilBalance: {
    color: Colors.gold,
    fontSize: 14,
    fontWeight: "700",
  },
  oilLabel: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  mapContainer: {
    flex: 1,
    position: "relative",
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: "#0D1020",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  mapIcon: {
    fontSize: 56,
    opacity: 0.4,
  },
  mapHint: {
    color: Colors.textMuted,
    fontSize: 16,
  },
  mapSubHint: {
    color: Colors.textSubtle,
    fontSize: 13,
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  userPin: {
    position: "absolute",
  },
  pinCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gold,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.background,
  },
  pinInitials: {
    color: "#1A1200",
    fontSize: 16,
    fontWeight: "700",
  },
  bidBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.error,
    alignItems: "center",
    justifyContent: "center",
  },
  bidBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  bottomPanel: {
    backgroundColor: Colors.cardBackground,
    borderTopWidth: 1,
    borderTopColor: Colors.goldBorder,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 12,
  },
  nearbyList: {
    gap: 12,
    paddingRight: 8,
  },
  nearbyCard: {
    alignItems: "center",
    gap: 4,
  },
  nearbyAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.goldGlow,
    borderWidth: 1.5,
    borderColor: Colors.goldBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  nearbyInitials: {
    color: Colors.gold,
    fontSize: 18,
    fontWeight: "700",
  },
  nearbyDist: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  nearbyBids: {
    color: Colors.gold,
    fontSize: 10,
    fontWeight: "600",
  },
  litRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  litInfo: {
    flex: 1,
    gap: 2,
  },
  litTitle: {
    color: Colors.textCream,
    fontSize: 16,
    fontWeight: "700",
  },
  litBody: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  litToggle: {
    borderWidth: 1.5,
    borderColor: Colors.gold,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "transparent",
  },
  litToggleActive: {
    backgroundColor: Colors.gold,
  },
  litToggleText: {
    color: Colors.gold,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
  },
  litToggleTextActive: {
    color: "#1A1200",
  },
  flickerFab: {
    backgroundColor: "rgba(201, 168, 76, 0.15)",
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  flickerFabText: {
    color: Colors.gold,
    fontSize: 15,
    fontWeight: "700",
  },
});

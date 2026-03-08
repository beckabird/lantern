import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { Colors } from "../../src/constants/colors";

const FEATURES = [
  { icon: "🗺️", label: "See who's Lit nearby" },
  { icon: "🕯️", label: "Bid with Wicks on dates" },
  { icon: "🎟️", label: "Earn Wick Tickets for dates you win" },
  { icon: "🔒", label: "Stay anonymous until you match" },
];

export default function OnboardingCompleteScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={styles.container}>
        <View style={styles.heroSection}>
          <View style={styles.lanternGlow}>
            <Text style={styles.lanternEmoji}>🏮</Text>
          </View>
          <Text style={styles.title}>You're In.</Text>
          <Text style={styles.subtitle}>
            Welcome to Lantern. Your flame is ready to be lit.
          </Text>
        </View>

        <View style={styles.featuresSection}>
          {FEATURES.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <Text style={styles.featureIcon}>{f.icon}</Text>
              <Text style={styles.featureLabel}>{f.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => router.replace("/(app)/map")}
            activeOpacity={0.85}
          >
            <Text style={styles.btnPrimaryText}>LIGHT MY LANTERN →</Text>
          </TouchableOpacity>

          <Text style={styles.footnote}>
            You can always update your profile and preferences later.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
  },
  heroSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  lanternGlow: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(201, 168, 76, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  lanternEmoji: {
    fontSize: 52,
  },
  title: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 48,
    fontWeight: "700",
    color: Colors.gold,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 26,
    maxWidth: 280,
  },
  featuresSection: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.divider,
    gap: 14,
    marginBottom: 32,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureIcon: {
    fontSize: 22,
    width: 32,
  },
  featureLabel: {
    fontSize: 15,
    color: Colors.textCream,
    flex: 1,
  },
  actions: {
    gap: 12,
  },
  btnPrimary: {
    backgroundColor: Colors.gold,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
  },
  btnPrimaryText: {
    color: "#1A1200",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 2,
  },
  footnote: {
    color: Colors.textSubtle,
    fontSize: 12,
    textAlign: "center",
  },
});

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { Colors } from "../../src/constants/colors";

export default function LocationScreen() {
  const [status, setStatus] = useState<"idle" | "granted" | "denied">("idle");

  function handleEnableLocation() {
    setStatus("granted");
  }

  function handleSkip() {
    router.push("/onboarding/complete");
  }

  function handleContinue() {
    router.push("/onboarding/complete");
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={styles.container}>
        <View style={styles.stepIndicator}>
          {[1, 2, 3, 4].map((n) => (
            <View
              key={n}
              style={[
                styles.stepDot,
                n <= 3 && styles.stepDotActive,
              ]}
            />
          ))}
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.stepLabel}>STEP 3 OF 4</Text>
          <Text style={styles.title}>Your Location</Text>
          <Text style={styles.subtitle}>
            We use your location to show you Lit users nearby and to let others
            find you when you go Lit.
          </Text>
        </View>

        <View style={styles.iconSection}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconEmoji}>📍</Text>
          </View>
          {status === "granted" && (
            <View style={styles.grantedBadge}>
              <Text style={styles.grantedText}>✓ Location enabled</Text>
            </View>
          )}
          {status === "denied" && (
            <View style={styles.deniedBadge}>
              <Text style={styles.deniedText}>
                Location access was denied. You can enable it in Settings.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.privacyCard}>
          <Text style={styles.privacyTitle}>🔒 Your privacy matters</Text>
          <Text style={styles.privacyBody}>
            Your exact location is never stored. We only use it while you are
            actively "Lit" and visible to others.
          </Text>
        </View>

        <View style={styles.actions}>
          {status !== "granted" ? (
            <TouchableOpacity
              style={styles.btnPrimary}
              onPress={handleEnableLocation}
              activeOpacity={0.85}
            >
              <Text style={styles.btnPrimaryText}>USE MY LOCATION</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.btnPrimary}
              onPress={handleContinue}
              activeOpacity={0.85}
            >
              <Text style={styles.btnPrimaryText}>CONTINUE →</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={handleSkip} activeOpacity={0.7}>
            <Text style={styles.skipLink}>
              {status === "granted" ? "← Back" : "Skip for now"}
            </Text>
          </TouchableOpacity>
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
  stepIndicator: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 24,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.progressInactive,
  },
  stepDotActive: {
    backgroundColor: Colors.gold,
    width: 24,
  },
  titleSection: {
    marginBottom: 36,
  },
  stepLabel: {
    fontSize: 11,
    color: Colors.gold,
    letterSpacing: 3,
    fontWeight: "600",
    marginBottom: 8,
  },
  title: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 32,
    fontWeight: "700",
    color: Colors.textCream,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textMuted,
    lineHeight: 24,
  },
  iconSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Colors.goldBorder,
    backgroundColor: "rgba(201, 168, 76, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconEmoji: {
    fontSize: 44,
  },
  grantedBadge: {
    backgroundColor: "rgba(76, 175, 80, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(76, 175, 80, 0.4)",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  grantedText: {
    color: Colors.success,
    fontSize: 14,
    fontWeight: "600",
  },
  deniedBadge: {
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 107, 107, 0.3)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: 280,
  },
  deniedText: {
    color: Colors.error,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
  },
  privacyCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.divider,
    marginBottom: 32,
    gap: 6,
  },
  privacyTitle: {
    fontSize: 14,
    color: Colors.textCream,
    fontWeight: "600",
  },
  privacyBody: {
    fontSize: 13,
    color: Colors.textMuted,
    lineHeight: 20,
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
  skipLink: {
    color: Colors.textMuted,
    fontSize: 15,
    textAlign: "center",
    paddingVertical: 8,
  },
});

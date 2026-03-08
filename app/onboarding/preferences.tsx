import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { Colors } from "../../src/constants/colors";

const GENDER_OPTIONS = ["Men", "Women", "Non-binary people", "Everyone"];
const DISTANCE_OPTIONS = [5, 10, 25, 50, 100];

export default function PreferencesScreen() {
  const [preferredGenders, setPreferredGenders] = useState<string[]>([]);
  const [maxDistance, setMaxDistance] = useState(50);
  const [error, setError] = useState("");

  function toggleGender(g: string) {
    setPreferredGenders((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    );
  }

  function handleContinue() {
    setError("");
    if (preferredGenders.length === 0) {
      setError("Please select who you'd like to meet.");
      return;
    }
    router.push("/onboarding/location");
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.stepIndicator}>
            {[1, 2, 3, 4].map((n) => (
              <View
                key={n}
                style={[
                  styles.stepDot,
                  n <= 2 && styles.stepDotActive,
                ]}
              />
            ))}
          </View>

          <View style={styles.titleSection}>
            <Text style={styles.stepLabel}>STEP 2 OF 4</Text>
            <Text style={styles.title}>Your Preferences</Text>
            <Text style={styles.subtitle}>
              Who are you looking to meet?
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>I WANT TO MEET</Text>
            <View style={styles.chipGrid}>
              {GENDER_OPTIONS.map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[
                    styles.chip,
                    preferredGenders.includes(g) && styles.chipActive,
                  ]}
                  onPress={() => toggleGender(g)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.chipText,
                      preferredGenders.includes(g) && styles.chipTextActive,
                    ]}
                  >
                    {g}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              MAX DISTANCE — {maxDistance} KM
            </Text>
            <View style={styles.distanceRow}>
              {DISTANCE_OPTIONS.map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[
                    styles.distanceChip,
                    maxDistance === d && styles.distanceChipActive,
                  ]}
                  onPress={() => setMaxDistance(d)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.distanceChipText,
                      maxDistance === d && styles.distanceChipTextActive,
                    ]}
                  >
                    {d} km
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.btnPrimary}
              onPress={handleContinue}
              activeOpacity={0.85}
            >
              <Text style={styles.btnPrimaryText}>CONTINUE →</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Text style={styles.backLink}>← Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flexGrow: 1,
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
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 11,
    color: Colors.textMuted,
    letterSpacing: 2,
    fontWeight: "600",
    marginBottom: 12,
  },
  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "transparent",
  },
  chipActive: {
    backgroundColor: Colors.gold,
    borderColor: Colors.gold,
  },
  chipText: {
    color: Colors.textMuted,
    fontSize: 15,
  },
  chipTextActive: {
    color: "#1A1200",
    fontWeight: "600",
  },
  distanceRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  distanceChip: {
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "transparent",
  },
  distanceChipActive: {
    backgroundColor: Colors.goldGlow,
    borderColor: Colors.gold,
  },
  distanceChipText: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  distanceChipTextActive: {
    color: Colors.gold,
    fontWeight: "600",
  },
  errorText: {
    color: Colors.error,
    fontSize: 13,
    textAlign: "center",
    marginBottom: 8,
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
  backLink: {
    color: Colors.textMuted,
    fontSize: 15,
    textAlign: "center",
    paddingVertical: 8,
  },
});

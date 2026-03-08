import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { Colors } from "../../src/constants/colors";

const GENDER_OPTIONS = ["Man", "Woman", "Non-binary", "Other", "Prefer not to say"];

export default function ProfileBasicsScreen() {
  const [displayName, setDisplayName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");

  function formatDob(text: string) {
    const digits = text.replace(/\D/g, "");
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
  }

  function isDobValid(value: string): boolean {
    if (value.length !== 10) return false;
    const [mm, dd, yyyy] = value.split("/").map(Number);
    if (!mm || !dd || !yyyy) return false;
    if (mm < 1 || mm > 12 || dd < 1 || dd > 31 || yyyy < 1900) return false;
    const dob = new Date(yyyy, mm - 1, dd);
    return dob < new Date();
  }

  function handleContinue() {
    setError("");
    if (!displayName.trim()) {
      setError("Please enter your display name.");
      return;
    }
    if (!dob.trim() || !isDobValid(dob)) {
      setError("Please enter a valid date of birth (MM/DD/YYYY) in the past.");
      return;
    }
    if (!gender) {
      setError("Please select your gender.");
      return;
    }
    router.push("/onboarding/preferences");
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <View style={styles.stepIndicator}>
              {[1, 2, 3, 4].map((n) => (
                <View
                  key={n}
                  style={[
                    styles.stepDot,
                    n === 1 && styles.stepDotActive,
                  ]}
                />
              ))}
            </View>

            <View style={styles.titleSection}>
              <Text style={styles.stepLabel}>STEP 1 OF 4</Text>
              <Text style={styles.title}>The Basics</Text>
              <Text style={styles.subtitle}>Tell us a little about yourself.</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Display Name</Text>
                <TextInput
                  style={styles.input}
                  value={displayName}
                  onChangeText={setDisplayName}
                  placeholder="How you'll appear to others"
                  placeholderTextColor={Colors.textSubtle}
                  autoCapitalize="words"
                  textContentType="name"
                  selectionColor={Colors.gold}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Date of Birth (MM/DD/YYYY)</Text>
                <TextInput
                  style={styles.input}
                  value={dob}
                  onChangeText={(t) => setDob(formatDob(t))}
                  placeholder="MM/DD/YYYY"
                  placeholderTextColor={Colors.textSubtle}
                  keyboardType="numeric"
                  maxLength={10}
                  selectionColor={Colors.gold}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Gender</Text>
                <View style={styles.genderGrid}>
                  {GENDER_OPTIONS.map((g) => (
                    <TouchableOpacity
                      key={g}
                      style={[
                        styles.genderChip,
                        gender === g && styles.genderChipActive,
                      ]}
                      onPress={() => setGender(g)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.genderChipText,
                          gender === g && styles.genderChipTextActive,
                        ]}
                      >
                        {g}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Bio (Optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={bio}
                  onChangeText={setBio}
                  placeholder="A few words about you…"
                  placeholderTextColor={Colors.textSubtle}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  selectionColor={Colors.gold}
                />
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
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    marginBottom: 32,
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
  form: {
    gap: 20,
    marginBottom: 24,
  },
  field: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    letterSpacing: 2,
    fontWeight: "600",
  },
  input: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: Colors.text,
  },
  textArea: {
    minHeight: 90,
    paddingTop: 14,
  },
  genderGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  genderChip: {
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "transparent",
  },
  genderChipActive: {
    backgroundColor: Colors.gold,
    borderColor: Colors.gold,
  },
  genderChipText: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  genderChipTextActive: {
    color: "#1A1200",
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
});

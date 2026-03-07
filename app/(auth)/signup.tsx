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

const PARTICLES: { top: string; left: string; size: number; opacity: number }[] =
  [
    { top: "8%", left: "90%", size: 2, opacity: 0.35 },
    { top: "40%", left: "5%", size: 2, opacity: 0.3 },
    { top: "70%", left: "88%", size: 2, opacity: 0.3 },
    { top: "85%", left: "20%", size: 3, opacity: 0.25 },
  ];

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");

  function handleSignup() {
    setError("");
    if (!displayName.trim()) {
      setError("Please enter a display name.");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    router.replace("/(tabs)/home");
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
            {PARTICLES.map((p, i) => (
              <View
                key={i}
                style={[
                  styles.particle,
                  {
                    top: p.top as any,
                    left: p.left as any,
                    width: p.size,
                    height: p.size,
                    borderRadius: p.size / 2,
                    opacity: p.opacity,
                  },
                ]}
              />
            ))}

            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => router.back()}
              hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}
            >
              <Text style={styles.backText}>←</Text>
            </TouchableOpacity>

            <View style={styles.heroSection}>
              <Text style={styles.appName}>Lantern</Text>
              <Text style={styles.tagline}>CREATE ACCOUNT</Text>
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
                  autoComplete="name"
                  textContentType="name"
                  selectionColor={Colors.gold}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor={Colors.textSubtle}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  textContentType="emailAddress"
                  selectionColor={Colors.gold}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Password</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor={Colors.textSubtle}
                  secureTextEntry
                  autoCapitalize="none"
                  autoComplete="new-password"
                  textContentType="newPassword"
                  selectionColor={Colors.gold}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Confirm Password</Text>
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="••••••••"
                  placeholderTextColor={Colors.textSubtle}
                  secureTextEntry
                  autoCapitalize="none"
                  autoComplete="new-password"
                  textContentType="newPassword"
                  selectionColor={Colors.gold}
                />
              </View>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.btnPrimary}
                onPress={handleSignup}
                activeOpacity={0.85}
              >
                <Text style={styles.btnPrimaryText}>CREATE ACCOUNT</Text>
              </TouchableOpacity>

              <View style={styles.loginRow}>
                <Text style={styles.loginHint}>Already have an account? </Text>
                <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                  <Text style={styles.loginLink}>LOG IN</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.terms}>
              By creating an account you agree to our Terms of Service and
              Privacy Policy.
            </Text>
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
  },
  particle: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
  },
  backBtn: {
    paddingTop: 16,
    paddingBottom: 8,
    alignSelf: "flex-start",
  },
  backText: {
    color: Colors.textMuted,
    fontSize: 24,
  },
  heroSection: {
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 36,
  },
  appName: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 48,
    fontWeight: "700",
    color: Colors.gold,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 12,
    color: Colors.textMuted,
    letterSpacing: 4,
    marginTop: 8,
    fontWeight: "400",
  },
  form: {
    gap: 20,
    marginBottom: 32,
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
  errorText: {
    color: "#FF6B6B",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 8,
  },
  actions: {
    gap: 16,
    marginBottom: 24,
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
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginHint: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  loginLink: {
    color: Colors.gold,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1,
  },
  terms: {
    color: Colors.textSubtle,
    fontSize: 11,
    textAlign: "center",
    lineHeight: 18,
  },
});

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

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    setError("");
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setSubmitted(true);
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
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => router.back()}
              hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}
            >
              <Text style={styles.backText}>←</Text>
            </TouchableOpacity>

            <View style={styles.heroSection}>
              <Text style={styles.appName}>Lantern</Text>
              <Text style={styles.tagline}>RESET PASSWORD</Text>
            </View>

            {submitted ? (
              <View style={styles.successCard}>
                <Text style={styles.successIcon}>✉️</Text>
                <Text style={styles.successTitle}>Check your inbox</Text>
                <Text style={styles.successBody}>
                  If an account exists for{" "}
                  <Text style={styles.successEmail}>{email.trim()}</Text>, you'll
                  receive a password reset link shortly.
                </Text>
                <TouchableOpacity
                  style={styles.btnPrimary}
                  onPress={() => router.replace("/(auth)/login")}
                  activeOpacity={0.85}
                >
                  <Text style={styles.btnPrimaryText}>BACK TO LOGIN</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text style={styles.bodyText}>
                  Enter your email address and we'll send you a link to reset
                  your password.
                </Text>

                <View style={styles.form}>
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
                </View>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.btnPrimary}
                    onPress={handleSubmit}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.btnPrimaryText}>SEND RESET LINK</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.cancelLink}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
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
    paddingTop: 32,
    paddingBottom: 32,
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
  bodyText: {
    color: Colors.textMuted,
    fontSize: 15,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 32,
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
  cancelLink: {
    color: Colors.textMuted,
    fontSize: 15,
    textAlign: "center",
    paddingVertical: 8,
  },
  successCard: {
    alignItems: "center",
    gap: 16,
    paddingTop: 16,
  },
  successIcon: {
    fontSize: 48,
  },
  successTitle: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 26,
    fontWeight: "700",
    color: Colors.textCream,
  },
  successBody: {
    color: Colors.textMuted,
    fontSize: 15,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 8,
  },
  successEmail: {
    color: Colors.gold,
  },
});

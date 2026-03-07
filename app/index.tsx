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
import { Colors } from "../src/constants/colors";

function LanternIcon({ size = 72 }: { size?: number }) {
  const bodyW = size * 0.78;
  const bodyH = size * 0.88;
  return (
    <View style={{ alignItems: "center" }}>
      <View
        style={{
          width: size * 0.22,
          height: size * 0.12,
          backgroundColor: Colors.gold,
          borderRadius: 3,
          marginBottom: 2,
        }}
      />
      <View
        style={{
          width: bodyW,
          height: bodyH,
          borderWidth: 2.5,
          borderColor: Colors.gold,
          borderRadius: size * 0.18,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(201,168,76,0.08)",
        }}
      >
        <Text style={{ fontSize: size * 0.38, lineHeight: size * 0.44 }}>♥</Text>
      </View>
      <View
        style={{
          width: size * 0.1,
          height: size * 0.18,
          backgroundColor: Colors.gold,
          marginTop: 2,
        }}
      />
      <View
        style={{
          width: size * 0.2,
          height: size * 0.2,
          borderRadius: (size * 0.2) / 2,
          borderWidth: 2,
          borderColor: Colors.gold,
          marginTop: 1,
        }}
      />
    </View>
  );
}

const PARTICLES: { top: string; left: string; size: number; opacity: number }[] =
  [
    { top: "8%", left: "12%", size: 2, opacity: 0.4 },
    { top: "14%", left: "72%", size: 3, opacity: 0.3 },
    { top: "22%", left: "88%", size: 2, opacity: 0.5 },
    { top: "35%", left: "5%", size: 2, opacity: 0.35 },
    { top: "42%", left: "91%", size: 3, opacity: 0.3 },
    { top: "55%", left: "18%", size: 2, opacity: 0.4 },
    { top: "62%", left: "80%", size: 2, opacity: 0.45 },
    { top: "70%", left: "50%", size: 3, opacity: 0.25 },
    { top: "78%", left: "7%", size: 2, opacity: 0.3 },
    { top: "85%", left: "62%", size: 2, opacity: 0.35 },
    { top: "5%", left: "45%", size: 2, opacity: 0.3 },
    { top: "30%", left: "60%", size: 2, opacity: 0.25 },
  ];

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
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

        <View style={styles.heroSection}>
          <LanternIcon size={80} />
          <Text style={styles.appName}>Lantern</Text>
          <Text style={styles.tagline}>LIGHT WHAT LASTS.</Text>
        </View>

        <View style={styles.marketingSection}>
          <Text style={styles.marketingPrimary}>Find your next date.</Text>
          <Text style={styles.marketingSecondary}>Bid with wicks.</Text>
        </View>

        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => router.push("/(auth)/login")}
            activeOpacity={0.85}
          >
            <Text style={styles.btnPrimaryText}>LOG IN</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() => router.push("/onboarding/how-it-works")}
            activeOpacity={0.85}
          >
            <Text style={styles.btnSecondaryText}>SIGN UP</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(tabs)" as any)}
            activeOpacity={0.7}
          >
            <Text style={styles.guestLink}>Continue as guest</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            BY INVITATION ONLY{"  "}•{"  "}LUXURY DATING
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
  },
  particle: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
  },
  heroSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 24,
  },
  appName: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 52,
    fontWeight: "700",
    color: Colors.gold,
    marginTop: 20,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 12,
    color: Colors.textMuted,
    letterSpacing: 4,
    marginTop: 8,
    fontWeight: "400",
  },
  marketingSection: {
    alignItems: "center",
    paddingBottom: 36,
  },
  marketingPrimary: {
    fontSize: 18,
    color: Colors.text,
    fontWeight: "400",
    marginBottom: 4,
  },
  marketingSecondary: {
    fontSize: 18,
    color: Colors.gold,
    fontWeight: "500",
  },
  actionsSection: {
    gap: 12,
    paddingBottom: 24,
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
  btnSecondary: {
    borderWidth: 1.5,
    borderColor: Colors.gold,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  btnSecondaryText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 2,
  },
  guestLink: {
    color: Colors.textMuted,
    fontSize: 15,
    textAlign: "center",
    paddingVertical: 8,
  },
  footer: {
    paddingBottom: 16,
    alignItems: "center",
  },
  footerText: {
    color: Colors.textSubtle,
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: "500",
  },
});

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
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../src/constants/colors";

const RULES = [
  {
    title: "What are Wicks?",
    body: "Wicks are Lantern's exclusive virtual currency. Every bid you place uses Wicks. You start with 50 Wicks and can purchase more in the Wick Store anytime.",
    icon: "pin" as const,
  },
  {
    title: "How Auctions Work",
    body: "Hosts craft curated date experiences and list them as time-limited auctions. Each auction shows its itinerary, category, and a live countdown. When time runs out, the highest bidder wins the date.",
    icon: "checkmark" as const,
  },
  {
    title: "Bidding Rules",
    body: "Each bid must exceed the current highest bid. You cannot retract a bid once placed. If you are outbid, your Wicks are returned instantly. One win per auction — no split prizes.",
    icon: "hammer" as const,
  },
  {
    title: "Hosting a Date",
    body: "Any verified member can create an auction. Design your ideal date — from intimate dinners to wild adventures. Set a minimum bid in Wicks and let the magic happen.",
    icon: "water" as const,
  },
  {
    title: "Privacy & Safety",
    body: "Your identity stays private until a date is confirmed. All members are verified before joining. You can block or report anyone instantly. Your safety is our priority.",
    icon: "shield-checkmark" as const,
  },
];

const PARTICLES: { top: string; left: string; size: number; opacity: number }[] =
  [
    { top: "30%", left: "92%", size: 2, opacity: 0.35 },
    { top: "50%", left: "4%", size: 2, opacity: 0.3 },
    { top: "70%", left: "88%", size: 2, opacity: 0.3 },
    { top: "20%", left: "50%", size: 2, opacity: 0.25 },
  ];

function LanternHeaderIcon() {
  return (
    <View style={headerStyles.iconWrapper}>
      <View style={headerStyles.iconInner}>
        <View style={headerStyles.iconCap} />
        <View style={headerStyles.iconBody}>
          <Ionicons name="pin" size={10} color={Colors.gold} />
        </View>
      </View>
    </View>
  );
}

const headerStyles = StyleSheet.create({
  iconWrapper: { alignItems: "center", marginRight: 8 },
  iconInner: { alignItems: "center" },
  iconCap: {
    width: 8,
    height: 5,
    backgroundColor: Colors.gold,
    borderRadius: 2,
    marginBottom: 1,
  },
  iconBody: {
    width: 28,
    height: 32,
    borderWidth: 2,
    borderColor: Colors.gold,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(201,168,76,0.1)",
  },
});

function RuleIcon({ name }: { name: (typeof RULES)[0]["icon"] }) {
  return (
    <View style={iconStyles.container}>
      <View style={iconStyles.glow} />
      <Ionicons name={name} size={22} color={Colors.gold} />
    </View>
  );
}

const iconStyles = StyleSheet.create({
  container: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: Colors.gold,
    backgroundColor: "rgba(201, 168, 76, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
  },
  glow: {
    position: "absolute",
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "rgba(201, 168, 76, 0.1)",
    top: -8,
    left: -8,
  },
});

export default function HowItWorksScreen() {
  const [step, setStep] = useState(0);
  const rule = RULES[step];
  const isFirst = step === 0;
  const isLast = step === RULES.length - 1;

  function handleNext() {
    if (isLast) {
      router.push("/(auth)/signup");
    } else {
      setStep((s) => s + 1);
    }
  }

  function handleBack() {
    setStep((s) => s - 1);
  }

  function handleSkip() {
    router.push("/(auth)/signup");
  }

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

        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.headerBrand}>
              <LanternHeaderIcon />
              <Text style={styles.headerTitle}>Lantern</Text>
            </View>
            <Text style={styles.headerSubtitle}>HOW IT WORKS</Text>
          </View>
          <TouchableOpacity
            style={styles.menuBtn}
            hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}
            onPress={handleSkip}
          >
            <View style={styles.menuDot} />
            <View style={styles.menuDot} />
            <View style={styles.menuDot} />
          </TouchableOpacity>
        </View>

        <View style={styles.progressBar}>
          {RULES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressSegment,
                { backgroundColor: i <= step ? Colors.progressActive : Colors.progressInactive },
              ]}
            />
          ))}
        </View>

        <View style={styles.cardArea}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.ruleLabel}>
                RULE {step + 1} OF {RULES.length}
              </Text>
              <RuleIcon name={rule.icon} />
            </View>

            <Text style={styles.ruleTitle}>{rule.title}</Text>
            <Text style={styles.ruleBody}>{rule.body}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={handleNext}
            activeOpacity={0.85}
          >
            <Text style={styles.btnPrimaryText}>
              {isLast ? "Get Started →" : "Next Rule →"}
            </Text>
          </TouchableOpacity>

          {!isFirst && (
            <TouchableOpacity
              style={styles.btnSecondary}
              onPress={handleBack}
              activeOpacity={0.85}
            >
              <Text style={styles.btnSecondaryText}>← Back</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={handleSkip} activeOpacity={0.7}>
            <Text style={styles.skipLink}>Skip introduction</Text>
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
  },
  particle: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerLeft: {
    flex: 1,
  },
  headerBrand: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.gold,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  headerSubtitle: {
    fontSize: 11,
    color: Colors.textMuted,
    letterSpacing: 3,
    fontWeight: "500",
    marginTop: 4,
    marginLeft: 2,
  },
  menuBtn: {
    flexDirection: "row",
    gap: 3,
    paddingTop: 8,
  },
  menuDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.textMuted,
  },
  progressBar: {
    flexDirection: "row",
    gap: 6,
    marginVertical: 16,
  },
  progressSegment: {
    flex: 1,
    height: 3,
    borderRadius: 2,
  },
  cardArea: {
    flex: 1,
    justifyContent: "center",
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    padding: 28,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  ruleLabel: {
    fontSize: 11,
    color: Colors.gold,
    letterSpacing: 3,
    fontWeight: "600",
  },
  ruleTitle: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 30,
    fontWeight: "700",
    color: Colors.textCream,
    marginBottom: 16,
    lineHeight: 38,
  },
  ruleBody: {
    fontSize: 16,
    color: Colors.textMuted,
    lineHeight: 26,
  },
  actions: {
    gap: 12,
    paddingBottom: 20,
  },
  btnPrimary: {
    backgroundColor: Colors.gold,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
  },
  btnPrimaryText: {
    color: "#1A1200",
    fontSize: 16,
    fontWeight: "700",
  },
  btnSecondary: {
    borderWidth: 1.5,
    borderColor: Colors.goldBorder,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  btnSecondaryText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  skipLink: {
    color: Colors.textMuted,
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 8,
  },
});

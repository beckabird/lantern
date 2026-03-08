import { Stack } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../src/constants/colors";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "index",
};

const SNUFF_KEY = "snuffs_received";
const MY_USER_ID = "local_user";
const BAN_DURATION_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

function BanScreen({ daysLeft }: { daysLeft: number }) {
  const flicker = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(flicker, { toValue: 0.5, duration: 800, useNativeDriver: true }),
        Animated.timing(flicker, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, [flicker]);

  return (
    <View style={banStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <Animated.Text style={[banStyles.candle, { opacity: flicker }]}>
        🕯️
      </Animated.Text>
      <Text style={banStyles.title}>Your flame has been extinguished.</Text>
      <Text style={banStyles.subtitle}>
        You've been removed from Lantern for 14 days.
      </Text>
      <View style={banStyles.countdownBox}>
        <Text style={banStyles.countdownLabel}>DAYS REMAINING</Text>
        <Text style={banStyles.countdownValue}>{daysLeft}</Text>
      </View>
    </View>
  );
}

const banStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  candle: {
    fontSize: 72,
    marginBottom: 32,
  },
  title: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 24,
    fontWeight: "700",
    color: Colors.gold,
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 40,
  },
  countdownBox: {
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    borderRadius: 16,
    paddingHorizontal: 40,
    paddingVertical: 20,
    alignItems: "center",
    backgroundColor: Colors.cardBackground,
  },
  countdownLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    letterSpacing: 3,
    fontWeight: "600",
    marginBottom: 6,
  },
  countdownValue: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 52,
    fontWeight: "700",
    color: Colors.gold,
  },
});

export default function RootLayout() {
  const [banDaysLeft, setBanDaysLeft] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    checkBanStatus();
  }, []);

  async function checkBanStatus() {
    try {
      const raw = await AsyncStorage.getItem(`${SNUFF_KEY}:${MY_USER_ID}`);
      if (raw) {
        const snuffs: { timestamp: number }[] = JSON.parse(raw);
        if (snuffs.length >= 3) {
          const thirdSnuff = snuffs[2];
          const elapsed = Date.now() - thirdSnuff.timestamp;
          if (elapsed < BAN_DURATION_MS) {
            const msLeft = BAN_DURATION_MS - elapsed;
            const daysLeft = Math.ceil(msLeft / (24 * 60 * 60 * 1000));
            setBanDaysLeft(daysLeft);
          }
        }
      }
    } catch {}
    setChecked(true);
  }

  if (!checked) return null;

  if (banDaysLeft !== null && banDaysLeft > 0) {
    return <BanScreen daysLeft={banDaysLeft} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(app)" />
      <Stack.Screen name="ticket" />
    </Stack>
  );
}

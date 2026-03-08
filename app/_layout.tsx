import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../src/constants/colors";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "index",
};

const SNUFF_BAN_KEY = "lantern_snuff_ban_until";
const STORAGE_KEY_SNUFFS = "lantern_snuffs";

function BanScreen({ until }: { until: number }) {
  const daysLeft = Math.max(0, Math.ceil((until - Date.now()) / (1000 * 60 * 60 * 24)));
  return (
    <View style={banStyles.container}>
      <Text style={banStyles.icon}>🕯️</Text>
      <Text style={banStyles.title}>Your flame has been extinguished.</Text>
      <Text style={banStyles.body}>
        You've been removed from Lantern for 14 days.
      </Text>
      <Text style={banStyles.countdown}>{daysLeft} day{daysLeft !== 1 ? "s" : ""} remaining</Text>
    </View>
  );
}

const banStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  icon: { fontSize: 64, marginBottom: 24 },
  title: {
    color: Colors.gold,
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
    fontFamily: "serif",
  },
  body: {
    color: Colors.textCream,
    fontSize: 16,
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 24,
  },
  countdown: {
    color: Colors.textMuted,
    fontSize: 18,
    fontWeight: "600",
  },
});

export default function RootLayout() {
  const [banUntil, setBanUntil] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const snuffsStr = await AsyncStorage.getItem(STORAGE_KEY_SNUFFS);
        const snuffs = snuffsStr ? Number(snuffsStr) : 0;
        if (snuffs >= 3) {
          let banUntilTs = await AsyncStorage.getItem(SNUFF_BAN_KEY);
          if (!banUntilTs) {
            const until = Date.now() + 14 * 24 * 60 * 60 * 1000;
            await AsyncStorage.setItem(SNUFF_BAN_KEY, String(until));
            banUntilTs = String(until);
          }
          const until = Number(banUntilTs);
          if (Date.now() < until) {
            setBanUntil(until);
          } else {
            await AsyncStorage.removeItem(SNUFF_BAN_KEY);
            await AsyncStorage.removeItem(STORAGE_KEY_SNUFFS);
          }
        }
      } catch (e) {
        // AsyncStorage errors should not crash the app at startup
      }
      setChecked(true);
    })();
  }, []);

  if (!checked) return null;
  if (banUntil !== null) return <BanScreen until={banUntil} />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

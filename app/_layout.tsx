import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../src/constants/colors";

function BanScreen({ daysLeft }: { daysLeft: number }) {
  return (
    <View style={banStyles.container}>
      <Text style={banStyles.emoji}>🕯️</Text>
      <Text style={banStyles.title}>Your flame has been extinguished</Text>
      <Text style={banStyles.subtitle}>Your account is suspended due to multiple snuffs.</Text>
      <Text style={banStyles.countdown}>{daysLeft} day{daysLeft !== 1 ? 's' : ''} remaining</Text>
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
  emoji: { fontSize: 56, marginBottom: 24 },
  title: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 26,
    fontWeight: "700",
    color: Colors.textCream,
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: { color: Colors.textMuted, fontSize: 15, textAlign: "center", marginBottom: 24, lineHeight: 22 },
  countdown: { color: Colors.gold, fontSize: 20, fontWeight: "700" },
});

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function RootLayout() {
  const [banned, setBanned] = useState(false);
  const [daysLeft, setDaysLeft] = useState(0);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    async function checkBan() {
      try {
        const bannedUntil = await AsyncStorage.getItem("snuffBannedUntil");
        if (bannedUntil) {
          const ts = parseInt(bannedUntil, 10);
          if (Date.now() < ts) {
            setBanned(true);
            setDaysLeft(Math.ceil((ts - Date.now()) / (24 * 60 * 60 * 1000)));
          }
        }
      } finally {
        setChecked(true);
      }
    }
    checkBan();
  }, []);

  if (!checked) return null;
  if (banned) return <BanScreen daysLeft={daysLeft} />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(app)" />
      <Stack.Screen name="flicker/[id]" />
      <Stack.Screen name="ticket/[id]" />
      <Stack.Screen name="messages/[id]" />
      <Stack.Screen name="profile/edit" />
      <Stack.Screen name="purchase-oil" />
    </Stack>
  );
}

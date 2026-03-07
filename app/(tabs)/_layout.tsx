import { Tabs } from "expo-router";
import { Colors } from "../../src/constants/colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: Colors.background, borderTopColor: Colors.goldBorder },
        tabBarActiveTintColor: Colors.gold,
        tabBarInactiveTintColor: Colors.textMuted,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
    </Tabs>
  );
}

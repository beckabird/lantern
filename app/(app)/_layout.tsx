import { Tabs } from "expo-router";
import { Colors } from "../../src/constants/colors";
import { Text } from "react-native";

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>
  );
}

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopColor: Colors.goldBorder,
          borderTopWidth: 1,
          height: 62,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: Colors.gold,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 10,
          letterSpacing: 1,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="map"
        options={{
          title: "MAP",
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🗺️" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="flickers"
        options={{
          title: "FLICKERS",
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🕯️" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="tickets"
        options={{
          title: "TICKETS",
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🎟️" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "PROFILE",
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="👤" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

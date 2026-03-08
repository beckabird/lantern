import { Tabs } from "expo-router";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Colors } from "../../src/constants/colors";

function TabIcon({ icon, label, focused }: { icon: string; label: string; focused: boolean }) {
  return (
    <View style={tabStyles.iconContainer}>
      <Text style={[tabStyles.icon, focused && tabStyles.iconActive]}>{icon}</Text>
      {focused && <Text style={tabStyles.label}>{label}</Text>}
    </View>
  );
}

function MapTabIcon({ focused }: { focused: boolean }) {
  return (
    <View style={[tabStyles.mapIconOuter, focused && tabStyles.mapIconOuterActive]}>
      <Text style={tabStyles.mapIcon}>🏮</Text>
    </View>
  );
}

const tabStyles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 4,
  },
  icon: {
    fontSize: 22,
    color: Colors.textMuted,
  },
  iconActive: {
    color: Colors.gold,
  },
  label: {
    fontSize: 9,
    color: Colors.gold,
    fontWeight: "700",
    letterSpacing: 1,
    marginTop: 2,
  },
  mapIconOuter: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.cardBackground,
    borderWidth: 2,
    borderColor: Colors.goldBorder,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  mapIconOuterActive: {
    backgroundColor: "rgba(201,168,76,0.2)",
    borderColor: Colors.gold,
    shadowColor: Colors.gold,
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  mapIcon: {
    fontSize: 24,
  },
});

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#080816",
          borderTopColor: "rgba(201,168,76,0.2)",
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 84 : 64,
          paddingBottom: Platform.OS === "ios" ? 24 : 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: Colors.gold,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          title: "Feed",
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🏠" label="FEED" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🔥" label="DISCOVER" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          tabBarIcon: ({ focused }) => (
            <MapTabIcon focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="💬" label="MESSAGES" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="👤" label="PROFILE" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

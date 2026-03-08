import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { Colors } from "../../src/constants/colors";

const MOCK_PROFILE = {
  displayName: "You",
  username: "user_xyz",
  bio: "Adventure seeker. Coffee lover. Night owl.",
  oilBalance: 50,
  city: "New York",
  gender: "Man",
};

const LIT_DURATIONS = [
  { label: "30 min", value: 30 },
  { label: "1 hr", value: 60 },
  { label: "2 hr", value: 120 },
  { label: "4 hr", value: 240 },
];

export default function ProfileScreen() {
  const [isLit, setIsLit] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(60);

  function handleLogout() {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: () => router.replace("/"),
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <Text style={styles.headerSubtitle}>YOUR LANTERN</Text>
        </View>

        {/* Avatar + Name */}
        <View style={styles.profileSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitial}>
              {MOCK_PROFILE.displayName[0]}
            </Text>
            {isLit && <View style={styles.litDot} />}
          </View>
          <Text style={styles.displayName}>{MOCK_PROFILE.displayName}</Text>
          <Text style={styles.username}>@{MOCK_PROFILE.username}</Text>
          {MOCK_PROFILE.bio ? (
            <Text style={styles.bio}>{MOCK_PROFILE.bio}</Text>
          ) : null}
          <View style={styles.metaRow}>
            <Text style={styles.metaPill}>📍 {MOCK_PROFILE.city}</Text>
            <Text style={styles.metaPill}>⚧ {MOCK_PROFILE.gender}</Text>
          </View>
        </View>

        {/* Oil Balance */}
        <View style={styles.oilCard}>
          <View style={styles.oilLeft}>
            <Text style={styles.oilEmoji}>🕯️</Text>
            <View>
              <Text style={styles.oilAmount}>{MOCK_PROFILE.oilBalance}</Text>
              <Text style={styles.oilLabel}>Wicks available</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.getOilBtn}
            onPress={() => router.push("/purchase-oil")}
            activeOpacity={0.85}
          >
            <Text style={styles.getOilText}>GET WICKS</Text>
          </TouchableOpacity>
        </View>

        {/* Lit Toggle */}
        <View style={styles.litCard}>
          <View style={styles.litHeader}>
            <Text style={styles.litTitle}>
              {isLit ? "🔥 You're Lit" : "Go Lit"}
            </Text>
            <Text style={styles.litSubtitle}>
              {isLit
                ? "Others can see you on the map"
                : "Become visible on the Lantern map"}
            </Text>
          </View>

          {!isLit && (
            <View style={styles.durationRow}>
              <Text style={styles.durationLabel}>Duration</Text>
              <View style={styles.durationChips}>
                {LIT_DURATIONS.map((d) => (
                  <TouchableOpacity
                    key={d.value}
                    style={[
                      styles.durationChip,
                      selectedDuration === d.value &&
                        styles.durationChipActive,
                    ]}
                    onPress={() => setSelectedDuration(d.value)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.durationChipText,
                        selectedDuration === d.value &&
                          styles.durationChipTextActive,
                      ]}
                    >
                      {d.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[styles.litToggleBtn, isLit && styles.litToggleBtnActive]}
            onPress={() => setIsLit((v) => !v)}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.litToggleBtnText,
                isLit && styles.litToggleBtnTextActive,
              ]}
            >
              {isLit ? "GO DARK" : "GO LIT"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>ACCOUNT</Text>

          <TouchableOpacity style={styles.settingsRow} activeOpacity={0.8}>
            <Text style={styles.settingsRowIcon}>✏️</Text>
            <Text style={styles.settingsRowText}>Edit Profile</Text>
            <Text style={styles.settingsRowArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsRow} activeOpacity={0.8}>
            <Text style={styles.settingsRowIcon}>🔔</Text>
            <Text style={styles.settingsRowText}>Notifications</Text>
            <Text style={styles.settingsRowArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsRow} activeOpacity={0.8}>
            <Text style={styles.settingsRowIcon}>🔒</Text>
            <Text style={styles.settingsRowText}>Privacy & Safety</Text>
            <Text style={styles.settingsRowArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsRow} activeOpacity={0.8}>
            <Text style={styles.settingsRowIcon}>❓</Text>
            <Text style={styles.settingsRowText}>Help & Support</Text>
            <Text style={styles.settingsRowArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingsRow, styles.settingsRowLast]}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Text style={styles.settingsRowIcon}>🚪</Text>
            <Text style={[styles.settingsRowText, styles.logoutText]}>
              Log Out
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 28,
    fontWeight: "700",
    color: Colors.gold,
  },
  headerSubtitle: {
    fontSize: 10,
    color: Colors.textMuted,
    letterSpacing: 2,
    marginTop: 2,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 6,
    paddingHorizontal: 20,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.goldGlow,
    borderWidth: 2,
    borderColor: Colors.gold,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  avatarInitial: {
    color: Colors.gold,
    fontSize: 32,
    fontWeight: "700",
  },
  litDot: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#FF7A3C",
    borderWidth: 2,
    borderColor: Colors.background,
  },
  displayName: {
    color: Colors.textCream,
    fontSize: 22,
    fontWeight: "700",
  },
  username: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  bio: {
    color: Colors.textMuted,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 280,
  },
  metaRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  metaPill: {
    color: Colors.textMuted,
    fontSize: 13,
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  oilCard: {
    marginHorizontal: 16,
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    marginBottom: 12,
  },
  oilLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  oilEmoji: {
    fontSize: 28,
  },
  oilAmount: {
    color: Colors.gold,
    fontSize: 24,
    fontWeight: "700",
  },
  oilLabel: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  getOilBtn: {
    backgroundColor: Colors.gold,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  getOilText: {
    color: "#1A1200",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },
  litCard: {
    marginHorizontal: 16,
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.divider,
    gap: 14,
    marginBottom: 20,
  },
  litHeader: {
    gap: 4,
  },
  litTitle: {
    color: Colors.textCream,
    fontSize: 17,
    fontWeight: "700",
  },
  litSubtitle: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  durationRow: {
    gap: 8,
  },
  durationLabel: {
    color: Colors.textMuted,
    fontSize: 12,
    letterSpacing: 1,
    fontWeight: "600",
  },
  durationChips: {
    flexDirection: "row",
    gap: 8,
  },
  durationChip: {
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "transparent",
  },
  durationChipActive: {
    backgroundColor: Colors.goldGlow,
    borderColor: Colors.gold,
  },
  durationChipText: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  durationChipTextActive: {
    color: Colors.gold,
    fontWeight: "600",
  },
  litToggleBtn: {
    borderWidth: 1.5,
    borderColor: Colors.gold,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  litToggleBtnActive: {
    backgroundColor: Colors.gold,
  },
  litToggleBtnText: {
    color: Colors.gold,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 2,
  },
  litToggleBtnTextActive: {
    color: "#1A1200",
  },
  settingsSection: {
    marginHorizontal: 16,
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.divider,
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: 11,
    color: Colors.textMuted,
    letterSpacing: 2,
    fontWeight: "600",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 6,
  },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    gap: 12,
  },
  settingsRowLast: {},
  settingsRowIcon: {
    fontSize: 18,
    width: 26,
  },
  settingsRowText: {
    flex: 1,
    color: Colors.text,
    fontSize: 15,
  },
  settingsRowArrow: {
    color: Colors.textMuted,
    fontSize: 20,
  },
  logoutText: {
    color: Colors.error,
  },
});

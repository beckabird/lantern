import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar,
  Platform, ScrollView, Alert, Image,
} from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../../src/constants/colors";
import { MOCK_AUCTIONS } from "../../src/data/mockData";

export default function ProfileScreen() {
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [isLitDate, setIsLitDate] = useState(false);
  const [snuffCount, setSnuffCount] = useState(0);

  useEffect(() => {
    async function load() {
      const uri = await AsyncStorage.getItem("avatarUri");
      if (uri) setAvatarUri(uri);
      const litDateTs = await AsyncStorage.getItem("litDateGrantedAt");
      if (litDateTs) {
        const ts = parseInt(litDateTs, 10);
        const thirtyDays = 30 * 24 * 60 * 60 * 1000;
        if (Date.now() - ts < thirtyDays) setIsLitDate(true);
      }
      const snuff = await AsyncStorage.getItem("snuffCount_opponent");
      if (snuff) setSnuffCount(parseInt(snuff, 10));
    }
    load();
  }, []);

  async function pickAvatar() {
    try {
      const { launchImageLibraryAsync, MediaTypeOptions } = await import("expo-image-picker");
      const result = await launchImageLibraryAsync({
        mediaTypes: MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0].uri) {
        const uri = result.assets[0].uri;
        setAvatarUri(uri);
        await AsyncStorage.setItem("avatarUri", uri);
      }
    } catch {
      Alert.alert("Info", "Image picker not available in this environment.");
    }
  }

  function handleStatTap() {
    Alert.alert("Coming Soon", "This feature is coming soon!");
  }

  async function handleLogout() {
    router.replace("/(auth)/login");
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View style={styles.headerLine} />
          <Text style={styles.headerTitle}>PROFILE</Text>
          <View style={styles.headerLine} />
        </View>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={pickAvatar} style={styles.avatarWrapper}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>A</Text>
              </View>
            )}
            <View style={styles.avatarEdit}>
              <Text style={styles.avatarEditText}>📷</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.displayName}>Alex Morgan</Text>
          <Text style={styles.subTitle}>Member since 2024</Text>

          {isLitDate && (
            <View style={styles.litBadge}>
              <Text style={styles.litBadgeText}>🏮 Lit Date</Text>
            </View>
          )}

          {snuffCount >= 1 && (
            <View style={styles.snuffWarning}>
              <Text style={styles.snuffText}>⚠️ {snuffCount} snuff{snuffCount > 1 ? 's' : ''} recorded</Text>
            </View>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { label: "Dates Hosted", value: "4" },
            { label: "Wicks Won", value: "230" },
            { label: "Flame Rate", value: "92%" },
          ].map((s, i, arr) => (
            <TouchableOpacity
              key={s.label}
              style={[styles.statItem, i === arr.length - 1 && { borderRightWidth: 0 }]}
              onPress={handleStatTap}
            >
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.editBtn} onPress={() => router.push("/profile/edit" as any)}>
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.oilBtn} onPress={() => router.push("/purchase-oil" as any)}>
            <Text style={styles.oilBtnText}>🕯 Get Oil</Text>
          </TouchableOpacity>
        </View>

        {/* My Auctions */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionLine} />
          <Text style={styles.sectionTitle}>MY AUCTIONS</Text>
          <View style={styles.sectionLine} />
        </View>

        {MOCK_AUCTIONS.slice(0, 3).map((a) => (
          <TouchableOpacity
            key={a.id}
            style={styles.auctionCard}
            onPress={() => router.push(`/flicker/${a.id}` as any)}
          >
            <View style={styles.auctionCardLeft}>
              <Text style={styles.auctionCardTitle}>{a.title}</Text>
              <Text style={styles.auctionCardLocation}>{a.location}</Text>
            </View>
            <View style={styles.auctionBidBadge}>
              <Text style={styles.auctionBidText}>🕯 {a.currentBid}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>LOG OUT</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: 40 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  headerLine: { flex: 1, height: 1, backgroundColor: Colors.goldBorder },
  headerTitle: { color: Colors.gold, fontSize: 14, fontWeight: "700", letterSpacing: 3 },
  avatarSection: { alignItems: "center", paddingVertical: 24, paddingHorizontal: 16 },
  avatarWrapper: { position: "relative", marginBottom: 12 },
  avatarImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: Colors.gold },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.cardBackground,
    borderWidth: 3,
    borderColor: Colors.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: { color: Colors.gold, fontSize: 36, fontWeight: "700" },
  avatarEdit: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.gold,
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEditText: { fontSize: 16 },
  displayName: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 24,
    fontWeight: "700",
    color: Colors.textCream,
    marginBottom: 4,
  },
  subTitle: { color: Colors.textMuted, fontSize: 13 },
  litBadge: {
    marginTop: 8,
    backgroundColor: "rgba(201,168,76,0.2)",
    borderWidth: 1,
    borderColor: Colors.gold,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  litBadgeText: { color: Colors.gold, fontSize: 13, fontWeight: "700" },
  snuffWarning: {
    marginTop: 8,
    backgroundColor: "rgba(255,100,100,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,100,100,0.4)",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  snuffText: { color: "#FF6B6B", fontSize: 12, fontWeight: "600" },
  statsRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    borderRightWidth: 1,
    borderRightColor: Colors.goldBorder,
  },
  statValue: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 22,
    fontWeight: "700",
    color: Colors.gold,
  },
  statLabel: { color: Colors.textMuted, fontSize: 10, letterSpacing: 0.5, marginTop: 4, textAlign: "center" },
  actions: { flexDirection: "row", gap: 12, paddingHorizontal: 16, marginBottom: 24 },
  editBtn: {
    flex: 1,
    borderRadius: 28,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.gold,
    backgroundColor: "transparent",
  },
  editBtnText: { color: Colors.gold, fontSize: 14, fontWeight: "700" },
  oilBtn: {
    flex: 1,
    borderRadius: 28,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: Colors.gold,
  },
  oilBtnText: { color: "#1A1200", fontSize: 14, fontWeight: "700" },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 10,
  },
  sectionLine: { flex: 1, height: 1, backgroundColor: Colors.goldBorder },
  sectionTitle: { color: Colors.gold, fontSize: 12, fontWeight: "700", letterSpacing: 2 },
  auctionCard: {
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  auctionCardLeft: { flex: 1, marginRight: 12 },
  auctionCardTitle: {
    color: Colors.textCream,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  auctionCardLocation: { color: Colors.textMuted, fontSize: 12 },
  auctionBidBadge: {
    backgroundColor: "rgba(201,168,76,0.15)",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
  },
  auctionBidText: { color: Colors.gold, fontSize: 12, fontWeight: "700" },
  logoutBtn: {
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 28,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,100,100,0.4)",
  },
  logoutText: { color: "#FF6B6B", fontSize: 14, fontWeight: "700", letterSpacing: 1 },
});

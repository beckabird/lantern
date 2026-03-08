import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar,
  Platform, ScrollView, Alert,
} from "react-native";
import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import QRCode from "react-native-qrcode-svg";
import { Colors } from "../../src/constants/colors";
import { MOCK_TICKETS } from "../../src/data/mockData";

export default function TicketDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const ticket = MOCK_TICKETS.find((t) => t.id === id) ?? MOCK_TICKETS[0];
  const [litDateGranted, setLitDateGranted] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("litDateGrantedAt").then((val) => {
      if (val) {
        const ts = parseInt(val, 10);
        if (Date.now() - ts < 30 * 24 * 60 * 60 * 1000) setLitDateGranted(true);
      }
    });
  }, []);

  async function saveToCameraRoll() {
    try {
      const { requestPermissionsAsync, saveToLibraryAsync } = await import("expo-media-library");
      const { status } = await requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Needed", "Camera roll permission is required.");
        return;
      }
      await saveToLibraryAsync(`lantern-ticket-${ticket.id}`);
      Alert.alert("Saved!", "Ticket saved to camera roll.");
    } catch {
      Alert.alert("Info", "Media library not available in this environment.");
    }
  }

  async function uploadProof() {
    try {
      const { launchImageLibraryAsync, MediaTypeOptions } = await import("expo-image-picker");
      const result = await launchImageLibraryAsync({
        mediaTypes: MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: 3,
        quality: 0.8,
      });
      if (!result.canceled) {
        const ts = Date.now();
        await AsyncStorage.setItem("litDateGrantedAt", String(ts));
        setLitDateGranted(true);
        Alert.alert("🏮 Lit Date Earned!", "You've uploaded proof of your date. Lit Date badge awarded!");
      }
    } catch {
      Alert.alert("Info", "Image picker not available in this environment.");
    }
  }

  async function snuffOpponent() {
    const key = "snuffCount_opponent";
    const current = await AsyncStorage.getItem(key);
    const count = current ? parseInt(current, 10) + 1 : 1;
    await AsyncStorage.setItem(key, String(count));
    Alert.alert("Snuffed 🕯️", `Snuff recorded. Count: ${count}`);
  }

  const TIER_COLORS: Record<string, string> = {
    'Starter Flame': '#8B7355',
    'Burning Bright': Colors.gold,
    'Wildfire': '#FF6B35',
    'Inferno': '#FF3333',
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>TICKET</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {litDateGranted && (
          <View style={styles.litBadge}>
            <Text style={styles.litBadgeText}>🏮 Lit Date Verified</Text>
          </View>
        )}

        {/* Ticket Card */}
        <View style={styles.ticketCard}>
          <View style={styles.ticketHeader}>
            <Text style={styles.ticketTitle}>{ticket.title}</Text>
            <View style={[styles.tierBadge, { backgroundColor: TIER_COLORS[ticket.tier] + '30', borderColor: TIER_COLORS[ticket.tier] }]}>
              <Text style={[styles.tierText, { color: TIER_COLORS[ticket.tier] }]}>{ticket.tier}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>PARTNER</Text>
            <View style={styles.partnerRow}>
              <View style={[styles.partnerAvatar, { backgroundColor: ticket.partnerAvatarColor }]}>
                <Text style={styles.partnerInitials}>{ticket.partnerInitials}</Text>
              </View>
              <Text style={styles.infoValue}>{ticket.partner}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>LOCATION</Text>
            <Text style={styles.infoValue}>{ticket.location}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>SCHEDULED</Text>
            <Text style={styles.infoValue}>{ticket.scheduledTime}</Text>
          </View>
        </View>

        {/* QR Code */}
        <View style={styles.qrSection}>
          <Text style={styles.qrLabel}>ENTRY QR CODE</Text>
          <View style={styles.qrWrapper}>
            <QRCode
              value={`lantern-ticket-${ticket.id}`}
              size={200}
              color={Colors.gold}
              backgroundColor={Colors.cardBackground}
            />
          </View>
          <TouchableOpacity style={styles.saveBtn} onPress={saveToCameraRoll}>
            <Text style={styles.saveBtnText}>Save to Camera Roll</Text>
          </TouchableOpacity>
        </View>

        {/* Upload Proof */}
        <View style={styles.proofSection}>
          <Text style={styles.proofTitle}>UPLOAD DATE PROOF</Text>
          <Text style={styles.proofSub}>Upload 1-3 photos from your date to earn the 🏮 Lit Date badge</Text>
          <TouchableOpacity style={styles.uploadBtn} onPress={uploadProof} activeOpacity={0.85}>
            <Text style={styles.uploadBtnText}>📸 Upload Photos</Text>
          </TouchableOpacity>
        </View>

        {/* Snuff button */}
        <TouchableOpacity style={styles.snuffBtn} onPress={snuffOpponent}>
          <Text style={styles.snuffBtnText}>🕯️ Snuff</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: { padding: 8, width: 40 },
  backText: { color: Colors.textMuted, fontSize: 24 },
  topTitle: { color: Colors.gold, fontSize: 13, fontWeight: "700", letterSpacing: 3 },
  scroll: { padding: 16, paddingBottom: 40, gap: 16 },
  litBadge: {
    backgroundColor: "rgba(201,168,76,0.2)",
    borderWidth: 1,
    borderColor: Colors.gold,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: "center",
    marginBottom: 8,
  },
  litBadgeText: { color: Colors.gold, fontSize: 14, fontWeight: "700" },
  ticketCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    padding: 20,
    gap: 14,
  },
  ticketHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 12 },
  ticketTitle: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textCream,
    flex: 1,
  },
  tierBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
  },
  tierText: { fontSize: 10, fontWeight: "700", letterSpacing: 0.5 },
  infoRow: { gap: 4 },
  infoLabel: { color: Colors.textMuted, fontSize: 10, letterSpacing: 2, fontWeight: "600" },
  infoValue: { color: Colors.textCream, fontSize: 14, fontWeight: "600" },
  partnerRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  partnerAvatar: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  partnerInitials: { color: "#fff", fontSize: 12, fontWeight: "700" },
  qrSection: { alignItems: "center", gap: 12 },
  qrLabel: { color: Colors.textMuted, fontSize: 11, letterSpacing: 2, fontWeight: "600" },
  qrWrapper: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
  },
  saveBtn: {
    borderRadius: 28,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: Colors.gold,
  },
  saveBtnText: { color: Colors.gold, fontSize: 13, fontWeight: "700" },
  proofSection: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    padding: 20,
    gap: 10,
    alignItems: "center",
  },
  proofTitle: { color: Colors.gold, fontSize: 12, fontWeight: "700", letterSpacing: 2 },
  proofSub: { color: Colors.textMuted, fontSize: 12, textAlign: "center", lineHeight: 18 },
  uploadBtn: {
    backgroundColor: Colors.gold,
    borderRadius: 28,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 4,
  },
  uploadBtnText: { color: "#1A1200", fontSize: 13, fontWeight: "700" },
  snuffBtn: {
    borderRadius: 28,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,100,100,0.4)",
  },
  snuffBtnText: { color: "#FF6B6B", fontSize: 14, fontWeight: "600" },
});

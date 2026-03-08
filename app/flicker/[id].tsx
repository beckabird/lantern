import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar,
  Platform, ScrollView, Modal, TextInput, Alert, Dimensions, ImageBackground,
} from "react-native";
import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Colors } from "../../src/constants/colors";
import { MOCK_AUCTIONS } from "../../src/data/mockData";

const { width } = Dimensions.get("window");

function formatCountdown(ms: number) {
  if (ms <= 0) return "ENDED";
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function FlickerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const auction = MOCK_AUCTIONS.find((a) => a.id === id) ?? MOCK_AUCTIONS[0];

  const [msLeft, setMsLeft] = useState(auction.endsAt - Date.now());
  const [modalVisible, setModalVisible] = useState(false);
  const [bidAmount, setBidAmount] = useState(String(auction.currentBid + 5));
  const [bidError, setBidError] = useState("");

  useEffect(() => {
    const t = setInterval(() => setMsLeft(auction.endsAt - Date.now()), 1000);
    return () => clearInterval(t);
  }, [auction.endsAt]);

  function confirmBid() {
    const amt = parseInt(bidAmount, 10);
    if (isNaN(amt) || amt < 1) { setBidError("Enter a valid amount."); return; }
    if (amt <= auction.currentBid) { setBidError(`Bid must exceed ${auction.currentBid} wicks.`); return; }
    if (amt > 50) { setBidError("Insufficient wicks (balance: 50)."); return; }
    setBidError("");
    setModalVisible(false);
    Alert.alert("Bid Placed! 🕯️", `You bid ${amt} wicks on "${auction.title}".`);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.countdownBadge}>
          <Text style={styles.countdownText}>⏱ {formatCountdown(msLeft)}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={{ uri: auction.imageUrl }}
          style={styles.heroImage}
        >
          <View style={styles.heroOverlay} />
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>{auction.category}</Text>
          </View>
        </ImageBackground>

        <View style={styles.content}>
          <Text style={styles.title}>{auction.title}</Text>
          <Text style={styles.location}>📍 {auction.location}</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>PROPOSED TIME</Text>
              <Text style={styles.infoValue}>{auction.proposedTime}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>HOSTED BY</Text>
              <Text style={styles.infoValue}>{auction.hostName}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>CURRENT BID</Text>
              <Text style={[styles.infoValue, styles.bidValue]}>🕯 {auction.currentBid} wicks</Text>
            </View>
          </View>

          <Text style={styles.descTitle}>ABOUT THIS DATE</Text>
          <Text style={styles.description}>{auction.activity}</Text>
        </View>
      </ScrollView>

      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.flickerBtn} onPress={() => router.push("/flicker/new" as any)}>
          <Text style={styles.flickerBtnText}>Send a Flicker</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bidBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.bidBtnText}>Place Bid</Text>
        </TouchableOpacity>
      </View>

      {/* Bid Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Place Your Bid</Text>
            <Text style={styles.modalSub}>Current bid: 🕯 {auction.currentBid} wicks · Your balance: 🕯 50 wicks</Text>

            <View style={styles.modalInput}>
              <Text style={styles.modalInputLabel}>WICK AMOUNT</Text>
              <TextInput
                style={styles.modalTextInput}
                value={bidAmount}
                onChangeText={(t) => { setBidAmount(t); setBidError(""); }}
                keyboardType="numeric"
                selectionColor={Colors.gold}
              />
            </View>
            {bidError ? <Text style={styles.bidErrorText}>{bidError}</Text> : null}

            <TouchableOpacity style={styles.confirmBtn} onPress={confirmBid} activeOpacity={0.85}>
              <Text style={styles.confirmBtnText}>Confirm Bid</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: { padding: 8 },
  backText: { color: Colors.textMuted, fontSize: 26 },
  countdownBadge: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
  },
  countdownText: { color: Colors.gold, fontSize: 13, fontWeight: "700" },
  heroImage: { width, height: 260, justifyContent: "flex-end" },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(11,13,26,0.5)" },
  heroBadge: {
    margin: 16,
    alignSelf: "flex-start",
    backgroundColor: "rgba(201,168,76,0.25)",
    borderWidth: 1,
    borderColor: Colors.gold,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  heroBadgeText: { color: Colors.gold, fontSize: 11, fontWeight: "700", letterSpacing: 1 },
  content: { padding: 20 },
  title: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 28,
    fontWeight: "700",
    color: Colors.textCream,
    marginBottom: 6,
  },
  location: { color: Colors.textMuted, fontSize: 14, marginBottom: 20 },
  infoCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    padding: 16,
    marginBottom: 20,
  },
  infoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8 },
  infoLabel: { color: Colors.textMuted, fontSize: 11, letterSpacing: 1.5, fontWeight: "600" },
  infoValue: { color: Colors.textCream, fontSize: 14, fontWeight: "600" },
  bidValue: { color: Colors.gold },
  divider: { height: 1, backgroundColor: "rgba(255,255,255,0.06)" },
  descTitle: { color: Colors.textMuted, fontSize: 11, letterSpacing: 2, fontWeight: "600", marginBottom: 8 },
  description: { color: Colors.textMuted, fontSize: 15, lineHeight: 24 },
  actionBar: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 24 : 16,
    borderTopWidth: 1,
    borderTopColor: Colors.goldBorder,
    backgroundColor: Colors.background,
  },
  flickerBtn: {
    flex: 1,
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.gold,
  },
  flickerBtnText: { color: Colors.gold, fontSize: 14, fontWeight: "700" },
  bidBtn: {
    flex: 1,
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: Colors.gold,
  },
  bidBtnText: { color: "#1A1200", fontSize: 14, fontWeight: "700" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: Colors.cardBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    borderTopWidth: 1,
    borderColor: Colors.goldBorder,
  },
  modalTitle: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 22,
    fontWeight: "700",
    color: Colors.textCream,
    marginBottom: 6,
    textAlign: "center",
  },
  modalSub: { color: Colors.textMuted, fontSize: 13, textAlign: "center", marginBottom: 20 },
  modalInput: { marginBottom: 8 },
  modalInputLabel: { color: Colors.textMuted, fontSize: 11, letterSpacing: 2, fontWeight: "600", marginBottom: 6 },
  modalTextInput: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    fontWeight: "700",
    color: Colors.gold,
  },
  bidErrorText: { color: "#FF6B6B", fontSize: 13, marginBottom: 12 },
  confirmBtn: {
    backgroundColor: Colors.gold,
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 12,
    marginTop: 8,
  },
  confirmBtnText: { color: "#1A1200", fontSize: 15, fontWeight: "700" },
  cancelBtn: { alignItems: "center", paddingVertical: 10 },
  cancelBtnText: { color: Colors.textMuted, fontSize: 14 },
});

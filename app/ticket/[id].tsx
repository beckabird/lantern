import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
  Platform,
  Image,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useState, useRef, useEffect } from "react";
import QRCode from "react-native-qrcode-svg";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { captureRef } from "react-native-view-shot";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../src/constants/colors";

const SNUFF_KEY = "snuffs_received";
const LIT_DATE_KEY = "lit_date_badges";
const MY_USER_ID = "local_user";
const OTHER_USER_ID = "other_user";

const MOCK_TICKETS: Record<
  string,
  { title: string; vibe: string; date: string; host: string; location: string }
> = {
  "1": {
    title: "Rooftop Sunset Dinner",
    vibe: "Romantic 🌅",
    date: "2025-01-15",
    host: "Sophia M.",
    location: "Manhattan, NY",
  },
  "2": {
    title: "Jazz & Wine Evening",
    vibe: "Chill 🎷",
    date: "2025-02-20",
    host: "Marcus A.",
    location: "Brooklyn, NY",
  },
  "3": {
    title: "Art Gallery Walk",
    vibe: "Cultural 🎨",
    date: "2026-04-10",
    host: "Aria L.",
    location: "Chelsea, NY",
  },
  "4": {
    title: "Private Chef Experience",
    vibe: "Luxe 🍽️",
    date: "2026-05-01",
    host: "James K.",
    location: "Upper East Side, NY",
  },
};

export default function TicketDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const ticket = MOCK_TICKETS[id ?? "1"] ?? MOCK_TICKETS["1"];
  const ticketId = id ?? "1";

  const dateHasPassed = new Date(ticket.date) < new Date();

  const [dateProofPhotos, setDateProofPhotos] = useState<string[]>([]);
  const [litDateActive, setLitDateActive] = useState(false);
  const [snuffSent, setSnuffSent] = useState(false);
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const qrRef = useRef<View>(null);

  useEffect(() => {
    checkLitDate();
    checkSnuffSent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (litDateActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [litDateActive, shimmerAnim]);

  async function checkLitDate() {
    try {
      const raw = await AsyncStorage.getItem(`${LIT_DATE_KEY}:${MY_USER_ID}`);
      if (raw) {
        const badges: { grantedAt: number }[] = JSON.parse(raw);
        const now = Date.now();
        const active = badges.some(
          (b) => now - b.grantedAt < 30 * 24 * 60 * 60 * 1000
        );
        setLitDateActive(active);
      }
    } catch {}
  }

  async function checkSnuffSent() {
    try {
      const raw = await AsyncStorage.getItem(
        `snuffs_sent:${MY_USER_ID}:${ticketId}`
      );
      if (raw) setSnuffSent(true);
    } catch {}
  }

  async function handleUploadDateProof() {
    if (dateProofPhotos.length >= 3) {
      Alert.alert("Limit reached", "You can upload up to 3 photos.");
      return;
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Please allow photo library access.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      const newPhotos = [...dateProofPhotos, result.assets[0].uri];
      setDateProofPhotos(newPhotos);

      // Grant Lit Date badge on first upload
      if (newPhotos.length === 1) {
        await grantLitDateBadge();
      }
    }
  }

  async function grantLitDateBadge() {
    try {
      const raw = await AsyncStorage.getItem(`${LIT_DATE_KEY}:${MY_USER_ID}`);
      const badges = raw ? JSON.parse(raw) : [];
      badges.push({ grantedAt: Date.now(), ticketId });
      await AsyncStorage.setItem(
        `${LIT_DATE_KEY}:${MY_USER_ID}`,
        JSON.stringify(badges)
      );
      setLitDateActive(true);
    } catch {}
  }

  async function handleSnuff() {
    if (snuffSent) {
      Alert.alert("Already snuffed", "You have already snuffed this date.");
      return;
    }
    Alert.alert(
      "Snuff this date? 🕯️",
      "This will report a bad date experience. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Snuff",
          style: "destructive",
          onPress: async () => {
            try {
              // Record snuff on other user
              const raw = await AsyncStorage.getItem(
                `${SNUFF_KEY}:${OTHER_USER_ID}`
              );
              const snuffs = raw ? JSON.parse(raw) : [];
              snuffs.push({ timestamp: Date.now(), fromTicket: ticketId });
              await AsyncStorage.setItem(
                `${SNUFF_KEY}:${OTHER_USER_ID}`,
                JSON.stringify(snuffs)
              );

              // Mark as sent for this ticket
              await AsyncStorage.setItem(
                `snuffs_sent:${MY_USER_ID}:${ticketId}`,
                "1"
              );
              setSnuffSent(true);
              Alert.alert(
                "Snuffed 🕯️",
                "Your report has been recorded. Thank you for keeping Lantern safe."
              );
            } catch {}
          },
        },
      ]
    );
  }

  async function handleSaveQR() {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Please allow media library access.");
      return;
    }
    try {
      if (!qrRef.current) {
        Alert.alert("Error", "Could not capture QR code.");
        return;
      }
      const uri = await captureRef(qrRef, { format: "png", quality: 1 });
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert("Saved!", "QR code saved to your camera roll.");
    } catch {
      Alert.alert("Error", "Failed to save QR code.");
    }
  }

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 1],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.gold} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ticket</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Ticket card */}
        <View style={styles.ticketCard}>
          <View style={styles.ticketTop}>
            <View style={styles.vibePill}>
              <Text style={styles.vibeText}>{ticket.vibe}</Text>
            </View>
            {litDateActive && (
              <Animated.View
                style={[styles.litBadgeSmall, { opacity: shimmerOpacity }]}
              >
                <Text style={styles.litBadgeSmallText}>🏮 Lit Date</Text>
              </Animated.View>
            )}
          </View>
          <Text style={styles.ticketTitle}>{ticket.title}</Text>

          <View style={styles.ticketMeta}>
            <View style={styles.metaRow}>
              <Ionicons name="calendar-outline" size={13} color={Colors.textMuted} />
              <Text style={styles.metaText}>{ticket.date}</Text>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="location-outline" size={13} color={Colors.textMuted} />
              <Text style={styles.metaText}>{ticket.location}</Text>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="person-outline" size={13} color={Colors.textMuted} />
              <Text style={styles.metaText}>Hosted by {ticket.host}</Text>
            </View>
          </View>

          <View style={styles.ticketDivider} />

          {/* QR Code */}
          <View style={styles.qrSection}>
            <Text style={styles.sectionLabel}>TICKET QR CODE</Text>
            <View
              ref={qrRef as any}
              style={styles.qrWrapper}
              collapsable={false}
            >
              <QRCode
                value={`lantern:ticket:${ticketId}`}
                size={180}
                color={Colors.gold}
                backgroundColor={Colors.cardBackground}
              />
            </View>
            <Text style={styles.qrIdText}>#{ticketId.padStart(8, "0")}</Text>
            <TouchableOpacity
              style={styles.saveQrBtn}
              onPress={handleSaveQR}
              activeOpacity={0.8}
            >
              <Ionicons name="download-outline" size={16} color={Colors.gold} />
              <Text style={styles.saveQrText}>Save to Camera Roll</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Date Proof Upload (only after date has passed) */}
        {dateHasPassed && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>DATE PROOF</Text>

            {litDateActive && (
              <Animated.View
                style={[styles.litDateBadge, { opacity: shimmerOpacity }]}
              >
                <Text style={styles.litDateEmoji}>🏮</Text>
                <Text style={styles.litDateText}>Lit Date</Text>
              </Animated.View>
            )}

            <Text style={styles.sectionHint}>
              Upload up to 3 photos from your date to earn the Lit Date 🏮 badge.
            </Text>

            <View style={styles.photoRow}>
              {dateProofPhotos.map((uri, i) => (
                <Image key={i} source={{ uri }} style={styles.proofPhoto} />
              ))}
              {dateProofPhotos.length < 3 && (
                <TouchableOpacity
                  style={styles.addPhotoBtn}
                  onPress={handleUploadDateProof}
                  activeOpacity={0.8}
                >
                  <Ionicons name="add" size={28} color={Colors.gold} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Snuff Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>REPORT</Text>
          <Text style={styles.sectionHint}>
            Had a bad experience? Snuffing reports this date to Lantern.
          </Text>
          <TouchableOpacity
            style={[styles.snuffBtn, snuffSent && styles.snuffBtnDisabled]}
            onPress={handleSnuff}
            activeOpacity={0.8}
            disabled={snuffSent}
          >
            <Text style={styles.snuffBtnText}>
              {snuffSent ? "🕯️ Snuffed" : "🕯️ Snuff this date"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 56 : 40,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.goldBorder,
  },
  backBtn: {
    padding: 2,
  },
  headerTitle: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 20,
    fontWeight: "700",
    color: Colors.gold,
    letterSpacing: 0.5,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 48,
    gap: 20,
  },
  ticketCard: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    borderRadius: 20,
    padding: 20,
  },
  ticketTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  vibePill: {
    backgroundColor: "rgba(201,168,76,0.12)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  vibeText: {
    color: Colors.gold,
    fontSize: 11,
    fontWeight: "500",
  },
  litBadgeSmall: {
    backgroundColor: "rgba(201,168,76,0.15)",
    borderWidth: 1,
    borderColor: Colors.gold,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  litBadgeSmallText: {
    color: Colors.gold,
    fontSize: 11,
    fontWeight: "600",
  },
  ticketTitle: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 14,
  },
  ticketMeta: {
    gap: 6,
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  ticketDivider: {
    height: 1,
    backgroundColor: Colors.goldBorder,
    marginBottom: 20,
  },
  qrSection: {
    alignItems: "center",
    gap: 12,
  },
  sectionLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    letterSpacing: 3,
    fontWeight: "600",
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  qrWrapper: {
    padding: 16,
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
  },
  qrIdText: {
    color: Colors.textMuted,
    fontSize: 12,
    letterSpacing: 2,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  saveQrBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  saveQrText: {
    color: Colors.gold,
    fontSize: 13,
    fontWeight: "600",
  },
  section: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  sectionHint: {
    color: Colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
  },
  litDateBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 8,
    backgroundColor: "rgba(201,168,76,0.15)",
    borderWidth: 1.5,
    borderColor: Colors.gold,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  litDateEmoji: {
    fontSize: 18,
  },
  litDateText: {
    color: Colors.gold,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1,
  },
  photoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  proofPhoto: {
    width: 80,
    height: 80,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
  },
  addPhotoBtn: {
    width: 80,
    height: 80,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.goldBorder,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(201,168,76,0.05)",
  },
  snuffBtn: {
    borderWidth: 1,
    borderColor: "rgba(255,100,100,0.4)",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "rgba(255,100,100,0.07)",
  },
  snuffBtnDisabled: {
    opacity: 0.5,
  },
  snuffBtnText: {
    color: "#FF8080",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});

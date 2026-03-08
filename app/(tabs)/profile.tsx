import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { Colors } from "../../src/constants/colors";
import { Durations } from "../../src/constants/durations";

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&q=80";
const STORAGE_KEY_AVATAR = "lantern_avatar_uri";
const STORAGE_KEY_LIT_DATE = "lantern_lit_date_ts";
const STORAGE_KEY_SNUFFS = "lantern_snuffs";

const MY_AUCTIONS = [
  { id: "1", title: "Rooftop Dinner for Two", wicks: 15, timer: "02:45:00", category: "ROMANTIC" },
  { id: "2", title: "Jazz Café Evening", wicks: 12, timer: "05:20:00", category: "COZY" },
];

export default function ProfileScreen() {
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [litDate, setLitDate] = useState<number | null>(null);
  const [snuffs, setSnuffs] = useState(0);

  useEffect(() => {
    (async () => {
      const uri = await AsyncStorage.getItem(STORAGE_KEY_AVATAR);
      if (uri) setAvatarUri(uri);
      const ts = await AsyncStorage.getItem(STORAGE_KEY_LIT_DATE);
      if (ts) setLitDate(Number(ts));
      const s = await AsyncStorage.getItem(STORAGE_KEY_SNUFFS);
      if (s) setSnuffs(Number(s));
    })();
  }, []);

  async function handleAvatarPress() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Please allow access to your photo library.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setAvatarUri(uri);
      await AsyncStorage.setItem(STORAGE_KEY_AVATAR, uri);
    }
  }

  const isLitDateActive = litDate !== null && Date.now() - litDate < Durations.litDateBadgeMs;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerBg} />

        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={handleAvatarPress} activeOpacity={0.85}>
            <View style={styles.avatarRing}>
              <Image
                source={{ uri: avatarUri ?? DEFAULT_AVATAR }}
                style={styles.avatar}
              />
              <View style={styles.onlineDot} />
            </View>
          </TouchableOpacity>
          <Text style={styles.name}>Alexandra Winters</Text>
          <Text style={styles.location}>📍 New York, NY</Text>
          {isLitDateActive && (
            <View style={styles.litDateBadge}>
              <Text style={styles.litDateText}>Lit Date 🏮</Text>
            </View>
          )}
          {snuffs > 0 && snuffs < 3 && (
            <View style={styles.snuffWarning}>
              <Text style={styles.snuffWarningText}>⚠️ {snuffs} snuff{snuffs > 1 ? "s" : ""} — be careful</Text>
            </View>
          )}
          <TouchableOpacity style={styles.editBtn} activeOpacity={0.85}>
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          {[
            { icon: "❤️", label: "Dates Hosted", value: "12" },
            { icon: "🕯", label: "Wicks Won", value: "347" },
            { icon: "⭐", label: "Flame Rate", value: "94%" },
          ].map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ABOUT</Text>
          <View style={styles.aboutCard}>
            <Text style={styles.aboutText}>
              "I believe the best dates start with a little mystery and end with a good story.
              Lover of candlelit dinners, jazz, and spontaneous adventures."
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>MY AUCTIONS</Text>
            <TouchableOpacity style={styles.newBtn}>
              <Text style={styles.newBtnText}>+ New</Text>
            </TouchableOpacity>
          </View>
          {MY_AUCTIONS.map((auction) => (
            <View key={auction.id} style={styles.auctionCard}>
              <View style={styles.auctionLeft}>
                <View style={styles.auctionCategoryPill}>
                  <Text style={styles.auctionCategoryText}>{auction.category}</Text>
                </View>
                <Text style={styles.auctionTitle}>{auction.title}</Text>
                <Text style={styles.auctionMeta}>🕯 {auction.wicks} Wicks  •  ⏱ {auction.timer}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  headerBg: {
    height: 160,
    backgroundColor: "#0D0D22",
    borderBottomWidth: 1,
    borderBottomColor: Colors.goldBorder,
  },
  avatarSection: {
    alignItems: "center",
    marginTop: -56,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  avatarRing: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 3,
    borderColor: Colors.gold,
    padding: 2,
    position: "relative",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 54,
  },
  onlineDot: {
    position: "absolute",
    bottom: 6,
    right: 6,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: Colors.background,
  },
  name: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 26,
    fontWeight: "700",
    color: Colors.text,
    marginTop: 12,
  },
  location: {
    color: Colors.textMuted,
    fontSize: 14,
    marginTop: 4,
  },
  litDateBadge: {
    marginTop: 8,
    backgroundColor: "rgba(201,168,76,0.2)",
    borderWidth: 1,
    borderColor: Colors.gold,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  litDateText: {
    color: Colors.gold,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
  },
  snuffWarning: {
    marginTop: 6,
    backgroundColor: "rgba(255,100,100,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,100,100,0.4)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  snuffWarningText: {
    color: "#FF6B6B",
    fontSize: 12,
    fontWeight: "600",
  },
  editBtn: {
    marginTop: 14,
    borderWidth: 1.5,
    borderColor: Colors.gold,
    borderRadius: 28,
    paddingHorizontal: 28,
    paddingVertical: 10,
  },
  editBtnText: {
    color: Colors.gold,
    fontSize: 14,
    fontWeight: "600",
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    gap: 4,
  },
  statIcon: { fontSize: 20 },
  statValue: {
    color: Colors.gold,
    fontSize: 18,
    fontWeight: "700",
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 11,
    color: Colors.gold,
    letterSpacing: 3,
    fontWeight: "700",
    marginBottom: 12,
  },
  newBtn: {
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  newBtnText: {
    color: Colors.gold,
    fontSize: 13,
    fontWeight: "600",
  },
  aboutCard: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    borderRadius: 14,
    padding: 18,
  },
  aboutText: {
    color: Colors.textCream,
    fontSize: 15,
    lineHeight: 24,
    fontStyle: "italic",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  auctionCard: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
  },
  auctionLeft: { gap: 6 },
  auctionCategoryPill: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: Colors.gold,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  auctionCategoryText: {
    color: Colors.gold,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },
  auctionTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "700",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  auctionMeta: {
    color: Colors.textMuted,
    fontSize: 13,
  },
});

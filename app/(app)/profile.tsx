import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  Platform,
  Alert,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../src/constants/colors";

const SNUFF_KEY = "snuffs_received";
const LIT_DATE_KEY = "lit_date_badges";
const MY_USER_ID = "local_user";
const LIT_DATE_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export default function ProfileScreen() {
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [snuffCount, setSnuffCount] = useState(0);
  const [litDateActive, setLitDateActive] = useState(false);
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadProfileData();
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

  async function loadProfileData() {
    try {
      // Load snuff count
      const snuffsRaw = await AsyncStorage.getItem(`${SNUFF_KEY}:${MY_USER_ID}`);
      if (snuffsRaw) {
        const snuffs: { timestamp: number }[] = JSON.parse(snuffsRaw);
        setSnuffCount(snuffs.length);
      }

      // Load Lit Date badge
      const litBadgesRaw = await AsyncStorage.getItem(`${LIT_DATE_KEY}:${MY_USER_ID}`);
      if (litBadgesRaw) {
        const badges: { grantedAt: number }[] = JSON.parse(litBadgesRaw);
        const now = Date.now();
        const hasActive = badges.some(
          (b) => now - b.grantedAt < LIT_DATE_DURATION_MS
        );
        setLitDateActive(hasActive);
      }
    } catch {}
  }

  async function handlePickAvatar() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Please allow access to your photo library to set a profile photo."
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setAvatarUri(result.assets[0].uri);
    }
  }

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 1],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <Ionicons name="settings-outline" size={22} color={Colors.gold} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={handlePickAvatar} activeOpacity={0.8}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarEmoji}>🏮</Text>
              </View>
            )}
            <View style={styles.avatarEditBadge}>
              <Ionicons name="camera-outline" size={14} color="#1A1200" />
            </View>
          </TouchableOpacity>
          <Text style={styles.username}>@username</Text>
          <Text style={styles.userCity}>New York, NY</Text>
        </View>

        {/* Lit Date Badge */}
        {litDateActive && (
          <Animated.View style={[styles.litDateBadge, { opacity: shimmerOpacity }]}>
            <Text style={styles.litDateEmoji}>🏮</Text>
            <Text style={styles.litDateText}>Lit Date</Text>
          </Animated.View>
        )}

        {/* Snuff Warning */}
        {snuffCount > 0 && snuffCount < 3 && (
          <View style={styles.snuffWarning}>
            <Ionicons name="warning-outline" size={16} color="#FF9B3A" />
            <Text style={styles.snuffWarningText}>
              {snuffCount === 1
                ? "1 snuff received — be mindful of your connections."
                : `${snuffCount} snuffs received — one more and you'll be removed.`}
            </Text>
          </View>
        )}

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>50</Text>
            <Text style={styles.statLabel}>Wicks</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Dates</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Bids</Text>
          </View>
        </View>

        {/* Bio */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>BIO</Text>
          <View style={styles.bioCard}>
            <Text style={styles.bioText}>
              No bio yet. Tap to add one.
            </Text>
          </View>
        </View>

        {/* Action Row */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8}>
            <Ionicons name="create-outline" size={16} color={Colors.gold} />
            <Text style={styles.actionBtnText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtnOutline} activeOpacity={0.8}>
            <Ionicons name="share-social-outline" size={16} color={Colors.textMuted} />
            <Text style={styles.actionBtnOutlineText}>Share</Text>
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
  headerTitle: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 24,
    fontWeight: "700",
    color: Colors.gold,
    letterSpacing: 0.5,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 48,
  },
  avatarSection: {
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2.5,
    borderColor: Colors.gold,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2.5,
    borderColor: Colors.gold,
    backgroundColor: Colors.cardBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmoji: {
    fontSize: 44,
  },
  avatarEditBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    backgroundColor: Colors.gold,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.background,
  },
  username: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "700",
    marginTop: 12,
    letterSpacing: 0.3,
  },
  userCity: {
    color: Colors.textMuted,
    fontSize: 13,
    marginTop: 4,
  },
  litDateBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    gap: 8,
    backgroundColor: "rgba(201,168,76,0.15)",
    borderWidth: 1.5,
    borderColor: Colors.gold,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginBottom: 16,
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
  snuffWarning: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,155,58,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,155,58,0.4)",
    borderRadius: 12,
    marginHorizontal: 20,
    padding: 12,
    marginBottom: 16,
  },
  snuffWarningText: {
    color: "#FF9B3A",
    fontSize: 12,
    flex: 1,
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    borderRadius: 16,
    paddingVertical: 20,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    color: Colors.gold,
    fontSize: 22,
    fontWeight: "700",
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    letterSpacing: 1,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.goldBorder,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    letterSpacing: 3,
    fontWeight: "600",
    marginBottom: 10,
  },
  bioCard: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    borderRadius: 12,
    padding: 14,
  },
  bioText: {
    color: Colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: Colors.gold,
    borderRadius: 12,
    paddingVertical: 14,
  },
  actionBtnText: {
    color: "#1A1200",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  actionBtnOutline: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    borderRadius: 12,
    paddingVertical: 14,
  },
  actionBtnOutlineText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});

import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../src/constants/colors";

const MOCK_AUCTIONS = [
  {
    id: "1",
    title: "Rooftop Sunset Dinner",
    vibe: "Romantic 🌅",
    currentBid: 120,
    endsIn: "2h 14m",
  },
  {
    id: "2",
    title: "Jazz & Wine Evening",
    vibe: "Chill 🎷",
    currentBid: 85,
    endsIn: "4h 52m",
  },
  {
    id: "3",
    title: "Art Gallery Walk",
    vibe: "Cultural 🎨",
    currentBid: 60,
    endsIn: "1d 3h",
  },
  {
    id: "4",
    title: "Private Chef Experience",
    vibe: "Luxe 🍽️",
    currentBid: 250,
    endsIn: "5h 30m",
  },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={styles.header}>
        <Text style={styles.logo}>Lantern</Text>
        <View style={styles.headerRight}>
          <View style={styles.wicksBadge}>
            <Ionicons name="flame-outline" size={14} color={Colors.gold} />
            <Text style={styles.wicksText}>50 wicks</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/(app)/profile")}
            hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
          >
            <Ionicons name="person-circle-outline" size={30} color={Colors.gold} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Active Auctions</Text>
        {MOCK_AUCTIONS.map((auction) => (
          <TouchableOpacity
            key={auction.id}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => router.push(`/ticket/${auction.id}` as any)}
          >
            <View style={styles.cardHeader}>
              <View style={styles.vibePill}>
                <Text style={styles.vibeText}>{auction.vibe}</Text>
              </View>
              <View style={styles.timerRow}>
                <Ionicons name="time-outline" size={12} color={Colors.textMuted} />
                <Text style={styles.timerText}>{auction.endsIn}</Text>
              </View>
            </View>
            <Text style={styles.cardTitle}>{auction.title}</Text>
            <View style={styles.cardFooter}>
              <View style={styles.bidRow}>
                <Ionicons name="flame-outline" size={14} color={Colors.gold} />
                <Text style={styles.bidText}>
                  Current bid: {auction.currentBid} wicks
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
            </View>
          </TouchableOpacity>
        ))}
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
  logo: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 26,
    fontWeight: "700",
    color: Colors.gold,
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  wicksBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  wicksText: {
    color: Colors.gold,
    fontSize: 12,
    fontWeight: "600",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 12,
    color: Colors.textMuted,
    letterSpacing: 3,
    fontWeight: "600",
    marginBottom: 16,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
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
  timerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timerText: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bidRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  bidText: {
    color: Colors.textMuted,
    fontSize: 13,
  },
});

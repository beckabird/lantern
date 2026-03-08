import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, Platform, ImageBackground, Dimensions,
} from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { Colors } from "../../src/constants/colors";
import { MOCK_AUCTIONS, Auction } from "../../src/data/mockData";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 32;

function formatCountdown(ms: number) {
  if (ms <= 0) return "ENDED";
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function AuctionCard({ auction }: { auction: Auction }) {
  const [msLeft, setMsLeft] = useState(auction.endsAt - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setMsLeft(auction.endsAt - Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, [auction.endsAt]);

  return (
    <TouchableOpacity
      style={cardStyles.card}
      onPress={() => router.push(`/flicker/${auction.id}` as any)}
      activeOpacity={0.9}
    >
      <ImageBackground
        source={{ uri: auction.imageUrl }}
        style={cardStyles.image}
        imageStyle={{ borderRadius: 16 }}
      >
        <View style={cardStyles.overlay} />
        <View style={cardStyles.topRow}>
          <View style={cardStyles.categoryPill}>
            <Text style={cardStyles.categoryText}>{auction.category}</Text>
          </View>
          <View style={cardStyles.countdownBadge}>
            <Text style={cardStyles.countdownText}>⏱ {formatCountdown(msLeft)}</Text>
          </View>
        </View>
        <View style={cardStyles.bottomArea}>
          <Text style={cardStyles.title}>{auction.title}</Text>
          <Text style={cardStyles.location}>📍 {auction.location}</Text>
          <View style={cardStyles.bidRow}>
            <View>
              <Text style={cardStyles.bidLabel}>CURRENT BID</Text>
              <Text style={cardStyles.bidAmount}>🕯 {auction.currentBid} wicks</Text>
            </View>
            <TouchableOpacity
              style={cardStyles.bidBtn}
              onPress={() => router.push(`/flicker/${auction.id}` as any)}
              activeOpacity={0.85}
            >
              <Text style={cardStyles.bidBtnText}>Bid Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  image: {
    width: "100%",
    height: 280,
    justifyContent: "space-between",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10,10,26,0.55)",
    borderRadius: 16,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  categoryPill: {
    backgroundColor: "rgba(201,168,76,0.25)",
    borderWidth: 1,
    borderColor: Colors.gold,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  categoryText: {
    color: Colors.gold,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  countdownBadge: {
    backgroundColor: "rgba(10,10,26,0.7)",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  countdownText: {
    color: Colors.textCream,
    fontSize: 12,
    fontWeight: "600",
  },
  bottomArea: {
    padding: 16,
  },
  title: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 22,
    fontWeight: "700",
    color: Colors.textCream,
    marginBottom: 4,
  },
  location: {
    color: Colors.textMuted,
    fontSize: 13,
    marginBottom: 12,
  },
  bidRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bidLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: "600",
  },
  bidAmount: {
    color: Colors.gold,
    fontSize: 18,
    fontWeight: "700",
    marginTop: 2,
  },
  bidBtn: {
    backgroundColor: Colors.gold,
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  bidBtnText: {
    color: "#1A1200",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});

export default function FeedScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerLine} />
          <Text style={styles.headerTitle}>DATE AUCTIONS</Text>
          <View style={styles.headerLine} />
        </View>
        <View style={styles.wickBadge}>
          <Text style={styles.wickText}>🕯 50</Text>
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {MOCK_AUCTIONS.map((auction) => (
          <AuctionCard key={auction.id} auction={auction} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.goldBorder,
    width: 32,
  },
  headerTitle: {
    color: Colors.gold,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 3,
  },
  wickBadge: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  wickText: {
    color: Colors.gold,
    fontSize: 14,
    fontWeight: "700",
  },
  list: {
    paddingTop: 8,
    paddingBottom: 32,
  },
});

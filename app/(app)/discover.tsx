import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, Platform, Dimensions,
  ImageBackground,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { Colors } from "../../src/constants/colors";
import { MOCK_AUCTIONS } from "../../src/data/mockData";

const FILTERS = ["All", "Romantic", "Cozy", "Playful", "Fancy", "Outdoor"] as const;
const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

function DiscoverCard({ auction }: { auction: typeof MOCK_AUCTIONS[0] }) {
  return (
    <TouchableOpacity
      style={cardStyles.card}
      onPress={() => router.push(`/flicker/${auction.id}` as any)}
      activeOpacity={0.85}
    >
      <ImageBackground
        source={{ uri: auction.imageUrl }}
        style={cardStyles.image}
        imageStyle={{ borderRadius: 12 }}
      >
        <View style={cardStyles.overlay} />
        <View style={cardStyles.pill}>
          <Text style={cardStyles.pillText}>{auction.category}</Text>
        </View>
        <View style={cardStyles.bottom}>
          <Text style={cardStyles.title} numberOfLines={2}>{auction.title}</Text>
          <Text style={cardStyles.bid}>🕯 {auction.currentBid}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
  },
  image: { width: "100%", height: 180, justifyContent: "space-between" },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(10,10,26,0.5)", borderRadius: 12 },
  pill: {
    margin: 8,
    alignSelf: "flex-start",
    backgroundColor: "rgba(201,168,76,0.2)",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
  },
  pillText: { color: Colors.gold, fontSize: 9, fontWeight: "700", letterSpacing: 0.8 },
  bottom: { padding: 8 },
  title: { color: Colors.textCream, fontSize: 12, fontWeight: "700", marginBottom: 2, fontFamily: Platform.OS === "ios" ? "Georgia" : "serif" },
  bid: { color: Colors.gold, fontSize: 12, fontWeight: "600" },
});

export default function DiscoverScreen() {
  const [activeFilter, setActiveFilter] = useState<typeof FILTERS[number]>("All");

  const filtered = activeFilter === "All"
    ? MOCK_AUCTIONS
    : MOCK_AUCTIONS.filter((a) => a.category === activeFilter);

  const pairs: Array<[typeof MOCK_AUCTIONS[0], typeof MOCK_AUCTIONS[0] | undefined]> = [];
  for (let i = 0; i < filtered.length; i += 2) {
    pairs.push([filtered[i], filtered[i + 1]]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={styles.header}>
        <View style={styles.headerLine} />
        <Text style={styles.headerTitle}>DISCOVER</Text>
        <View style={styles.headerLine} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={styles.filterContent}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.chip, activeFilter === f && styles.chipActive]}
            onPress={() => setActiveFilter(f)}
          >
            <Text style={[styles.chipText, activeFilter === f && styles.chipTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.grid}>
        {pairs.map((pair, i) => (
          <View key={i} style={styles.row}>
            <DiscoverCard auction={pair[0]} />
            {pair[1] ? <DiscoverCard auction={pair[1]} /> : <View style={{ width: CARD_WIDTH }} />}
          </View>
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
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  headerLine: { flex: 1, height: 1, backgroundColor: Colors.goldBorder },
  headerTitle: { color: Colors.gold, fontSize: 14, fontWeight: "700", letterSpacing: 3 },
  filterRow: { maxHeight: 52 },
  filterContent: { paddingHorizontal: 16, gap: 8, paddingVertical: 8 },
  chip: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    backgroundColor: "transparent",
  },
  chipActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  chipText: { color: Colors.textMuted, fontSize: 13, fontWeight: "600" },
  chipTextActive: { color: "#1A1200" },
  grid: { paddingHorizontal: 16, paddingBottom: 32 },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
});

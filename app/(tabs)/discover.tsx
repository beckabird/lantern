import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  Dimensions,
  ImageBackground,
} from "react-native";
import { useState } from "react";
import { Colors } from "../../src/constants/colors";

const { width } = Dimensions.get("window");

const FILTERS = ["All", "Romantic", "Cozy", "Playful", "Fancy", "Outdoor"];

const ITEMS = [
  { id: "1", title: "Rooftop Dinner", category: "ROMANTIC", wicks: 15, timer: "02:45", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80", height: 200 },
  { id: "2", title: "Jazz Café Evening", category: "COZY", wicks: 12, timer: "05:20", image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&q=80", height: 170 },
  { id: "3", title: "Cocktail Night", category: "PLAYFUL", wicks: 20, timer: "01:10", image: "https://images.unsplash.com/photo-1470338745628-171cf53de3a8?w=400&q=80", height: 220 },
  { id: "4", title: "Art Gallery Tour", category: "FANCY", wicks: 25, timer: "08:00", image: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=400&q=80", height: 185 },
  { id: "5", title: "Vineyard Escape", category: "ROMANTIC", wicks: 30, timer: "03:30", image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400&q=80", height: 195 },
  { id: "6", title: "Kitchen Experience", category: "COZY", wicks: 18, timer: "06:15", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80", height: 175 },
  { id: "7", title: "Garden Party", category: "OUTDOOR", wicks: 22, timer: "04:00", image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&q=80", height: 210 },
  { id: "8", title: "Sunset Cruise", category: "FANCY", wicks: 35, timer: "01:45", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80", height: 180 },
];

export default function DiscoverScreen() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = activeFilter === "All"
    ? ITEMS
    : ITEMS.filter(i => i.category.toLowerCase() === activeFilter.toLowerCase());

  const leftCol = filtered.filter((_, i) => i % 2 === 0);
  const rightCol = filtered.filter((_, i) => i % 2 !== 0);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={styles.header}>
        <Text style={styles.heading}>Discover</Text>
        <TouchableOpacity style={styles.filterIconBtn}>
          <Text style={styles.filterIconText}>⚙</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterList}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
            onPress={() => setActiveFilter(f)}
          >
            <Text style={[styles.filterChipText, activeFilter === f && styles.filterChipTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.grid}>
        <View style={styles.col}>
          {leftCol.map((item) => (
            <DiscoverCard key={item.id} item={item} />
          ))}
        </View>
        <View style={styles.col}>
          {rightCol.map((item) => (
            <DiscoverCard key={item.id} item={item} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DiscoverCard({ item }: { item: typeof ITEMS[0] }) {
  return (
    <View style={[styles.card, { marginBottom: 12 }]}>
      <ImageBackground
        source={{ uri: item.image }}
        style={[styles.cardImage, { height: item.height }]}
        imageStyle={{ borderRadius: 12 }}
      >
        <View style={styles.cardOverlay} />
        <View style={styles.categoryPill}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
          <View style={styles.cardMeta}>
            <Text style={styles.metaWicks}>🕯 {item.wicks}</Text>
            <Text style={styles.metaTimer}>⏱ {item.timer}</Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  heading: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text,
  },
  filterIconBtn: {
    padding: 8,
  },
  filterIconText: {
    fontSize: 20,
    color: Colors.gold,
  },
  filterScroll: { flexGrow: 0 },
  filterList: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
    flexDirection: "row",
  },
  filterChip: {
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  filterChipActive: {
    backgroundColor: Colors.gold,
    borderColor: Colors.gold,
  },
  filterChipText: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  filterChipTextActive: {
    color: "#1A1200",
  },
  grid: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 12,
  },
  col: { flex: 1 },
  card: {
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(201,168,76,0.3)",
  },
  cardImage: {
    width: "100%",
    justifyContent: "space-between",
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10,10,26,0.5)",
    borderRadius: 12,
  },
  categoryPill: {
    margin: 8,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: Colors.gold,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  categoryText: {
    color: Colors.gold,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  cardInfo: {
    padding: 10,
  },
  cardTitle: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 6,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  cardMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metaWicks: {
    color: Colors.gold,
    fontSize: 11,
    fontWeight: "600",
  },
  metaTimer: {
    color: Colors.textMuted,
    fontSize: 11,
  },
});

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  ImageBackground,
  Dimensions,
} from "react-native";
import { Colors } from "../../src/constants/colors";

const { width } = Dimensions.get("window");

const AUCTIONS = [
  {
    id: "1",
    title: "Rooftop Dinner for Two",
    category: "ROMANTIC",
    timer: "02:45:00",
    wicks: 15,
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
  },
  {
    id: "2",
    title: "Jazz Café Evening",
    category: "COZY",
    timer: "05:20:00",
    wicks: 12,
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&q=80",
  },
  {
    id: "3",
    title: "Cocktail Bar Night",
    category: "PLAYFUL",
    timer: "01:10:00",
    wicks: 20,
    image: "https://images.unsplash.com/photo-1470338745628-171cf53de3a8?w=800&q=80",
  },
  {
    id: "4",
    title: "Art Gallery Tour",
    category: "FANCY",
    timer: "08:00:00",
    wicks: 25,
    image: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&q=80",
  },
  {
    id: "5",
    title: "Vineyard Escape",
    category: "ROMANTIC",
    timer: "03:30:00",
    wicks: 30,
    image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&q=80",
  },
  {
    id: "6",
    title: "Private Kitchen Experience",
    category: "COZY",
    timer: "06:15:00",
    wicks: 18,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
  },
];

export default function FeedScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <View style={styles.decorLine} />
          <Text style={styles.heading}>DATE AUCTION</Text>
          <View style={styles.decorLine} />
        </View>
        <View style={styles.wickBadge}>
          <Text style={styles.wickIcon}>🕯</Text>
          <Text style={styles.wickCount}>50</Text>
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {AUCTIONS.map((item) => (
          <View key={item.id} style={styles.card}>
            <ImageBackground
              source={{ uri: item.image }}
              style={styles.cardImage}
              imageStyle={{ borderRadius: 16 }}
            >
              <View style={styles.cardOverlay} />
              <View style={styles.cardTop}>
                <View style={styles.categoryPill}>
                  <Text style={styles.categoryText}>{item.category}</Text>
                </View>
                <View style={styles.timerPill}>
                  <Text style={styles.timerIcon}>⏱</Text>
                  <Text style={styles.timerText}>{item.timer}</Text>
                </View>
              </View>
              <View style={styles.cardBottom}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <View style={styles.cardActions}>
                  <Text style={styles.wickBid}>🕯 {item.wicks} Wicks — current bid</Text>
                  <TouchableOpacity style={styles.bidBtn} activeOpacity={0.85}>
                    <Text style={styles.bidBtnText}>Bid Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ImageBackground>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  decorLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.goldBorder,
  },
  heading: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.gold,
    letterSpacing: 3,
  },
  wickBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
    marginLeft: 12,
  },
  wickIcon: {
    fontSize: 14,
  },
  wickCount: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.gold,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 16,
  },
  card: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(201,168,76,0.3)",
  },
  cardImage: {
    width: "100%",
    height: 260,
    justifyContent: "space-between",
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10,10,26,0.45)",
    borderRadius: 16,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
  },
  categoryPill: {
    borderWidth: 1,
    borderColor: Colors.gold,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  categoryText: {
    color: Colors.gold,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },
  timerPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(10,10,26,0.75)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },
  timerIcon: {
    fontSize: 10,
  },
  timerText: {
    color: Colors.text,
    fontSize: 11,
    fontWeight: "600",
  },
  cardBottom: {
    padding: 16,
    gap: 10,
  },
  cardTitle: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
  },
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  wickBid: {
    fontSize: 13,
    color: Colors.gold,
    fontWeight: "500",
  },
  bidBtn: {
    backgroundColor: Colors.gold,
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  bidBtnText: {
    color: "#1A1200",
    fontSize: 13,
    fontWeight: "700",
  },
});

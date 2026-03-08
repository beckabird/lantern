import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar,
  Platform, ScrollView, Alert,
} from "react-native";
import { router } from "expo-router";
import { Colors } from "../src/constants/colors";

const OIL_PACKS = [
  { id: '1', name: 'Starter Flame', wicks: 50, price: '$4.99', popular: false },
  { id: '2', name: 'Burning Bright', wicks: 150, price: '$12.99', popular: true },
  { id: '3', name: 'Wildfire', wicks: 350, price: '$24.99', popular: false },
  { id: '4', name: 'Inferno', wicks: 750, price: '$49.99', popular: false },
];

export default function PurchaseOilScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.titleArea}>
          <View style={styles.titleLine} />
          <Text style={styles.title}>GET OIL</Text>
          <View style={styles.titleLine} />
        </View>
        <View style={{ width: 40 }} />
      </View>

      <Text style={styles.subtitle}>Purchase Wicks to place bids on exclusive date auctions</Text>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {OIL_PACKS.map((pack) => (
          <TouchableOpacity
            key={pack.id}
            style={[styles.packCard, pack.popular && styles.packCardPopular]}
            onPress={() => Alert.alert("Coming Soon", "Stripe integration coming soon!")}
            activeOpacity={0.85}
          >
            {pack.popular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
              </View>
            )}
            <View style={styles.packMain}>
              <Text style={styles.packFlame}>🕯</Text>
              <View style={styles.packInfo}>
                <Text style={styles.packName}>{pack.name}</Text>
                <Text style={styles.packWicks}>{pack.wicks} Wicks</Text>
              </View>
              <Text style={styles.packPrice}>{pack.price}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <Text style={styles.disclaimer}>
          Payments are processed securely via Stripe. Wicks are non-refundable and expire after 12 months of account inactivity.
        </Text>
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
  backBtn: { width: 40, padding: 8 },
  backText: { color: Colors.textMuted, fontSize: 24 },
  titleArea: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1, justifyContent: "center" },
  titleLine: { flex: 1, height: 1, backgroundColor: Colors.goldBorder, maxWidth: 32 },
  title: { color: Colors.gold, fontSize: 14, fontWeight: "700", letterSpacing: 3 },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 32,
    marginBottom: 24,
    lineHeight: 22,
  },
  scroll: { paddingHorizontal: 16, paddingBottom: 40, gap: 14 },
  packCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.goldBorder,
    padding: 20,
    position: "relative",
    overflow: "visible",
  },
  packCardPopular: {
    borderColor: Colors.gold,
    borderWidth: 2,
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  popularBadge: {
    position: "absolute",
    top: -12,
    alignSelf: "center",
    backgroundColor: Colors.gold,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  popularBadgeText: { color: "#1A1200", fontSize: 10, fontWeight: "700", letterSpacing: 1 },
  packMain: { flexDirection: "row", alignItems: "center", gap: 14 },
  packFlame: { fontSize: 32 },
  packInfo: { flex: 1 },
  packName: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textCream,
    marginBottom: 2,
  },
  packWicks: { color: Colors.gold, fontSize: 14, fontWeight: "600" },
  packPrice: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 22,
    fontWeight: "700",
    color: Colors.textCream,
  },
  disclaimer: {
    color: Colors.textSubtle,
    fontSize: 11,
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 16,
    marginTop: 8,
  },
});

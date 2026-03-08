import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { Colors } from "../src/constants/colors";

interface OilPack {
  id: string;
  wicks: number;
  price: string;
  label: string;
  badge?: string;
  popular?: boolean;
}

const OIL_PACKS: OilPack[] = [
  {
    id: "starter",
    wicks: 50,
    price: "$4.99",
    label: "Starter",
    badge: "🕯️",
  },
  {
    id: "popular",
    wicks: 150,
    price: "$9.99",
    label: "Popular",
    badge: "🔥",
    popular: true,
  },
  {
    id: "premium",
    wicks: 350,
    price: "$19.99",
    label: "Premium",
    badge: "⭐",
  },
  {
    id: "elite",
    wicks: 800,
    price: "$39.99",
    label: "Elite",
    badge: "👑",
  },
];

export default function PurchaseOilScreen() {
  const [selectedPack, setSelectedPack] = useState<string>("popular");
  const [purchasing, setPurchasing] = useState(false);

  const selected = OIL_PACKS.find((p) => p.id === selectedPack) ?? OIL_PACKS[1];

  function handlePurchase() {
    Alert.alert(
      "Purchase Wicks",
      `Buy ${selected.wicks} Wicks for ${selected.price}?\n\nPayment processing is coming soon.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => {
            setPurchasing(true);
            setTimeout(() => {
              setPurchasing(false);
              Alert.alert(
                "Coming Soon",
                "In-app purchases will be available soon. Stay tuned!",
                [{ text: "OK", onPress: () => router.back() }]
              );
            }, 500);
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Back */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}
          >
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Get Wicks</Text>
            <Text style={styles.subtitle}>POWER YOUR LANTERN</Text>
            <Text style={styles.description}>
              Wicks are Lantern's currency. Use them to bid on dates and propose
              flickers to people you're interested in.
            </Text>
          </View>

          {/* Packs */}
          <View style={styles.packsSection}>
            <Text style={styles.sectionLabel}>CHOOSE A PACK</Text>
            <View style={styles.packsGrid}>
              {OIL_PACKS.map((pack) => (
                <TouchableOpacity
                  key={pack.id}
                  style={[
                    styles.packCard,
                    selectedPack === pack.id && styles.packCardActive,
                    pack.popular && styles.packCardPopular,
                  ]}
                  onPress={() => setSelectedPack(pack.id)}
                  activeOpacity={0.8}
                >
                  {pack.popular && (
                    <View style={styles.popularTag}>
                      <Text style={styles.popularTagText}>BEST VALUE</Text>
                    </View>
                  )}
                  <Text style={styles.packBadge}>{pack.badge}</Text>
                  <Text style={styles.packLabel}>{pack.label}</Text>
                  <Text style={styles.packWicks}>{pack.wicks}</Text>
                  <Text style={styles.packWicksLabel}>wicks</Text>
                  <Text
                    style={[
                      styles.packPrice,
                      selectedPack === pack.id && styles.packPriceActive,
                    ]}
                  >
                    {pack.price}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Selected Summary */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Selected pack</Text>
              <Text style={styles.summaryValue}>
                {selected.wicks} Wicks · {selected.price}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Payment</Text>
              <Text style={styles.summaryNote}>Stripe · Coming soon</Text>
            </View>
          </View>

          {/* FAQ */}
          <View style={styles.faqSection}>
            <Text style={styles.faqTitle}>About Wicks</Text>
            {[
              {
                q: "Do Wicks expire?",
                a: "No. Once purchased, your Wicks never expire.",
              },
              {
                q: "What if my Flicker is rejected?",
                a: "If a Flicker bid is rejected, your Wicks are refunded immediately.",
              },
              {
                q: "Can I earn Wicks for free?",
                a: "Yes! You start with 50 free Wicks and earn bonus Wicks for referring friends.",
              },
            ].map((item, i) => (
              <View key={i} style={styles.faqItem}>
                <Text style={styles.faqQ}>{item.q}</Text>
                <Text style={styles.faqA}>{item.a}</Text>
              </View>
            ))}
          </View>

          {/* CTA */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.btnPrimary, purchasing && styles.btnPrimaryLoading]}
              onPress={handlePurchase}
              disabled={purchasing}
              activeOpacity={0.85}
            >
              <Text style={styles.btnPrimaryText}>
                {purchasing ? "PROCESSING…" : `BUY ${selected.wicks} WICKS · ${selected.price}`}
              </Text>
            </TouchableOpacity>

            <Text style={styles.terms}>
              Payments are processed securely by Stripe. By purchasing you agree
              to our Terms of Service.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 8,
    gap: 24,
  },
  backBtn: {
    paddingTop: 12,
    paddingBottom: 4,
    alignSelf: "flex-start",
  },
  backText: {
    color: Colors.textMuted,
    fontSize: 24,
  },
  header: {
    gap: 8,
  },
  title: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 34,
    fontWeight: "700",
    color: Colors.gold,
  },
  subtitle: {
    fontSize: 10,
    color: Colors.textMuted,
    letterSpacing: 3,
    fontWeight: "600",
  },
  description: {
    fontSize: 14,
    color: Colors.textMuted,
    lineHeight: 22,
    marginTop: 4,
  },
  packsSection: {
    gap: 12,
  },
  sectionLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    letterSpacing: 2,
    fontWeight: "600",
  },
  packsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  packCard: {
    width: "47%",
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: Colors.divider,
    alignItems: "center",
    gap: 4,
    position: "relative",
    overflow: "hidden",
  },
  packCardActive: {
    borderColor: Colors.gold,
    backgroundColor: "rgba(201, 168, 76, 0.05)",
  },
  packCardPopular: {
    borderColor: Colors.goldBorder,
  },
  popularTag: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: Colors.gold,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderBottomLeftRadius: 8,
  },
  popularTagText: {
    color: "#1A1200",
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1,
  },
  packBadge: {
    fontSize: 28,
    marginBottom: 4,
  },
  packLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: "600",
  },
  packWicks: {
    color: Colors.textCream,
    fontSize: 28,
    fontWeight: "700",
  },
  packWicksLabel: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  packPrice: {
    color: Colors.textMuted,
    fontSize: 16,
    fontWeight: "600",
    marginTop: 4,
  },
  packPriceActive: {
    color: Colors.gold,
  },
  summaryCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.divider,
    gap: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  summaryValue: {
    color: Colors.textCream,
    fontSize: 14,
    fontWeight: "600",
  },
  summaryNote: {
    color: Colors.textSubtle,
    fontSize: 13,
  },
  faqSection: {
    gap: 12,
  },
  faqTitle: {
    color: Colors.textMuted,
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: "600",
  },
  faqItem: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.divider,
    gap: 4,
  },
  faqQ: {
    color: Colors.textCream,
    fontSize: 14,
    fontWeight: "600",
  },
  faqA: {
    color: Colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
  },
  actions: {
    gap: 10,
  },
  btnPrimary: {
    backgroundColor: Colors.gold,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
  },
  btnPrimaryLoading: {
    opacity: 0.7,
  },
  btnPrimaryText: {
    color: "#1A1200",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1,
  },
  terms: {
    color: Colors.textSubtle,
    fontSize: 11,
    textAlign: "center",
    lineHeight: 16,
  },
});

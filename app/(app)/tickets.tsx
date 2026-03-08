import {
  View, Text, TouchableOpacity, FlatList, StyleSheet,
  SafeAreaView, StatusBar, Platform,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { Colors } from "../../src/constants/colors";
import { MOCK_TICKETS } from "../../src/data/mockData";

const TIER_COLORS: Record<string, string> = {
  'Starter Flame': '#8B7355',
  'Burning Bright': Colors.gold,
  'Wildfire': '#FF6B35',
  'Inferno': '#FF3333',
};

export default function TicketsScreen() {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const filtered = MOCK_TICKETS.filter((t) => t.status === tab);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={styles.header}>
        <View style={styles.headerLine} />
        <Text style={styles.headerTitle}>TICKET LIT</Text>
        <View style={styles.headerLine} />
      </View>

      <View style={styles.tabRow}>
        {(['upcoming', 'past'] as const).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tabBtn, tab === t && styles.tabBtnActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabBtnText, tab === t && styles.tabBtnTextActive]}>
              {t.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(t) => t.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.ticketCard}
            onPress={() => router.push(`/ticket/${item.id}` as any)}
            activeOpacity={0.85}
          >
            <View style={styles.ticketTop}>
              <Text style={styles.ticketTitle}>{item.title}</Text>
              <View style={[styles.tierBadge, { borderColor: TIER_COLORS[item.tier] }]}>
                <Text style={[styles.tierText, { color: TIER_COLORS[item.tier] }]}>{item.tier}</Text>
              </View>
            </View>
            <View style={styles.ticketBottom}>
              <View style={[styles.partnerAvatar, { backgroundColor: item.partnerAvatarColor }]}>
                <Text style={styles.partnerInitials}>{item.partnerInitials}</Text>
              </View>
              <View style={styles.ticketInfo}>
                <Text style={styles.partnerName}>{item.partner}</Text>
                <Text style={styles.scheduledTime}>{item.scheduledTime}</Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No {tab} tickets</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  headerLine: { flex: 1, height: 1, backgroundColor: Colors.goldBorder },
  headerTitle: { color: Colors.gold, fontSize: 14, fontWeight: "700", letterSpacing: 3 },
  tabRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
  },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 10 },
  tabBtnActive: { backgroundColor: Colors.gold },
  tabBtnText: { color: Colors.textMuted, fontSize: 12, fontWeight: "700", letterSpacing: 1 },
  tabBtnTextActive: { color: "#1A1200" },
  list: { paddingHorizontal: 16, paddingBottom: 32, gap: 12 },
  ticketCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    padding: 16,
    gap: 12,
  },
  ticketTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 8 },
  ticketTitle: {
    flex: 1,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textCream,
  },
  tierBadge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1 },
  tierText: { fontSize: 10, fontWeight: "700", letterSpacing: 0.5 },
  ticketBottom: { flexDirection: "row", alignItems: "center", gap: 10 },
  partnerAvatar: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  partnerInitials: { color: "#fff", fontSize: 13, fontWeight: "700" },
  ticketInfo: { flex: 1 },
  partnerName: { color: Colors.textCream, fontSize: 14, fontWeight: "700" },
  scheduledTime: { color: Colors.textMuted, fontSize: 12, marginTop: 2 },
  arrow: { color: Colors.textMuted, fontSize: 22 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 60 },
  emptyText: { color: Colors.textMuted, fontSize: 15 },
});

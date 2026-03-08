import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  Platform,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { Colors } from "../../src/constants/colors";

type TicketTier = "starter" | "burning_bright" | "wildfire";

interface MockTicket {
  id: string;
  partner: string;
  place: string;
  activity: string;
  scheduledAt: string;
  tier: TicketTier;
  oilSpent: number;
  isPast: boolean;
}

const MOCK_TICKETS: MockTicket[] = [
  {
    id: "1",
    partner: "Alex",
    place: "Café Noir, Downtown",
    activity: "Coffee & conversation",
    scheduledAt: "Tomorrow, 7:00 PM",
    tier: "starter",
    oilSpent: 15,
    isPast: false,
  },
  {
    id: "2",
    partner: "Riley",
    place: "Rooftop Garden",
    activity: "Sunset drinks",
    scheduledAt: "Sat, Mar 15 · 6:30 PM",
    tier: "burning_bright",
    oilSpent: 25,
    isPast: false,
  },
  {
    id: "3",
    partner: "Jordan",
    place: "Art District",
    activity: "Gallery hop",
    scheduledAt: "Feb 28 · 3:00 PM",
    tier: "wildfire",
    oilSpent: 50,
    isPast: true,
  },
];

const TIER_LABELS: Record<TicketTier, string> = {
  starter: "STARTER",
  burning_bright: "BURNING BRIGHT",
  wildfire: "WILDFIRE",
};

const TIER_COLORS: Record<TicketTier, string> = {
  starter: "#8B9FCA",
  burning_bright: "#C9A84C",
  wildfire: "#E87A42",
};

function TicketCard({
  ticket,
  onPress,
}: {
  ticket: MockTicket;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.cardTierBar}>
        <View
          style={[
            styles.tierBadge,
            { backgroundColor: `${TIER_COLORS[ticket.tier]}22`, borderColor: TIER_COLORS[ticket.tier] },
          ]}
        >
          <Text style={[styles.tierText, { color: TIER_COLORS[ticket.tier] }]}>
            {TIER_LABELS[ticket.tier]}
          </Text>
        </View>
        {ticket.isPast && (
          <Text style={styles.pastLabel}>PAST</Text>
        )}
      </View>

      <View style={styles.cardMain}>
        <View style={styles.partnerRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{ticket.partner[0]}</Text>
          </View>
          <View style={styles.partnerInfo}>
            <Text style={styles.partnerName}>{ticket.partner}</Text>
            <Text style={styles.scheduledAt}>{ticket.scheduledAt}</Text>
          </View>
        </View>

        <View style={styles.placeRow}>
          <Text style={styles.placeIcon}>📍</Text>
          <View>
            <Text style={styles.placeName}>{ticket.place}</Text>
            <Text style={styles.activityText}>{ticket.activity}</Text>
          </View>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.oilSpent}>🕯️ {ticket.oilSpent} wicks spent</Text>
        <TouchableOpacity
          style={styles.qrBtn}
          onPress={onPress}
          activeOpacity={0.8}
        >
          <Text style={styles.qrBtnText}>Show QR →</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function TicketsScreen() {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

  const filtered = MOCK_TICKETS.filter((t) =>
    tab === "upcoming" ? !t.isPast : t.isPast
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wick Tickets</Text>
        <Text style={styles.headerSubtitle}>YOUR CONFIRMED DATES</Text>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabBtn, tab === "upcoming" && styles.tabBtnActive]}
          onPress={() => setTab("upcoming")}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabBtnText,
              tab === "upcoming" && styles.tabBtnTextActive,
            ]}
          >
            UPCOMING
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, tab === "past" && styles.tabBtnActive]}
          onPress={() => setTab("past")}
          activeOpacity={0.8}
        >
          <Text
            style={[styles.tabBtnText, tab === "past" && styles.tabBtnTextActive]}
          >
            PAST
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TicketCard
            ticket={item}
            onPress={() => router.push(`/ticket/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🎟️</Text>
            <Text style={styles.emptyText}>
              {tab === "upcoming"
                ? "No upcoming dates"
                : "No past dates yet"}
            </Text>
            <Text style={styles.emptyHint}>
              {tab === "upcoming"
                ? "Accept a flicker to get your first Wick Ticket"
                : "Completed dates will appear here"}
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 28,
    fontWeight: "700",
    color: Colors.gold,
  },
  headerSubtitle: {
    fontSize: 10,
    color: Colors.textMuted,
    letterSpacing: 2,
    marginTop: 2,
  },
  tabBar: {
    flexDirection: "row",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabBtnActive: {
    borderBottomColor: Colors.gold,
  },
  tabBtnText: {
    fontSize: 12,
    color: Colors.textMuted,
    letterSpacing: 2,
    fontWeight: "600",
  },
  tabBtnTextActive: {
    color: Colors.gold,
  },
  list: {
    padding: 16,
    gap: 14,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.divider,
    gap: 14,
  },
  cardTierBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tierBadge: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tierText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },
  pastLabel: {
    color: Colors.textSubtle,
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: "600",
  },
  cardMain: {
    gap: 12,
  },
  partnerRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.goldGlow,
    borderWidth: 1.5,
    borderColor: Colors.goldBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: Colors.gold,
    fontSize: 18,
    fontWeight: "700",
  },
  partnerInfo: {
    flex: 1,
    gap: 2,
  },
  partnerName: {
    color: Colors.textCream,
    fontSize: 16,
    fontWeight: "700",
  },
  scheduledAt: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  placeRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
  },
  placeIcon: {
    fontSize: 16,
    marginTop: 1,
  },
  placeName: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "500",
  },
  activityText: {
    color: Colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: 12,
  },
  oilSpent: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  qrBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    borderRadius: 8,
  },
  qrBtnText: {
    color: Colors.gold,
    fontSize: 13,
    fontWeight: "600",
  },
  empty: {
    alignItems: "center",
    paddingTop: 64,
    gap: 10,
  },
  emptyIcon: {
    fontSize: 48,
    opacity: 0.4,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 16,
    fontWeight: "600",
  },
  emptyHint: {
    color: Colors.textSubtle,
    fontSize: 13,
    textAlign: "center",
    maxWidth: 260,
    lineHeight: 20,
  },
});

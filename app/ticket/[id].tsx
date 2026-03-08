import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Colors } from "../../src/constants/colors";

type TicketTier = "starter" | "burning_bright" | "wildfire";

const MOCK_TICKETS: Record<
  string,
  {
    id: string;
    partner: string;
    place: string;
    activity: string;
    scheduledAt: string;
    tier: TicketTier;
    oilSpent: number;
    isPast: boolean;
    qrSecret: string;
  }
> = {
  "1": {
    id: "1",
    partner: "Alex",
    place: "Café Noir, Downtown",
    activity: "Coffee & conversation",
    scheduledAt: "Tomorrow, 7:00 PM",
    tier: "starter",
    oilSpent: 15,
    isPast: false,
    qrSecret: "TKT-1A2B3C",
  },
  "2": {
    id: "2",
    partner: "Riley",
    place: "Rooftop Garden",
    activity: "Sunset drinks",
    scheduledAt: "Sat, Mar 15 · 6:30 PM",
    tier: "burning_bright",
    oilSpent: 25,
    isPast: false,
    qrSecret: "TKT-4D5E6F",
  },
  "3": {
    id: "3",
    partner: "Jordan",
    place: "Art District",
    activity: "Gallery hop",
    scheduledAt: "Feb 28 · 3:00 PM",
    tier: "wildfire",
    oilSpent: 50,
    isPast: true,
    qrSecret: "TKT-7G8H9I",
  },
};

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

const TIER_DESCRIPTIONS: Record<TicketTier, string> = {
  starter: "A taste of what Lantern is all about.",
  burning_bright: "A memorable evening with someone special.",
  wildfire: "An unforgettable experience, passionately crafted.",
};

/** Simple QR-like grid using a deterministic pattern from the ticket secret */
function QRDisplay({ secret }: { secret: string }) {
  const size = 7;
  const cells = Array.from({ length: size * size }, (_, i) => {
    const charCode = secret.charCodeAt(i % secret.length);
    return (charCode + i * 13) % 3 !== 0;
  });

  const corners = [
    [0, 0], [0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 1], [2, 2],
    [0, 4], [0, 5], [0, 6], [1, 4], [1, 6], [2, 4], [2, 5], [2, 6],
    [4, 0], [4, 1], [4, 2], [5, 0], [5, 2], [6, 0], [6, 1], [6, 2],
  ];
  const cornerSet = new Set(corners.map(([r, c]) => r * size + c));

  return (
    <View style={qrStyles.container}>
      <View style={qrStyles.grid}>
        {cells.map((filled, idx) => {
          const isCorner = cornerSet.has(idx);
          return (
            <View
              key={idx}
              style={[
                qrStyles.cell,
                (filled || isCorner) && qrStyles.cellFilled,
                isCorner && qrStyles.cellCorner,
              ]}
            />
          );
        })}
      </View>
      <Text style={qrStyles.secretText}>{secret}</Text>
    </View>
  );
}

const qrStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 12,
  },
  grid: {
    width: 175,
    height: 175,
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
  },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    backgroundColor: "transparent",
  },
  cellFilled: {
    backgroundColor: "#1A1A1A",
  },
  cellCorner: {
    backgroundColor: "#000000",
  },
  secretText: {
    color: Colors.textSubtle,
    fontSize: 12,
    letterSpacing: 2,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
});

export default function TicketDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const ticket = MOCK_TICKETS[id ?? ""] ?? null;

  if (!ticket) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Ticket not found</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backLink}>← Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const tierColor = TIER_COLORS[ticket.tier];

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
            <Text style={styles.backText}>← Tickets</Text>
          </TouchableOpacity>

          {/* Tier Badge */}
          <View style={styles.tierSection}>
            <View
              style={[
                styles.tierBadge,
                {
                  backgroundColor: `${tierColor}22`,
                  borderColor: tierColor,
                },
              ]}
            >
              <Text style={[styles.tierLabel, { color: tierColor }]}>
                {TIER_LABELS[ticket.tier]}
              </Text>
            </View>
            <Text style={styles.tierDescription}>
              {TIER_DESCRIPTIONS[ticket.tier]}
            </Text>
          </View>

          {/* Partner */}
          <View style={styles.partnerSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{ticket.partner[0]}</Text>
            </View>
            <Text style={styles.partnerName}>{ticket.partner}</Text>
            <Text style={styles.partnerLabel}>your date</Text>
          </View>

          {/* QR Code */}
          {!ticket.isPast && (
            <View style={styles.qrSection}>
              <Text style={styles.qrTitle}>SHOW AT THE DATE</Text>
              <Text style={styles.qrSubtitle}>
                Both of you need to show this QR code to verify your date.
              </Text>
              <QRDisplay secret={ticket.qrSecret} />
            </View>
          )}

          {/* Details */}
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>📍</Text>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>LOCATION</Text>
                <Text style={styles.detailValue}>{ticket.place}</Text>
              </View>
            </View>

            <View style={styles.detailDivider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>🎭</Text>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>ACTIVITY</Text>
                <Text style={styles.detailValue}>{ticket.activity}</Text>
              </View>
            </View>

            <View style={styles.detailDivider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>📅</Text>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>DATE & TIME</Text>
                <Text style={styles.detailValue}>{ticket.scheduledAt}</Text>
              </View>
            </View>

            <View style={styles.detailDivider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>🕯️</Text>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>WICKS SPENT</Text>
                <Text style={styles.detailValue}>
                  {ticket.oilSpent} wicks
                </Text>
              </View>
            </View>
          </View>

          {ticket.isPast && (
            <View style={styles.pastBanner}>
              <Text style={styles.pastBannerText}>
                ✓ This date has passed. We hope it was magical.
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() => router.push("/(app)/tickets")}
            activeOpacity={0.85}
          >
            <Text style={styles.btnSecondaryText}>← Back to Tickets</Text>
          </TouchableOpacity>
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
    gap: 20,
  },
  backBtn: {
    paddingTop: 12,
    paddingBottom: 4,
    alignSelf: "flex-start",
  },
  backText: {
    color: Colors.textMuted,
    fontSize: 15,
  },
  tierSection: {
    alignItems: "center",
    gap: 8,
  },
  tierBadge: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  tierLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
  },
  tierDescription: {
    color: Colors.textMuted,
    fontSize: 13,
    textAlign: "center",
  },
  partnerSection: {
    alignItems: "center",
    gap: 6,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.goldGlow,
    borderWidth: 2,
    borderColor: Colors.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: Colors.gold,
    fontSize: 28,
    fontWeight: "700",
  },
  partnerName: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 24,
    fontWeight: "700",
    color: Colors.textCream,
  },
  partnerLabel: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  qrSection: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
  },
  qrTitle: {
    fontSize: 11,
    color: Colors.gold,
    letterSpacing: 3,
    fontWeight: "600",
  },
  qrSubtitle: {
    color: Colors.textMuted,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 240,
  },
  detailsCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingVertical: 12,
  },
  detailIcon: {
    fontSize: 20,
    marginTop: 2,
  },
  detailContent: {
    flex: 1,
    gap: 3,
  },
  detailLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    letterSpacing: 2,
    fontWeight: "600",
  },
  detailValue: {
    fontSize: 15,
    color: Colors.textCream,
  },
  detailDivider: {
    height: 1,
    backgroundColor: Colors.divider,
  },
  pastBanner: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  pastBannerText: {
    color: Colors.textMuted,
    fontSize: 14,
    textAlign: "center",
  },
  btnSecondary: {
    borderWidth: 1.5,
    borderColor: Colors.divider,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  btnSecondaryText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: "600",
  },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  notFoundText: {
    color: Colors.textMuted,
    fontSize: 16,
  },
  backLink: {
    color: Colors.gold,
    fontSize: 15,
  },
});

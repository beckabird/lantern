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

type FlickerStatus = "pending" | "accepted" | "rejected" | "expired";

interface MockFlicker {
  id: string;
  otherUser: string;
  place: string;
  activity: string;
  oilAmount: number;
  expiresAt: string;
  status: FlickerStatus;
  type: "received" | "sent";
}

const MOCK_FLICKERS: MockFlicker[] = [
  {
    id: "1",
    otherUser: "Alex",
    place: "Café Noir, Downtown",
    activity: "Coffee & conversation",
    oilAmount: 15,
    expiresAt: "2h 30m",
    status: "pending",
    type: "received",
  },
  {
    id: "2",
    otherUser: "Morgan",
    place: "Rooftop Garden",
    activity: "Sunset drinks",
    oilAmount: 25,
    expiresAt: "45m",
    status: "pending",
    type: "received",
  },
  {
    id: "3",
    otherUser: "Jamie",
    place: "Art District Walk",
    activity: "Gallery hop",
    oilAmount: 10,
    expiresAt: "Expired",
    status: "expired",
    type: "sent",
  },
  {
    id: "4",
    otherUser: "Riley",
    place: "Sunset Beach",
    activity: "Evening walk",
    oilAmount: 20,
    expiresAt: "Accepted",
    status: "accepted",
    type: "sent",
  },
];

const STATUS_COLORS: Record<FlickerStatus, string> = {
  pending: Colors.gold,
  accepted: Colors.success,
  rejected: Colors.error,
  expired: Colors.textMuted,
};

const STATUS_LABELS: Record<FlickerStatus, string> = {
  pending: "PENDING",
  accepted: "ACCEPTED",
  rejected: "REJECTED",
  expired: "EXPIRED",
};

function FlickerCard({
  flicker,
  onPress,
}: {
  flicker: MockFlicker;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.cardTop}>
        <View style={styles.cardLeft}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{flicker.otherUser[0]}</Text>
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardUser}>{flicker.otherUser}</Text>
            <Text style={styles.cardPlace}>{flicker.place}</Text>
            <Text style={styles.cardActivity}>{flicker.activity}</Text>
          </View>
        </View>
        <View style={styles.cardRight}>
          <View
            style={[
              styles.statusBadge,
              { borderColor: STATUS_COLORS[flicker.status] },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: STATUS_COLORS[flicker.status] },
              ]}
            >
              {STATUS_LABELS[flicker.status]}
            </Text>
          </View>
          <Text style={styles.oilText}>🕯️ {flicker.oilAmount} wicks</Text>
        </View>
      </View>
      {flicker.status === "pending" && (
        <View style={styles.cardBottom}>
          <Text style={styles.expiresText}>⏱ Expires in {flicker.expiresAt}</Text>
          {flicker.type === "received" && (
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.btnAccept}
                onPress={onPress}
                activeOpacity={0.85}
              >
                <Text style={styles.btnAcceptText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnReject} activeOpacity={0.85}>
                <Text style={styles.btnRejectText}>Decline</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function FlickersScreen() {
  const [tab, setTab] = useState<"received" | "sent">("received");

  const filtered = MOCK_FLICKERS.filter((f) => f.type === tab);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Flickers</Text>
        <Text style={styles.headerSubtitle}>YOUR DATE PROPOSALS</Text>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabBtn, tab === "received" && styles.tabBtnActive]}
          onPress={() => setTab("received")}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabBtnText,
              tab === "received" && styles.tabBtnTextActive,
            ]}
          >
            RECEIVED
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, tab === "sent" && styles.tabBtnActive]}
          onPress={() => setTab("sent")}
          activeOpacity={0.8}
        >
          <Text
            style={[styles.tabBtnText, tab === "sent" && styles.tabBtnTextActive]}
          >
            SENT
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <FlickerCard
            flicker={item}
            onPress={() => router.push(`/flicker/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🕯️</Text>
            <Text style={styles.emptyText}>
              {tab === "received"
                ? "No flickers received yet"
                : "No flickers sent yet"}
            </Text>
            <Text style={styles.emptyHint}>
              {tab === "received"
                ? "Go Lit on the map to start receiving flickers"
                : "Go Lit and tap Send Flicker to propose a date"}
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
    gap: 0,
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
    gap: 12,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.divider,
    gap: 12,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardLeft: {
    flexDirection: "row",
    gap: 12,
    flex: 1,
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
  cardInfo: {
    flex: 1,
    gap: 2,
  },
  cardUser: {
    color: Colors.textCream,
    fontSize: 16,
    fontWeight: "700",
  },
  cardPlace: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  cardActivity: {
    color: Colors.textSubtle,
    fontSize: 12,
  },
  cardRight: {
    alignItems: "flex-end",
    gap: 6,
  },
  statusBadge: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },
  oilText: {
    color: Colors.gold,
    fontSize: 13,
    fontWeight: "600",
  },
  cardBottom: {
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: 12,
  },
  expiresText: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
  },
  btnAccept: {
    flex: 1,
    backgroundColor: Colors.gold,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  btnAcceptText: {
    color: "#1A1200",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
  },
  btnReject: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  btnRejectText: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 1,
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

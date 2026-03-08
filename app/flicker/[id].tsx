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
import { useLocalSearchParams, router } from "expo-router";
import { useState } from "react";
import { Colors } from "../../src/constants/colors";

const MOCK_FLICKERS: Record<
  string,
  {
    id: string;
    otherUser: string;
    place: string;
    activity: string;
    oilAmount: number;
    expiresAt: string;
    status: string;
    type: "received" | "sent";
    proposedAt: string;
    message?: string;
  }
> = {
  "1": {
    id: "1",
    otherUser: "Alex",
    place: "Café Noir, Downtown",
    activity: "Coffee & conversation",
    oilAmount: 15,
    expiresAt: "2h 30m",
    status: "pending",
    type: "received",
    proposedAt: "Sunday, 7:00 PM",
    message: "Hey! I'd love to grab coffee and chat. I know a great quiet spot.",
  },
  "2": {
    id: "2",
    otherUser: "Morgan",
    place: "Rooftop Garden",
    activity: "Sunset drinks",
    oilAmount: 25,
    expiresAt: "45m",
    status: "pending",
    type: "received",
    proposedAt: "Saturday, 6:30 PM",
    message: "The view from this rooftop is stunning at sunset.",
  },
  "3": {
    id: "3",
    otherUser: "Jamie",
    place: "Art District Walk",
    activity: "Gallery hop",
    oilAmount: 10,
    expiresAt: "Expired",
    status: "expired",
    type: "sent",
    proposedAt: "Last Friday, 3:00 PM",
  },
  "4": {
    id: "4",
    otherUser: "Riley",
    place: "Sunset Beach",
    activity: "Evening walk",
    oilAmount: 20,
    expiresAt: "Accepted",
    status: "accepted",
    type: "sent",
    proposedAt: "Tomorrow, 7:30 PM",
  },
  new: {
    id: "new",
    otherUser: "Someone nearby",
    place: "Choose a location",
    activity: "Suggest an activity",
    oilAmount: 10,
    expiresAt: "—",
    status: "draft",
    type: "sent",
    proposedAt: "—",
  },
};

export default function FlickerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const flicker = MOCK_FLICKERS[id ?? ""] ?? null;
  const [accepted, setAccepted] = useState(false);
  const [rejected, setRejected] = useState(false);

  if (!flicker) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Flicker not found</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backLink}>← Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  function handleAccept() {
    Alert.alert("Accept Flicker?", "You'll be matched with this person for the proposed date.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Accept",
        onPress: () => {
          setAccepted(true);
        },
      },
    ]);
  }

  function handleReject() {
    Alert.alert("Decline Flicker?", "This flicker will be declined.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Decline",
        style: "destructive",
        onPress: () => {
          setRejected(true);
        },
      },
    ]);
  }

  const isPending = flicker.status === "pending" && !accepted && !rejected;
  const isReceived = flicker.type === "received";

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
            <Text style={styles.backText}>← Flickers</Text>
          </TouchableOpacity>

          {/* Status Banner */}
          {accepted && (
            <View style={styles.acceptedBanner}>
              <Text style={styles.acceptedBannerText}>
                🎉 Flicker Accepted! A Wick Ticket has been created.
              </Text>
            </View>
          )}
          {rejected && (
            <View style={styles.rejectedBanner}>
              <Text style={styles.rejectedBannerText}>
                Flicker declined.
              </Text>
            </View>
          )}

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{flicker.otherUser[0]}</Text>
            </View>
            <Text style={styles.otherUser}>{flicker.otherUser}</Text>
            <Text style={styles.directionLabel}>
              {isReceived ? "sent you a flicker" : "you sent a flicker"}
            </Text>
          </View>

          {/* Oil Bid */}
          <View style={styles.bidCard}>
            <Text style={styles.bidLabel}>WICKS BID</Text>
            <Text style={styles.bidAmount}>🕯️ {flicker.oilAmount}</Text>
            <Text style={styles.bidSubtext}>wicks</Text>
          </View>

          {/* Details */}
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>📍</Text>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>LOCATION</Text>
                <Text style={styles.detailValue}>{flicker.place}</Text>
              </View>
            </View>

            <View style={styles.detailDivider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>🎭</Text>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>ACTIVITY</Text>
                <Text style={styles.detailValue}>{flicker.activity}</Text>
              </View>
            </View>

            <View style={styles.detailDivider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>📅</Text>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>PROPOSED TIME</Text>
                <Text style={styles.detailValue}>{flicker.proposedAt}</Text>
              </View>
            </View>

            {isPending && (
              <>
                <View style={styles.detailDivider} />
                <View style={styles.detailRow}>
                  <Text style={styles.detailIcon}>⏱️</Text>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>EXPIRES IN</Text>
                    <Text style={[styles.detailValue, { color: Colors.gold }]}>
                      {flicker.expiresAt}
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>

          {/* Message */}
          {flicker.message && (
            <View style={styles.messageCard}>
              <Text style={styles.messageLabel}>MESSAGE</Text>
              <Text style={styles.messageText}>"{flicker.message}"</Text>
            </View>
          )}

          {/* Actions */}
          {isPending && isReceived && (
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.btnAccept}
                onPress={handleAccept}
                activeOpacity={0.85}
              >
                <Text style={styles.btnAcceptText}>ACCEPT FLICKER</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnReject}
                onPress={handleReject}
                activeOpacity={0.85}
              >
                <Text style={styles.btnRejectText}>DECLINE</Text>
              </TouchableOpacity>
            </View>
          )}

          {accepted && (
            <TouchableOpacity
              style={styles.btnPrimary}
              onPress={() => router.replace("/(app)/tickets")}
              activeOpacity={0.85}
            >
              <Text style={styles.btnPrimaryText}>VIEW WICK TICKET →</Text>
            </TouchableOpacity>
          )}
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
    gap: 16,
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
  acceptedBanner: {
    backgroundColor: "rgba(76, 175, 80, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(76, 175, 80, 0.4)",
    borderRadius: 12,
    padding: 14,
  },
  acceptedBannerText: {
    color: Colors.success,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  rejectedBanner: {
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 107, 107, 0.3)",
    borderRadius: 12,
    padding: 14,
  },
  rejectedBannerText: {
    color: Colors.error,
    fontSize: 14,
    textAlign: "center",
  },
  header: {
    alignItems: "center",
    paddingVertical: 8,
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
  otherUser: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 26,
    fontWeight: "700",
    color: Colors.textCream,
  },
  directionLabel: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  bidCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    gap: 4,
  },
  bidLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    letterSpacing: 3,
    fontWeight: "600",
  },
  bidAmount: {
    fontSize: 40,
    fontWeight: "700",
    color: Colors.gold,
  },
  bidSubtext: {
    color: Colors.textMuted,
    fontSize: 13,
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
  messageCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.divider,
    gap: 8,
  },
  messageLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    letterSpacing: 2,
    fontWeight: "600",
  },
  messageText: {
    fontSize: 15,
    color: Colors.textMuted,
    fontStyle: "italic",
    lineHeight: 22,
  },
  actions: {
    gap: 10,
  },
  btnAccept: {
    backgroundColor: Colors.gold,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
  },
  btnAcceptText: {
    color: "#1A1200",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 2,
  },
  btnReject: {
    borderWidth: 1.5,
    borderColor: Colors.divider,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
  },
  btnRejectText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 1,
  },
  btnPrimary: {
    backgroundColor: Colors.gold,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
  },
  btnPrimaryText: {
    color: "#1A1200",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 2,
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

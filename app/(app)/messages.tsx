import {
  View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet,
  SafeAreaView, StatusBar,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { Colors } from "../../src/constants/colors";
import { MOCK_CONVERSATIONS } from "../../src/data/mockData";

export default function MessagesScreen() {
  const [search, setSearch] = useState("");

  const filtered = MOCK_CONVERSATIONS.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) ||
           c.previewText.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={styles.header}>
        <View style={styles.headerLine} />
        <Text style={styles.headerTitle}>MESSAGES</Text>
        <View style={styles.headerLine} />
      </View>

      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search conversations..."
          placeholderTextColor={Colors.textSubtle}
          value={search}
          onChangeText={setSearch}
          selectionColor={Colors.gold}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ paddingBottom: 32 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.convoItem}
            onPress={() => router.push(`/messages/${item.id}` as any)}
            activeOpacity={0.8}
          >
            <View style={[styles.avatar, { backgroundColor: item.avatarColor }]}>
              <Text style={styles.avatarText}>{item.initials}</Text>
            </View>
            <View style={styles.convoBody}>
              <View style={styles.convoTop}>
                <Text style={styles.convoName}>{item.name}</Text>
                <Text style={styles.convoTime}>{item.timestamp}</Text>
              </View>
              <View style={styles.convoBottom}>
                <Text style={styles.convoPreview} numberOfLines={1}>{item.previewText}</Text>
                {item.unread > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{item.unread}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
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
  searchRow: { paddingHorizontal: 16, marginBottom: 8 },
  searchInput: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: Colors.text,
    fontSize: 15,
  },
  convoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  convoBody: { flex: 1 },
  convoTop: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  convoName: { color: Colors.textCream, fontSize: 15, fontWeight: "700" },
  convoTime: { color: Colors.textSubtle, fontSize: 12 },
  convoBottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  convoPreview: { color: Colors.textMuted, fontSize: 13, flex: 1 },
  unreadBadge: {
    backgroundColor: Colors.gold,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  unreadText: { color: "#1A1200", fontSize: 11, fontWeight: "700" },
});

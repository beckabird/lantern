import {
  View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet,
  SafeAreaView, StatusBar, KeyboardAvoidingView, Platform,
} from "react-native";
import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Colors } from "../../src/constants/colors";
import { MOCK_CONVERSATIONS, MOCK_CHAT_MESSAGES } from "../../src/data/mockData";

export default function MessageDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const convo = MOCK_CONVERSATIONS.find((c) => c.id === id) ?? MOCK_CONVERSATIONS[0];
  const initialMessages = MOCK_CHAT_MESSAGES[id ?? '1'] ?? [];
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState("");

  function sendMessage() {
    if (!text.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: String(Date.now()), text: text.trim(), fromMe: true, time: "Now" },
    ]);
    setText("");
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={[styles.avatar, { backgroundColor: convo.avatarColor }]}>
          <Text style={styles.avatarText}>{convo.initials}</Text>
        </View>
        <Text style={styles.convoName}>{convo.name}</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <FlatList
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.messageList}
          renderItem={({ item }) => (
            <View style={[styles.bubble, item.fromMe ? styles.bubbleMe : styles.bubbleThem]}>
              <Text style={[styles.bubbleText, item.fromMe ? styles.bubbleTextMe : styles.bubbleTextThem]}>
                {item.text}
              </Text>
              <Text style={styles.bubbleTime}>{item.time}</Text>
            </View>
          )}
        />

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Type a message..."
            placeholderTextColor={Colors.textSubtle}
            selectionColor={Colors.gold}
            multiline
          />
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage} activeOpacity={0.8}>
            <Text style={styles.sendBtnText}>→</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.goldBorder,
    gap: 10,
  },
  backBtn: { padding: 4, marginRight: 4 },
  backText: { color: Colors.textMuted, fontSize: 24 },
  avatar: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#fff", fontSize: 14, fontWeight: "700" },
  convoName: { color: Colors.textCream, fontSize: 16, fontWeight: "700" },
  messageList: { padding: 16, gap: 8 },
  bubble: {
    maxWidth: "75%",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 4,
  },
  bubbleMe: { alignSelf: "flex-end", backgroundColor: Colors.gold, borderBottomRightRadius: 4 },
  bubbleThem: { alignSelf: "flex-start", backgroundColor: Colors.cardBackground, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: Colors.goldBorder },
  bubbleText: { fontSize: 15, lineHeight: 20 },
  bubbleTextMe: { color: "#1A1200", fontWeight: "600" },
  bubbleTextThem: { color: Colors.textCream },
  bubbleTime: { fontSize: 10, marginTop: 3, opacity: 0.6, color: Colors.textMuted },
  inputRow: {
    flexDirection: "row",
    padding: 12,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.goldBorder,
    backgroundColor: Colors.background,
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: Colors.text,
    fontSize: 15,
    maxHeight: 100,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnText: { color: "#1A1200", fontSize: 20, fontWeight: "700" },
});

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  TextInput,
  Image,
} from "react-native";
import { Colors } from "../../src/constants/colors";

const CONVERSATIONS = [
  {
    id: "1",
    name: "Sophia Laurent",
    preview: "Can't wait for our rooftop evening! 🕯",
    time: "2m",
    unread: 2,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&q=80",
  },
  {
    id: "2",
    name: "James Whitfield",
    preview: "The jazz café sounds perfect for Friday",
    time: "14m",
    unread: 0,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
  },
  {
    id: "3",
    name: "Elena Marchetti",
    preview: "I won the vineyard auction! 🍷",
    time: "1h",
    unread: 1,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
  },
  {
    id: "4",
    name: "Marcus Cole",
    preview: "Should we meet at 8? The cocktail bar closes at midnight",
    time: "3h",
    unread: 0,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
  },
  {
    id: "5",
    name: "Isabelle Chen",
    preview: "The gallery tour was absolutely wonderful ✨",
    time: "1d",
    unread: 0,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",
  },
];

export default function MessagesScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={styles.header}>
        <Text style={styles.heading}>Messages</Text>
        <TouchableOpacity style={styles.composeBtn}>
          <Text style={styles.composeIcon}>✏️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchWrapper}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search conversations..."
          placeholderTextColor={Colors.textSubtle}
          selectionColor={Colors.gold}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {CONVERSATIONS.map((convo) => (
          <TouchableOpacity key={convo.id} style={styles.row} activeOpacity={0.7}>
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: convo.avatar }} style={styles.avatar} />
              {convo.unread > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{convo.unread}</Text>
                </View>
              )}
            </View>
            <View style={styles.rowContent}>
              <View style={styles.rowTop}>
                <Text style={styles.name}>{convo.name}</Text>
                <Text style={styles.time}>{convo.time}</Text>
              </View>
              <Text
                style={[styles.preview, convo.unread > 0 && styles.previewUnread]}
                numberOfLines={1}
              >
                {convo.preview}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  heading: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text,
  },
  composeBtn: { padding: 8 },
  composeIcon: { fontSize: 20 },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  searchInput: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    color: Colors.text,
    fontSize: 15,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
    gap: 12,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: Colors.goldBorder,
  },
  unreadBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  unreadText: {
    color: "#1A1200",
    fontSize: 10,
    fontWeight: "700",
  },
  rowContent: { flex: 1 },
  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  name: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  time: {
    color: Colors.textSubtle,
    fontSize: 12,
  },
  preview: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  previewUnread: {
    color: Colors.textCream,
    fontWeight: "600",
  },
});

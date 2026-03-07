import { StyleSheet, Text, View, StatusBar } from "react-native";
import { Colors } from "../../src/constants/colors";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <Text style={styles.title}>Lantern</Text>
      <Text style={styles.subtitle}>Main App — Coming Soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.gold,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 8,
    letterSpacing: 1,
  },
});

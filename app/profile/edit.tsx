import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView,
  StatusBar, Platform, ScrollView, Alert, Image,
} from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../../src/constants/colors";

const GENDERS = ["Man", "Woman", "Non-binary", "Other"];

export default function EditProfileScreen() {
  const [displayName, setDisplayName] = useState("Alex Morgan");
  const [bio, setBio] = useState("Looking for meaningful connections 🕯");
  const [gender, setGender] = useState("Man");
  const [dob, setDob] = useState("1995-06-15");
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const name = await AsyncStorage.getItem("displayName");
      if (name) setDisplayName(name);
      const b = await AsyncStorage.getItem("bio");
      if (b) setBio(b);
      const g = await AsyncStorage.getItem("gender");
      if (g) setGender(g);
      const d = await AsyncStorage.getItem("dob");
      if (d) setDob(d);
      const uri = await AsyncStorage.getItem("avatarUri");
      if (uri) setAvatarUri(uri);
    }
    load();
  }, []);

  async function pickPhoto() {
    try {
      const { launchImageLibraryAsync, MediaTypeOptions } = await import("expo-image-picker");
      const result = await launchImageLibraryAsync({
        mediaTypes: MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0].uri) {
        setAvatarUri(result.assets[0].uri);
      }
    } catch {
      Alert.alert("Info", "Image picker not available in this environment.");
    }
  }

  async function save() {
    await AsyncStorage.multiSet([
      ["displayName", displayName],
      ["bio", bio],
      ["gender", gender],
      ["dob", dob],
    ]);
    if (avatarUri) await AsyncStorage.setItem("avatarUri", avatarUri);
    Alert.alert("Saved!", "Your profile has been updated.");
    router.back();
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>EDIT PROFILE</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Avatar */}
        <TouchableOpacity style={styles.avatarSection} onPress={pickPhoto}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarPlaceholderText}>📷</Text>
              <Text style={styles.avatarPlaceholderLabel}>Upload Photo</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>DISPLAY NAME</Text>
            <TextInput style={styles.input} value={displayName} onChangeText={setDisplayName} selectionColor={Colors.gold} placeholderTextColor={Colors.textSubtle} />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>BIO</Text>
            <TextInput style={[styles.input, styles.inputMulti]} value={bio} onChangeText={setBio} multiline numberOfLines={3} selectionColor={Colors.gold} placeholderTextColor={Colors.textSubtle} />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>DATE OF BIRTH</Text>
            <TextInput style={styles.input} value={dob} onChangeText={setDob} placeholder="YYYY-MM-DD" selectionColor={Colors.gold} placeholderTextColor={Colors.textSubtle} />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>GENDER</Text>
            <View style={styles.chipRow}>
              {GENDERS.map((g) => (
                <TouchableOpacity key={g} style={[styles.chip, gender === g && styles.chipActive]} onPress={() => setGender(g)}>
                  <Text style={[styles.chipText, gender === g && styles.chipTextActive]}>{g}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={save} activeOpacity={0.85}>
          <Text style={styles.saveBtnText}>SAVE CHANGES</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: { padding: 8 },
  backText: { color: Colors.textMuted, fontSize: 24 },
  topTitle: { color: Colors.gold, fontSize: 13, fontWeight: "700", letterSpacing: 3 },
  scroll: { paddingBottom: 40 },
  avatarSection: {
    alignItems: "center",
    paddingVertical: 24,
  },
  avatarImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: Colors.gold },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.cardBackground,
    borderWidth: 2,
    borderColor: Colors.goldBorder,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  avatarPlaceholderText: { fontSize: 28 },
  avatarPlaceholderLabel: { color: Colors.textMuted, fontSize: 10, letterSpacing: 1 },
  form: { paddingHorizontal: 16, gap: 20 },
  field: { gap: 8 },
  fieldLabel: { color: Colors.textMuted, fontSize: 11, letterSpacing: 2, fontWeight: "600" },
  input: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: Colors.text,
    fontSize: 15,
  },
  inputMulti: { minHeight: 80, textAlignVertical: "top" },
  chipRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  chip: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
  },
  chipActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  chipText: { color: Colors.textMuted, fontSize: 13 },
  chipTextActive: { color: "#1A1200", fontWeight: "700" },
  saveBtn: {
    marginHorizontal: 16,
    marginTop: 32,
    borderRadius: 28,
    paddingVertical: 18,
    alignItems: "center",
    backgroundColor: Colors.gold,
  },
  saveBtnText: { color: "#1A1200", fontSize: 14, fontWeight: "700", letterSpacing: 2 },
});

import { useRouter } from "expo-router";
import { Home } from "lucide-react-native";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function FeedbackPage() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.title}>Feedback & Complaints</Text>
          <Text style={styles.subtitle}>Coming Soon...</Text>
        </View>
      </ScrollView>

      {/* FAB Home */}
      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fabButton} onPress={() => router.replace("/dashboard/admin")}>
          <Home size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.fabText}>Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f3f4f6" },
  scrollContent: { padding: 16, paddingBottom: 100 },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 24, alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", color: "#1f2937", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#6b7280" },
  fabContainer: { position: "absolute", bottom: 24, left: 0, right: 0, alignItems: "center" },
  fabButton: { backgroundColor: "#1f2937", flexDirection: "row", alignItems: "center", paddingHorizontal: 32, height: 56, borderRadius: 28, elevation: 6 },
  fabText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

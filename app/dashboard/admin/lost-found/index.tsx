import { useRouter } from "expo-router";
import { Home, Image as ImageIcon } from "lucide-react-native";
import React from "react";
import {
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

// --- DATA DUMMY ---
const items = [
  { id: 1, nama: "Kunci Motor", status: "Ditemukan" },
  { id: 2, nama: "Dompet Coklat", status: "Ditemukan" },
  { id: 3, nama: "Helm Bogo", status: "Ditemukan" },
  { id: 4, nama: "Charger Laptop", status: "Ditemukan" },
];

// --- KOMPONEN HELPER ---

// Card untuk setiap item (Grid Item)
const LostItemCard = ({ item }: { item: (typeof items)[0] }) => (
  <View style={styles.card}>
    {/* Image Placeholder */}
    <View style={styles.imagePlaceholder}>
      <ImageIcon size={32} color="#9ca3af" />
    </View>

    <View style={styles.cardContent}>
      <Text style={styles.itemName} numberOfLines={1}>{item.nama}</Text>

      {/* Badge Status */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{item.status}</Text>
      </View>
    </View>
  </View>
);

// --- KOMPONEN UTAMA ---
export default function LostFoundPage() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1f2937" />

      {/* 1. HEADER (Sticky) */}
      <View style={styles.header}>
        <Image
          // Pastikan path ini benar (naik 4 folder)
          source={require("../../../../assets/kostmunity-logo.png")}
          style={styles.headerLogo}
          resizeMode="contain"
          tintColor="white" // Menggantikan filter invert
        />
        <Text style={styles.headerTitle}>Kostmunity</Text>
        <View>
          <Text style={styles.headerSubtitleTop}>Admin</Text>
          <Text style={styles.headerSubtitleBottom}>Dashboard</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* 2. Judul Halaman */}
        <View style={styles.pageTitleContainer}>
          <Text style={styles.pageTitle}>Lost and Found</Text>
          <Text style={styles.pageSubtitle}>Kost Kurnia</Text>
        </View>

        {/* 3. Grid Item */}
        <View style={styles.gridContainer}>
          {items.map((item) => (
            // Wrapper untuk mengatur lebar kolom (50% minus gap)
            <View key={item.id} style={styles.gridItemWrapper}>
              <LostItemCard item={item} />
            </View>
          ))}
        </View>

      </ScrollView>

      {/* Floating Action Button (FAB) */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.fabButton}
          onPress={() => router.replace("/dashboard/admin")}
        >
          <Home size={20} color="#1f2937" style={{ marginRight: 8 }} />
          <Text style={styles.fabText}>Home</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1f2937", // bg-gray-800
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Ruang untuk FAB
  },

  // Header Styles
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1f2937", // bg-gray-800
    paddingTop: Platform.OS === 'android' ? 16 : 8,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#374151", // border-gray-700
    gap: 8,
    zIndex: 50,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  headerLogo: {
    width: 30,
    height: 35,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitleTop: {
    fontSize: 12,
    color: "#d1d5db", // text-gray-300
    fontWeight: "600",
    marginTop: 4,
    lineHeight: 12,
  },
  headerSubtitleBottom: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
    lineHeight: 14,
  },

  // Page Title
  pageTitleContainer: {
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  pageSubtitle: {
    fontSize: 14,
    color: "#9ca3af", // text-gray-400
    marginTop: 4,
  },

  // Grid Container
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12, // Jarak antar card
  },
  gridItemWrapper: {
    width: "48%", // Agar jadi 2 kolom (sedikit kurang dari 50% untuk gap)
  },

  // Card Styles
  card: {
    backgroundColor: "#374151", // bg-gray-700
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4b5563", // border-gray-600
    overflow: "hidden",
    width: "100%",
  },
  imagePlaceholder: {
    width: "100%",
    height: 128, // h-32
    backgroundColor: "#4b5563", // bg-gray-600
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    padding: 12, // p-3
    gap: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },

  // Badge Styles
  badge: {
    backgroundColor: "#e9d5ff", // bg-purple-200
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 12, // text-xs
    fontWeight: "500",
    color: "#6b21a8", // text-purple-800
  },

  // FAB Styles
  fabContainer: {
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  fabButton: {
    backgroundColor: "#e5e7eb", // bg-gray-200
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 32,
    height: 56,
    borderRadius: 28,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    color: "#1f2937", // text-gray-800
    fontSize: 16,
    fontWeight: "600",
  },
});

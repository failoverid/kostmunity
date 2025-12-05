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
const feedback = [
  { id: 1, tanggal: "01/01/25 | 13:30", aduan: "Air di kamar mandi B-05 mati...", status: "Baru Ditanggapi" },
  { id: 2, tanggal: "01/01/25 | 10:15", aduan: "Lampu koridor lantai 2 mati...", status: "Baru Ditanggapi" },
  { id: 3, tanggal: "31/12/24 | 08:00", aduan: "Internet lambat sekali...", status: "Selesai" },
];

// --- KOMPONEN HELPER ---

// 1. Badge Status
const FeedbackStatusBadge = ({ status }: { status: string }) => {
  const isNew = status === "Baru Ditanggapi";
  return (
    <View
      style={[
        styles.badge,
        isNew ? styles.badgeOrange : styles.badgeGreen,
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          isNew ? styles.badgeTextOrange : styles.badgeTextGreen,
        ]}
      >
        {status}
      </Text>
    </View>
  );
};

// 2. Card Aduan
const FeedbackCard = ({ item }: { item: (typeof feedback)[0] }) => (
  <View style={styles.card}>
    <View style={styles.cardContent}>
      {/* Image Placeholder */}
      <View style={styles.imagePlaceholder}>
        <ImageIcon size={24} color="#9ca3af" />
      </View>

      {/* Konten Aduan */}
      <View style={styles.textContainer}>
        <Text style={styles.dateText}>{item.tanggal}</Text>
        <Text style={styles.aduanText} numberOfLines={2}>{item.aduan}</Text>
        <View style={styles.badgeContainer}>
          <FeedbackStatusBadge status={item.status} />
        </View>
      </View>
    </View>
  </View>
);

// --- KOMPONEN UTAMA ---
export default function FeedbackPage() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1f2937" />

      {/* 1. HEADER (Sticky) */}
      <View style={styles.header}>
        <Image
          // Pastikan path ini benar (naik 4 folder dari app/dashboard/admin/feedback)
          source={require("../../../../assets/kostmunity-logo.png")}
          style={styles.headerLogo}
          resizeMode="contain"
          // Trik menggantikan "filter invert": tintColor="white" membuat logo hitam jadi putih
          tintColor="white"
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
          <Text style={styles.pageTitle}>Aduan dan Feedback</Text>
          <Text style={styles.pageSubtitle}>Kost Kurnia</Text>
        </View>

        {/* 3. Daftar Aduan */}
        <View style={styles.listContainer}>
          {feedback.map((item) => (
            <FeedbackCard key={item.id} item={item} />
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
    borderBottomColor: "#374151", // border-gray-700 (sebagai ganti border-black-500)
    gap: 8,
    zIndex: 50,
    elevation: 4, // Shadow android
    shadowColor: "#000", // Shadow iOS
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
    color: "#fff", // text-white-800
  },
  headerSubtitleTop: {
    fontSize: 12,
    color: "#d1d5db", // text-gray-300 approx
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
    fontSize: 20, // text-xl
    fontWeight: "bold",
    color: "#fff",
  },
  pageSubtitle: {
    fontSize: 14, // text-sm
    color: "#9ca3af", // text-gray-400
    marginTop: 4,
  },

  // List & Cards
  listContainer: {
    gap: 12,
  },
  card: {
    backgroundColor: "#374151", // bg-gray-700
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4b5563", // border-gray-600
    overflow: "hidden",
  },
  cardContent: {
    padding: 12,
    flexDirection: "row",
    gap: 12,
  },
  imagePlaceholder: {
    width: 80, // w-20
    height: 80, // h-20
    backgroundColor: "#4b5563", // bg-gray-600
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  dateText: {
    fontSize: 12, // text-xs
    color: "#9ca3af", // text-gray-400
  },
  aduanText: {
    fontSize: 14, // text-sm
    fontWeight: "500",
    color: "#fff",
    lineHeight: 20,
  },
  badgeContainer: {
    flexDirection: "row", // Agar badge tidak stretch
  },

  // Badge Styles
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  badgeOrange: {
    backgroundColor: "#fed7aa", // bg-orange-200
  },
  badgeGreen: {
    backgroundColor: "#bbf7d0", // bg-green-200
  },
  badgeText: {
    fontSize: 10, // text-xs
    fontWeight: "600",
  },
  badgeTextOrange: {
    color: "#9a3412", // text-orange-800
  },
  badgeTextGreen: {
    color: "#166534", // text-green-800
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

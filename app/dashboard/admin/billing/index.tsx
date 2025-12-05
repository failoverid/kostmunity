import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform
} from "react-native";
import { useRouter } from "expo-router";
import { Home, Plus } from "lucide-react-native";

// --- DATA DUMMY ---
const tagihan = [
  { id: 1, nama: "Budi Santoso", total: "1.500K", sisa: "0K", status: "Lunas" },
  { id: 2, nama: "Citra Lestari", total: "1.500K", sisa: "1.500K", status: "Belum Lunas" },
  { id: 3, nama: "Doni Hidayat", total: "1.200K", sisa: "0K", status: "Lunas" },
  { id: 4, nama: "Eka Wijaya", total: "1.200K", sisa: "1.200K", status: "Belum Lunas" },
  { id: 5, nama: "Fajar Nugroho", total: "1.200K", sisa: "0K", status: "Lunas" },
];

// --- KOMPONEN HELPER ---

// 1. Badge Status
const StatusBadge = ({ status }: { status: string }) => {
  const isLunas = status === "Lunas";
  return (
    <View
      style={[
        styles.badge,
        isLunas ? styles.badgeSuccess : styles.badgeDanger,
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          isLunas ? styles.badgeTextSuccess : styles.badgeTextDanger,
        ]}
      >
        {status}
      </Text>
    </View>
  );
};

// 2. Baris Tagihan (Row)
const BillingRow = ({ item }: { item: (typeof tagihan)[0] }) => (
  <View style={styles.rowContainer}>
    {/* Kolom Nama (Flex 2 agar lebih lebar) */}
    <Text style={[styles.rowText, { flex: 2 }]} numberOfLines={1}>
      {item.nama}
    </Text>

    {/* Kolom Total */}
    <Text style={[styles.rowText, styles.textRight, { flex: 1.5, color: '#4b5563' }]}>
      {item.total}
    </Text>

    {/* Kolom Sisa */}
    <Text style={[styles.rowText, styles.textRight, { flex: 1.5, fontWeight: '600' }]}>
      {item.sisa}
    </Text>

    {/* Kolom Status */}
    <View style={{ flex: 2, alignItems: 'flex-end' }}>
      <StatusBadge status={item.status} />
    </View>
  </View>
);

// --- KOMPONEN UTAMA ---
export default function BillingPage() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* 1. Header Halaman */}
        <View style={styles.header}>
          <Image
            // Sesuaikan path ini dengan lokasi file logo Anda
            source={require("../../../../assets/kostmunity-logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Kostmunity</Text>
          <View>
            <Text style={styles.headerSubtitleTop}>Admin</Text>
            <Text style={styles.headerSubtitleBottom}>Dashboard</Text>
          </View>
        </View>

        {/* 2. Card Manajemen Tagihan */}
        <View style={styles.card}>
          {/* Card Header */}
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>Manajemen Tagihan</Text>
              <Text style={styles.cardSubtitle}>Oktober 2025</Text>
            </View>
            <TouchableOpacity style={styles.addButton}>
              <Plus size={14} color="#fff" style={{ marginRight: 4 }} />
              <Text style={styles.addButtonText}>Tambah</Text>
            </TouchableOpacity>
          </View>

          {/* Card Content (Table) */}
          <View style={styles.cardContent}>

            {/* Table Header Row */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeadText, { flex: 2 }]}>Nama</Text>
              <Text style={[styles.tableHeadText, styles.textRight, { flex: 1.5 }]}>Total</Text>
              <Text style={[styles.tableHeadText, styles.textRight, { flex: 1.5 }]}>Sisa</Text>
              <Text style={[styles.tableHeadText, styles.textRight, { flex: 2 }]}>Status</Text>
            </View>

            {/* Table Body */}
            <View style={{ gap: 8 }}>
              {tagihan.map((item) => (
                <BillingRow key={item.id} item={item} />
              ))}
            </View>

          </View>
        </View>

      </ScrollView>

      {/* Floating Action Button (FAB) */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.fabButton}
          onPress={() => router.replace("/dashboard/admin")}
        >
          <Home size={20} color="#fff" style={{ marginRight: 8 }} />
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
    backgroundColor: "#f3f4f6", // bg-gray-100
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
    paddingTop: 16,
    paddingBottom: 24,
    gap: 8,
  },
  logo: {
    width: 30,
    height: 35,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
  },
  headerSubtitleTop: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
    lineHeight: 12,
  },
  headerSubtitleBottom: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1f2937",
    lineHeight: 14,
  },

  // Card Styles
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb", // border-gray-200
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  addButton: {
    backgroundColor: "#1f2937", // bg-gray-800
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },

  // Table Styles
  cardContent: {
    padding: 16,
    backgroundColor: "#f9fafb", // bg-gray-50
  },
  tableHeader: {
    flexDirection: "row",
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  tableHeadText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#6b7280",
  },

  // Row Styles
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  rowText: {
    fontSize: 14,
    color: "#1f2937",
  },
  textRight: {
    textAlign: "right",
  },

  // Badge Styles
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  badgeSuccess: {
    backgroundColor: "#dcfce7", // bg-green-100
  },
  badgeDanger: {
    backgroundColor: "#fee2e2", // bg-red-100
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "600",
  },
  badgeTextSuccess: {
    color: "#15803d", // text-green-700
  },
  badgeTextDanger: {
    color: "#b91c1c", // text-red-700
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
    backgroundColor: "#1f2937",
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
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

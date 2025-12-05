import { useRouter } from "expo-router";
import {
    Home,
    Pencil,
    Plus,
    Trash2
} from "lucide-react-native";
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
const services = [
  { id: 1, nama: "Laundry Kiloan", kontak: "0812-3456-7890" },
  { id: 2, nama: "Catering Sehat", kontak: "0821-4455-6677" },
  { id: 3, nama: "Servis AC", kontak: "0855-1122-3344" },
  { id: 4, nama: "Tukang Galon", kontak: "0877-9988-7766" },
];

// --- KOMPONEN HELPER ---

// 1. Baris Layanan (Row)
const ServiceRow = ({ service }: { service: (typeof services)[0] }) => (
  <View style={styles.rowContainer}>

    {/* Kolom Nama */}
    <Text style={[styles.rowText, { flex: 2 }]} numberOfLines={1}>
      {service.nama}
    </Text>

    {/* Kolom Kontak */}
    <Text style={[styles.rowText, styles.textGray, { flex: 2 }]} numberOfLines={1}>
      {service.kontak}
    </Text>

    {/* Kolom Aksi (Edit/Delete) */}
    <View style={[styles.actionContainer, { flex: 1.5 }]}>
      <TouchableOpacity style={styles.actionButton}>
        <Pencil size={16} color="#2563eb" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton}>
        <Trash2 size={16} color="#dc2626" />
      </TouchableOpacity>
    </View>

  </View>
);

// --- KOMPONEN UTAMA ---
export default function ServicesPage() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />

      {/* 1. HEADER (Sticky) */}
      <View style={styles.header}>
        <Image
          // Pastikan path ini benar (naik 4 folder)
          source={require("../../../../assets/kostmunity-logo.png")}
          style={styles.headerLogo}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>Kostmunity</Text>
        <View>
          <Text style={styles.headerSubtitleTop}>Admin</Text>
          <Text style={styles.headerSubtitleBottom}>Dashboard</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* 2. Card Manajemen Layanan */}
        <View style={styles.card}>
          {/* Card Header */}
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>Manajemen Layanan</Text>
              <Text style={styles.cardSubtitle}>Kost Kurnia</Text>
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
              <Text style={[styles.tableHeadText, { flex: 2 }]}>Kontak</Text>
              <Text style={[styles.tableHeadText, styles.textRight, { flex: 1.5 }]}>Edit</Text>
            </View>

            {/* Table Body */}
            <View style={{ gap: 8 }}>
              {services.map((service) => (
                <ServiceRow key={service.id} service={service} />
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
    backgroundColor: "#fff",
    paddingTop: Platform.OS === 'android' ? 16 : 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    gap: 8,
    zIndex: 50,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerLogo: {
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
    fontWeight: "600",
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
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

  // Table Container Styles
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
  textRight: {
    textAlign: "right",
  },
  textGray: {
    color: "#4b5563",
  },

  // Row Styles
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  rowText: {
    fontSize: 13,
    color: "#1f2937",
  },

  // Action Buttons (Edit/Trash)
  actionContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  actionButton: {
    padding: 6,
    backgroundColor: "#f3f4f6",
    borderRadius: 4,
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

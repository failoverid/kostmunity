import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  StatusBar,
  SafeAreaView,
  Platform
} from "react-native";
import { useRouter } from "expo-router";
import {
  Home,
  Pencil,
  Plus,
  ArrowRight,
  LogOut,
  Check,
  Building2 // Fallback jika logo error
} from "lucide-react-native";

// --- KOMPONEN HELPER ---

// 1. Placeholder Row (Kotak abu-abu loading)
const PlaceholderRow = ({ cols = 3 }) => {
  return (
    <View style={styles.placeholderContainer}>
      {Array.from({ length: cols }).map((_, i) => (
        <View key={i} style={[styles.placeholderBox, { flex: 1 }]} />
      ))}
    </View>
  );
};

// 2. See More Link
const SeeMoreLink = ({ href, router }: { href: string; router: any }) => (
  <TouchableOpacity
    onPress={() => router.push(href)}
    style={styles.seeMoreContainer}
  >
    <Text style={styles.seeMoreText}>Lihat Selengkapnya</Text>
    <ArrowRight size={16} color="#2563eb" style={{ marginLeft: 4 }} />
  </TouchableOpacity>
);

// 3. Stat Box Atas (Gelap)
const StatBox = ({ title, value }: { title: string; value: string }) => (
  <View style={styles.statBox}>
    <Text numberOfLines={1} style={styles.statTitle}>
      {title}
    </Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

// 4. Management Card (Putih)
const ManagementCard = ({
  title,
  href,
  children,
  router,
}: {
  title: string;
  href: string;
  children: React.ReactNode;
  router: any;
}) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>{title}</Text>
      <TouchableOpacity style={styles.addButton}>
        <Plus size={14} color="#fff" style={{ marginRight: 4 }} />
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.cardContent}>
      {children}
      <SeeMoreLink href={href} router={router} />
    </View>
  </View>
);

// 5. Bottom Stat Box (Gelap)
const BottomStatBox = ({
  title,
  count,
  href,
  router,
}: {
  title: string;
  count: number;
  href: string;
  router: any;
}) => (
  <View style={styles.bottomStatBox}>
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{count}</Text>
    </View>
    <Text style={styles.bottomStatTitle}>{title}</Text>
    <TouchableOpacity
      onPress={() => router.push(href)}
      style={styles.bottomLink}
    >
      <Text style={styles.bottomLinkText}>Lihat Selengkapnya</Text>
      <ArrowRight size={12} color="#d1d5db" style={{ marginLeft: 4 }} />
    </TouchableOpacity>
  </View>
);

// --- KOMPONEN UTAMA ---
export default function AdminDashboardPage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [kostName, setKostName] = useState("Kost Kurnia");

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />

      {/* 1. HEADER (Fixed/Sticky di atas ScrollView) */}
      <View style={styles.header}>
        <Image
          // Pastikan path assets benar (naik 3 folder dari app/dashboard/admin)
          source={require("../../../assets/kostmunity-logo.png")}
          style={styles.headerLogo}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>Kostmunity</Text>
        <View style={styles.headerSubtitleContainer}>
          <Text style={styles.headerSubtitleTop}>Admin</Text>
          <Text style={styles.headerSubtitleBottom}>Dashboard</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* 2. NAMA KOST (Editable) */}
        <View style={styles.card}>
          <View style={styles.nameCardContent}>
            {isEditing ? (
              <TextInput
                style={styles.nameInput}
                value={kostName}
                onChangeText={setKostName}
                autoFocus
              />
            ) : (
              <Text style={styles.nameText}>{kostName}</Text>
            )}

            <TouchableOpacity
              onPress={() => setIsEditing(!isEditing)}
              style={styles.iconButton}
            >
              {isEditing ? (
                <Check size={20} color="#16a34a" /> // Green
              ) : (
                <Pencil size={20} color="#6b7280" /> // Gray
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. GRID STATISTIK ATAS */}
        <View style={styles.gridContainer}>
          <View style={{ flex: 1 }}>
            <StatBox title="Kamar Terisi" value="10" />
          </View>
          <View style={{ flex: 1 }}>
            <StatBox title="Tagihan Bulan Ini" value="8" />
          </View>
          <View style={{ flex: 1 }}>
            <StatBox title="Jumlah Aduan" value="3" />
          </View>
        </View>

        {/* 4. MANAJEMEN MEMBER */}
        <ManagementCard
          title="Manajemen Member"
          href="/dashboard/admin/members"
          router={router}
        >
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeadText, { flex: 1 }]}>Nama</Text>
            <Text style={[styles.tableHeadText, { flex: 1 }]}>Kamar</Text>
            <Text style={[styles.tableHeadText, { flex: 1 }]}>Status</Text>
          </View>
          {/* Placeholders */}
          <View style={{ gap: 12 }}>
            <PlaceholderRow cols={3} />
            <PlaceholderRow cols={3} />
            <PlaceholderRow cols={3} />
            <PlaceholderRow cols={3} />
            <PlaceholderRow cols={3} />
          </View>
        </ManagementCard>

        {/* 5. MANAJEMEN TAGIHAN */}
        <ManagementCard
          title="Manajemen Tagihan"
          href="/dashboard/admin/billing"
          router={router}
        >
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeadText, { flex: 1 }]}>Nama</Text>
            <Text style={[styles.tableHeadText, { flex: 1 }]}>Total</Text>
            <Text style={[styles.tableHeadText, { flex: 1 }]}>Status</Text>
            <Text style={[styles.tableHeadText, { flex: 1 }]}>Jatuh Tempo</Text>
          </View>

          <View style={{ gap: 12 }}>
            <PlaceholderRow cols={4} />

            {/* Baris "Lunas" Manual */}
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                <View style={[styles.placeholderBox, { flex: 1 }]} />
                <View style={[styles.placeholderBox, { flex: 1 }]} />
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>Lunas</Text>
                    </View>
                </View>
                <View style={[styles.placeholderBox, { flex: 1 }]} />
            </View>

            <PlaceholderRow cols={4} />
            <PlaceholderRow cols={4} />
          </View>
        </ManagementCard>

        {/* 6. MANAJEMEN LAYANAN */}
        <ManagementCard
          title="Manajemen Layanan"
          href="/dashboard/admin/services"
          router={router}
        >
           <View style={styles.tableHeader}>
            <Text style={[styles.tableHeadText, { flex: 1 }]}>Nama</Text>
            <Text style={[styles.tableHeadText, { flex: 1 }]}>Kontak</Text>
          </View>
          <View style={{ gap: 12 }}>
            <PlaceholderRow cols={2} />
            <PlaceholderRow cols={2} />
            <PlaceholderRow cols={2} />
            <PlaceholderRow cols={2} />
            <PlaceholderRow cols={2} />
          </View>
        </ManagementCard>

        {/* 7. GRID STATISTIK BAWAH */}
        <View style={styles.gridContainer}>
            <View style={{ flex: 1 }}>
                <BottomStatBox
                    title="Lost and Found"
                    count={5}
                    href="/dashboard/admin/lost-found"
                    router={router}
                />
            </View>
            <View style={{ flex: 1 }}>
                <BottomStatBox
                    title="Aduan atau Feedback"
                    count={3}
                    href="/dashboard/admin/feedback"
                    router={router}
                />
            </View>
        </View>

        {/* 8. TOMBOL SIGN OUT */}
        <View style={{ alignItems: 'center', paddingTop: 16, paddingBottom: 32 }}>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                <LogOut size={16} color="#4b5563" style={{ marginRight: 8 }} />
                <Text style={{ color: '#4b5563', fontSize: 14 }}>Sign Out</Text>
            </TouchableOpacity>
        </View>

      </ScrollView>

      {/* 9. FLOATING ACTION BUTTON (FAB) */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
            style={styles.fabButton}
            onPress={() => router.replace("/")} // Kembali ke Home
        >
            <Home size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.fabText}>Home</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

// --- STYLING (Tailwind to React Native) ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f3f4f6", // bg-gray-100
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // pb-24 (memberi ruang untuk FAB)
    gap: 24, // space-y-6
  },

  // Header Style
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingTop: Platform.OS === 'android' ? 40 : 20, // Padding atas status bar
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#6b7280", // border-gray-500
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 50,
    gap: 8,
  },
  headerLogo: {
    width: 30,
    height: 35,
  },
  headerTitle: {
    fontSize: 24, // text-2xl
    fontWeight: "bold",
    color: "#1f2937", // text-gray-800
  },
  headerSubtitleContainer: {
    alignItems: "flex-start",
  },
  headerSubtitleTop: {
    fontSize: 14,
    color: "#4b5563", // text-gray-650 (approx)
    fontWeight: "600",
    marginTop: 4, // mt-1
    lineHeight: 14,
  },
  headerSubtitleBottom: {
    fontSize: 14,
    color: "#1f2937",
    fontWeight: "bold",
    lineHeight: 14,
  },

  // Card Styles
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    overflow: "hidden",
  },
  nameCardContent: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nameText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  nameInput: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    borderBottomWidth: 1,
    borderColor: "#2563eb",
    padding: 0,
    flex: 1,
    marginRight: 8,
  },
  iconButton: {
    padding: 4,
  },

  // Grid
  gridContainer: {
    flexDirection: "row",
    gap: 12,
  },

  // Stat Box
  statBox: {
    backgroundColor: "#1f2937", // bg-gray-800
    padding: 16,
    borderRadius: 8,
    elevation: 3,
  },
  statTitle: {
    fontSize: 12,
    color: "#d1d5db", // text-gray-300
  },
  statValue: {
    fontSize: 24, // 3xl di web besar, di HP 24-30 cukup
    fontWeight: "bold",
    color: "#fff",
    marginTop: 4,
  },

  // Management Card
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  addButton: {
    backgroundColor: "#1f2937",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 12,
  },
  cardContent: {
    padding: 16,
  },
  tableHeader: {
    flexDirection: "row",
    marginBottom: 12,
    gap: 16,
  },
  tableHeadText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },

  // Placeholders
  placeholderContainer: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  placeholderBox: {
    height: 16,
    backgroundColor: "#e5e7eb", // bg-gray-200
    borderRadius: 4,
  },

  // See More
  seeMoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 16,
  },
  seeMoreText: {
    fontSize: 14,
    color: "#2563eb", // text-blue-600
  },

  // Status Badge
  statusBadge: {
    backgroundColor: "#dcfce7", // bg-green-100
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  statusText: {
    color: "#15803d", // text-green-700
    fontSize: 12,
    fontWeight: "500",
  },

  // Bottom Stat Box
  bottomStatBox: {
    backgroundColor: "#1f2937",
    padding: 16,
    borderRadius: 8,
    elevation: 3,
    position: 'relative',
    height: 100, // Biar seragam
    justifyContent: 'space-between'
  },
  bottomStatTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    paddingRight: 20,
  },
  badge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#ef4444", // red-500
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  bottomLink: {
    flexDirection: "row",
    alignItems: "center",
  },
  bottomLinkText: {
    fontSize: 12,
    color: "#d1d5db",
  },

  // FAB (Floating Action Button)
  fabContainer: {
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 100,
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

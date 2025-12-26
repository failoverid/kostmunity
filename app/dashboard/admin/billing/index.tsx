import { useRouter } from "expo-router";
import { ArrowRight, Edit3, Home, Plus, Search, Trash2, Upload, X } from "lucide-react-native";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

// --- FIREBASE IMPORTS ---
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../../../lib/firebase-clients';

// --- IMPORT HOOKS & SERVICES BARU ---
import { useAuth } from "../../../../contexts/AuthContext";
import { useTagihanList } from "../../../../hooks/useTagihan";
import { formatCurrency } from "../../../../lib/formatting";
import type { Tagihan } from "../../../../models/Tagihan";
import { deleteTagihan, updateTagihan } from "../../../../services/tagihanService";

// ==========================================
// HELPER FUNCTIONS
// ==========================================
const formatRupiah = (num: number): string => {
  const formatted = (num / 1000).toFixed(0);
  return `${formatted}K`;
};

const formatStatus = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

// ==========================================
// 2. COMPONENT: ADD BILL MODAL (DIPERBAIKI)
// ==========================================

interface AddBillModalProps {
  visible: boolean;
  onClose: () => void;
  kostId: string;        // TAMBAHAN: Butuh ID Kost
  onSuccess: () => void; // TAMBAHAN: Untuk refresh list setelah simpan
}

const AddBillModal = ({ visible, onClose, kostId, onSuccess }: AddBillModalProps) => {
  const [loading, setLoading] = useState(false);
  const [nama, setNama] = useState("");
  const [kamar, setKamar] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [jatuhTempo, setJatuhTempo] = useState("");

  const handleSave = async () => {
    if (!nama || !kamar || !jumlah || !jatuhTempo) {
      Alert.alert("Mohon Lengkapi Data", "Semua kolom harus diisi.");
      return;
    }

    setLoading(true);
    try {
      const cleanAmount = parseInt(jumlah.replace(/[^0-9]/g, ""));

      await addDoc(collection(db, "tagihan"), {
        memberId: nama,
        room: kamar,
        amount: cleanAmount,
        dueDate: jatuhTempo,
        status: "Belum Lunas",
        createdAt: new Date(),
        kostId: kostId, // PERBAIKAN UTAMA: Menyimpan ID Kost
      });

      Alert.alert("Sukses", "Tagihan berhasil ditambahkan");

      // Reset Form
      setNama(""); setKamar(""); setJumlah(""); setJatuhTempo("");

      // Refresh Data & Tutup Modal
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error adding doc:", error);
      Alert.alert("Error", "Gagal menyimpan data");
    } finally {
      setLoading(false);
    }
  };

  return (
      <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={modalStyles.overlay}>
          <View style={modalStyles.modalContainer}>

            {/* Header Modal */}
            <View style={modalStyles.headerRow}>
              <View style={modalStyles.logoContainer}>
                <Image source={require("../../../../assets/kostmunity-logo.png")} style={modalStyles.logoIcon} resizeMode="contain"/>
                <View>
                  <Text style={modalStyles.logoTextMain}>kostmunity</Text>
                  <Text style={modalStyles.logoTextSub}>billing system</Text>
                </View>
              </View>
              <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
                <X size={20} color="#1f2937" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={modalStyles.formGroup}>
                <TextInput style={modalStyles.input} placeholder="Nama Penghuni" placeholderTextColor="#A0A090" value={nama} onChangeText={setNama} />
                <TextInput style={modalStyles.input} placeholder="Nomor Kamar (ex: A-101)" placeholderTextColor="#A0A090" value={kamar} onChangeText={setKamar} />
                <TextInput style={modalStyles.input} placeholder="Total Tagihan (Rp)" placeholderTextColor="#A0A090" keyboardType="numeric" value={jumlah} onChangeText={setJumlah} />
                <TextInput style={modalStyles.input} placeholder="Jatuh Tempo (ex: 25 Okt)" placeholderTextColor="#A0A090" value={jatuhTempo} onChangeText={setJatuhTempo} />

                <TouchableOpacity style={modalStyles.uploadArea}>
                  <Upload size={24} color="#A0A090" />
                  <Text style={modalStyles.uploadText}>Upload Dokumen Pendukung (Opsional)</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View style={modalStyles.footer}>
              <TouchableOpacity style={modalStyles.submitButton} onPress={handleSave} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff"/> : (
                    <>
                      <Text style={modalStyles.submitButtonText}>Buat Tagihan</Text>
                      <View style={modalStyles.arrowContainer}><ArrowRight size={16} color="#fff" /></View>
                    </>
                )}
              </TouchableOpacity>
            </View>

          </View>
        </KeyboardAvoidingView>
      </Modal>
  );
};

// ==========================================
// 3. COMPONENT: BILLING ROW
// ==========================================

const StatusBadge = ({ status }: { status: string }) => {
  const isLunas = status.toLowerCase() === "paid" || status.toLowerCase() === "lunas";
  return (
      <View style={[
        styles.statusBadge,
        { backgroundColor: isLunas ? '#dcfce7' : '#fee2e2' }
      ]}>
        <Text style={[
          styles.statusText,
          { color: isLunas ? '#059669' : '#dc2626' }
        ]}>
          {status}
        </Text>
      </View>
  );
};

const BillingRow = ({ item }: { item: Tagihan }) => (
    <View style={styles.rowContainer}>
      <Text style={[styles.rowText, { flex: 2 }]} numberOfLines={1}>{item.memberName}</Text>

      <View style={{ flex: 1.5, alignItems: 'center' }}>
        <View style={{ backgroundColor: '#f3f4f6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 }}>
          <Text style={{ fontSize: 13, color: '#374151', fontWeight: '600' }}>{formatCurrency(item.amount)}</Text>
        </View>
      </View>

      <View style={{ flex: 1.5, alignItems: 'center' }}>
        <View style={{ backgroundColor: '#f3f4f6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 }}>
          <Text style={{ fontSize: 13, color: '#374151' }}>{item.dueDate}</Text>
        </View>
      </View>

      <View style={{ flex: 1.5, alignItems: 'center' }}>
        <StatusBadge status={item.status} />
      </View>

      <View style={{ flex: 0.8, alignItems: 'center' }}>
        <TouchableOpacity style={{ padding: 8 }}>
          <Edit3 size={14} color="#6b7280" />
        </TouchableOpacity>
      </View>
    </View>
);

// ==========================================
// 4. MAIN PAGE: BILLING PAGE
// ==========================================

export default function BillingPage() {
  const router = useRouter();
  const { user } = useAuth();

  const kostId = user?.kostId || "kost_kurnia_01";

  const { tagihan: tagihanList, loading, error, refetch } = useTagihanList('kost', kostId);

  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Filter tagihan
  const filteredTagihan = tagihanList.filter((tagihan: Tagihan) => {
    const matchesSearch = (tagihan.memberName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tagihan.room.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || tagihan.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (id: string, newStatus: 'Belum Lunas' | 'Lunas' | 'Terlambat') => {
    try {
      await updateTagihan(id, { status: newStatus });
      Alert.alert("Berhasil", "Status tagihan berhasil diupdate");
      refetch();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Gagal mengupdate status tagihan");
    }
  };

  const handleDeleteTagihan = async (id: string, memberName?: string) => {
    Alert.alert(
      "Hapus Tagihan",
      `Yakin ingin menghapus tagihan ${memberName || 'ini'}?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTagihan(id);
              Alert.alert("Berhasil", "Tagihan berhasil dihapus");
              refetch();
            } catch (error: any) {
              Alert.alert("Error", error.message || "Gagal menghapus tagihan");
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.safeArea, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={{ marginTop: 12, color: "#6b7280" }}>Memuat data tagihan...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.safeArea, { justifyContent: "center", alignItems: "center", padding: 20 }]}>
        <Text style={{ color: "#dc2626", fontSize: 16, textAlign: "center", marginBottom: 20 }}>
          Error: {error.message}
        </Text>
        <TouchableOpacity
          style={{ backgroundColor: "#6366f1", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 }}
          onPress={refetch}
        >
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
        <ScrollView contentContainerStyle={styles.scrollContent}>

          <View style={styles.header}>
            <Image source={require("../../../../assets/kostmunity-logo.png")} style={styles.logo} resizeMode="contain" />
            <Text style={styles.headerTitle}>Kostmunity</Text>
            <View>
              <Text style={styles.headerSubtitleTop}>Admin</Text>
              <Text style={styles.headerSubtitleBottom}>Dashboard</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardTitle}>Manajemen Tagihan</Text>
                <Text style={styles.cardSubtitle}>
                  Total: {tagihanList.length} | Lunas: {tagihanList.filter((t: Tagihan) => t.status === "Lunas").length}
                </Text>
              </View>
              <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Plus size={14} color="#fff" style={{ marginRight: 4 }} />
                <Text style={styles.addButtonText}>Tambah</Text>
              </TouchableOpacity>
            </View>

            <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
              <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#f9fafb", borderRadius: 8, paddingHorizontal: 12, marginBottom: 12 }}>
                <Search size={18} color="#6b7280" />
                <TextInput
                  style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 12, color: "#111827" }}
                  placeholder="Cari nama, kamar..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {["all", "Lunas", "Belum Lunas", "Terlambat"].map((status) => (
                    <TouchableOpacity
                        key={status}
                        style={[styles.filterChip, selectedStatus === status && styles.filterChipActive]}
                        onPress={() => setSelectedStatus(status)}
                    >
                      <Text style={[styles.filterText, selectedStatus === status && styles.filterTextActive]}>
                        {status === "all" ? `Semua (${tagihanList.length})` :
                         status === "Belum Lunas" ? `Belum Bayar (${tagihanList.filter((t: Tagihan) => t.status === "Belum Lunas").length})` :
                         `${status} (${tagihanList.filter((t: Tagihan) => t.status === status).length})`}
                      </Text>
                    </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.cardContent}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeadText, { flex: 2 }]}>Nama</Text>
                <Text style={[styles.tableHeadText, { flex: 1.5, textAlign: 'center' }]}>Kamar</Text>
                <Text style={[styles.tableHeadText, { flex: 1.5, textAlign: 'center' }]}>Total</Text>
                <Text style={[styles.tableHeadText, { flex: 1.5, textAlign: 'center' }]}>Jatuh Tempo</Text>
                <Text style={[styles.tableHeadText, { flex: 1.5, textAlign: 'center' }]}>Status</Text>
                <Text style={[styles.tableHeadText, { flex: 1, textAlign: 'center' }]}>Aksi</Text>
              </View>

              <View style={styles.separator} />

              {filteredTagihan.length === 0 ? (
                  <View style={{ padding: 40, alignItems: "center" }}>
                    <Text style={{ color: "#6b7280", fontSize: 16 }}>
                      {searchQuery ? "Tidak ada tagihan ditemukan" : "Belum ada tagihan"}
                    </Text>
                  </View>
              ) : (
                filteredTagihan.map((item: Tagihan) => (
                    <View key={item.id} style={styles.rowContainer}>
                      <View style={{ flex: 2 }}>
                        <Text style={[styles.rowText, { fontWeight: '600' }]} numberOfLines={1}>
                          {item.memberName}
                        </Text>
                      </View>

                      <View style={{ flex: 1.5, alignItems: 'center' }}>
                        <View style={styles.pillContainer}>
                          <Text style={styles.pillText}>{item.room}</Text>
                        </View>
                      </View>

                      <View style={{ flex: 1.5, alignItems: 'center' }}>
                        <Text style={[styles.rowText, { fontWeight: '700', color: '#059669' }]}>
                          {formatCurrency(item.amount)}
                        </Text>
                      </View>

                      <View style={{ flex: 1.5, alignItems: 'center' }}>
                        <Text style={[styles.rowText, { color: '#6b7280' }]}>
                          {item.dueDate}
                        </Text>
                      </View>

                      <View style={{ flex: 1.5, alignItems: 'center' }}>
                        <StatusBadge status={item.status} />
                      </View>

                      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', gap: 4 }}>
                        {item.status === "Belum Lunas" && (
                          <TouchableOpacity
                            style={[styles.iconBtn, { backgroundColor: '#dcfce7' }]}
                            onPress={() => handleUpdateStatus(item.id, "Lunas")}
                          >
                            <Text style={{ fontSize: 12, color: "#059669", fontWeight: "700" }}>✓</Text>
                          </TouchableOpacity>
                        )}
                        <TouchableOpacity
                          style={[styles.iconBtn, { backgroundColor: '#fee2e2' }]}
                          onPress={() => handleDeleteTagihan(item.id, item.memberName)}
                        >
                          <Trash2 size={12} color="#dc2626" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
              )}
            </View>
          </View>
        </ScrollView>

        <View style={styles.fabContainer}>
          <TouchableOpacity style={styles.fabButton} onPress={() => router.replace("/dashboard/admin")}>
            <Home size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.fabText}>Home</Text>
          </TouchableOpacity>
        </View>

        <AddBillModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            kostId={kostId}        // Kirim ID Kost
            onSuccess={refetch}    // Kirim fungsi refresh
        />
      </SafeAreaView>
  );
}

// ==========================================
// 5. STYLES
// ==========================================

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f3f4f6" },
  scrollContent: { padding: 16, paddingBottom: 100 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingTop: 16, paddingBottom: 24, gap: 8 },
  logo: { width: 30, height: 35 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#1f2937" },
  headerSubtitleTop: { fontSize: 10, color: "#6b7280", lineHeight: 10 },
  headerSubtitleBottom: { fontSize: 10, fontWeight: "bold", color: "#1f2937", lineHeight: 12 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 20, elevation: 2, shadowColor: "#000", shadowOpacity: 0.05 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  cardTitle: { fontSize: 22, fontWeight: "bold", color: "#333", lineHeight: 26 },
  cardSubtitle: { fontSize: 14, color: "#666", marginTop: 4 },
  addButton: { backgroundColor: "#333", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, flexDirection: "row", alignItems: "center" },
  addButtonText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  filterChip: { backgroundColor: "#f3f4f6", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginRight: 8 },
  filterChipActive: { backgroundColor: "#6366f1" },
  filterText: { color: "#6b7280", fontSize: 13, fontWeight: "600" },
  filterTextActive: { color: "#fff" },
  cardContent: {},
  tableHeader: { flexDirection: "row", alignItems: "center", paddingBottom: 12 },
  tableHeadText: { fontSize: 12, fontWeight: "bold", color: "#333" },
  separator: { height: 1, backgroundColor: "#000", marginBottom: 12 },
  rowContainer: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#f0f0f0" },
  rowText: { fontSize: 13, color: "#333", fontWeight: "500" },
  pillContainer: { backgroundColor: "#e5e7eb", paddingVertical: 4, paddingHorizontal: 12, borderRadius: 10 },
  pillText: { fontSize: 11, color: "#374151", fontWeight: "500" },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 11, color: "#fff", fontWeight: "600" },
  iconBtn: { padding: 6, borderRadius: 4 },
  fabContainer: { position: "absolute", bottom: 24, left: 0, right: 0, alignItems: "center" },
  fabButton: { backgroundColor: "#333", flexDirection: "row", alignItems: "center", paddingHorizontal: 24, height: 48, borderRadius: 24, elevation: 5 },
  fabText: { color: "#fff", fontSize: 14, fontWeight: "600" },
});

const modalStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", padding: 20 },
  modalContainer: { width: "100%", backgroundColor: "#FEFCE8", borderRadius: 24, padding: 24, maxHeight: "85%", elevation: 10 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  logoContainer: { flexDirection: "row", alignItems: "center", gap: 8 },
  logoIcon: { width: 32, height: 32 },
  logoTextMain: { fontSize: 18, fontWeight: "bold", color: "#2D2D2A" },
  logoTextSub: { fontSize: 16, fontWeight: "600", color: "#2D2D2A" },
  closeButton: { padding: 4 },
  formGroup: { gap: 12 },
  input: { backgroundColor: "transparent", borderWidth: 1, borderColor: "#E2E2D5", borderRadius: 8, paddingHorizontal: 16, paddingVertical: 14, fontSize: 14, color: "#2D2D2A" },
  uploadArea: { borderWidth: 1, borderColor: "#E2E2D5", borderRadius: 12, height: 100, justifyContent: "center", alignItems: "center", marginTop: 8, backgroundColor: "#FDFFF5", gap: 8 },
  uploadText: { fontSize: 12, color: "#A0A090" },
  footer: { marginTop: 24 },
  submitButton: { backgroundColor: "#D6D6C8", borderRadius: 12, paddingVertical: 14, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 },
  submitButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  arrowContainer: { backgroundColor: "rgba(255,255,255,0.3)", borderRadius: 10, padding: 2 },
});

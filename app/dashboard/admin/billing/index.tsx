import { useRouter } from "expo-router";
import { ArrowRight, Edit3, Home, Upload, X } from "lucide-react-native"; // Tambah Edit3
import React, { useEffect, useState } from "react";
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
import { addDoc, collection, onSnapshot, query } from "firebase/firestore";
// Pastikan path ini benar sesuai struktur folder Anda
import { db } from "../../../../lib/firebase-clients";

// ==========================================
// 1. INTERFACES & HELPERS
// ==========================================

interface TagihanUI {
  id: string;
  nama: string;
  total: string;
  jatuhTempo: string; // Baru: Sesuai gambar tabel
  status: string;
}

export interface TagihanDB {
  memberId: string;
  room: string;
  amount: number;
  dueDate: string;
  status: string;
  createdAt: any;
}

const formatCurrency = (amount: number): string => {
  if (!amount) return "0K";
  // Format ribuan (Contoh: 1500000 -> 1.500K)
  const formatted = (amount / 1000).toLocaleString('id-ID');
  return `${formatted}K`;
};

const formatStatus = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

// ==========================================
// 2. COMPONENT: ADD BILL MODAL (STYLE GAMBAR 2)
// ==========================================

interface AddBillModalProps {
  visible: boolean;
  onClose: () => void;
}

const AddBillModal = ({ visible, onClose }: AddBillModalProps) => {
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
      });

      Alert.alert("Sukses", "Tagihan berhasil ditambahkan");
      setNama(""); setKamar(""); setJumlah(""); setJatuhTempo("");
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
              {/* Pastikan Logo Ada */}
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

              {/* Dummy Upload Area sesuai gambar */}
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
// 3. COMPONENT: BILLING ROW (SESUAI GAMBAR 1)
// ==========================================

const StatusBadge = ({ status }: { status: string }) => {
  const isLunas = status.toLowerCase() === "lunas";
  return (
    <View style={[styles.badge, isLunas ? styles.badgeSuccess : styles.badgeDanger]}>
      <Text style={[styles.badgeText, isLunas ? styles.badgeTextSuccess : styles.badgeTextDanger]}>
        {status}
      </Text>
    </View>
  );
};

const BillingRow = ({ item }: { item: TagihanUI }) => (
  <View style={styles.rowContainer}>
    {/* 1. Nama */}
    <Text style={[styles.rowText, { flex: 2 }]} numberOfLines={1}>{item.nama}</Text>

    {/* 2. Total (Bg Abu rounded di gambar) */}
    <View style={{ flex: 1.5, alignItems: 'center' }}>
        <View style={styles.totalPill}>
            <Text style={styles.totalText}>{item.total}</Text>
        </View>
    </View>

    {/* 3. Jatuh Tempo (Bg Abu rounded di gambar) */}
    <View style={{ flex: 1.5, alignItems: 'center' }}>
        <View style={styles.datePill}>
             <Text style={styles.dateText}>{item.jatuhTempo}</Text>
        </View>
    </View>

    {/* 4. Status */}
    <View style={{ flex: 1.5, alignItems: 'center' }}>
      <StatusBadge status={item.status} />
    </View>

    {/* 5. Edit (Icon) */}
    <View style={{ flex: 0.8, alignItems: 'center' }}>
        <TouchableOpacity style={styles.editIcon}>
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
  const [tagihanList, setTagihanList] = useState<TagihanUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // Menggunakan onSnapshot untuk Realtime update
    const q = query(collection(db, "tagihan"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedData: TagihanUI[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as TagihanDB;
        loadedData.push({
          id: doc.id,
          nama: data.memberId || "Tanpa Nama", // Asumsi memberId menyimpan nama sementara
          total: formatCurrency(data.amount),
          jatuhTempo: data.dueDate || "-",
          status: formatStatus(data.status || "Belum Bayar"),
        });
      });
      setTagihanList(loadedData);
      setLoading(false);
    }, (err) => {
        console.error(err);
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Header App */}
        <View style={styles.header}>
          <Image source={require("../../../../assets/kostmunity-logo.png")} style={styles.logo} resizeMode="contain" />
          <Text style={styles.headerTitle}>Kostmunity</Text>
          <View>
            <Text style={styles.headerSubtitleTop}>Admin</Text>
            <Text style={styles.headerSubtitleBottom}>Dashboard</Text>
          </View>
        </View>

        {/* Card Tagihan */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>Manajemen</Text>
              <Text style={styles.cardTitle}>Tagihan</Text>
              <Text style={styles.cardSubtitle}>Oktober 2025</Text>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
              <Text style={styles.addButtonText}>Tambah +</Text>
            </TouchableOpacity>
          </View>

          {/* Table Content */}
          <View style={styles.cardContent}>
            {/* Table Header - Sesuai Gambar 1 */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeadText, { flex: 2 }]}>Nama</Text>
              <Text style={[styles.tableHeadText, { flex: 1.5, textAlign: 'center' }]}>Total</Text>
              <Text style={[styles.tableHeadText, { flex: 1.5, textAlign: 'center' }]}>Jatuh{'\n'}Tempo</Text>
              <Text style={[styles.tableHeadText, { flex: 1.5, textAlign: 'center' }]}>Status</Text>
              <Text style={[styles.tableHeadText, { flex: 0.8, textAlign: 'center' }]}>Edit</Text>
            </View>

            <View style={styles.separator} />

            {/* List Data */}
            {loading ? (
                <ActivityIndicator style={{marginTop: 20}} color="#333"/>
            ) : tagihanList.length === 0 ? (
                <Text style={{textAlign:'center', marginTop: 20, color:'#999'}}>Belum ada data</Text>
            ) : (
                tagihanList.map((item) => <BillingRow key={item.id} item={item} />)
            )}
          </View>
        </View>
      </ScrollView>

      {/* FAB Home */}
      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fabButton} onPress={() => router.replace("/dashboard/admin")}>
          <Home size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.fabText}>Home</Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <AddBillModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </SafeAreaView>
  );
}

// ==========================================
// 5. STYLES
// ==========================================

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f3f4f6" },
  scrollContent: { padding: 16, paddingBottom: 100 },

  // Header App
  header: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingTop: 16, paddingBottom: 24, gap: 8 },
  logo: { width: 30, height: 35 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#1f2937" },
  headerSubtitleTop: { fontSize: 10, color: "#6b7280", lineHeight: 10 },
  headerSubtitleBottom: { fontSize: 10, fontWeight: "bold", color: "#1f2937", lineHeight: 12 },

  // Card
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 20, elevation: 2, shadowColor: "#000", shadowOpacity: 0.05 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  cardTitle: { fontSize: 22, fontWeight: "bold", color: "#333", lineHeight: 26 },
  cardSubtitle: { fontSize: 14, color: "#666", marginTop: 4 },

  // Tombol Tambah (Hitam Pill)
  addButton: { backgroundColor: "#333", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  addButtonText: { color: "#fff", fontSize: 12, fontWeight: "600" },

  // Table
  cardContent: {},
  tableHeader: { flexDirection: "row", alignItems: "center", paddingBottom: 12 },
  tableHeadText: { fontSize: 12, fontWeight: "bold", color: "#333" },
  separator: { height: 1, backgroundColor: "#000", marginBottom: 12 }, // Garis hitam tegas sesuai gambar

  // Row
  rowContainer: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#f0f0f0" },
  rowText: { fontSize: 13, color: "#333", fontWeight: "500" },

  // Pills (Background abu-abu lonjong untuk Total & Date)
  totalPill: { backgroundColor: "#e5e7eb", paddingVertical: 4, paddingHorizontal: 12, borderRadius: 10, width: '90%', alignItems: 'center' },
  totalText: { fontSize: 11, fontWeight: "bold", color: "#333" },
  datePill: { backgroundColor: "#e5e7eb", paddingVertical: 4, paddingHorizontal: 12, borderRadius: 10, width: '90%', alignItems: 'center' },
  dateText: { fontSize: 11, color: "#555" },

  // Badges Status
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 }, // Kotak rounded, bukan full circle
  badgeSuccess: { backgroundColor: "transparent" }, // Di gambar backgroundnya transparan/putih textnya yg berwarna? atau abu? Saya buat simple
  badgeDanger: { backgroundColor: "transparent" },
  badgeText: { fontSize: 12 },
  badgeTextSuccess: { color: "#666" }, // Sesuai gambar "Lunas" warna abu gelap
  badgeTextDanger: { color: "#666" },  // Sesuai gambar "Belum Lunas" warna abu gelap

  editIcon: { padding: 4, borderWidth: 1, borderColor: '#ccc', borderRadius: 4 },

  // FAB
  fabContainer: { position: "absolute", bottom: 24, left: 0, right: 0, alignItems: "center" },
  fabButton: { backgroundColor: "#333", flexDirection: "row", alignItems: "center", paddingHorizontal: 24, height: 48, borderRadius: 24, elevation: 5 },
  fabText: { color: "#fff", fontSize: 14, fontWeight: "600" },
});

// Styles Khusus Modal (Cream Theme)
const modalStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", padding: 20 },
  modalContainer: { width: "100%", backgroundColor: "#FEFCE8", borderRadius: 24, padding: 24, maxHeight: "85%", elevation: 10 }, // Warna Cream
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

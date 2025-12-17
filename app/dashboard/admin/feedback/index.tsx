import { useRouter } from "expo-router";
import { AlertTriangle, Home, Image as ImageIcon, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
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
import { collection, doc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";
// Pastikan path ini benar (sesuaikan dengan struktur folder Anda)
import { db } from "../../../../lib/firebase-clients";

// ==========================================
// 1. INTERFACE & DATABASE LOGIC
// ==========================================

export interface FeedbackDB {
  id: string;
  memberId: string; // Nama Penghuni
  message: string;  // Isi Aduan
  imageUrl?: string; // URL Foto (Sesuai permintaan gambar 2)
  createdAt: any;    // Firestore Timestamp
  status: 'Baru' | 'Diproses' | 'Selesai';
  priority: 'Umum' | 'Penting' | 'Darurat'; // Klasifikasi Prioritas
  adminResponse?: string; // Tanggapan Admin
}

// Fungsi Update Status/Tanggapan
const updateFeedbackStatus = async (id: string, data: Partial<FeedbackDB>) => {
  try {
    const docRef = doc(db, "feedback", id);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error("Error updating feedback:", error);
    throw error;
  }
};

// Helper: Format Tanggal
const formatDate = (timestamp: any) => {
  if (!timestamp) return "-";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString("id-ID", {
    day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'
  }).replace(/\./g, ':'); // Format: 01/01/25 13:30
};

// ==========================================
// 2. COMPONENT: RESPONSE MODAL
// ==========================================
// Modal untuk Admin memberikan tanggapan dan klasifikasi prioritas
interface ResponseModalProps {
  visible: boolean;
  onClose: () => void;
  item: FeedbackDB | null;
}

const ResponseModal = ({ visible, onClose, item }: ResponseModalProps) => {
  const [response, setResponse] = useState("");
  const [priority, setPriority] = useState<'Umum' | 'Penting' | 'Darurat'>('Umum');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setPriority(item.priority || 'Umum');
      setResponse(item.adminResponse || "");
    }
  }, [item]);

  const handleSubmit = async () => {
    if (!item) return;
    setLoading(true);
    try {
      // Logic: Jika darurat, sistem mencatat prioritas tinggi (simulasi notifikasi)
      await updateFeedbackStatus(item.id, {
        adminResponse: response,
        priority: priority,
        status: 'Diproses' // Update status jadi diproses setelah direspon
      });
      Alert.alert("Berhasil", "Tanggapan telah dikirim ke penghuni.");
      onClose();
    } catch (err) {
      Alert.alert("Error", "Gagal mengirim tanggapan.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tindak Lanjut Aduan</Text>
              <TouchableOpacity onPress={onClose}><X color="#333" size={24} /></TouchableOpacity>
            </View>

            <Text style={styles.label}>Klasifikasi Prioritas:</Text>
            <View style={styles.priorityContainer}>
              {(['Umum', 'Penting', 'Darurat'] as const).map((p) => (
                  <TouchableOpacity
                      key={p}
                      style={[styles.prioBadge, priority === p && styles.prioActive(p)]}
                      onPress={() => setPriority(p)}
                  >
                    <Text style={[styles.prioText, priority === p && { color: '#fff' }]}>{p}</Text>
                  </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Tanggapan Admin:</Text>
            <TextInput
                style={styles.inputArea}
                multiline
                numberOfLines={4}
                placeholder="Tulis tanggapan untuk penghuni..."
                value={response}
                onChangeText={setResponse}
            />

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Kirim Tanggapan</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
  );
};

// ==========================================
// 3. COMPONENT: FEEDBACK CARD
// ==========================================

const FeedbackCard = ({ item, onRespond, onComplete }: { item: FeedbackDB, onRespond: (i: FeedbackDB) => void, onComplete: (id: string) => void }) => {
  // Warna status text
  const isDone = item.status === 'Selesai';

  return (
      <View style={styles.card}>
        <View style={styles.cardInner}>

          {/* Kolom Kiri: Gambar */}
          <View style={styles.imageContainer}>
            {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.feedbackImage} />
            ) : (
                <View style={styles.placeholderImage}>
                  <ImageIcon size={32} color="#9ca3af" />
                </View>
            )}
          </View>

          {/* Kolom Kanan: Konten */}
          <View style={styles.contentContainer}>

            {/* Header Tanggal & Prioritas */}
            <View style={styles.cardHeaderRow}>
              {item.priority === 'Darurat' && <AlertTriangle size={14} color="#ef4444" style={{marginRight:4}} />}
              <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
            </View>

            {/* Isi Pesan (Garis-garis di desain) */}
            <View style={{ gap: 4, marginBottom: 12 }}>
              <Text style={styles.senderName}>{item.memberId}</Text>
              <Text style={styles.messageText} numberOfLines={3}>{item.message}</Text>
              {item.adminResponse && (
                  <Text style={styles.responseText}>↪ Admin: {item.adminResponse}</Text>
              )}
            </View>

            {/* Tombol Aksi (Sesuai Gambar 1) */}
            <View style={styles.actionRow}>
              {/* Tombol Putih: Beri Tanggapan */}
              <TouchableOpacity
                  style={[styles.btnAction, styles.btnWhite]}
                  onPress={() => onRespond(item)}
                  disabled={isDone}
              >
                <Text style={styles.textBtnWhite}>
                  {isDone ? "Sudah Selesai" : "Beri Tanggapan"}
                </Text>
              </TouchableOpacity>

              {/* Tombol Gelap: Tandai Selesai */}
              {!isDone && (
                  <TouchableOpacity style={[styles.btnAction, styles.btnDark]} onPress={() => onComplete(item.id)}>
                    <Text style={styles.textBtnDark}>Tandai Selesai</Text>
                  </TouchableOpacity>
              )}
            </View>

          </View>
        </View>
      </View>
  );
};

// ==========================================
// 4. MAIN PAGE
// ==========================================

export default function FeedbackPage() {
  const router = useRouter();
  const [feedbackList, setFeedbackList] = useState<FeedbackDB[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FeedbackDB | null>(null);

  // REALTIME FETCH
  useEffect(() => {
    // Mengambil data feedback, diurutkan dari yang terbaru
    const q = query(collection(db, "feedback"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: FeedbackDB[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as FeedbackDB);
      });
      setFeedbackList(data);
      setLoading(false);
    }, (error) => {
      console.error(error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handlers
  const handleOpenRespond = (item: FeedbackDB) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleMarkComplete = (id: string) => {
    Alert.alert("Konfirmasi", "Tandai laporan ini sebagai selesai?", [
      { text: "Batal", style: "cancel" },
      { text: "Ya, Selesai", onPress: () => updateFeedbackStatus(id, { status: 'Selesai' }) }
    ]);
  };

  return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#374151" />

        {/* 1. Header Sticky */}
        <View style={styles.header}>
          <Image
              source={require("../../../../assets/kostmunity-logo.png")}
              style={styles.headerLogo}
              resizeMode="contain"
              tintColor="white"
          />
          <Text style={styles.headerTitle}>Kostmunity</Text>
          <View>
            <Text style={styles.headerSubtitleTop}>Admin</Text>
            <Text style={styles.headerSubtitleBottom}>Dashboard</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* 2. Judul */}
          <View style={styles.pageTitleContainer}>
            <Text style={styles.pageTitle}>Aduan dan Feedback</Text>
            <Text style={styles.pageSubtitle}>Kost Kurnia</Text>
          </View>

          {/* 3. List Aduan */}
          <View style={styles.listContainer}>
            {loading ? (
                <ActivityIndicator color="#fff" size="large" style={{marginTop: 20}} />
            ) : feedbackList.length === 0 ? (
                <Text style={{color:'#9ca3af', textAlign:'center', marginTop:20}}>Belum ada aduan.</Text>
            ) : (
                feedbackList.map((item) => (
                    <FeedbackCard
                        key={item.id}
                        item={item}
                        onRespond={handleOpenRespond}
                        onComplete={handleMarkComplete}
                    />
                ))
            )}
          </View>
        </ScrollView>

        {/* FAB Home */}
        <View style={styles.fabContainer}>
          <TouchableOpacity style={styles.fabButton} onPress={() => router.replace("/dashboard/admin")}>
            <Home size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.fabText}>Home</Text>
          </TouchableOpacity>
        </View>

        {/* Modal Response */}
        <ResponseModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            item={selectedItem}
        />

      </SafeAreaView>
  );
}

// ==========================================
// 5. STYLES (DARK THEME)
// ==========================================

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#525252" }, // Background Abu Gelap (Sesuai gambar background luar)
  scrollContent: { padding: 16, paddingBottom: 100 },

  // Header
  header: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#525252", paddingTop: Platform.OS === 'android' ? 16 : 8, paddingBottom: 24, gap: 8 },
  headerLogo: { width: 30, height: 35 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  headerSubtitleTop: { fontSize: 12, color: "#d1d5db" },
  headerSubtitleBottom: { fontSize: 12, fontWeight: "bold", color: "#fff" },

  // Titles - Dalam kotak gelap
  pageTitleContainer: {
    backgroundColor: "#333", // Warna kotak container gelap
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#444"
  },
  pageTitle: { fontSize: 24, fontWeight: "bold", color: "#fff", letterSpacing: -0.5 },
  pageSubtitle: { fontSize: 14, color: "#9ca3af", marginTop: 4 },

  // List Container (Lanjutan kotak gelap)
  listContainer: {
    backgroundColor: "#333", // Container utama gelap
    padding: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    gap: 16,
    minHeight: 500, // Agar terlihat penuh
  },

  // CARD STYLES
  card: {
    backgroundColor: "#d4d4d4", // Warna abu terang (kartu di gambar 1)
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
  },
  cardInner: {
    flexDirection: "row",
    padding: 12,
    gap: 12,
  },
  // Kolom Gambar
  imageContainer: { width: 80, height: 80, borderRadius: 8, overflow: 'hidden', backgroundColor: "#404040" },
  feedbackImage: { width: '100%', height: '100%' },
  placeholderImage: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  // Kolom Konten
  contentContainer: { flex: 1, justifyContent: "space-between" },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'flex-end', alignItems:'center', marginBottom: 4 },
  dateText: { fontSize: 10, fontWeight: "bold", color: "#404040" },

  senderName: { fontSize: 12, fontWeight: "bold", color: "#000" },
  messageText: {
    fontSize: 14,
    fontWeight: "bold", // Style garis tebal
    color: "#171717",
    marginVertical: 2,
    lineHeight: 18
  },
  responseText: { fontSize: 11, color: "#059669", fontStyle: 'italic', marginTop: 2 },

  // Buttons Row
  actionRow: { flexDirection: "row", gap: 8, marginTop: 8 },
  btnAction: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnWhite: { backgroundColor: "#fff" },
  btnDark: { backgroundColor: "#525252" },
  textBtnWhite: { fontSize: 10, fontWeight: "bold", color: "#000" },
  textBtnDark: { fontSize: 10, fontWeight: "bold", color: "#fff" },

  // FAB
  fabContainer: { position: "absolute", bottom: 24, left: 0, right: 0, alignItems: "center" },
  fabButton: { backgroundColor: "#333", flexDirection: "row", alignItems: "center", paddingHorizontal: 32, height: 48, borderRadius: 24, elevation: 6 },
  fabText: { color: "#fff", fontSize: 14, fontWeight: "600" },

  // MODAL STYLES
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: 'center', padding: 20 },
  modalContainer: { backgroundColor: "#fff", borderRadius: 16, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  label: { fontSize: 12, fontWeight: "600", color: "#666", marginBottom: 8 },
  inputArea: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, height: 100, textAlignVertical: 'top', marginBottom: 16 },
  submitBtn: { backgroundColor: "#333", padding: 14, borderRadius: 12, alignItems: 'center' },
  submitBtnText: { color: "#fff", fontWeight: "bold" },

  // Priority Badges in Modal
  priorityContainer: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  prioBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
  prioActive: (type: string) => {
    if (type === 'Darurat') return { backgroundColor: '#ef4444', borderColor: '#ef4444' };
    if (type === 'Penting') return { backgroundColor: '#f97316', borderColor: '#f97316' };
    return { backgroundColor: '#3b82f6', borderColor: '#3b82f6' };
  },
  prioText: { fontSize: 12, color: "#333" },
});
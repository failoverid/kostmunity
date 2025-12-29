import { useRouter } from "expo-router";
import { AlertTriangle, ArrowRight, Home, X } from "lucide-react-native";
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

// --- FIREBASE & AUTH IMPORTS ---
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../../../../contexts/AuthContext";
import { db } from "../../../../lib/firebase-clients";
import {
    createFeedback,
    Feedback,
    getFeedbackByKostId,
    updateFeedback
} from "../../../../services/feedbackService";

// ==========================================
// 1. HELPER FUNCTIONS
// ==========================================

// Helper: Format Tanggal
const formatDate = (timestamp: any) => {
  if (!timestamp) return "-";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString("id-ID", {
    day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'
  }).replace(/\./g, ':');
};

// ==========================================
// 2. COMPONENT: ADD FEEDBACK MODAL
// ==========================================
interface AddModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  kostId: string;
  userId: string;
  userName: string;
}

const AddFeedbackModal = ({ visible, onClose, onSuccess, kostId, userId, userName }: AddModalProps) => {
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState<'complaint' | 'suggestion' | 'praise'>('complaint');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [nama, setNama] = useState(userName || "");

  const handleSubmit = async () => {
    if (!subject || !message) {
      Alert.alert("Mohon Lengkapi", "Judul dan pesan wajib diisi.");
      return;
    }
    setLoading(true);
    try {
      await createFeedback({
        kostId,
        memberId: userId,
        memberName: nama || userName,
        category,
        subject,
        message,
        priority
      });
      Alert.alert("Berhasil", "Laporan Anda telah dikirim.");
      setSubject("");
      setMessage("");
      setCategory('complaint');
      setPriority('medium');
      onSuccess();
      onClose();
    } catch (error: any) {
      Alert.alert("Gagal", error.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={addModalStyles.overlay}>
        <View style={addModalStyles.container}>
          <View style={addModalStyles.headerRow}>
            <View>
              <Text style={addModalStyles.brandTitle}>kostmunity</Text>
              <Text style={addModalStyles.brandSubtitle}>buat laporan</Text>
            </View>
            <TouchableOpacity onPress={onClose}><X color="#1f2937" size={24} /></TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={addModalStyles.formGroup}>
              <TextInput 
                style={addModalStyles.input} 
                placeholder="Nama Pelapor" 
                placeholderTextColor="#A0A090" 
                value={nama} 
                onChangeText={setNama} 
              />

              <TextInput 
                style={addModalStyles.input} 
                placeholder="Kategori (contoh: kebersihan, keamanan, dll)" 
                placeholderTextColor="#A0A090" 
                value={category} 
                onChangeText={setCategory} 
              />

              <TextInput 
                style={addModalStyles.input} 
                placeholder="Judul Laporan" 
                placeholderTextColor="#A0A090" 
                value={subject} 
                onChangeText={setSubject} 
              />

              {/* Priority Selector */}
              <View style={{flexDirection:'row', gap: 8, marginVertical: 4}}>
                {(['low', 'medium', 'high'] as const).map(p => (
                  <TouchableOpacity
                    key={p}
                    style={[
                      addModalStyles.prioBadge,
                      priority === p && { backgroundColor: p === 'high' ? '#ef4444' : p === 'medium' ? '#f97316' : '#3b82f6', borderColor: 'transparent' }
                    ]}
                    onPress={() => setPriority(p)}
                  >
                    <Text style={[addModalStyles.prioText, priority === p && {color:'#fff'}]}>
                      {p === 'low' ? 'Rendah' : p === 'medium' ? 'Sedang' : 'Tinggi'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={[addModalStyles.input, {height: 100, textAlignVertical:'top'}]}
                placeholder="Tulis keluhan atau masukan Anda..."
                placeholderTextColor="#A0A090"
                multiline
                numberOfLines={4}
                value={message}
                onChangeText={setMessage}
              />
            </View>
          </ScrollView>

          <TouchableOpacity style={addModalStyles.submitBtn} onPress={handleSubmit} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff"/> : (
              <>
                <Text style={addModalStyles.submitText}>Kirim Laporan</Text>
                <ArrowRight size={14} color="#fff"/>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// ==========================================
// 3. COMPONENT: RESPONSE MODAL (Admin)
// ==========================================
interface ResponseModalProps {
  visible: boolean;
  onClose: () => void;
  item: Feedback | null;
}

const ResponseModal = ({ visible, onClose, item }: ResponseModalProps) => {
  const [response, setResponse] = useState("");
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('low');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setPriority(item.priority || 'low');
      setResponse(item.response || "");
    }
  }, [item]);

  const handleSubmit = async () => {
    if (!item) return;
    setLoading(true);
    try {
      await updateFeedback(item.id!, {
        response: response,
        priority: priority,
        status: 'in_progress'
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
             {(['low', 'medium', 'high'] as const).map((p) => (
               <TouchableOpacity
                 key={p}
                 style={[styles.prioBadge, priority === p && styles.prioActive(p)]}
                 onPress={() => setPriority(p)}
               >
                 <Text style={[styles.prioText, priority === p && { color: '#fff' }]}>
                   {p === 'low' ? 'Rendah' : p === 'medium' ? 'Sedang' : 'Tinggi'}
                 </Text>
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
// 4. COMPONENT: FEEDBACK CARD
// ==========================================

const FeedbackCard = ({ item, onRespond, onComplete }: { item: Feedback, onRespond: (i: Feedback) => void, onComplete: (id: string) => void }) => {
  const isDone = item.status === 'resolved';
  
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f97316';
      case 'low': return '#3b82f6';
      default: return '#9ca3af';
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardInner}>

        {/* Kolom Kanan: Konten */}
        <View style={styles.contentContainer}>

          <View style={styles.cardHeaderRow}>
             {item.priority === 'high' && <AlertTriangle size={14} color="#ef4444" style={{marginRight:4}} />}
             <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
          </View>

          <View style={{ gap: 4, marginBottom: 12 }}>
             <Text style={styles.senderName}>{item.memberName}</Text>
             <Text style={styles.itemTitle}>{item.subject}</Text>
             <Text style={styles.messageText} numberOfLines={3}>{item.message}</Text>
             {item.response ? (
               <Text style={styles.responseText}>↪ Admin: {item.response}</Text>
             ) : null}
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.btnAction, styles.btnWhite]}
              onPress={() => onRespond(item)}
              disabled={isDone}
            >
              <Text style={styles.textBtnWhite}>{isDone ? "Sudah Selesai" : "Beri Tanggapan"}</Text>
            </TouchableOpacity>

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
// 5. MAIN PAGE
// ==========================================

export default function FeedbackPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [kostName, setKostName] = useState<string>("");

  // Modals
  const [respondModalVisible, setRespondModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Feedback | null>(null);

  // Fetch kost profile to get kost name
  useEffect(() => {
    const fetchKostProfile = async () => {
      if (!user?.kostId) return;
      try {
        const kostDoc = await getDoc(doc(db, "profileKost", user.kostId));
        if (kostDoc.exists()) {
          setKostName(kostDoc.data()?.name || "Kost");
        }
      } catch (error) {
        console.error("Error fetching kost profile:", error);
      }
    };
    fetchKostProfile();
  }, [user?.kostId]);

  // Fetch feedback by kostId
  const fetchFeedback = async () => {
    if (!user?.kostId) {
      setLoading(false);
      return;
    }
    try {
      const data = await getFeedbackByKostId(user.kostId);
      setFeedbackList(data);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [user?.kostId]);

  const handleOpenRespond = (item: Feedback) => {
    setSelectedItem(item);
    setRespondModalVisible(true);
  };

  const handleMarkComplete = async (id: string) => {
    const confirmed = Platform.OS === 'web' 
      ? window.confirm("Tandai laporan ini sebagai selesai?")
      : await new Promise(resolve => {
          Alert.alert("Konfirmasi", "Tandai laporan ini sebagai selesai?", [
            { text: "Batal", style: "cancel", onPress: () => resolve(false) },
            { text: "Ya, Selesai", onPress: () => resolve(true) }
          ]);
        });
    
    if (confirmed) {
      try {
        await updateFeedback(id, { status: 'resolved' });
        fetchFeedback();
      } catch (error) {
        console.error("Error updating feedback:", error);
        Alert.alert("Error", "Gagal mengupdate status");
      }
    }
  };

  if (!user?.kostId) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={{color: '#fff', textAlign: 'center', marginTop: 20}}>
          KostId tidak ditemukan. Silakan login ulang.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#374151" />

      {/* Header Sticky */}
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
        {/* Judul & Tombol Tambah */}
        <View style={styles.pageTitleContainer}>
          <View>
            <Text style={styles.pageTitle}>Aduan dan Feedback</Text>
            <Text style={styles.pageSubtitle}>{kostName || 'Memuat...'}</Text>
          </View>
          <TouchableOpacity style={styles.addHeaderBtn} onPress={() => setAddModalVisible(true)}>
             <Text style={styles.addBtnText}>+ Lapor</Text>
          </TouchableOpacity>
        </View>

        {/* List Aduan */}
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

      {/* Modal Response (Admin) */}
      <ResponseModal
        visible={respondModalVisible}
        onClose={() => setRespondModalVisible(false)}
        item={selectedItem}
      />

      {/* Modal Add Feedback (New) */}
      <AddFeedbackModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSuccess={fetchFeedback}
        kostId={user?.kostId || ''}
        userId={user?.uid || ''}
        userName={user?.nama || 'Admin'}
      />

    </SafeAreaView>
  );
}

// ==========================================
// 6. STYLES
// ==========================================

// Styles untuk Modal Tambah (Cream Theme)
const addModalStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", padding: 20 },
  container: { backgroundColor: "#FEFCE8", borderRadius: 24, padding: 24, maxHeight: "85%", width: "100%" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  brandTitle: { fontSize: 18, fontWeight: "bold", color: "#1f2937" },
  brandSubtitle: { fontSize: 16, fontWeight: "600", color: "#1f2937" },
  formGroup: { gap: 12 },
  input: { backgroundColor: "transparent", borderWidth: 1, borderColor: "#E2E2D5", borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 14, color: "#1f2937" },
  uploadArea: { borderWidth: 1, borderColor: "#E2E2D5", borderRadius: 12, height: 100, justifyContent: "center", alignItems: "center", marginTop: 8, backgroundColor: "#FDFFF5", gap: 8, overflow:'hidden' },
  uploadText: { fontSize: 12, color: "#A0A090" },
  submitBtn: { backgroundColor: "#D6D6C8", marginTop: 20, paddingVertical: 14, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  submitText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  prioBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#E2E2D5' },
  prioText: { fontSize: 12, color: "#333", fontWeight: '600' },
});

// Styles Utama (Dark Theme)
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#525252" },
  scrollContent: { padding: 16, paddingBottom: 100 },

  // Header
  header: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#525252", paddingTop: Platform.OS === 'android' ? 16 : 8, paddingBottom: 24, gap: 8 },
  headerLogo: { width: 30, height: 35 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  headerSubtitleTop: { fontSize: 12, color: "#d1d5db" },
  headerSubtitleBottom: { fontSize: 12, fontWeight: "bold", color: "#fff" },

  // Titles Box (Flex Row now for Button)
  pageTitleContainer: {
    backgroundColor: "#333",
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  pageTitle: { fontSize: 24, fontWeight: "bold", color: "#fff", letterSpacing: -0.5 },
  pageSubtitle: { fontSize: 14, color: "#9ca3af", marginTop: 4 },

  // Header Button (+ Lapor)
  addHeaderBtn: { backgroundColor: "#fff", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
  addBtnText: { color: "#1f2937", fontWeight: "bold", fontSize: 12 },

  // List Container
  listContainer: {
    backgroundColor: "#333",
    padding: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    gap: 16,
    minHeight: 500,
  },

  // CARD STYLES
  card: { backgroundColor: "#d4d4d4", borderRadius: 12, overflow: "hidden", elevation: 2 },
  cardInner: { flexDirection: "row", padding: 12, gap: 12 },
  imageContainer: { width: 80, height: 80, borderRadius: 8, overflow: 'hidden', backgroundColor: "#404040" },
  feedbackImage: { width: '100%', height: '100%' },
  placeholderImage: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  contentContainer: { flex: 1, justifyContent: "space-between" },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'flex-end', alignItems:'center', marginBottom: 4 },
  dateText: { fontSize: 10, fontWeight: "bold", color: "#404040" },
  senderName: { fontSize: 12, fontWeight: "bold", color: "#000" },
  messageText: { fontSize: 14, fontWeight: "bold", color: "#171717", marginVertical: 2, lineHeight: 18 },
  responseText: { fontSize: 11, color: "#059669", fontStyle: 'italic', marginTop: 2 },

  // Buttons Row
  actionRow: { flexDirection: "row", gap: 8, marginTop: 8 },
  btnAction: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  btnWhite: { backgroundColor: "#fff" },
  btnDark: { backgroundColor: "#525252" },
  textBtnWhite: { fontSize: 10, fontWeight: "bold", color: "#000" },
  textBtnDark: { fontSize: 10, fontWeight: "bold", color: "#fff" },

  // FAB
  fabContainer: { position: "absolute", bottom: 24, left: 0, right: 0, alignItems: "center" },
  fabButton: { backgroundColor: "#333", flexDirection: "row", alignItems: "center", paddingHorizontal: 32, height: 48, borderRadius: 24, elevation: 6 },
  fabText: { color: "#fff", fontSize: 14, fontWeight: "600" },

  // ADMIN RESPONSE MODAL STYLES
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: 'center', padding: 20 },
  modalContainer: { backgroundColor: "#fff", borderRadius: 16, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  label: { fontSize: 12, fontWeight: "600", color: "#666", marginBottom: 8 },
  inputArea: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, height: 100, textAlignVertical: 'top', marginBottom: 16 },
  submitBtn: { backgroundColor: "#333", padding: 14, borderRadius: 12, alignItems: 'center' },
  submitBtnText: { color: "#fff", fontWeight: "bold" },
  priorityContainer: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  prioBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
  prioActive: (type: string) => {
    if (type === 'high') return { backgroundColor: '#ef4444', borderColor: '#ef4444' };
    if (type === 'medium') return { backgroundColor: '#f97316', borderColor: '#f97316' };
    return { backgroundColor: '#3b82f6', borderColor: '#3b82f6' };
  },
  prioText: { fontSize: 12, color: "#333" },
});

import { useRouter } from "expo-router";
import { ArrowRight, Home, Pencil, Plus, Trash2, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
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
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
// Pastikan path ini sesuai dengan file firebase-clients.ts Anda
import { db } from "../../../../lib/firebase-clients";

// ==========================================
// 1. LOGIC DATABASE (Adapted from your snippet)
// ==========================================

// Kita menggunakan struktur 'ads' tapi untuk konteks 'services'
export interface ServiceType {
  id: string;
  imageUrl: string;
  title: string;    // Digunakan sebagai NAMA LAYANAN
  link: string;     // Digunakan sebagai KONTAK
  createdAt?: any;
}

// COLLECTION REF
const servicesRef = collection(db, "ads");

// CREATE
async function createService(title: string, link: string) {
  // Image URL di-hardcode atau bisa ditambahkan input upload jika perlu
  const defaultImage = "https://placehold.co/100";
  return await addDoc(servicesRef, {
    imageUrl: defaultImage,
    title: title, // Nama Layanan
    link: link,   // Kontak
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

// UPDATE
async function updateService(id: string, data: Partial<ServiceType>) {
  const ref = doc(db, "ads", id);
  return await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// DELETE
async function deleteService(id: string) {
  const ref = doc(db, "ads", id);
  return await deleteDoc(ref);
}

// ==========================================
// 2. COMPONENT: ADD/EDIT MODAL
// ==========================================
interface ServiceModalProps {
  visible: boolean;
  onClose: () => void;
  editData: ServiceType | null;
}

const ServiceModal = ({ visible, onClose, editData }: ServiceModalProps) => {
  const [loading, setLoading] = useState(false);

  // Form State
  const [nama, setNama] = useState("");   // Maps to title
  const [kontak, setKontak] = useState(""); // Maps to link

  useEffect(() => {
    if (editData) {
      setNama(editData.title);
      setKontak(editData.link);
    } else {
      setNama(""); setKontak("");
    }
  }, [editData, visible]);

  const handleSubmit = async () => {
    if (!nama || !kontak) {
      Alert.alert("Mohon Lengkapi", "Nama Layanan dan Kontak wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      if (editData) {
        // MODE EDIT
        await updateService(editData.id, { title: nama, link: kontak });
        Alert.alert("Berhasil", "Data layanan diperbarui.");
      } else {
        // MODE TAMBAH
        await createService(nama, kontak);
        Alert.alert("Berhasil", "Layanan baru ditambahkan.");
      }
      onClose();
    } catch (error) {
      console.error(error);
      Alert.alert("Gagal", "Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={modalStyles.overlay}>
        <View style={modalStyles.container}>
          <View style={modalStyles.headerRow}>
             <View>
                <Text style={modalStyles.title}>{editData ? "Edit Layanan" : "Tambah Layanan"}</Text>
                <Text style={modalStyles.subtitle}>Info Service Kost</Text>
             </View>
             <TouchableOpacity onPress={onClose}><X color="#1f2937" size={24} /></TouchableOpacity>
          </View>

          <View style={modalStyles.formGroup}>
            <Text style={modalStyles.label}>Nama Layanan</Text>
            <TextInput
              style={modalStyles.input}
              placeholder="Contoh: Laundry Express"
              value={nama}
              onChangeText={setNama}
            />

            <Text style={modalStyles.label}>Kontak / WhatsApp</Text>
            <TextInput
              style={modalStyles.input}
              placeholder="Contoh: 0812-3456-7890"
              keyboardType="phone-pad"
              value={kontak}
              onChangeText={setKontak}
            />
          </View>

          <TouchableOpacity style={modalStyles.submitBtn} onPress={handleSubmit} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff"/> : (
              <>
                 <Text style={modalStyles.submitText}>{editData ? "Simpan Perubahan" : "Simpan Layanan"}</Text>
                 <ArrowRight size={16} color="#fff"/>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// ==========================================
// 3. COMPONENT: SERVICE ROW (SESUAI GAMBAR)
// ==========================================
// Menggunakan style Pill (kotak abu) untuk Nama & Kontak

const ServiceRow = ({ item, onEdit, onDelete }: { item: ServiceType, onEdit: (s: ServiceType) => void, onDelete: (id: string) => void }) => {
  return (
    <View style={styles.rowContainer}>

      {/* 1. Nama (Gray Pill) */}
      <View style={[styles.pillContainer, { flex: 2 }]}>
        <Text style={styles.pillText} numberOfLines={1}>{item.title}</Text>
      </View>

      {/* 2. Kontak (Gray Pill) */}
      <View style={[styles.pillContainer, { flex: 2 }]}>
        <Text style={styles.pillText} numberOfLines={1}>{item.link}</Text>
      </View>

      {/* 3. Actions (Icons) */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => onEdit(item)}>
          <Pencil size={14} color="#2563eb" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={() => onDelete(item.id)}>
          <Trash2 size={14} color="#dc2626" />
        </TouchableOpacity>
      </View>

    </View>
  );
};

// ==========================================
// 4. MAIN PAGE
// ==========================================

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [editingService, setEditingService] = useState<ServiceType | null>(null);

  // FETCH DATA REALTIME
  useEffect(() => {
    // Query ke collection "ads" (sesuai request database Anda)
    const q = query(servicesRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loaded: ServiceType[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        loaded.push({
          id: doc.id,
          title: data.title || "",
          link: data.link || "",
          imageUrl: data.imageUrl || ""
        } as ServiceType);
      });
      setServices(loaded);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching services:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handlers
  const handleAdd = () => {
    setEditingService(null);
    setModalVisible(true);
  };

  const handleEdit = (item: ServiceType) => {
    setEditingService(item);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert("Hapus Layanan", "Apakah Anda yakin ingin menghapus layanan ini?", [
      { text: "Batal", style: "cancel" },
      { text: "Hapus", style: "destructive", onPress: () => deleteService(id) }
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />

      {/* Header */}
      <View style={styles.header}>
        <Image source={require("../../../../assets/kostmunity-logo.png")} style={styles.headerLogo} resizeMode="contain" />
        <Text style={styles.headerTitle}>Kostmunity</Text>
        <View>
          <Text style={styles.headerSubtitleTop}>Admin</Text>
          <Text style={styles.headerSubtitleBottom}>Dashboard</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Card Container */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>Manajemen</Text>
              <Text style={styles.cardTitle}>Layanan</Text>
              <Text style={styles.cardSubtitle}>Kost Kurnia</Text>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
              <Plus size={14} color="#fff" style={{ marginRight: 4 }} />
              <Text style={styles.addButtonText}>Tambah</Text>
            </TouchableOpacity>
          </View>

          {/* Table Content */}
          <View style={styles.cardContent}>

            {/* Table Header - Sesuai Gambar */}
            <View style={styles.tableHeader}>
              <Text style={[styles.headText, { flex: 2, textAlign: 'center' }]}>Nama</Text>
              <Text style={[styles.headText, { flex: 2, textAlign: 'center' }]}>Kontak</Text>
              <Text style={[styles.headText, { flex: 1, textAlign: 'center' }]}>Edit</Text>
            </View>

            <View style={styles.separator} />

            {/* List Body */}
            {loading ? (
              <ActivityIndicator style={{ margin: 20 }} color="#333" />
            ) : services.length === 0 ? (
              <Text style={{ textAlign: 'center', color: '#999', margin: 20 }}>Belum ada layanan.</Text>
            ) : (
              <View style={{ gap: 8 }}>
                {services.map((item) => (
                   <ServiceRow key={item.id} item={item} onEdit={handleEdit} onDelete={handleDelete} />
                ))}
              </View>
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

      {/* Modal Form */}
      <ServiceModal visible={modalVisible} onClose={() => setModalVisible(false)} editData={editingService} />

    </SafeAreaView>
  );
}

// ==========================================
// 5. STYLES
// ==========================================

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f3f4f6" },
  scrollContent: { padding: 16, paddingBottom: 100 },

  // Header
  header: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingTop: 16, paddingBottom: 24, gap: 8 },
  headerLogo: { width: 30, height: 35 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#1f2937" },
  headerSubtitleTop: { fontSize: 10, color: "#6b7280", lineHeight: 10 },
  headerSubtitleBottom: { fontSize: 10, fontWeight: "bold", color: "#1f2937", lineHeight: 12 },

  // Card
  card: { backgroundColor: "#fff", borderRadius: 12, overflow: "hidden", elevation: 2, shadowColor: "#000", shadowOpacity: 0.05 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", padding: 16, borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
  cardTitle: { fontSize: 22, fontWeight: "bold", color: "#1f2937", lineHeight: 26 },
  cardSubtitle: { fontSize: 14, color: "#6b7280", marginTop: 4 },

  // Button Tambah (Pill Hitam)
  addButton: { backgroundColor: "#1f2937", flexDirection: "row", alignItems: "center", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
  addButtonText: { color: "#fff", fontSize: 12, fontWeight: "500" },

  // Table Area
  cardContent: { padding: 16 },
  tableHeader: { flexDirection: "row", marginBottom: 8, paddingHorizontal: 4 },
  headText: { fontSize: 11, fontWeight: "bold", color: "#374151" },
  separator: { height: 1, backgroundColor: "#374151", marginBottom: 12 }, // Garis pemisah tegas

  // Row Styles
  rowContainer: { flexDirection: "row", alignItems: "center", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#f3f4f6" },

  // Pill Style (Kotak Abu Rounded) - Sesuai Gambar 4
  pillContainer: { backgroundColor: "#e5e7eb", borderRadius: 10, paddingVertical: 6, paddingHorizontal: 12, marginHorizontal: 4, alignItems: 'center' },
  pillText: { fontSize: 12, color: "#374151", fontWeight: "500" },

  // Action Buttons
  actionContainer: { flex: 1, flexDirection: 'row', justifyContent: 'center', gap: 8 },
  iconBtn: { padding: 4, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 4 },

  // FAB
  fabContainer: { position: "absolute", bottom: 24, left: 0, right: 0, alignItems: "center" },
  fabButton: { backgroundColor: "#1f2937", flexDirection: "row", alignItems: "center", paddingHorizontal: 32, height: 56, borderRadius: 28, elevation: 6 },
  fabText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

// MODAL STYLES
const modalStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", padding: 20 },
  container: { backgroundColor: "#fff", borderRadius: 16, padding: 24, width: "100%" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  title: { fontSize: 18, fontWeight: "bold", color: "#1f2937" },
  subtitle: { fontSize: 12, color: "#6b7280" },
  formGroup: { gap: 12, marginBottom: 20 },
  label: { fontSize: 12, fontWeight: "600", color: "#374151", marginBottom: -8, marginLeft: 2 },
  input: { borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 8, padding: 12, fontSize: 14, color: "#1f2937" },
  submitBtn: { backgroundColor: "#1f2937", paddingVertical: 12, borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  submitText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
});

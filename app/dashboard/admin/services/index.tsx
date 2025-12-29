import { useRouter } from "expo-router";
import { ArrowRight, Home, Pencil, Plus, Search, Trash2, X } from "lucide-react-native";
import React, { useState } from "react";
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

// --- IMPORT SERVICES & HOOKS ---
import { useAuth } from "../../../../contexts/AuthContext";
import type { Ad } from "../../../../models/Ad";
import { createAd, deleteAd, getAdsByKostId, updateAd } from "../../../../services/adsService";

// ==========================================
// 1. COMPONENT: ADD/EDIT MODAL
// ==========================================
interface ServiceModalProps {
  visible: boolean;
  onClose: () => void;
  editData: Ad | null;
  kostId: string;
  onSuccess: () => void;
}

const ServiceModal = ({ visible, onClose, editData, kostId, onSuccess }: ServiceModalProps) => {
  const [loading, setLoading] = useState(false);
  const [nama, setNama] = useState("");
  const [kontak, setKontak] = useState("");

  React.useEffect(() => {
    if (editData) {
      setNama(editData.title);
      setKontak(editData.link);
    } else {
      setNama("");
      setKontak("");
    }
  }, [editData, visible]);

  const handleSubmit = async () => {
    if (!nama || !kontak) {
      if (Platform.OS === 'web') {
        alert("Mohon lengkapi semua data");
      } else {
        Alert.alert("Error", "Mohon lengkapi semua data");
      }
      return;
    }

    setLoading(true);
    try {
      const defaultImage = "https://placehold.co/100";
      
      if (editData) {
        await updateAd(editData.id, { 
          title: nama, 
          link: kontak 
        });
        if (Platform.OS === 'web') {
          alert("Layanan berhasil diupdate");
        } else {
          Alert.alert("Berhasil", "Layanan berhasil diupdate");
        }
      } else {
        await createAd({
          title: nama,
          link: kontak,
          imageUrl: defaultImage,
          kostId: kostId,
          isActive: true,
          displayOrder: 0
        });
        if (Platform.OS === 'web') {
          alert("Layanan berhasil ditambahkan");
        } else {
          Alert.alert("Berhasil", "Layanan berhasil ditambahkan");
        }
      }
      
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error saving service:", error);
      if (Platform.OS === 'web') {
        alert("Error: " + (error?.message || "Gagal menyimpan layanan"));
      } else {
        Alert.alert("Error", error?.message || "Gagal menyimpan layanan");
      }
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
// 2. COMPONENT: SERVICE ROW
// ==========================================

const ServiceRow = ({ item, onEdit, onDelete }: { item: Ad, onEdit: (s: Ad) => void, onDelete: (id: string, title: string) => void }) => {
  return (
    <View style={styles.rowContainer}>
      <View style={[styles.pillContainer, { flex: 2 }]}>
        <Text style={styles.pillText} numberOfLines={1}>{item.title}</Text>
      </View>

      <View style={[styles.pillContainer, { flex: 2 }]}>
        <Text style={styles.pillText} numberOfLines={1}>{item.link}</Text>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => onEdit(item)}>
          <Pencil size={14} color="#2563eb" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={() => onDelete(item.id, item.title)}>
          <Trash2 size={14} color="#dc2626" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ==========================================
// 3. MAIN PAGE
// ==========================================

export default function ServicesPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const kostId = user?.kostId || "kost_kurnia_01";
  
  const [services, setServices] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingService, setEditingService] = useState<Ad | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch data
  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await getAdsByKostId(kostId);
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchServices();
  }, [kostId]);

  // Filter services based on search
  const filteredServices = services.filter(service => 
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.link.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    setEditingService(null);
    setModalVisible(true);
  };

  const handleEdit = (item: Ad) => {
    setEditingService(item);
    setModalVisible(true);
  };

  const handleDelete = async (id: string, title: string) => {
    const confirmDelete = Platform.OS === 'web'
      ? window.confirm(`Yakin ingin menghapus layanan "${title}"?`)
      : await new Promise((resolve) => {
          Alert.alert(
            "Hapus Layanan",
            `Yakin ingin menghapus layanan "${title}"?`,
            [
              { text: "Batal", style: "cancel", onPress: () => resolve(false) },
              { text: "Hapus", style: "destructive", onPress: () => resolve(true) }
            ]
          );
        });

    if (!confirmDelete) return;

    try {
      await deleteAd(id);
      if (Platform.OS === 'web') {
        alert("Layanan berhasil dihapus");
      } else {
        Alert.alert("Berhasil", "Layanan berhasil dihapus");
      }
      fetchServices();
    } catch (error: any) {
      if (Platform.OS === 'web') {
        alert("Error: " + (error?.message || "Gagal menghapus layanan"));
      } else {
        Alert.alert("Error", error?.message || "Gagal menghapus layanan");
      }
    }
  };

  if (loading) {
    return (
      <View style={[styles.safeArea, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={{ marginTop: 12, color: "#6b7280" }}>Memuat data layanan...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />

      <View style={styles.header}>
        <Image source={require("../../../../assets/kostmunity-logo.png")} style={styles.headerLogo} resizeMode="contain" />
        <Text style={styles.headerTitle}>Kostmunity</Text>
        <View>
          <Text style={styles.headerSubtitleTop}>Admin</Text>
          <Text style={styles.headerSubtitleBottom}>Dashboard</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>Manajemen Layanan</Text>
              <Text style={styles.cardSubtitle}>Total: {services.length} layanan</Text>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
              <Plus size={14} color="#fff" style={{ marginRight: 4 }} />
              <Text style={styles.addButtonText}>Tambah</Text>
            </TouchableOpacity>
          </View>

          <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#f9fafb", borderRadius: 8, paddingHorizontal: 12 }}>
              <Search size={18} color="#6b7280" />
              <TextInput
                style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 12, color: "#111827" }}
                placeholder="Cari nama layanan, kontak..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          <View style={styles.cardContent}>
            <View style={styles.tableHeader}>
              <Text style={[styles.headText, { flex: 2, textAlign: 'center' }]}>Nama</Text>
              <Text style={[styles.headText, { flex: 2, textAlign: 'center' }]}>Kontak</Text>
              <Text style={[styles.headText, { flex: 1, textAlign: 'center' }]}>Aksi</Text>
            </View>

            <View style={styles.separator} />

            {filteredServices.length === 0 ? (
              <View style={{ padding: 40, alignItems: "center" }}>
                <Text style={{ color: "#6b7280", fontSize: 16 }}>
                  {searchQuery ? "Tidak ada layanan ditemukan" : "Belum ada layanan"}
                </Text>
              </View>
            ) : (
              <View style={{ gap: 8 }}>
                {filteredServices.map((item) => (
                  <ServiceRow key={item.id} item={item} onEdit={handleEdit} onDelete={handleDelete} />
                ))}
              </View>
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

      <ServiceModal 
        visible={modalVisible} 
        onClose={() => {
          setModalVisible(false);
          setEditingService(null);
        }} 
        editData={editingService}
        kostId={kostId}
        onSuccess={fetchServices}
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
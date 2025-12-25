import { useRouter } from "expo-router";
import { ArrowRight, Home, Pencil, Plus, Trash2, X, Search, UserPlus, Edit } from "lucide-react-native";
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
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "../../../../lib/firebase-clients";

// --- IMPORT SERVICES & HOOKS BARU ---
import { useMembers } from "../../../../hooks/useMembers";
import { 
  deleteMember as deleteMemberService, 
  updateMember,
  createMember 
} from "../../../../services/memberService";
import { MemberInfo } from "../../../../models/MemberInfo";
import { formatCurrency, formatDate, getStatusColor } from "../../../../lib/formatting";
import { useAuth } from "../../../../contexts/AuthContext";

// --- SIMULASI AUTH ---
// Ganti string ini dengan ID Kost milik Admin yang sedang Login
// const CURRENT_ADMIN_KOST_ID = "kost_kurnia_01"; // DEPRECATED - using Auth Context now

// ==========================================
// COMPONENT: ADD/EDIT MEMBER MODAL
// ==========================================
interface MemberModalProps {
  visible: boolean;
  onClose: () => void;
  editData: MemberInfo | null;
}

const MemberModal = ({ visible, onClose, editData }: MemberModalProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [room, setRoom] = useState("");

  useEffect(() => {
    if (editData) {
      setName(editData.name);
      setEmail(editData.email);
      setPhone(editData.phone);
      setRoom(editData.room);
    } else {
      setName(""); setEmail(""); setPhone(""); setRoom("");
    }
  }, [editData, visible]);

  const handleSubmit = async () => {
    if (!name || !email || !phone || !room) {
      Alert.alert("Mohon Lengkapi", "Nama, Email, HP, dan Kamar wajib diisi.");
      return;
    }

    const kostId = user?.kostId || "kost_kurnia_01"; // Fallback for development

    setLoading(true);
    try {
      if (editData && editData.id) {
        // MODE EDIT
        await updateMember(editData.id, { name, email, phone, room });
        Alert.alert("Berhasil", "Data member diperbarui.");
      } else {
        // MODE TAMBAH
        await createMember({
          name,
          email,
          phone,
          room,
          kostId,
          status: 'active'
        });
        Alert.alert("Berhasil", "Member baru ditambahkan dengan password default: 123456");
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
                <Text style={modalStyles.title}>{editData ? "Edit Member" : "Tambah Member"}</Text>
                <Text style={modalStyles.subtitle}>Akun Login & Data Penghuni</Text>
              </View>
              <TouchableOpacity onPress={onClose}><X color="#1f2937" size={24} /></TouchableOpacity>
            </View>

            <View style={modalStyles.formGroup}>
              <TextInput style={modalStyles.input} placeholder="Nama Lengkap" value={name} onChangeText={setName} />
              <TextInput
                  style={[modalStyles.input, editData && {backgroundColor: '#f3f4f6'}]}
                  placeholder="Email (Untuk Login)"
                  value={email}
                  onChangeText={setEmail}
                  editable={!editData} // Email sebaiknya tidak diubah sembarangan
                  keyboardType="email-address"
                  autoCapitalize="none"
              />
              <TextInput style={modalStyles.input} placeholder="Nomor Kamar (ex: A-01)" value={room} onChangeText={setRoom} />
              <TextInput style={modalStyles.input} placeholder="No. HP / Kontak" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
            </View>

            <TouchableOpacity style={modalStyles.submitBtn} onPress={handleSubmit} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff"/> : (
                  <>
                    <Text style={modalStyles.submitText}>{editData ? "Simpan Perubahan" : "Buat Akun Member"}</Text>
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
// COMPONENT: MEMBER ROW
// ==========================================
const MemberRow = ({ member, onEdit, onDelete }: { member: MemberInfo, onEdit: (m: MemberInfo) => void, onDelete: (id: string) => void }) => {
  return (
      <View style={styles.rowContainer}>
        <Text style={[styles.rowText, { flex: 2, fontWeight: '600' }]} numberOfLines={1}>
          {member.name}
        </Text>

        <View style={[styles.pillContainer, { flex: 1 }]}>
          <Text style={styles.pillText}>{member.room}</Text>
        </View>

        <View style={[styles.pillContainer, { flex: 1.5 }]}>
          <Text style={styles.pillText} numberOfLines={1}>{member.phone}</Text>
        </View>

        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.statusText}>{member.status || "active"}</Text>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => onEdit(member)}>
            <Pencil size={14} color="#2563eb" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => member.id && onDelete(member.id)}>
            <Trash2 size={14} color="#dc2626" />
          </TouchableOpacity>
        </View>
      </View>
  );
};

// ==========================================
// MAIN PAGE
// ==========================================
export default function MembersPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const kostId = user?.kostId || "kost_kurnia_01"; // Fallback for development
  
  // GUNAKAN HOOKS BARU
  const { members, loading, error, refetch } = useMembers(kostId);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMember, setEditingMember] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Filter members berdasarkan search dan status
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.room.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || member.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAdd = () => {
    setEditingMember(null);
    setModalVisible(true);
  };

  const handleEdit = (member: MemberInfo) => {
    setEditingMember(member);
    setModalVisible(true);
  };

  const handleDelete = async (id: string, name: string) => {
    Alert.alert("Hapus Member", `Yakin ingin menghapus ${name}? User ini tidak akan bisa login lagi.`, [
      { text: "Batal", style: "cancel" },
      { 
        text: "Hapus", 
        style: "destructive", 
        onPress: async () => {
          try {
            await deleteMemberService(id);
            Alert.alert("Berhasil", "Member berhasil dihapus");
            refetch();
          } catch (error) {
            Alert.alert("Error", "Gagal menghapus member");
          }
        }
      }
    ]);
  };

  // Loading state
  if (loading) {
    return (
      <View style={[styles.safeArea, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={{ marginTop: 12, color: "#6b7280" }}>Memuat data member...</Text>
      </View>
    );
  }

  // Error state
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
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardTitle}>Manajemen Member</Text>
                <Text style={styles.cardSubtitle}>
                  Total: {members.length} member | Aktif: {members.filter(m => m.status === "active").length}
                </Text>
              </View>
              <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
                <Plus size={14} color="#fff" style={{ marginRight: 4 }} />
                <Text style={styles.addButtonText}>Tambah</Text>
              </TouchableOpacity>
            </View>

            {/* Search & Filter */}
            <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
              <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#f9fafb", borderRadius: 8, paddingHorizontal: 12, marginBottom: 12 }}>
                <Search size={18} color="#6b7280" />
                <TextInput
                  style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 12, color: "#111827" }}
                  placeholder="Cari nama, email, kamar..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <TouchableOpacity
                  style={[styles.filterChip, selectedStatus === "all" && styles.filterChipActive]}
                  onPress={() => setSelectedStatus("all")}
                >
                  <Text style={[styles.filterText, selectedStatus === "all" && styles.filterTextActive]}>
                    Semua ({members.length})
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterChip, selectedStatus === "active" && styles.filterChipActive]}
                  onPress={() => setSelectedStatus("active")}
                >
                  <Text style={[styles.filterText, selectedStatus === "active" && styles.filterTextActive]}>
                    Aktif ({members.filter(m => m.status === "active").length})
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.filterChip, selectedStatus === "inactive" && styles.filterChipActive]}
                  onPress={() => setSelectedStatus("inactive")}
                >
                  <Text style={[styles.filterText, selectedStatus === "inactive" && styles.filterTextActive]}>
                    Nonaktif ({members.filter(m => m.status === "inactive").length})
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>

            <View style={styles.cardContent}>
              <View style={styles.tableHeader}>
                <Text style={[styles.headText, { flex: 2 }]}>Nama</Text>
                <Text style={[styles.headText, { flex: 1 }]}>Kamar</Text>
                <Text style={[styles.headText, { flex: 1 }]}>Status</Text>
                <Text style={[styles.headText, { flex: 1, textAlign: 'center' }]}>Aksi</Text>
              </View>

              {filteredMembers.length === 0 ? (
                <View style={{ padding: 40, alignItems: "center" }}>
                  <Text style={{ color: "#6b7280", fontSize: 16 }}>
                    {searchQuery ? "Tidak ada member ditemukan" : "Belum ada member"}
                  </Text>
                </View>
              ) : (
                filteredMembers.map((member) => (
                  <View key={member.id} style={styles.rowContainer}>
                    <View style={{ flex: 2 }}>
                      <Text style={[styles.rowText, { fontWeight: '600' }]} numberOfLines={1}>
                        {member.name}
                      </Text>
                      <Text style={{ fontSize: 12, color: "#6b7280" }} numberOfLines={1}>
                        {member.email}
                      </Text>
                    </View>

                    <View style={[styles.pillContainer, { flex: 1 }]}>
                      <Text style={styles.pillText}>{member.room}</Text>
                    </View>

                    <View style={{ flex: 1, alignItems: 'center' }}>
                      <View style={[
                        styles.statusBadge, 
                        { backgroundColor: getStatusColor(member.status || 'active') }
                      ]}>
                        <Text style={styles.statusText}>{member.status || 'active'}</Text>
                      </View>
                    </View>

                    <View style={[styles.actionContainer, { flex: 1 }]}>
                      <TouchableOpacity style={styles.iconBtn} onPress={() => handleEdit(member)}>
                        <Pencil size={14} color="#2563eb" />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.iconBtn} 
                        onPress={() => handleDelete(member.id, member.name)}
                      >
                        <Trash2 size={14} color="#dc2626" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
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

        <MemberModal visible={modalVisible} onClose={() => setModalVisible(false)} editData={editingMember} />
      </SafeAreaView>
  );
}

// --- STYLES (Sama seperti sebelumnya) ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f3f4f6" },
  scrollContent: { padding: 16, paddingBottom: 100 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingTop: 16, paddingBottom: 24, gap: 8 },
  headerLogo: { width: 30, height: 35 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#1f2937" },
  headerSubtitleTop: { fontSize: 10, color: "#6b7280" },
  headerSubtitleBottom: { fontSize: 10, fontWeight: "bold", color: "#1f2937" },
  card: { backgroundColor: "#fff", borderRadius: 12, overflow: "hidden", elevation: 2, shadowColor: "#000", shadowOpacity: 0.05 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
  cardTitle: { fontSize: 18, fontWeight: "600", color: "#1f2937" },
  cardSubtitle: { fontSize: 12, color: "#6b7280" },
  addButton: { backgroundColor: "#1f2937", flexDirection: "row", alignItems: "center", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
  addButtonText: { color: "#fff", fontSize: 12, fontWeight: "500" },
  cardContent: { padding: 16 },
  tableHeader: { flexDirection: "row", marginBottom: 8, paddingHorizontal: 4 },
  headText: { fontSize: 11, fontWeight: "bold", color: "#374151" },
  separator: { height: 1, backgroundColor: "#374151", marginBottom: 12 },
  rowContainer: { flexDirection: "row", alignItems: "center", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#f3f4f6" },
  rowText: { fontSize: 13, color: "#1f2937" },
  pillContainer: { backgroundColor: "#e5e7eb", borderRadius: 10, paddingVertical: 4, paddingHorizontal: 8, marginHorizontal: 4, alignItems: 'center' },
  pillText: { fontSize: 11, color: "#374151", fontWeight: "500" },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 11, color: "#fff", fontWeight: "600" },
  actionContainer: { flex: 1, flexDirection: 'row', justifyContent: 'center', gap: 8 },
  iconBtn: { padding: 4, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 4 },
  filterChip: { backgroundColor: "#f3f4f6", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginRight: 8 },
  filterChipActive: { backgroundColor: "#6366f1" },
  filterText: { color: "#6b7280", fontSize: 13, fontWeight: "600" },
  filterTextActive: { color: "#fff" },
  fabContainer: { position: "absolute", bottom: 24, left: 0, right: 0, alignItems: "center" },
  fabButton: { backgroundColor: "#1f2937", flexDirection: "row", alignItems: "center", paddingHorizontal: 32, height: 56, borderRadius: 28, elevation: 6 },
  fabText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

const modalStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", padding: 20 },
  container: { backgroundColor: "#fff", borderRadius: 16, padding: 24, width: "100%" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  title: { fontSize: 18, fontWeight: "bold", color: "#1f2937" },
  subtitle: { fontSize: 12, color: "#6b7280" },
  formGroup: { gap: 12, marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 8, padding: 12, fontSize: 14, color: "#1f2937" },
  submitBtn: { backgroundColor: "#1f2937", paddingVertical: 12, borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  submitText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
});
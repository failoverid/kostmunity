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
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "../../../../lib/firebase-clients";
import { createMember, deleteMember, updateMember, UserType } from "../../../../lib/user-services"; // Import fungsi yang kita buat tadi

// --- SIMULASI AUTH ---
// Ganti string ini dengan ID Kost milik Admin yang sedang Login
const CURRENT_ADMIN_KOST_ID = "kost_kurnia_01";

// ==========================================
// COMPONENT: ADD/EDIT MEMBER MODAL
// ==========================================
interface MemberModalProps {
  visible: boolean;
  onClose: () => void;
  editData: UserType | null;
}

const MemberModal = ({ visible, onClose, editData }: MemberModalProps) => {
  const [loading, setLoading] = useState(false);

  // Form State
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [kamar, setKamar] = useState("");

  useEffect(() => {
    if (editData) {
      setNama(editData.nama);
      setEmail(editData.email);
      setPhone(editData.phone);
      setKamar(editData.kamar);
    } else {
      setNama(""); setEmail(""); setPhone(""); setKamar("");
    }
  }, [editData, visible]);

  const handleSubmit = async () => {
    if (!nama || !email || !phone || !kamar) {
      Alert.alert("Mohon Lengkapi", "Nama, Email, HP, dan Kamar wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      if (editData && editData.id) {
        // MODE EDIT
        await updateMember(editData.id, { nama, email, phone, kamar });
        Alert.alert("Berhasil", "Data member diperbarui.");
      } else {
        // MODE TAMBAH
        await createMember(CURRENT_ADMIN_KOST_ID, {
            nama,
            email,
            phone,
            kamar
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
            <TextInput style={modalStyles.input} placeholder="Nama Lengkap" value={nama} onChangeText={setNama} />
            <TextInput
                style={[modalStyles.input, editData && {backgroundColor: '#f3f4f6'}]}
                placeholder="Email (Untuk Login)"
                value={email}
                onChangeText={setEmail}
                editable={!editData} // Email sebaiknya tidak diubah sembarangan
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput style={modalStyles.input} placeholder="Nomor Kamar (ex: A-01)" value={kamar} onChangeText={setKamar} />
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
const MemberRow = ({ member, onEdit, onDelete }: { member: UserType, onEdit: (m: UserType) => void, onDelete: (id: string) => void }) => {
  return (
    <View style={styles.rowContainer}>
      <Text style={[styles.rowText, { flex: 2, fontWeight: '600' }]} numberOfLines={1}>
        {member.nama}
      </Text>

      <View style={[styles.pillContainer, { flex: 1 }]}>
        <Text style={styles.pillText}>{member.kamar}</Text>
      </View>

      <View style={[styles.pillContainer, { flex: 1.5 }]}>
        <Text style={styles.pillText} numberOfLines={1}>{member.phone}</Text>
      </View>

      <View style={{ flex: 1, alignItems: 'center' }}>
         <Text style={styles.statusText}>{member.status || "Aktif"}</Text>
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
  const [members, setMembers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingMember, setEditingMember] = useState<UserType | null>(null);

  // FETCH DATA REALTIME DENGAN FILTER ID KOST
  useEffect(() => {
    // Query: Ambil users di mana role='user' DAN idKost = KOST ADMIN SAAT INI
    const q = query(
        collection(db, "users"),
        where("role", "==", "user"),
        where("idKost", "==", CURRENT_ADMIN_KOST_ID),
        orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loaded: UserType[] = [];
      snapshot.forEach((doc) => {
        loaded.push({ id: doc.id, ...doc.data() } as UserType);
      });
      // Sort manual by Kamar agar rapi
      loaded.sort((a, b) => a.kamar.localeCompare(b.kamar, undefined, { numeric: true }));
      setMembers(loaded);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching members:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAdd = () => {
    setEditingMember(null);
    setModalVisible(true);
  };

  const handleEdit = (member: UserType) => {
    setEditingMember(member);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert("Hapus Member", "User ini tidak akan bisa login lagi. Lanjutkan?", [
      { text: "Batal", style: "cancel" },
      { text: "Hapus", style: "destructive", onPress: () => deleteMember(id) }
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
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>Manajemen Member</Text>
              <Text style={styles.cardSubtitle}>Daftar Penghuni & Akun User</Text>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
              <Plus size={14} color="#fff" style={{ marginRight: 4 }} />
              <Text style={styles.addButtonText}>Tambah</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardContent}>
            <View style={styles.tableHeader}>
              <Text style={[styles.headText, { flex: 2 }]}>Nama</Text>
              <Text style={[styles.headText, { flex: 1, textAlign: 'center' }]}>Kamar</Text>
              <Text style={[styles.headText, { flex: 1.5, textAlign: 'center' }]}>Kontak</Text>
              <Text style={[styles.headText, { flex: 1, textAlign: 'center' }]}>Status</Text>
              <Text style={[styles.headText, { flex: 1, textAlign: 'center' }]}>Edit</Text>
            </View>
            <View style={styles.separator} />

            {loading ? (
              <ActivityIndicator style={{ margin: 20 }} color="#333" />
            ) : members.length === 0 ? (
              <Text style={{ textAlign: 'center', color: '#999', margin: 20 }}>Belum ada member di Kost ini.</Text>
            ) : (
              <View style={{ gap: 8 }}>
                {members.map((m) => (
                   <MemberRow key={m.id} member={m} onEdit={handleEdit} onDelete={handleDelete} />
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
  statusText: { fontSize: 11, color: "#4b5563" },
  actionContainer: { flex: 1, flexDirection: 'row', justifyContent: 'center', gap: 8 },
  iconBtn: { padding: 4, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 4 },
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

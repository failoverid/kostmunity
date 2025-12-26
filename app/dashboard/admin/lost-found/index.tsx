import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";
import { ArrowRight, CheckCircle, Home, Image as ImageIcon, MapPin, X } from "lucide-react-native";
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
import { collection, doc, onSnapshot, orderBy, query, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { db } from "../../../../lib/firebase-clients";

// ==========================================
// 1. LOGIC DATABASE & HELPER
// ==========================================

export interface LostItemDB {
  itemId: string;
  item: string;
  memberId: string;
  type: "lost";
  found: boolean;    // true = Ditemukan, false = Kehilangan
  reportedAt: any;
  photoURL?: string;
  description?: string; // Info Kontak
  location?: string;
}

// Fungsi Tambah Barang
async function reportLostItem(
  itemName: string,
  memberId: string,
  fileUri?: string,
  description?: string,
  location?: string,
  statusFound?: boolean
): Promise<void> {
  const itemId = `${memberId}_${Date.now()}`;
  let photoURL: string | undefined;

  // Upload foto kalau ada
  if (fileUri) {
    try {
      console.log("Memulai upload gambar...");
      const storage = getStorage(); // Pastikan storageBucket ada di firebaseConfig
      const storageRef = ref(storage, `lostItems/${itemId}.jpg`);

      // Fetch blob dari URI
      const response = await fetch(fileUri);
      const blob = await response.blob();

      await uploadBytes(storageRef, blob);
      photoURL = await getDownloadURL(storageRef);
      console.log("Upload gambar berhasil, URL:", photoURL);
    } catch (err: any) {
      console.error("Gagal upload gambar:", err);
      // Kita throw error agar user tahu, atau bisa di-comment throw-nya jika ingin lanjut tanpa gambar
      throw new Error(`Gagal upload gambar: ${err.message}. Pastikan Storage aktif di Firebase Console.`);
    }
  }

  const itemData = {
    item: itemName,
    memberId,
    type: "lost",
    found: statusFound || false,
    reportedAt: new Date(),
    photoURL: photoURL || null,
    description,
    location,
    itemId,
  };

  console.log("Menyimpan data ke Firestore...", itemData);
  await setDoc(doc(db, "lostItems", itemId), itemData);
}

// Fungsi Update Status Jadi Ditemukan
async function markAsFound(itemId: string) {
  try {
    await updateDoc(doc(db, "lostItems", itemId), {
      found: true
    });
    Alert.alert("Sukses", "Status berhasil diubah menjadi Ditemukan.");
  } catch (error) {
    console.error("Error updating status:", error);
    Alert.alert("Error", "Gagal mengupdate status.");
  }
}

// Helper Format Tanggal
const formatDate = (timestamp: any) => {
  if (!timestamp) return "-";
  // Handle Firestore Timestamp vs Date object
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString("id-ID", {
    day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'
  }).replace(/\./g, ':');
};

// ==========================================
// 2. COMPONENT: ADD ITEM MODAL (CREAM THEME)
// ==========================================
interface AddModalProps {
  visible: boolean;
  onClose: () => void;
}

const AddLostItemModal = ({ visible, onClose }: AddModalProps) => {
  const [loading, setLoading] = useState(false);
  const [nama, setNama] = useState("");
  const [status, setStatus] = useState("Kehilangan");
  const [lokasi, setLokasi] = useState("");
  const [kontak, setKontak] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    // Request permission (biasanya otomatis di Expo modern, tapi aman ditambah)
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Izin Ditolak", "Anda perlu mengizinkan akses galeri untuk upload foto.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    console.log("Tombol Kirim Ditekan"); // Debugging

    if (!nama || !lokasi) {
      Alert.alert("Mohon Lengkapi", "Nama barang dan lokasi wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      const isFound = status.toLowerCase().includes("ditemukan");

      // Panggil fungsi create
      await reportLostItem(
        nama,
        "Admin", // Bisa diganti dengan ID user yang login
        imageUri || undefined,
        kontak,
        lokasi,
        isFound
      );

      Alert.alert("Berhasil", "Laporan berhasil dibuat!");

      // Reset Form
      setNama(""); setLokasi(""); setKontak(""); setImageUri(null);
      onClose();
    } catch (error: any) {
      console.error("Submit Error:", error);
      Alert.alert("Gagal", error.message || "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={modalStyles.overlay}>
        <View style={modalStyles.container}>

          {/* Header Modal */}
          <View style={modalStyles.headerRow}>
            <View>
              <Text style={modalStyles.brandTitle}>kostmunity</Text>
              <Text style={modalStyles.brandSubtitle}>lost and found</Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{top:10, bottom:10, left:10, right:10}}>
                <X color="#1f2937" size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 20}}>
            <View style={modalStyles.formGroup}>
              <TextInput
                style={modalStyles.input}
                placeholder="Nama Barang"
                placeholderTextColor="#A0A090"
                value={nama}
                onChangeText={setNama}
              />
              <TextInput
                style={modalStyles.input}
                placeholder="Status (Kehilangan / Ditemukan)"
                placeholderTextColor="#A0A090"
                value={status}
                onChangeText={setStatus}
              />
              <TextInput
                style={modalStyles.input}
                placeholder="Lokasi Terakhir"
                placeholderTextColor="#A0A090"
                value={lokasi}
                onChangeText={setLokasi}
              />
              <TextInput
                style={modalStyles.input}
                placeholder="Info Kontak"
                placeholderTextColor="#A0A090"
                value={kontak}
                onChangeText={setKontak}
              />

              <TouchableOpacity style={modalStyles.uploadArea} onPress={pickImage}>
                {imageUri ? (
                  <Image source={{ uri: imageUri }} style={{ width: '100%', height: '100%', borderRadius: 12 }} resizeMode="cover" />
                ) : (
                  <>
                    <ImageIcon size={32} color="#A0A090" />
                    <Text style={modalStyles.uploadText}>Upload Foto Barang</Text>
                    <View style={modalStyles.badgePill}><Text style={modalStyles.badgeText}>Pilih Foto</Text></View>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Footer Button */}
          <TouchableOpacity
            style={[modalStyles.submitBtn, loading && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
                <ActivityIndicator color="#fff"/>
            ) : (
                <>
                  <Text style={modalStyles.submitText}>Kirim Laporan</Text>
                  <View style={modalStyles.arrowIcon}><ArrowRight size={14} color="#fff"/></View>
                </>
            )}
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

// ==========================================
// 3. COMPONENT: LIST ITEM CARD
// ==========================================

const LostItemCard = ({ item, onMarkFound }: { item: LostItemDB, onMarkFound: (id: string) => void }) => {
  const isFound = item.found;

  return (
    <View style={styles.card}>
      <View style={styles.cardInner}>

        {/* Kolom Kiri: Gambar */}
        <View style={styles.imageContainer}>
          {item.photoURL ? (
            <Image source={{ uri: item.photoURL }} style={styles.cardImage} resizeMode="cover" />
          ) : (
            <View style={styles.placeholderImage}>
              <ImageIcon size={32} color="#9ca3af" />
            </View>
          )}
        </View>

        {/* Kolom Kanan: Konten */}
        <View style={styles.contentContainer}>

          {/* Header: Tanggal & Lokasi */}
          <View style={styles.cardHeaderRow}>
            <View style={{flexDirection:'row', alignItems:'center', flex: 1}}>
              <MapPin size={10} color="#525252" style={{marginRight:2}} />
              <Text style={styles.locationText} numberOfLines={1}>{item.location || "Lokasi tidak diketahui"}</Text>
            </View>
            <Text style={styles.dateText}>{formatDate(item.reportedAt)}</Text>
          </View>

          {/* Isi Konten */}
          <View style={{ gap: 4, marginBottom: 8 }}>
            <Text style={styles.itemTitle}>{item.item}</Text>
            <Text style={styles.contactText}>
              {item.description ? `Kontak: ${item.description}` : "Tidak ada info kontak"}
            </Text>
          </View>

          {/* Tombol Aksi */}
          <View style={styles.actionRow}>
            {isFound ? (
                <View style={[styles.btnAction, styles.btnWhite, { opacity: 0.7 }]}>
                  <CheckCircle size={10} color="#166534" style={{marginRight: 4}}/>
                  <Text style={styles.textBtnWhite}>Sudah Ditemukan</Text>
                </View>
            ) : (
                <TouchableOpacity
                    style={[styles.btnAction, styles.btnDark]}
                    onPress={() => onMarkFound(item.itemId)}
                >
                  <Text style={styles.textBtnDark}>Tandai Ditemukan</Text>
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

export default function LostFoundPage() {
  const router = useRouter();
  const [items, setItems] = useState<LostItemDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // Query items
    const q = query(collection(db, "lostItems"), orderBy("reportedAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loaded: LostItemDB[] = [];
      snapshot.forEach((doc) => {
        loaded.push(doc.data() as LostItemDB);
      });
      setItems(loaded);
      setLoading(false);
    }, (error) => {
        console.error("Snapshot Error:", error);
        setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleMarkFound = (id: string) => {
    Alert.alert("Konfirmasi", "Barang ini sudah ditemukan/dikembalikan?", [
      { text: "Batal", style: "cancel" },
      { text: "Ya, Ditemukan", onPress: () => markAsFound(id) }
    ]);
  };

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
            <Text style={styles.pageTitle}>Lost and Found</Text>
            <Text style={styles.pageSubtitle}>Kost Kurnia</Text>
          </View>
          <TouchableOpacity style={styles.addHeaderBtn} onPress={() => setModalVisible(true)}>
            <Text style={styles.addBtnText}>+ Lapor</Text>
          </TouchableOpacity>
        </View>

        {/* List Container */}
        <View style={styles.listContainer}>
          {loading ? (
              <ActivityIndicator size="large" color="#fff" style={{marginTop: 20}} />
          ) : items.length === 0 ? (
              <Text style={{color:'#9ca3af', textAlign:'center', marginTop:20}}>Tidak ada laporan barang.</Text>
          ) : (
              items.map((item) => (
                  <LostItemCard
                      key={item.itemId}
                      item={item}
                      onMarkFound={handleMarkFound}
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

      {/* Modal Input */}
      <AddLostItemModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </SafeAreaView>
  );
}

// ==========================================
// 5. STYLES
// ==========================================

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#525252" },
  scrollContent: { padding: 16, paddingBottom: 100 },

  // Header
  header: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#525252", paddingTop: Platform.OS === 'android' ? 16 : 8, paddingBottom: 24, gap: 8 },
  headerLogo: { width: 30, height: 35 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  headerSubtitleTop: { fontSize: 12, color: "#d1d5db" },
  headerSubtitleBottom: { fontSize: 12, fontWeight: "bold", color: "#fff" },

  // Page Title
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
  card: {
    backgroundColor: "#d4d4d4",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
  },
  cardInner: {
    flexDirection: "row",
    padding: 12,
    gap: 12,
  },
  imageContainer: { width: 80, height: 80, borderRadius: 8, overflow: 'hidden', backgroundColor: "#404040" },
  cardImage: { width: '100%', height: '100%' },
  placeholderImage: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  contentContainer: { flex: 1, justifyContent: "space-between" },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems:'center', marginBottom: 4 },
  dateText: { fontSize: 10, fontWeight: "bold", color: "#404040" },
  locationText: { fontSize: 10, color: "#525252", fontStyle: 'italic', maxWidth: '70%' },

  itemTitle: { fontSize: 14, fontWeight: "bold", color: "#171717" },
  contactText: { fontSize: 12, color: "#404040" },

  actionRow: { flexDirection: "row", gap: 8, marginTop: 8, justifyContent: 'flex-end' },
  btnAction: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnWhite: { backgroundColor: "#fff" },
  btnDark: { backgroundColor: "#525252" },
  textBtnWhite: { fontSize: 10, fontWeight: "bold", color: "#000" },
  textBtnDark: { fontSize: 10, fontWeight: "bold", color: "#fff" },

  // FAB
  fabContainer: { position: "absolute", bottom: 24, left: 0, right: 0, alignItems: "center", zIndex: 100 },
  fabButton: { backgroundColor: "#333", flexDirection: "row", alignItems: "center", paddingHorizontal: 32, height: 48, borderRadius: 24, elevation: 6 },
  fabText: { color: "#fff", fontSize: 14, fontWeight: "600" },
});

// STYLES MODAL
const modalStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", padding: 20 },
  container: { backgroundColor: "#FEFCE8", borderRadius: 24, padding: 24, maxHeight: "85%", width: "100%" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  brandTitle: { fontSize: 18, fontWeight: "bold", color: "#1f2937" },
  brandSubtitle: { fontSize: 16, fontWeight: "600", color: "#1f2937" },
  formGroup: { gap: 12 },
  input: { backgroundColor: "transparent", borderWidth: 1, borderColor: "#E2E2D5", borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 14, color: "#2D2D2A" },
  uploadArea: { borderWidth: 1, borderColor: "#E2E2D5", borderRadius: 12, height: 140, justifyContent: "center", alignItems: "center", marginTop: 8, backgroundColor: "#FDFFF5", gap: 8, overflow:'hidden' },
  uploadText: { fontSize: 12, color: "#A0A090" },
  badgePill: { backgroundColor: "#E5E5D8", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 10, color: "#fff", fontWeight: "600" },
  submitBtn: { backgroundColor: "#D6D6C8", marginTop: 20, paddingVertical: 14, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  submitText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  arrowIcon: { backgroundColor: "rgba(255,255,255,0.3)", borderRadius: 10, padding: 2 }
});

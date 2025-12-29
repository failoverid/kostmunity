import FloatingNavbar from "@/components/FloatingNavbar";
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import {
    ArrowLeft, ArrowRight, FileSearch,
    Image as ImageIcon,
    Plus, X
} from "lucide-react-native";
import React, { useState } from "react";
import {
    ActivityIndicator, Alert,
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
import { useAuth } from "../../../../../contexts/AuthContext";
import { createLostItem } from "../../../../../services/lostFoundService";

const COLORS = {
    background: "#181A20",
    cardPurple: "#6C5CE7",
    lime: "#C6F432",
    textWhite: "#FFFFFF",
    textGray: "#9E9E9E",
    inputBg: "#262A34",
    inputPurple: "#5A4FCF",
    navbar: "#262A34",
};

export default function MyReportsPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [modalVisible, setModalVisible] = useState(false);

    // Form State
    const [namaBarang, setNamaBarang] = useState("");
    const [status, setStatus] = useState<"Ditemukan" | "Kehilangan">("Ditemukan");
    const [lokasi, setLokasi] = useState("");
    const [kontak, setKontak] = useState("");
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Fungsi Pilih Gambar
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    // Fungsi Upload ke Firebase Storage
    const uploadImage = async (uri: string) => {
        try {
            const response = await fetch(uri);
            const blob = await response.blob();
            const storage = getStorage();
            const filename = `lostfound/${Date.now()}_${user?.uid}.jpg`;
            const storageRef = ref(storage, filename);

            await uploadBytes(storageRef, blob);
            return await getDownloadURL(storageRef);
        } catch (error) {
            console.error("Upload error:", error);
            throw new Error("Gagal upload gambar");
        }
    };

    const handleSubmit = async () => {
        if (!namaBarang || !lokasi || !kontak) {
            Alert.alert("Error", "Mohon lengkapi nama barang, lokasi, dan kontak");
            return;
        }

        setLoading(true);
        try {
            let imageUrl: string | undefined = undefined;
            // Image is optional - only upload if provided
            if (imageUri) {
                try {
                    imageUrl = await uploadImage(imageUri);
                } catch (error) {
                    console.log("Upload image failed, continuing without image");
                    // Continue without image if upload fails
                }
            }

            await createLostItem({
                kostId: user?.kostId || "",
                reporterId: user?.uid || "",
                reporterName: user?.nama || "Member",
                itemName: namaBarang,
                description: `Status: ${status}`, // Simpan status di deskripsi atau field khusus jika ada
                category: 'other', // Default category
                location: lokasi,
                contactInfo: kontak,
                imageUrl: imageUrl
            });

            Alert.alert("Sukses", "Laporan berhasil dibuat!");
            setModalVisible(false);
            // Reset form
            setNamaBarang(""); setLokasi(""); setKontak(""); setImageUri(null);

            // Redirect kembali ke list agar refresh
            router.replace("/dashboard/member/services/lost-found");
        } catch (error) {
            Alert.alert("Error", "Gagal membuat laporan. Coba lagi.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

            <View style={styles.header}>
                <View style={styles.headerTitleContainer}>
                    <Image source={require("../../../../../assets/kostmunity-logo.png")} style={styles.logoSmall} resizeMode="contain" tintColor={COLORS.textWhite} />
                    <Text style={styles.headerTitle}>Kostmunity</Text>
                    <View style={{ marginLeft: 4 }}><Text style={styles.headerSubtitle}>LOST &</Text><Text style={styles.headerSubtitle}>FOUND</Text></View>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <TouchableOpacity style={styles.searchBar} activeOpacity={0.8} onPress={() => router.back()}>
                    <Text style={styles.searchText}>#KembaliKeList</Text>
                    <View style={styles.arrowCircle}><ArrowLeft size={14} color="#AAA" /></View>
                </TouchableOpacity>

                <View style={styles.emptyStateContainer}>
                    <FileSearch size={100} color="#FFF" style={{ marginBottom: 24 }} strokeWidth={1.5} />
                    <Text style={styles.emptyTitle}>Buat Laporan Baru</Text>
                    <Text style={[styles.emptyTitle, { fontSize: 16, marginTop: 8, color: COLORS.textGray }]}>
                        Barang hilang atau menemukan sesuatu?
                    </Text>

                    <TouchableOpacity style={styles.createButton} onPress={() => setModalVisible(true)}>
                        <Text style={styles.createButtonText}>Isi Formulir</Text>
                        <View style={styles.plusCircle}><Plus size={14} color={COLORS.lime} /></View>
                    </TouchableOpacity>
                </View>
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* MODAL FORM */}
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalBrand}>Lapor Barang</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <View style={styles.closeButton}><X size={20} color="#FFF" /></View>
                            </TouchableOpacity>
                        </View>

                        <ScrollView contentContainerStyle={styles.formScroll} showsVerticalScrollIndicator={false}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Nama Barang</Text>
                                <TextInput style={styles.input} placeholder="Contoh: Dompet Hitam" placeholderTextColor="rgba(255,255,255,0.5)" value={namaBarang} onChangeText={setNamaBarang} />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Status Barang</Text>
                                <View style={styles.statusToggleContainer}>
                                    <TouchableOpacity style={[styles.statusButton, status === "Ditemukan" && styles.statusActive]} onPress={() => setStatus("Ditemukan")}>
                                        <Text style={styles.statusText}>Menemukan</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.statusButton, status === "Kehilangan" && styles.statusActive]} onPress={() => setStatus("Kehilangan")}>
                                        <Text style={styles.statusText}>Kehilangan</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Lokasi</Text>
                                <TextInput style={styles.input} placeholder="Contoh: Dapur Lt 1" placeholderTextColor="rgba(255,255,255,0.5)" value={lokasi} onChangeText={setLokasi} />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Kontak (WA)</Text>
                                <TextInput style={styles.input} placeholder="0812xxx" placeholderTextColor="rgba(255,255,255,0.5)" value={kontak} onChangeText={setKontak} keyboardType="phone-pad" />
                            </View>

                            <TouchableOpacity style={styles.uploadContainer} onPress={pickImage}>
                                {imageUri ? (
                                    <Image source={{ uri: imageUri }} style={{ width: '100%', height: 120, borderRadius: 8 }} resizeMode="cover" />
                                ) : (
                                    <View style={styles.uploadBox}>
                                        <ImageIcon size={40} color="rgba(0,0,0,0.3)" />
                                        <Text style={styles.uploadText}>Upload Foto Barang (Opsional)</Text>
                                    </View>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
                                {loading ? <ActivityIndicator color="#000" /> : (
                                    <>
                                        <Text style={styles.submitButtonText}>Kirim Laporan</Text>
                                        <ArrowRight size={18} color="#000" />
                                    </>
                                )}
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
            <FloatingNavbar />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: Platform.OS === 'android' ? 40 : 20, paddingHorizontal: 20, marginBottom: 10 },
    headerTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    logoSmall: { width: 24, height: 24 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.textWhite },
    headerSubtitle: { fontSize: 8, color: '#CCC', fontWeight: 'bold', lineHeight: 8 },
    scrollContent: { padding: 20, paddingTop: 10 },
    searchBar: { backgroundColor: COLORS.inputBg, borderRadius: 12, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 20 },
    searchText: { color: '#AAA', fontWeight: '600', fontSize: 14 },
    arrowCircle: { width: 24, height: 24, borderRadius: 12, borderWidth: 1, borderColor: '#444', alignItems: 'center', justifyContent: 'center' },
    emptyStateContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 60, marginBottom: 40 },
    emptyTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.textWhite, textAlign: 'center' },
    createButton: { flexDirection: 'row', backgroundColor: '#262A34', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, alignItems: 'center', marginTop: 32, borderWidth: 1, borderColor: '#333' },
    createButtonText: { color: COLORS.lime, fontWeight: 'bold', fontSize: 14, marginRight: 8 },
    plusCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: COLORS.lime, alignItems: 'center', justifyContent: 'center' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: COLORS.cardPurple, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, height: '85%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    modalBrand: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
    closeButton: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
    formScroll: { gap: 16, paddingBottom: 40 },
    inputGroup: { gap: 8 },
    label: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginLeft: 4 },
    input: { backgroundColor: COLORS.inputPurple, borderRadius: 8, padding: 12, color: '#FFF', borderWidth: 1, borderColor: COLORS.lime, fontWeight: 'bold' },
    statusToggleContainer: { flexDirection: 'row', backgroundColor: COLORS.inputPurple, borderRadius: 8, padding: 4, borderWidth: 1, borderColor: COLORS.lime },
    statusButton: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6 },
    statusActive: { backgroundColor: 'rgba(0,0,0,0.2)' },
    statusText: { color: '#FFF', fontSize: 12 },
    uploadContainer: { borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)', borderRadius: 12, padding: 16, alignItems: 'center', backgroundColor: COLORS.inputPurple, height: 150, justifyContent: 'center', marginTop: 8 },
    uploadBox: { alignItems: 'center', gap: 8 },
    uploadText: { color: '#FFF', fontSize: 12 },
    submitButton: { backgroundColor: COLORS.lime, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 12, marginTop: 16, gap: 8 },
    submitButtonText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
});
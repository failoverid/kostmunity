import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Platform,
    Modal,
    TextInput,
    Image,
    ScrollView
} from "react-native";
import {
    ArrowLeft,
    ArrowRight,
    ShoppingBag,
    FileSearch, // Ikon Search/File untuk Empty State
    Plus,
    X,
    Camera,
    Image as ImageIcon
} from "lucide-react-native";
import { useRouter } from "expo-router";

// --- WARNA TEMA ---
const COLORS = {
    background: "#181A20",
    cardPurple: "#6C5CE7",
    lime: "#C6F432",
    textWhite: "#FFFFFF",
    inputBg: "#262A34",
    inputPurple: "#5A4FCF", // Warna input di dalam modal ungu
};

export default function MyReportsPage() {
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);

    // State Form
    const [namaBarang, setNamaBarang] = useState("");
    const [status, setStatus] = useState<"Ditemukan" | "Kehilangan">("Ditemukan");
    const [lokasi, setLokasi] = useState("");
    const [kontak, setKontak] = useState("");

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

            {/* --- CONTENT UTAMA (EMPTY STATE) --- */}

            {/* Header (Tanpa Tombol Back Standar) */}
            <View style={styles.header}>
                <View style={styles.headerTitleContainer}>
                    <View style={styles.logoBox}>
                        <ShoppingBag size={18} color={COLORS.cardPurple} />
                    </View>
                    <Text style={styles.headerTitle}>Kostmunity</Text>
                    <View style={{ marginLeft: 4 }}>
                        <Text style={styles.headerSubtitle}>LOST &</Text>
                        <Text style={styles.headerSubtitle}>FOUND</Text>
                    </View>
                </View>
            </View>

            <View style={styles.contentContainer}>
                {/* Tombol Back Custom (#LaporanSemuaOrang) */}
                <TouchableOpacity
                    style={styles.searchBar}
                    activeOpacity={0.8}
                    onPress={() => router.back()} // Navigasi Kembali
                >
                    <Text style={styles.searchText}>#LaporanSemuaOrang</Text>
                    <View style={styles.arrowCircle}>
                        <ArrowLeft size={14} color="#AAA" />
                    </View>
                </TouchableOpacity>

                {/* Tabs Dummy */}
                <View style={styles.tabContainer}>
                    <View style={styles.tabButton}>
                        <Text style={[styles.tabText, {color: COLORS.textWhite, fontWeight: 'bold'}]}>Semua</Text>
                        <View style={styles.activeLine} />
                    </View>
                    <Text style={[styles.tabText, {color: '#666'}]}>Ditemukan</Text>
                    <Text style={[styles.tabText, {color: '#666'}]}>Kehilangan</Text>
                </View>

                {/* Empty State Icon & Text */}
                <View style={styles.emptyStateContainer}>
                    <FileSearch size={100} color="#FFF" style={{ marginBottom: 24 }} strokeWidth={1.5} />

                    <Text style={styles.emptyTitle}>Kamu Belum</Text>
                    <Text style={styles.emptyTitle}>Melaporkan Apapun</Text>

                    <TouchableOpacity
                        style={styles.createButton}
                        onPress={() => setModalVisible(true)}
                    >
                        <Text style={styles.createButtonText}>Buat Laporan</Text>
                        <View style={styles.plusCircle}>
                            <Plus size={14} color={COLORS.lime} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>


            {/* --- MODAL FORM --- */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>

                        {/* Modal Header */}
                        <View style={styles.modalHeader}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                <View style={styles.logoBoxWhite}>
                                    <ShoppingBag size={24} color={COLORS.cardPurple} />
                                </View>
                                <View>
                                    <Text style={styles.modalBrand}>kostmunity</Text>
                                    <Text style={styles.modalSubBrand}>lost and found</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <View style={styles.closeButton}>
                                    <X size={20} color="#FFF" />
                                </View>
                            </TouchableOpacity>
                        </View>

                        <ScrollView contentContainerStyle={styles.formScroll} showsVerticalScrollIndicator={false}>

                            {/* Input Nama */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Nama Barang</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Contoh: Dompet Hitam"
                                    placeholderTextColor="rgba(255,255,255,0.5)"
                                    value={namaBarang}
                                    onChangeText={setNamaBarang}
                                />
                            </View>

                            {/* Status Toggle */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Status Barang</Text>
                                <View style={styles.statusToggleContainer}>
                                    <TouchableOpacity
                                        style={[styles.statusButton, status === "Ditemukan" && styles.statusActive]}
                                        onPress={() => setStatus("Ditemukan")}
                                    >
                                        <Text style={styles.statusText}>Ditemukan</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.statusButton, status === "Kehilangan" && styles.statusActive]}
                                        onPress={() => setStatus("Kehilangan")}
                                    >
                                        <Text style={styles.statusText}>Kehilangan</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Lokasi */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Lokasi Terakhir</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Contoh: Depan Pintu Kamar X"
                                    placeholderTextColor="rgba(255,255,255,0.5)"
                                    value={lokasi}
                                    onChangeText={setLokasi}
                                />
                            </View>

                            {/* Kontak */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Info Kontak</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="081234567890 (WA)"
                                    placeholderTextColor="rgba(255,255,255,0.5)"
                                    value={kontak}
                                    onChangeText={setKontak}
                                    keyboardType="phone-pad"
                                />
                            </View>

                            {/* Upload Foto */}
                            <View style={styles.uploadContainer}>
                                <View style={styles.uploadBox}>
                                    <ImageIcon size={40} color="rgba(0,0,0,0.3)" />
                                    <Text style={styles.uploadText}>Upload Foto Barang</Text>
                                    <TouchableOpacity style={styles.uploadButton}>
                                        <Text style={styles.uploadButtonText}>Pilih Foto</Text>
                                        <Plus size={12} color="#FFF" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Submit Button */}
                            <TouchableOpacity
                                style={styles.submitButton}
                                onPress={() => {
                                    setModalVisible(false);
                                    // Logika submit
                                }}
                            >
                                <Text style={styles.submitButtonText}>Kirim Laporan</Text>
                                <ArrowRight size={18} color="#000" />
                            </TouchableOpacity>

                        </ScrollView>

                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    contentContainer: {
        padding: 20,
        flex: 1,
    },
    // Header Style
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // Center title
        paddingTop: Platform.OS === 'android' ? 40 : 20,
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    logoBox: {
        width: 28,
        height: 28,
        backgroundColor: 'rgba(108, 92, 231, 0.2)',
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textWhite,
    },
    headerSubtitle: {
        fontSize: 8,
        color: '#CCC',
        fontWeight: 'bold',
        lineHeight: 8,
    },

    // Search Bar (Back Button)
    searchBar: {
        backgroundColor: COLORS.inputBg,
        borderRadius: 12,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 20,
        // opacity: 0.8,
    },
    searchText: {
        color: '#AAA', // Abu-abu agar terlihat seperti placeholder/disabled
        fontWeight: '600',
        fontSize: 14,
    },
    arrowCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#444',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Tabs
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 60,
        paddingHorizontal: 10,
    },
    tabButton: {
        alignItems: 'center',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
    },
    activeLine: {
        height: 3,
        backgroundColor: COLORS.lime,
        width: '100%',
        marginTop: 4,
        borderRadius: 2,
    },

    // Empty State
    emptyStateContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -40, // Naik sedikit
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textWhite,
        textAlign: 'center',
    },
    createButton: {
        flexDirection: 'row',
        backgroundColor: '#262A34',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 32,
        borderWidth: 1,
        borderColor: '#333',
    },
    createButtonText: {
        color: COLORS.lime,
        fontWeight: 'bold',
        fontSize: 14,
        marginRight: 8,
    },
    plusCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.lime,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // --- MODAL STYLE ---
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.cardPurple,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 24,
        height: '85%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    logoBoxWhite: {
        backgroundColor: '#FFF',
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    modalBrand: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
        lineHeight: 20,
    },
    modalSubBrand: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    formScroll: {
        gap: 16,
        paddingBottom: 40,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        marginLeft: 4,
    },
    input: {
        backgroundColor: COLORS.inputPurple,
        borderRadius: 8,
        padding: 12,
        color: '#FFF',
        borderWidth: 1,
        borderColor: COLORS.lime,
        fontWeight: 'bold',
    },
    statusToggleContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.inputPurple,
        borderRadius: 8,
        padding: 4,
        borderWidth: 1,
        borderColor: COLORS.lime,
    },
    statusButton: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 6,
    },
    statusActive: {
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    statusText: {
        color: '#FFF',
        fontSize: 12,
    },
    uploadContainer: {
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        backgroundColor: COLORS.inputPurple,
        height: 150,
        justifyContent: 'center',
        marginTop: 8,
    },
    uploadBox: {
        alignItems: 'center',
        gap: 8,
    },
    uploadText: {
        color: '#FFF',
        fontSize: 12,
    },
    uploadButton: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        alignItems: 'center',
        gap: 4,
    },
    uploadButtonText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    submitButton: {
        backgroundColor: COLORS.lime,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        marginTop: 16,
        gap: 8,
    },
    submitButtonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
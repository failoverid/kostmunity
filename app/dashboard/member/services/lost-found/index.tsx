import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Platform,
    Modal,
} from "react-native";
import {
    ArrowLeft,
    ArrowRight,
    ShoppingBag,
    X,
    Phone
} from "lucide-react-native";
import { useRouter } from "expo-router";

// --- WARNA TEMA ---
const COLORS = {
    background: "#181A20",
    cardPurple: "#6C5CE7",
    lime: "#C6F432",
    textWhite: "#FFFFFF",
    textGray: "#9E9E9E",
    inputBg: "#262A34",
    badgeLime: "#C6F432",
    modalBg: "rgba(0,0,0,0.7)", // Overlay gelap
    darkPurpleButton: "#4834d4", // Tombol hubungi kontak
    cyanText: "#5CE1E6", // Teks lokasi
};

// --- DATA DUMMY BARANG (Ditambah detail lokasi & kontak) ---
const ITEMS = [
    {
        id: 1,
        name: "Air Jordan 4 Retro SB Pine Green",
        status: "Kehilangan",
        location: "Depan Pintu Kamar X",
        contact: "0812-3456-7890",
        image: "https://images.stockx.com/images/Air-Jordan-4-Retro-SB-Pine-Green-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1678862862",
    },
    {
        id: 2,
        name: "Eiger Flecken Landscape Wallet",
        status: "Ditemukan",
        location: "Lobby Utama",
        contact: "0821-1122-3344",
        image: "https://eigeradventure.com/media/catalog/product/cache/a3809cbba0df796b4bf28882dfde5b27/9/1/910005697001_1.jpg",
    },
    {
        id: 3,
        name: "Laptop Gaming Asus TUF F16",
        status: "Ditemukan",
        location: "Ruang Bersama Lt. 2",
        contact: "0857-9988-7766",
        image: "https://dlcdnwebimgs.asus.com/gain/3b6e7a2b-23ac-4384-933e-074692795326/",
    },
    {
        id: 4,
        name: "Kaos Uniqlo KAWS x Warhol",
        status: "Kehilangan",
        location: "Jemuran Lantai 3",
        contact: "0813-4455-6677",
        image: "https://image.uniqlo.com/UQ/ST3/id/imagesgoods/470762/item/idgoods_09_470762.jpg?width=750",
    },
    {
        id: 5,
        name: "Crocs Swiftwater Mesh Wave",
        status: "Ditemukan",
        location: "Parkiran Motor",
        contact: "0878-1234-5678",
        image: "https://www.crocs.co.id/media/catalog/product/cache/e81e09c850239cb32356559779df30dc/2/0/209604_4ea_alt100.jpg",
    },
    {
        id: 6,
        name: "iPad Pro M2 2022 12.9 inch",
        status: "Kehilangan",
        location: "Kamar 102",
        contact: "0896-1122-3344",
        image: "https://ibox.co.id/media/catalog/product/cache/602f23078cc64303a56dc8f5bc6aa166/i/p/ipad-pro-12-9-m2-space-gray-1_3_1.jpg",
    },
];

export default function LostFoundPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"Semua" | "Ditemukan" | "Kehilangan">("Semua");
    const [selectedItem, setSelectedItem] = useState<(typeof ITEMS)[0] | null>(null);

    // Filter Logic
    const filteredItems = activeTab === "Semua"
        ? ITEMS
        : ITEMS.filter(item => item.status === activeTab);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* 1. HEADER */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={{ position: 'absolute', left: 0, zIndex: 10 }}>
                        <ArrowLeft size={24} color="#FFF" />
                    </TouchableOpacity>

                    <View style={styles.headerTitleContainer}>
                        <View style={styles.logoBox}>
                            <ShoppingBag size={18} color={COLORS.cardPurple} />
                        </View>
                        <Text style={styles.headerTitle}>Kostmunity</Text>
                        <View style={styles.headerSubtitleBox}>
                            <Text style={styles.headerSubtitle}>LOST &</Text>
                            <Text style={styles.headerSubtitle}>FOUND</Text>
                        </View>
                    </View>
                </View>

                {/* 2. SEARCH BAR (Link ke Laporanmu) */}
                <TouchableOpacity
                    style={styles.searchBar}
                    activeOpacity={0.8}
                    onPress={() => router.push("/dashboard/member/services/lost-found/my-reports")}
                >
                    <Text style={styles.searchText}>#Laporanmu</Text>
                    <View style={styles.arrowCircle}>
                        <ArrowRight size={14} color="#AAA" />
                    </View>
                </TouchableOpacity>

                {/* 3. TABS */}
                <View style={styles.tabContainer}>
                    {["Semua", "Ditemukan", "Kehilangan"].map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setActiveTab(tab as any)}
                            style={styles.tabButton}
                        >
                            <Text style={[
                                styles.tabText,
                                activeTab === tab ? styles.tabTextActive : styles.tabTextInactive
                            ]}>
                                {tab}
                            </Text>
                            {activeTab === tab && <View style={styles.activeLine} />}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* 4. GRID ITEMS */}
                <View style={styles.gridContainer}>
                    {filteredItems.map((item) => (
                        <View key={item.id} style={styles.card}>
                            <View style={styles.imageContainer}>
                                <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="cover" />
                            </View>

                            <View style={styles.cardContent}>
                                {/* Badge Status */}
                                <View style={styles.badgeContainer}>
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>{item.status}</Text>
                                    </View>
                                </View>

                                <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>

                                <TouchableOpacity
                                    style={styles.detailButton}
                                    onPress={() => setSelectedItem(item)} // Buka Modal
                                >
                                    <Text style={styles.detailButtonText}>Cek Detail</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Space Bawah */}
                <View style={{ height: 100 }} />

            </ScrollView>

            {/* --- MODAL DETAIL POPUP --- */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={!!selectedItem}
                onRequestClose={() => setSelectedItem(null)}
            >
                <View style={styles.modalOverlay}>
                    {selectedItem && (
                        <View style={styles.modalContent}>
                            {/* Close Button (X Bulat) */}
                            <TouchableOpacity
                                style={styles.closeButtonContainer}
                                onPress={() => setSelectedItem(null)}
                            >
                                <X size={20} color="#FFF" />
                            </TouchableOpacity>

                            {/* Image Box */}
                            <View style={styles.modalImageContainer}>
                                <Image source={{ uri: selectedItem.image }} style={styles.modalImage} resizeMode="contain" />
                            </View>

                            {/* Status Badge (Center Overlapping) */}
                            <View style={styles.modalBadgeContainer}>
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{selectedItem.status}</Text>
                                </View>
                            </View>

                            {/* Item Details */}
                            <Text style={styles.modalTitle} numberOfLines={2}>
                                {selectedItem.name}
                            </Text>

                            <Text style={styles.modalLabel}>Tempat Terakhir Barang</Text>
                            <Text style={styles.modalValue}>{selectedItem.location}</Text>

                            {/* Contact Button */}
                            <TouchableOpacity style={styles.contactButton}>
                                <Text style={styles.contactButtonText}>Hubungi Kontak</Text>
                            </TouchableOpacity>
                        </View>
                    )}
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
    scrollContent: {
        padding: 20,
        paddingTop: Platform.OS === 'android' ? 40 : 20,
    },
    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        position: 'relative',
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
    headerSubtitleBox: {
        marginLeft: 4,
    },
    headerSubtitle: {
        fontSize: 8,
        color: '#CCC',
        fontWeight: 'bold',
        lineHeight: 8,
    },
    // Search Bar
    searchBar: {
        backgroundColor: COLORS.inputBg,
        borderRadius: 12,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    searchText: {
        color: '#666',
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
        marginBottom: 24,
        paddingHorizontal: 10,
    },
    tabButton: {
        paddingVertical: 8,
        alignItems: 'center',
        flex: 1,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
    },
    tabTextActive: {
        color: COLORS.textWhite,
        fontWeight: 'bold',
    },
    tabTextInactive: {
        color: '#666',
    },
    activeLine: {
        height: 3,
        backgroundColor: COLORS.lime,
        width: '60%',
        marginTop: 4,
        borderRadius: 2,
    },
    // Grid & Card
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 16,
    },
    card: {
        width: '47%',
        backgroundColor: COLORS.cardPurple,
        borderRadius: 16,
        overflow: 'hidden',
        paddingBottom: 12,
    },
    imageContainer: {
        backgroundColor: '#FFF',
        height: 120,
        margin: 10,
        borderRadius: 12,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemImage: {
        width: '100%',
        height: '100%',
    },
    cardContent: {
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    badgeContainer: {
        marginTop: -24,
        marginBottom: 8,
        zIndex: 10,
    },
    badge: {
        backgroundColor: COLORS.badgeLime,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
    },
    badgeText: {
        color: '#000',
        fontSize: 10,
        fontWeight: 'bold',
    },
    itemName: {
        color: COLORS.textWhite,
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 12,
        height: 40,
    },
    detailButton: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        width: '100%',
        alignItems: 'center',
    },
    detailButtonText: {
        color: COLORS.textWhite,
        fontSize: 10,
        fontWeight: '600',
    },

    // --- MODAL STYLES ---
    modalOverlay: {
        flex: 1,
        backgroundColor: COLORS.modalBg,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        width: '85%',
        backgroundColor: COLORS.cardPurple,
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        position: 'relative',
    },
    closeButtonContainer: {
        position: 'absolute',
        top: -15,
        right: -15,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#333', // Warna gelap untuk tombol X di luar ungu
        borderWidth: 2,
        borderColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 20,
    },
    modalImageContainer: {
        width: '100%',
        height: 180,
        backgroundColor: '#FFF',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        padding: 10,
    },
    modalImage: {
        width: '100%',
        height: '100%',
    },
    modalBadgeContainer: {
        position: 'absolute',
        top: 185, // Diatur agar menumpuk di perbatasan foto dan text
        zIndex: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textWhite,
        textAlign: 'center',
        marginBottom: 8,
        marginTop: 10,
    },
    modalLabel: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 8,
    },
    modalValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.cyanText,
        marginBottom: 20,
        textAlign: 'center',
    },
    contactButton: {
        backgroundColor: COLORS.darkPurpleButton,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 20,
        width: '80%',
        alignItems: 'center',
    },
    contactButtonText: {
        color: COLORS.textWhite,
        fontWeight: 'bold',
        fontSize: 14,
    },
});
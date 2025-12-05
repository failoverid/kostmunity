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
    TextInput
} from "react-native";
import {
    ArrowLeft,
    ArrowRight,
    ShoppingBag,
    Home,
    Wallet,
    AlertTriangle,
    Package,
    User,
    X,
    Phone,
    Search,
    Star
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
    modalBg: "rgba(0,0,0,0.7)",
    darkPurpleButton: "#4834d4",
    cyanText: "#5CE1E6",
    navbar: "#262A34",
};

// --- DATA DUMMY LAYANAN ---
const SERVICES = [
    {
        id: 1,
        title: "Laundry Kilat 3 Jam",
        provider: "Berkah Laundry",
        price: "Rp 15.000 /kg",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1545173168-9f1947eebb8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        desc: "Layanan cuci kering setrika super cepat. Bisa antar jemput sampai depan kamar.",
        contact: "0812-3456-7890",
    },
    {
        id: 2,
        title: "Cleaning Service Kamar",
        provider: "Mas Bersih",
        price: "Rp 50.000 /jam",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1581578731117-104f8a74695e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        desc: "Jasa bersih-bersih kamar kos menyeluruh. Termasuk sapu, pel, lap kaca, dan buang sampah.",
        contact: "0821-1122-3344",
    },
    {
        id: 3,
        title: "Pijat Refleksi Panggilan",
        provider: "Pak Budi Sehat",
        price: "Rp 75.000 /jam",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        desc: "Pijat capek dan refleksi khusus pria. Terapis berpengalaman dan bersertifikat.",
        contact: "0857-9988-7766",
    },
    {
        id: 4,
        title: "Service AC & Elektronik",
        provider: "Teknik Maju Jaya",
        price: "Mulai Rp 60.000",
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        desc: "Cuci AC, tambah freon, atau servis kipas angin dan elektronik lainnya.",
        contact: "0813-4455-6677",
    },
    {
        id: 5,
        title: "Antar Jemput Galon",
        provider: "Segar Aqua",
        price: "Rp 5.000 /galon",
        rating: 5.0,
        image: "https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        desc: "Jasa angkut dan pasang galon air mineral ke dispenser Anda. Gratis biaya pasang.",
        contact: "0878-1234-5678",
    },
    {
        id: 6,
        title: "Jasa Angkut Barang",
        provider: "Bang Jago Angkut",
        price: "Nego",
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1600518464441-9154a4dea21e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        desc: "Bantu pindahan kamar atau angkut barang berat. Menyediakan troli.",
        contact: "0896-1122-3344",
    },
];

export default function MitraPage() {
    const router = useRouter();
    const [selectedService, setSelectedService] = useState<(typeof SERVICES)[0] | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredServices = SERVICES.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.provider.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                            <Text style={styles.headerSubtitle}>JASA</Text>
                            <Text style={styles.headerSubtitle}>MITRA</Text>
                        </View>
                    </View>
                </View>

                {/* 2. SEARCH BAR */}
                <View style={styles.searchBar}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="#CariJasa"
                        placeholderTextColor="#AAA"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <View style={styles.arrowCircle}>
                        <Search size={14} color="#AAA" />
                    </View>
                </View>

                {/* 3. GRID SERVICES */}
                <View style={styles.gridContainer}>
                    {filteredServices.map((item) => (
                        <View key={item.id} style={styles.card}>
                            <View style={styles.imageContainer}>
                                <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="cover" />
                                <View style={styles.ratingBadge}>
                                    <Star size={10} color="#000" fill="#000" />
                                    <Text style={styles.ratingText}>{item.rating}</Text>
                                </View>
                            </View>

                            <View style={styles.cardContent}>
                                {/* Badge Provider */}
                                <View style={styles.badgeContainer}>
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText} numberOfLines={1}>{item.provider}</Text>
                                    </View>
                                </View>

                                <Text style={styles.itemName} numberOfLines={2}>{item.title}</Text>
                                <Text style={styles.priceText}>{item.price}</Text>

                                <TouchableOpacity
                                    style={styles.detailButton}
                                    onPress={() => setSelectedService(item)} // Buka Modal
                                >
                                    <Text style={styles.detailButtonText}>Lihat Detail</Text>
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
                visible={!!selectedService}
                onRequestClose={() => setSelectedService(null)}
            >
                <View style={styles.modalOverlay}>
                    {selectedService && (
                        <View style={styles.modalContent}>
                            {/* Close Button */}
                            <TouchableOpacity
                                style={styles.closeButtonContainer}
                                onPress={() => setSelectedService(null)}
                            >
                                <X size={20} color="#FFF" />
                            </TouchableOpacity>

                            {/* Image */}
                            <View style={styles.modalImageContainer}>
                                <Image source={{ uri: selectedService.image }} style={styles.modalImage} resizeMode="cover" />
                                <View style={styles.modalRatingBadge}>
                                    <Star size={12} color="#000" fill="#000" />
                                    <Text style={styles.modalRatingText}>{selectedService.rating}</Text>
                                </View>
                            </View>

                            {/* Provider Badge */}
                            <View style={styles.modalBadgeContainer}>
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{selectedService.provider}</Text>
                                </View>
                            </View>

                            {/* Title & Price */}
                            <Text style={styles.modalTitle} numberOfLines={2}>
                                {selectedService.title}
                            </Text>
                            <Text style={styles.modalPrice}>{selectedService.price}</Text>

                            {/* Description */}
                            <View style={styles.descContainer}>
                                <Text style={styles.modalLabel}>Deskripsi Layanan</Text>
                                <Text style={styles.modalDesc}>{selectedService.desc}</Text>
                            </View>

                            {/* Contact Button */}
                            <TouchableOpacity
                                style={styles.contactButton}
                                onPress={() => {
                                    alert(`Menghubungi ${selectedService.contact}`);
                                }}
                            >
                                <Phone size={18} color="#FFF" style={{ marginRight: 8 }} />
                                <Text style={styles.contactButtonText}>Hubungi Mitra (WA)</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </Modal>

            {/* 4. FLOATING NAVBAR */}
            <View style={styles.floatingNavContainer}>
                <View style={styles.navGroupLeft}>
                    <TouchableOpacity style={styles.navItem} onPress={() => router.push("/dashboard/member")}>
                        <Home size={24} color={COLORS.cardPurple} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navItem} onPress={() => router.push("/dashboard/member/billing")}>
                        <Wallet size={24} color={COLORS.cardPurple} />
                    </TouchableOpacity>
                </View>

                <View style={styles.fabWrapper}>
                    <TouchableOpacity style={styles.fabButton}>
                        <AlertTriangle size={28} color="#000" />
                    </TouchableOpacity>
                </View>

                <View style={styles.navGroupRight}>
                    <TouchableOpacity
                        style={[styles.navItem, styles.navItemActive]}
                        onPress={() => router.push("/dashboard/member/services")}
                    >
                        <Package size={24} color="#000" />
                        <Text style={styles.navLabelActive}>Services</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navItem} onPress={() => router.push("/dashboard/member/profile")}>
                        <User size={24} color={COLORS.cardPurple} />
                    </TouchableOpacity>
                </View>
            </View>

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
    searchInput: {
        flex: 1,
        color: '#FFF',
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

    // Grid
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
        position: 'relative',
    },
    itemImage: {
        width: '100%',
        height: '100%',
    },
    ratingBadge: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: COLORS.lime,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
        gap: 2,
    },
    ratingText: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#000',
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
        maxWidth: 120,
    },
    badgeText: {
        color: '#000',
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    itemName: {
        color: COLORS.textWhite,
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 4,
        height: 40,
    },
    priceText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 10,
        marginBottom: 12,
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
        backgroundColor: '#333',
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
        marginBottom: 20,
        overflow: 'hidden',
        position: 'relative',
    },
    modalImage: {
        width: '100%',
        height: '100%',
    },
    modalRatingBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: COLORS.lime,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    modalRatingText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#000',
    },
    modalBadgeContainer: {
        position: 'absolute',
        top: 185,
        zIndex: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textWhite,
        textAlign: 'center',
        marginBottom: 4,
        marginTop: 10,
    },
    modalPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.cyanText,
        marginBottom: 16,
    },
    descContainer: {
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 12,
        padding: 12,
        marginBottom: 20,
    },
    modalLabel: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.6)',
        marginBottom: 4,
        textTransform: 'uppercase',
        fontWeight: 'bold',
    },
    modalDesc: {
        fontSize: 12,
        color: '#FFF',
        lineHeight: 18,
    },
    contactButton: {
        backgroundColor: COLORS.darkPurpleButton,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 20,
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    contactButtonText: {
        color: COLORS.textWhite,
        fontWeight: 'bold',
        fontSize: 14,
    },

    // Navbar Styles (Sama dengan halaman lain)
    floatingNavContainer: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        height: 70,
        backgroundColor: COLORS.navbar,
        borderRadius: 35,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    navGroupLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'space-around',
        paddingRight: 20,
    },
    navGroupRight: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'space-around',
        paddingLeft: 20,
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
    },
    navItemActive: {
        flexDirection: 'row',
        backgroundColor: COLORS.lime,
        paddingHorizontal: 16,
        width: 'auto',
        height: 44,
        borderRadius: 22,
        gap: 8,
    },
    navLabelActive: {
        fontWeight: 'bold',
        color: '#000',
        fontSize: 14,
    },
    fabWrapper: {
        position: 'absolute',
        left: '50%',
        top: -25,
        marginLeft: -30,
        zIndex: 10,
    },
    fabButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.lime,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: COLORS.background,
        elevation: 5,
    },
});
import FloatingNavbar from "@/components/FloatingNavbar";
import { useRouter } from "expo-router";
import { ArrowLeft, ArrowRight, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Modal, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../../../../contexts/AuthContext";
import { getLostItemsByKostId, LostItem } from "../../../../../services/lostFoundService";

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
};

export default function LostFoundPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<"Semua" | "Ditemukan" | "Kehilangan">("Semua");
    const [selectedItem, setSelectedItem] = useState<LostItem | null>(null);
    const [items, setItems] = useState<LostItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItems = async () => {
            // PERBAIKAN: Tangani jika kostId tidak ada
            if (!user?.kostId) {
                setLoading(false);
                return;
            }
            try {
                const data = await getLostItemsByKostId(user.kostId);
                setItems(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, [user?.kostId]);

    const filteredItems = items.filter(item => {
        if (activeTab === "Semua") return true;
        if (activeTab === "Ditemukan") return item.status === 'found';
        if (activeTab === "Kehilangan") return item.status === 'lost';
        return true;
    });

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={COLORS.lime} />
            </SafeAreaView>
        );
    }

    // ... (Sisa return JSX dan Styles sama) ...
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{ position: 'absolute', left: 0, zIndex: 10 }}
                    >
                        <ArrowLeft size={24} color="#FFF" />
                    </TouchableOpacity>
                    <View style={styles.headerTitleContainer}>
                        <Image
                            source={require("../../../../../assets/kostmunity-logo.png")}
                            style={styles.logoSmall}
                            resizeMode="contain"
                            tintColor={COLORS.textWhite}
                        />
                        <Text style={styles.headerTitle}>Kostmunity</Text>
                        <View style={styles.headerSubtitleBox}>
                            <Text style={styles.headerSubtitle}>LOST &</Text>
                            <Text style={styles.headerSubtitle}>FOUND</Text>
                        </View>
                    </View>
                </View>

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

                {/* TABS UPDATED */}
                <View style={styles.tabContainer}>
                    {["Semua", "Ditemukan", "Kehilangan"].map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setActiveTab(tab as any)}
                            style={styles.tabButton}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    activeTab === tab ? styles.tabTextActive : styles.tabTextInactive
                                ]}
                            >
                                {tab}
                            </Text>
                            {activeTab === tab && <View style={styles.activeLine} />}
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.gridContainer}>
                    {filteredItems.length === 0 ? (
                        <Text style={{ color: '#666', textAlign: 'center', marginTop: 20, width: '100%' }}>Belum ada item.</Text>
                    ) : (
                        filteredItems.map((item) => (
                            <View key={item.id} style={styles.card}>
                                <View style={styles.imageContainer}>
                                    {item.imageUrl ? (
                                        <Image
                                            source={{ uri: item.imageUrl }}
                                            style={styles.itemImage}
                                            resizeMode="cover"
                                        />
                                    ) : (
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ fontSize: 10, color: '#999' }}>No Image</Text>
                                        </View>
                                    )}
                                </View>
                                <View style={styles.cardContent}>
                                    <View style={styles.badgeContainer}>
                                        <View style={[styles.badge, { backgroundColor: item.status === 'found' ? COLORS.lime : '#ff4444' }]}>
                                            <Text style={styles.badgeText}>{item.status === 'found' ? 'Ditemukan' : 'Kehilangan'}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.itemName} numberOfLines={2}>
                                        {item.itemName}
                                    </Text>
                                    <TouchableOpacity
                                        style={styles.detailButton}
                                        onPress={() => setSelectedItem(item)}
                                    >
                                        <Text style={styles.detailButtonText}>Cek Detail</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    )}
                </View>
                <View style={{ height: 100 }} />
            </ScrollView>

            <Modal
                animationType="fade"
                transparent={true}
                visible={!!selectedItem}
                onRequestClose={() => setSelectedItem(null)}
            >
                <View style={styles.modalOverlay}>
                    {selectedItem && (
                        <View style={styles.modalContent}>
                            <TouchableOpacity
                                style={styles.closeButtonContainer}
                                onPress={() => setSelectedItem(null)}
                            >
                                <X size={20} color="#FFF" />
                            </TouchableOpacity>

                            <View style={styles.modalImageContainer}>
                                {selectedItem.imageUrl ? (
                                    <Image
                                        source={{ uri: selectedItem.imageUrl }}
                                        style={styles.modalImage}
                                        resizeMode="contain"
                                    />
                                ) : (
                                    <Text>No Image</Text>
                                )}
                            </View>

                            <View style={styles.modalBadgeContainer}>
                                <View style={[styles.badge, { backgroundColor: selectedItem.status === 'found' ? COLORS.lime : '#ff4444' }]}>
                                    <Text style={styles.badgeText}>{selectedItem.status === 'found' ? 'Ditemukan' : 'Kehilangan'}</Text>
                                </View>
                            </View>

                            <Text style={styles.modalTitle} numberOfLines={2}>
                                {selectedItem.itemName}
                            </Text>
                            <Text style={styles.modalLabel}>Tempat Terakhir Barang</Text>
                            <Text style={styles.modalValue}>
                                {selectedItem.location}
                            </Text>
                            <Text style={styles.modalLabel}>Kontak</Text>
                            <Text style={[styles.modalValue, { fontSize: 14, color: COLORS.textWhite }]}>
                                {selectedItem.contactInfo}
                            </Text>
                        </View>
                    )}
                </View>
            </Modal>
            <FloatingNavbar />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    scrollContent: { padding: 20, paddingTop: Platform.OS === 'android' ? 40 : 20 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        position: 'relative'
    },
    headerTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    logoSmall: { width: 24, height: 24 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.textWhite },
    headerSubtitleBox: { marginLeft: 4 },
    headerSubtitle: { fontSize: 8, color: '#CCC', fontWeight: 'bold', lineHeight: 8 },
    searchBar: {
        backgroundColor: COLORS.inputBg,
        borderRadius: 12,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 20
    },
    searchText: {
        color: '#AAA',
        fontWeight: '600',
        fontSize: 14
    },
    arrowCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#444',
        alignItems: 'center',
        justifyContent: 'center'
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#262A34'
    },
    tabButton: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignItems: 'center',
        flex: 1
    },
    tabText: { fontSize: 14, fontWeight: '500', textAlign: 'center' },
    tabTextActive: { color: COLORS.textWhite, fontWeight: 'bold' },
    tabTextInactive: { color: '#666' },
    activeLine: {
        height: 3,
        backgroundColor: COLORS.lime,
        width: '80%',
        marginTop: 8,
        borderRadius: 2
    },

    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 16
    },
    card: {
        width: '47%',
        backgroundColor: COLORS.cardPurple,
        borderRadius: 16,
        overflow: 'hidden',
        paddingBottom: 12
    },
    imageContainer: {
        backgroundColor: '#FFF',
        height: 120,
        margin: 10,
        borderRadius: 12,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center'
    },
    itemImage: { width: '100%', height: '100%' },
    cardContent: {
        paddingHorizontal: 10,
        alignItems: 'center'
    },
    badgeContainer: {
        marginTop: -24,
        marginBottom: 8,
        zIndex: 10
    },
    badge: {
        backgroundColor: COLORS.badgeLime,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20
    },
    badgeText: { color: '#000', fontSize: 10, fontWeight: 'bold' },
    itemName: {
        color: COLORS.textWhite,
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 12,
        height: 40
    },
    detailButton: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        width: '100%',
        alignItems: 'center'
    },
    detailButtonText: { color: COLORS.textWhite, fontSize: 10, fontWeight: '600' },
    modalOverlay: {
        flex: 1,
        backgroundColor: COLORS.modalBg,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    modalContent: {
        width: '85%',
        backgroundColor: COLORS.cardPurple,
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        position: 'relative'
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
        zIndex: 20
    },
    modalImageContainer: {
        width: '100%',
        height: 180,
        backgroundColor: '#FFF',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        padding: 10
    },
    modalImage: { width: '100%', height: '100%' },
    modalBadgeContainer: { position: 'absolute', top: 185, zIndex: 10 },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textWhite,
        textAlign: 'center',
        marginBottom: 8,
        marginTop: 10
    },
    modalLabel: { fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 8 },
    modalValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.cyanText,
        marginBottom: 20,
        textAlign: 'center'
    },
    contactButton: {
        backgroundColor: COLORS.darkPurpleButton,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 20,
        width: '80%',
        alignItems: 'center'
    },
    contactButtonText: { color: COLORS.textWhite, fontWeight: 'bold', fontSize: 14 },
});
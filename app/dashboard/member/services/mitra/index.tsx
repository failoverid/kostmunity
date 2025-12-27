import FloatingNavbar from "@/components/FloatingNavbar";
import { useRouter } from "expo-router";
import { ArrowLeft, Phone, Search, Star, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Linking,
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

import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from "../../../../../lib/firebase-clients";

interface Ad {
    id: string;
    title: string;
    link: string;
    imageUrl?: string;
    createdAt?: any;
}

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

export default function MitraPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [selectedService, setSelectedService] = useState<Ad | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [services, setServices] = useState<Ad[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = async () => {
        try {
            const q = query(collection(db, "ads"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const loadedData = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    title: data.title || "Layanan Tanpa Nama",
                    link: data.link || "",
                    imageUrl: data.imageUrl || ""
                } as Ad;
            });
            setServices(loadedData);
        } catch (error) {
            console.error("Gagal memuat data mitra:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleContact = (link: string) => {
        if (!link) return;

        let finalUrl = link.trim();

        const cleanNumber = finalUrl.replace(/[-+ ]/g, '');

        if (cleanNumber.startsWith('08')) {
            const formatted = '62' + cleanNumber.substring(1);
            finalUrl = `https://wa.me/${formatted}`;
        }
        else if (cleanNumber.startsWith('62')) {
            finalUrl = `https://wa.me/${cleanNumber}`;
        }
        else if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
            finalUrl = `https://${finalUrl}`;
        }

        console.log("Opening URL:", finalUrl);

        Linking.openURL(finalUrl).catch(err => {
            console.error("Error opening URL:", err);
            Alert.alert("Gagal", "Tidak dapat membuka link kontak.");
        });
    };

    const filteredServices = services.filter(item =>
        (item.title || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={COLORS.lime} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={{ position: 'absolute', left: 0, zIndex: 10 }}>
                        <ArrowLeft size={24} color="#FFF" />
                    </TouchableOpacity>
                    <View style={styles.headerTitleContainer}>
                        <Image source={require("../../../../../assets/kostmunity-logo.png")} style={styles.logoSmall} resizeMode="contain" tintColor={COLORS.textWhite} />
                        <Text style={styles.headerTitle}>Kostmunity</Text>
                        <View style={styles.headerSubtitleBox}><Text style={styles.headerSubtitle}>JASA</Text><Text style={styles.headerSubtitle}>MITRA</Text></View>
                    </View>
                </View>

                <View style={styles.searchBar}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="#CariJasa"
                        placeholderTextColor="#AAA"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <View style={styles.arrowCircle}><Search size={14} color="#AAA" /></View>
                </View>

                {filteredServices.length === 0 ? (
                    <Text style={{ color: '#666', textAlign: 'center', marginTop: 20 }}>Belum ada layanan tersedia.</Text>
                ) : (
                    <View style={styles.gridContainer}>
                        {filteredServices.map((item) => (
                            <View key={item.id} style={styles.card}>
                                <View style={styles.imageContainer}>
                                    <Image
                                        source={{ uri: (item.imageUrl && item.imageUrl !== "") ? item.imageUrl : "https://placehold.co/100" }}
                                        style={styles.itemImage}
                                        resizeMode="cover"
                                    />
                                    <View style={styles.ratingBadge}><Star size={10} color="#000" fill="#000" /><Text style={styles.ratingText}>5.0</Text></View>
                                </View>
                                <View style={styles.cardContent}>
                                    <View style={styles.badgeContainer}><View style={styles.badge}><Text style={styles.badgeText} numberOfLines={1}>Mitra</Text></View></View>
                                    <Text style={styles.itemName} numberOfLines={2}>{item.title}</Text>
                                    <Text style={styles.priceText}>{item.link ? "Hubungi Admin" : "Info"}</Text>
                                    <TouchableOpacity style={styles.detailButton} onPress={() => setSelectedService(item)}>
                                        <Text style={styles.detailButtonText}>Lihat Detail</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
                <View style={{ height: 100 }} />
            </ScrollView>

            <Modal animationType="fade" transparent={true} visible={!!selectedService} onRequestClose={() => setSelectedService(null)}>
                <View style={styles.modalOverlay}>
                    {selectedService && (
                        <View style={styles.modalContent}>
                            <TouchableOpacity style={styles.closeButtonContainer} onPress={() => setSelectedService(null)}><X size={20} color="#FFF" /></TouchableOpacity>
                            <View style={styles.modalImageContainer}>
                                <Image
                                    source={{ uri: (selectedService.imageUrl && selectedService.imageUrl !== "") ? selectedService.imageUrl : "https://placehold.co/200" }}
                                    style={styles.modalImage}
                                    resizeMode="cover"
                                />
                            </View>
                            <View style={styles.modalBadgeContainer}><View style={styles.badge}><Text style={styles.badgeText}>Mitra Terpercaya</Text></View></View>
                            <Text style={styles.modalTitle} numberOfLines={2}>{selectedService.title}</Text>

                            <View style={styles.descContainer}>
                                <Text style={styles.modalLabel}>Info Kontak / Link</Text>
                                <Text style={styles.modalDesc}>{selectedService.link}</Text>
                            </View>

                            <TouchableOpacity style={styles.contactButton} onPress={() => handleContact(selectedService.link)}>
                                <Phone size={18} color="#FFF" style={{ marginRight: 8 }} />
                                <Text style={styles.contactButtonText}>Hubungi Sekarang</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </Modal>
            <FloatingNavbar />
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
        paddingTop: Platform.OS === "android" ? 40 : 20,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 24,
        position: "relative",
    },

    headerTitleContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },

    logoSmall: {
        width: 24,
        height: 24,
    },

    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: COLORS.textWhite,
    },

    headerSubtitleBox: {
        marginLeft: 4,
    },

    headerSubtitle: {
        fontSize: 8,
        color: "#CCC",
        fontWeight: "bold",
        lineHeight: 8,
    },

    searchBar: {
        backgroundColor: COLORS.inputBg,
        borderRadius: 12,
        height: 50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        marginBottom: 20,
    },

    searchInput: {
        flex: 1,
        color: "#FFF",
        fontWeight: "600",
        fontSize: 14,
    },

    arrowCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#444",
        alignItems: "center",
        justifyContent: "center",
    },

    gridContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: 16,
    },

    card: {
        width: "47%",
        backgroundColor: COLORS.cardPurple,
        borderRadius: 16,
        overflow: "hidden",
        paddingBottom: 12,
    },

    imageContainer: {
        backgroundColor: "#FFF",
        height: 120,
        margin: 10,
        borderRadius: 12,
        overflow: "hidden",
        position: "relative",
    },

    itemImage: {
        width: "100%",
        height: "100%",
    },

    ratingBadge: {
        position: "absolute",
        top: 4,
        right: 4,
        backgroundColor: COLORS.lime,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
        gap: 2,
    },

    ratingText: {
        fontSize: 8,
        fontWeight: "bold",
        color: "#000",
    },

    cardContent: {
        paddingHorizontal: 10,
        alignItems: "center",
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
        color: "#000",
        fontSize: 10,
        fontWeight: "bold",
        textAlign: "center",
    },

    itemName: {
        color: COLORS.textWhite,
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 4,
        height: 40,
    },

    priceText: {
        color: "rgba(255,255,255,0.8)",
        fontSize: 10,
        marginBottom: 12,
    },

    detailButton: {
        backgroundColor: "rgba(0,0,0,0.2)",
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        width: "100%",
        alignItems: "center",
    },

    detailButtonText: {
        color: COLORS.textWhite,
        fontSize: 10,
        fontWeight: "600",
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: COLORS.modalBg,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },

    modalContent: {
        width: "85%",
        backgroundColor: COLORS.cardPurple,
        borderRadius: 24,
        padding: 24,
        alignItems: "center",
        position: "relative",
    },

    closeButtonContainer: {
        position: "absolute",
        top: -15,
        right: -15,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#333",
        borderWidth: 2,
        borderColor: "#FFF",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 20,
    },

    modalImageContainer: {
        width: "100%",
        height: 180,
        backgroundColor: "#FFF",
        borderRadius: 16,
        marginBottom: 20,
        overflow: "hidden",
        position: "relative",
    },

    modalImage: {
        width: "100%",
        height: "100%",
    },

    modalRatingBadge: {
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: COLORS.lime,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },

    modalRatingText: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#000",
    },

    modalBadgeContainer: {
        position: "absolute",
        top: 185,
        zIndex: 10,
    },

    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: COLORS.textWhite,
        textAlign: "center",
        marginBottom: 4,
        marginTop: 10,
    },

    modalPrice: {
        fontSize: 16,
        fontWeight: "bold",
        color: COLORS.cyanText,
        marginBottom: 16,
    },

    descContainer: {
        width: "100%",
        backgroundColor: "rgba(0,0,0,0.1)",
        borderRadius: 12,
        padding: 12,
        marginBottom: 20,
    },

    modalLabel: {
        fontSize: 10,
        color: "rgba(255,255,255,0.6)",
        marginBottom: 4,
        textTransform: "uppercase",
        fontWeight: "bold",
    },

    modalDesc: {
        fontSize: 12,
        color: "#FFF",
        lineHeight: 18,
    },

    contactButton: {
        backgroundColor: COLORS.darkPurpleButton,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 20,
        width: "100%",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
    },

    contactButtonText: {
        color: COLORS.textWhite,
        fontWeight: "bold",
        fontSize: 14,
    },
});

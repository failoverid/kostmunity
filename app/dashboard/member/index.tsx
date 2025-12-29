import FloatingNavbar from "@/components/FloatingNavbar";
import { useRouter } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import {
    AlertCircle,
    ArrowRight,
    CreditCard,
    FileSearch,
    HeartHandshake,
    MapPin,
    MessageSquarePlus
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useAuth } from "../../../contexts/AuthContext";
import { db } from "../../../lib/firebase-clients";
import { formatCurrency } from "../../../lib/formatting";
import { Tagihan } from "../../../models/Tagihan";
import { getTagihanByMemberId, getTagihanByRoom } from "../../../services/tagihanService";

const COLORS = {
    background: "#181A20",
    cardDark: "#1F222A",
    purple: "#6C5CE7",
    lime: "#C6F432",
    textWhite: "#FFFFFF",
    textGray: "#9E9E9E",
    red: "#FF4444",
    orange: "#FF9800"
};

const FeatureCard = ({
    title,
    icon,
    onPress
}: {
    title: string;
    icon: React.ReactNode;
    onPress: () => void;
}) => (
    <TouchableOpacity style={styles.featureCard} onPress={onPress}>
        <View style={styles.featureIconContainer}>{icon}</View>
        <View style={styles.featureFooter}>
            <Text style={styles.featureTitle} numberOfLines={2}>
                {title}
            </Text>
            <View style={styles.arrowCircle}>
                <ArrowRight size={14} color={COLORS.textWhite} />
            </View>
        </View>
    </TouchableOpacity>
);

export default function MemberDashboard() {
    const router = useRouter();
    const { user } = useAuth();

    const memberId = user?.memberId || "";
    const kamar = user?.kamar || "";
    const kostId = user?.kostId || "";

    const [memberData, setMemberData] = useState<any>(null);
    const [tagihanList, setTagihanList] = useState<Tagihan[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingTagihan, setLoadingTagihan] = useState(true);

    // Debug log
    console.log("=== MEMBER DASHBOARD DEBUG ===");
    console.log("User:", user);
    console.log("MemberId:", memberId);
    console.log("Kamar:", kamar);
    console.log("KostId:", kostId);

    // Fetch member info
    useEffect(() => {
        console.log("Effect running, memberId:", memberId);
        if (!memberId) {
            console.log("No memberId, skipping fetch");
            setLoading(false);
            return;
        }
        const unsubscribe = onSnapshot(
            doc(db, "memberInfo", memberId),
            (docSnap) => {
                console.log("Firestore snapshot - exists:", docSnap.exists());
                if (docSnap.exists()) {
                    const data = { id: docSnap.id, ...docSnap.data() };
                    console.log("Member data from Firestore:", data);
                    console.log("Room field:", data.room);
                    setMemberData(data);
                } else {
                    console.log("Document does not exist for memberId:", memberId);
                }
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching member:", error);
                setLoading(false);
            }
        );
        return () => unsubscribe();
    }, [memberId]);

    // Fetch tagihan - try by memberId first, then by room
    useEffect(() => {
        const fetchTagihan = async () => {
            console.log("===== FETCHING TAGIHAN START =====");
            setLoadingTagihan(true);
            try {
                let tagihan: Tagihan[] = [];
                
                // Try query by memberId first
                if (memberId) {
                    console.log("Attempting to fetch tagihan by memberId:", memberId);
                    try {
                        tagihan = await getTagihanByMemberId(memberId);
                        console.log("Query by memberId result:", tagihan.length, "items found");
                    } catch (err) {
                        console.error("Error querying by memberId:", err);
                    }
                }
                
                // If no results and we have room and kostId, try query by room
                if (tagihan.length === 0 && (kamar || memberData?.room)) {
                    const room = kamar || memberData?.room;
                    console.log("No tagihan found by memberId, trying by room:", room, "kostId:", kostId);
                    try {
                        tagihan = await getTagihanByRoom(room, kostId);
                        console.log("Query by room result:", tagihan.length, "items found");
                    } catch (err) {
                        console.error("Error querying by room:", err);
                    }
                }
                
                console.log("Final tagihan list:", tagihan);
                console.log("===== FETCHING TAGIHAN END =====");
                setTagihanList(tagihan);
            } catch (error) {
                console.error("Error fetching tagihan:", error);
                setTagihanList([]);
            } finally {
                setLoadingTagihan(false);
            }
        };

        // Only fetch if we have either memberId or room info
        if (memberId || kamar || memberData?.room) {
            console.log("Conditions met, starting fetch. memberId:", memberId, "kamar:", kamar, "memberData?.room:", memberData?.room);
            fetchTagihan();
        } else {
            console.log("No memberId or room info, skipping tagihan fetch");
            setLoadingTagihan(false);
        }
    }, [memberId, kamar, memberData?.room, kostId]);

    // Calculate tagihan stats
    const unpaidTagihan = tagihanList.filter((t: any) => 
        t.status !== "Lunas" && t.status !== "Paid" && t.status !== "paid" && t.status !== "lunas"
    );
    const totalUnpaid = unpaidTagihan.reduce((sum: number, t: any) => sum + t.amount, 0);

    if (loading && loadingTagihan) {
        return (
            <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                <ActivityIndicator size="large" color={COLORS.lime} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.headerTop}>
                    <Image
                        source={require("../../../assets/kostmunity-logo.png")}
                        style={styles.logoSmall}
                        resizeMode="contain"
                        tintColor={COLORS.textWhite}
                    />
                    <Text style={styles.brandName}>Kostmunity</Text>
                </View>

                <View style={styles.welcomeCard}>
                    <View style={styles.welcomeTextContainer}>
                        <Text style={styles.welcomeTitle}>Hi, {memberData?.nama || user?.nama || "Member"}</Text>
                        <Text style={styles.welcomeSubtitle}>
                            Selamat datang di dashboard Anda
                        </Text>
                        <View style={styles.locationBadge}>
                            <MapPin size={14} color="#000" style={{ marginRight: 4 }} />
                            <Text style={styles.locationText}>
                                Kamar {memberData?.room || user?.kamar || "-"}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.graphicContainer}>
                        <Image
                            source={require("../../../assets/kostmunity-logo.png")}
                            style={styles.graphicLogo}
                            resizeMode="contain"
                        />
                    </View>
                </View>

                {/* Tagihan Card */}
                {unpaidTagihan.length > 0 ? (
                    <View style={styles.billCard}>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                                <CreditCard size={20} color={COLORS.red} />
                                <Text style={[styles.billTitle, { marginLeft: 8 }]}>
                                    {unpaidTagihan.length} Tagihan Belum Dibayar
                                </Text>
                            </View>
                            <Text style={styles.billSubtitle}>
                                Total yang harus dibayar
                            </Text>
                            <Text style={styles.billAmount}>{formatCurrency(totalUnpaid)}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.payButton}
                            onPress={() => router.push("/dashboard/member/billing")}
                        >
                            <Text style={styles.payButtonText}>Bayar</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={[styles.billCard, { backgroundColor: "#1a4d2e" }]}>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                                <AlertCircle size={20} color={COLORS.lime} />
                                <Text style={[styles.billTitle, { marginLeft: 8 }]}>
                                    Tidak Ada Tagihan
                                </Text>
                            </View>
                            <Text style={styles.billSubtitle}>
                                Semua tagihan sudah lunas!
                            </Text>
                        </View>
                    </View>
                )}

                <View style={styles.gridContainer}>
                    <FeatureCard
                        title="Jasa Mitra Panggilan"
                        icon={<HeartHandshake size={32} color={COLORS.lime} />}
                        onPress={() => router.push("/dashboard/member/services/mitra")}
                    />
                    <FeatureCard
                        title="Lost and Found"
                        icon={<FileSearch size={32} color={COLORS.lime} />}
                        onPress={() => router.push("/dashboard/member/services/lost-found")}
                    />
                    <FeatureCard
                        title="Aduan dan Feedback"
                        icon={<MessageSquarePlus size={32} color={COLORS.lime} />}
                        onPress={() => router.push("/dashboard/member/services/feedback")}
                    />
                </View>
                <View style={{ height: 120 }} />
            </ScrollView>
            <FloatingNavbar />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    scrollContent: {
        padding: 20,
        paddingTop: Platform.OS === "android" ? 40 : 20
    },
    headerTop: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 24
    },
    logoSmall: { width: 24, height: 24, marginRight: 8 },
    brandName: { color: COLORS.textWhite, fontSize: 20, fontWeight: "bold" },
    welcomeCard: {
        backgroundColor: COLORS.purple,
        borderRadius: 20,
        padding: 20,
        height: 160,
        flexDirection: "row",
        overflow: "hidden",
        position: "relative",
        marginBottom: 16
    },
    welcomeTextContainer: {
        flex: 1,
        zIndex: 2,
        justifyContent: "center",
        paddingRight: 120 // <-- Perbaikan: Memberi ruang pada teks
    },
    welcomeTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: COLORS.textWhite,
        marginBottom: 4
    },
    welcomeSubtitle: {
        fontSize: 12,
        color: "rgba(255,255,255,0.8)",
        marginBottom: 16,
        maxWidth: "90%"
    },
    locationBadge: {
        backgroundColor: COLORS.lime,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center"
    },
    locationText: { color: "#000", fontWeight: "bold", fontSize: 12 },
    graphicContainer: {
        position: "absolute",
        right: -20,
        bottom: -20,
        width: 140,
        height: 140,
        opacity: 0.2, // <-- Perbaikan: Mengurangi opasitas logo
        zIndex: 1 // Memastikan logo di bawah teks
    },
    graphicLogo: { width: "100%", height: "100%", tintColor: COLORS.textWhite },
    billCard: {
        backgroundColor: "#544AB5",
        borderRadius: 20,
        padding: 20,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 24
    },
    billTitle: { fontSize: 18, fontWeight: "bold", color: COLORS.textWhite },
    billSubtitle: {
        fontSize: 12,
        color: "rgba(255,255,255,0.7)",
        marginTop: 2,
        marginBottom: 8
    },
    billAmount: { fontSize: 24, fontWeight: "bold", color: COLORS.textWhite },
    payButton: {
        backgroundColor: "#6EE7B7",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20
    },
    payButtonText: { color: "#000", fontWeight: "bold", fontSize: 14 },
    gridContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12
    },
    featureCard: {
        flex: 1,
        backgroundColor: COLORS.cardDark,
        borderRadius: 16,
        padding: 16,
        minHeight: 140,
        justifyContent: "space-between"
    },
    featureIconContainer: {
        marginBottom: 12
    },
    featureFooter: {
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between"
    },
    featureTitle: {
        color: COLORS.textWhite,
        fontSize: 12,
        fontWeight: "600",
        flex: 1,
        marginRight: 4
    },
    arrowCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "rgba(255,255,255,0.1)",
        alignItems: "center",
        justifyContent: "center"
    }
});
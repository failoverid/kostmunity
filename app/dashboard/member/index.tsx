import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Platform
} from "react-native";
import {
    MapPin,
    HeartHandshake,
    FileSearch,
    MessageSquarePlus,
    ArrowRight
} from "lucide-react-native";
import { useRouter } from "expo-router";
import FloatingNavbar from "@/components/FloatingNavbar"; // Navbar Baru

const COLORS = {
    background: "#181A20",
    cardDark: "#1F222A",
    purple: "#6C5CE7",
    lime: "#C6F432",
    textWhite: "#FFFFFF",
    textGray: "#9E9E9E"
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
                        <Text style={styles.welcomeTitle}>Hi, Marsheli</Text>
                        <Text style={styles.welcomeSubtitle}>
                            Udah diingetin sarapan belum nih sama doi?!
                        </Text>
                        <View style={styles.locationBadge}>
                            <MapPin size={14} color="#000" style={{ marginRight: 4 }} />
                            <Text style={styles.locationText}>Kost Kurnia</Text>
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

                <View style={styles.billCard}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.billTitle}>Tagihan Terdekat</Text>
                        <Text style={styles.billSubtitle}>
                            Uang Kos September - Oktober 2025
                        </Text>
                        <Text style={styles.billAmount}>Rp. 1.600.000</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.payButton}
                        onPress={() => router.push("/dashboard/member/billing")}
                    >
                        <Text style={styles.payButtonText}>Bayar</Text>
                    </TouchableOpacity>
                </View>

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
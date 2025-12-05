import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Platform,
} from "react-native";
import {
    ArrowRight,
    Home,
    Wallet,
    Package,
    User,
    AlertTriangle,
    ShoppingBag,
    HeartHandshake,
    FileSearch,
    MessageSquarePlus
} from "lucide-react-native";
import { useRouter } from "expo-router";

// --- WARNA TEMA ---
const COLORS = {
    background: "#181A20",
    navbar: "#262A34",
    purple: "#6C5CE7",
    lime: "#C6F432",     // Warna ikon service
    cyan: "#5CE1E6",     // Warna panah
    textWhite: "#FFFFFF",
    textGray: "#9E9E9E",
};

// --- DATA LAYANAN ---
const SERVICES = [
    {
        id: 1,
        title: "Jasa Mitra\nPanggilan",
        icon: <HeartHandshake size={40} color={COLORS.lime} />,
        route: "/dashboard/member/services/mitra", // Rute placeholder
    },
    {
        id: 2,
        title: "Lost and\nFound",
        icon: <FileSearch size={40} color={COLORS.lime} />,
        route: "/dashboard/member/services/lost-found",
    },
    {
        id: 3,
        title: "Aduan dan\nFeedback",
        icon: <MessageSquarePlus size={40} color={COLORS.lime} />,
        route: "/dashboard/member/services/feedback",
    },
];

export default function ServicesPage() {
    const router = useRouter();

    const handlePress = (route: string) => {
        console.log("Navigasi ke:", route);
        // router.push(route); // Aktifkan jika halaman detail sudah ada
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* 1. HEADER LOGO */}
                <View style={styles.header}>
                    <View style={styles.logoBox}>
                        <ShoppingBag size={20} color={COLORS.purple} />
                    </View>
                    <Text style={styles.headerTitle}>
                        Layanan . <Text style={{ fontWeight: 'normal' }}>Kostmunity</Text>
                    </Text>
                </View>

                {/* 2. INSTRUCTION TEXT */}
                <Text style={styles.instructionText}>Pilih Salah Satu Jenis Layanan</Text>

                {/* 3. SERVICE CARDS */}
                <View style={styles.cardsContainer}>
                    {SERVICES.map((service) => (
                        <TouchableOpacity
                            key={service.id}
                            style={styles.serviceCard}
                            activeOpacity={0.8}
                            onPress={() => handlePress(service.route)}
                        >
                            {/* Icon Kiri */}
                            <View style={styles.iconContainer}>
                                {service.icon}
                            </View>

                            {/* Teks Tengah */}
                            <View style={styles.textContainer}>
                                <Text style={styles.serviceTitle}>{service.title}</Text>
                            </View>

                            {/* Panah Kanan */}
                            <View style={styles.arrowContainer}>
                                <ArrowRight size={32} color={COLORS.cyan} />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Space for Navbar */}
                <View style={{ height: 100 }} />

            </ScrollView>

            {/* 4. FLOATING NAVBAR */}
            <View style={styles.floatingNavContainer}>

                {/* Kiri */}
                <View style={styles.navGroupLeft}>
                    <TouchableOpacity style={styles.navItem} onPress={() => router.push("/dashboard/member")}>
                        <Home size={24} color={COLORS.purple} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.navItem} onPress={() => router.push("/dashboard/member/billing")}>
                        <Wallet size={24} color={COLORS.purple} />
                    </TouchableOpacity>
                </View>

                {/* Tengah (FAB) */}
                <View style={styles.fabWrapper}>
                    <TouchableOpacity style={styles.fabButton}>
                        <AlertTriangle size={28} color="#000" />
                    </TouchableOpacity>
                </View>

                {/* Kanan */}
                <View style={styles.navGroupRight}>
                    {/* Active Services Tab */}
                    <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
                        <Package size={24} color="#000" />
                        <Text style={styles.navLabelActive}>Services</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.navItem} onPress={() => router.push("/dashboard/member/profile")}>
                        <User size={24} color={COLORS.purple} />
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
        marginBottom: 40, // Jarak agak jauh ke instruksi
        gap: 8,
    },
    logoBox: {
        width: 32,
        height: 32,
        backgroundColor: 'rgba(108, 92, 231, 0.2)',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textWhite,
    },

    // Content
    instructionText: {
        textAlign: 'center',
        color: '#666',
        fontSize: 14,
        marginBottom: 24,
    },
    cardsContainer: {
        gap: 20,
    },
    serviceCard: {
        backgroundColor: COLORS.purple,
        borderRadius: 20,
        height: 100,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        // Shadow ringan
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    iconContainer: {
        width: 50,
        alignItems: 'flex-start',
    },
    textContainer: {
        flex: 1,
        paddingHorizontal: 10,
    },
    serviceTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textWhite,
        lineHeight: 24,
    },
    arrowContainer: {
        width: 40,
        alignItems: 'flex-end',
    },

    // Navbar
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
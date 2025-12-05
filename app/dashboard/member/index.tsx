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
    Platform,
    Dimensions,
} from "react-native";
import {
    MapPin,
    HeartHandshake,
    FileSearch,
    MessageSquarePlus,
    ArrowRight,
    Home,
    Wallet,
    Package,
    User,
    AlertTriangle
} from "lucide-react-native";
import { useRouter } from "expo-router";

// --- WARNA TEMA (Sesuai Desain) ---
const COLORS = {
    background: "#181A20",    // Dark background
    cardDark: "#1F222A",      // Untuk grid item
    purple: "#6C5CE7",        // Warna utama banner
    lime: "#C6F432",          // Warna aksen tombol/badge
    textWhite: "#FFFFFF",
    textGray: "#9E9E9E",
    navbar: "#262A34",        // Background navbar
};

// --- KOMPONEN FITUR GRID ---
const FeatureCard = ({ title, icon, onPress }: { title: string, icon: React.ReactNode, onPress: () => void }) => (
    <TouchableOpacity style={styles.featureCard} onPress={onPress}>
        <View style={styles.featureIconContainer}>
            {icon}
        </View>
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

            {/* Scrollable Content */}
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* 1. HEADER LOGO */}
                <View style={styles.headerTop}>
                    <Image
                        source={require("../../../assets/kostmunity-logo.png")}
                        style={styles.logoSmall}
                        resizeMode="contain"
                        tintColor={COLORS.textWhite} // Logo jadi putih agar kontras
                    />
                    <Text style={styles.brandName}>Kostmunity</Text>
                </View>

                {/* 2. WELCOME BANNER (Kartu Ungu) */}
                <View style={styles.welcomeCard}>
                    <View style={styles.welcomeTextContainer}>
                        <Text style={styles.welcomeTitle}>Hi, Marsheli</Text>
                        <Text style={styles.welcomeSubtitle}>
                            Udah diingetin sarapan belum nih sama doi?!
                        </Text>

                        {/* Lokasi Badge */}
                        <View style={styles.locationBadge}>
                            <MapPin size={14} color="#000" style={{ marginRight: 4 }} />
                            <Text style={styles.locationText}>Kost Kurnia</Text>
                        </View>
                    </View>

                    {/* Ilustrasi Grafis Kanan (Menggunakan potongan logo besar/abstrak) */}
                    <View style={styles.graphicContainer}>
                        <Image
                            source={require("../../../assets/kostmunity-logo.png")}
                            style={styles.graphicLogo}
                            resizeMode="contain"
                        />
                    </View>
                </View>

                {/* 3. TAGIHAN CARD */}
                <View style={styles.billCard}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.billTitle}>Tagihan Terdekat</Text>
                        <Text style={styles.billSubtitle}>Uang Kos September - Oktober 2025</Text>
                        <Text style={styles.billAmount}>Rp. 1.600.000</Text>
                    </View>
                    <TouchableOpacity style={styles.payButton}>
                        <Text style={styles.payButtonText}>Bayar</Text>
                    </TouchableOpacity>
                </View>

                {/* 4. FITUR GRID (3 Menu Utama) */}
                <View style={styles.gridContainer}>
                    <FeatureCard
                        title="Jasa Mitra Panggilan"
                        icon={<HeartHandshake size={32} color={COLORS.lime} />}
                        onPress={() => console.log("Jasa Mitra")}
                    />
                    <FeatureCard
                        title="Lost and Found"
                        icon={<FileSearch size={32} color={COLORS.lime} />}
                        onPress={() => console.log("Lost Found")}
                    />
                    <FeatureCard
                        title="Aduan dan Feedback"
                        icon={<MessageSquarePlus size={32} color={COLORS.lime} />}
                        onPress={() => console.log("Aduan")}
                    />
                </View>

                {/* Space kosong di bawah untuk agar konten tidak tertutup navbar */}
                <View style={{ height: 120 }} />

            </ScrollView>

            {/* 5. FLOATING NAVBAR (Sticky & Mengambang) */}
            <View style={styles.floatingNavContainer}>

                {/* Tombol Navbar Kiri */}
                <View style={styles.navGroupLeft}>
                    <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
                        <Home size={24} color="#000" />
                        <Text style={styles.navLabelActive}>Home</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.navItem}>
                        <Wallet size={24} color={COLORS.purple} />
                    </TouchableOpacity>
                </View>

                {/* Floating Action Button (FAB) - Kuning/Lime Besar */}
                <View style={styles.fabWrapper}>
                    <TouchableOpacity style={styles.fabButton}>
                        <AlertTriangle size={28} color="#000" />
                    </TouchableOpacity>
                </View>

                {/* Tombol Navbar Kanan */}
                <View style={styles.navGroupRight}>
                    <TouchableOpacity style={styles.navItem}>
                        <Package size={24} color={COLORS.purple} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.navItem}>
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

    // --- HEADER ---
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    logoSmall: {
        width: 24,
        height: 24,
        marginRight: 8,
    },
    brandName: {
        color: COLORS.textWhite,
        fontSize: 20,
        fontWeight: 'bold',
    },

    // --- WELCOME CARD ---
    welcomeCard: {
        backgroundColor: COLORS.purple,
        borderRadius: 20,
        padding: 20,
        height: 160,
        flexDirection: 'row',
        overflow: 'hidden',
        position: 'relative',
        marginBottom: 16,
    },
    welcomeTextContainer: {
        flex: 1,
        zIndex: 2,
        justifyContent: 'center',
    },
    welcomeTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.textWhite,
        marginBottom: 4,
    },
    welcomeSubtitle: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 16,
        maxWidth: '90%',
    },
    locationBadge: {
        backgroundColor: COLORS.lime,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 12,
    },
    graphicContainer: {
        position: 'absolute',
        right: -20,
        bottom: -20,
        width: 140,
        height: 140,
        opacity: 0.9,
    },
    graphicLogo: {
        width: '100%',
        height: '100%',
        tintColor: COLORS.textWhite, // Membuat grafis jadi putih transparan
    },

    // --- BILL CARD ---
    billCard: {
        backgroundColor: '#544AB5', // Sedikit lebih gelap dari purple utama
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    billTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textWhite,
    },
    billSubtitle: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 2,
        marginBottom: 8,
    },
    billAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textWhite,
    },
    payButton: {
        backgroundColor: '#6EE7B7', // Warna cyan/hijau muda
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    payButtonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 14,
    },

    // --- GRID MENU ---
    gridContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    featureCard: {
        flex: 1,
        backgroundColor: COLORS.cardDark,
        borderRadius: 16,
        padding: 16,
        minHeight: 140,
        justifyContent: 'space-between',
    },
    featureIconContainer: {
        marginBottom: 12,
    },
    featureFooter: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    featureTitle: {
        color: COLORS.textWhite,
        fontSize: 12,
        fontWeight: '600',
        flex: 1,
        marginRight: 4,
    },
    arrowCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // --- FLOATING NAVBAR ---
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
        // Shadow untuk efek mengambang
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
        width: 'auto', // override fixed width
        height: 44,
        borderRadius: 22,
        gap: 8,
    },
    navLabelActive: {
        fontWeight: 'bold',
        color: '#000',
        fontSize: 14,
    },

    // Floating Action Button (Center)
    fabWrapper: {
        position: 'absolute',
        left: '50%',
        top: -25, // Naik ke atas sedikit
        marginLeft: -30, // Setengah dari width (60/2)
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
        borderColor: COLORS.background, // Memberi efek "terpotong" di navbar
        elevation: 5,
    },
});
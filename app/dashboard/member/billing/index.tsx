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
    Dimensions,
} from "react-native";
import {
    ArrowLeft,
    Home,
    Wallet,
    Package,
    User,
    AlertTriangle,
    ShoppingBag // Ikon tas belanja untuk logo header
} from "lucide-react-native";
import { useRouter } from "expo-router";

// --- WARNA TEMA ---
const COLORS = {
    background: "#181A20",
    cardDark: "#1F222A",
    purple: "#6C5CE7",
    lime: "#C6F432",
    cyan: "#5CE1E6",        // Warna tombol Bayar
    textWhite: "#FFFFFF",
    textGray: "#9E9E9E",
    navbar: "#262A34",
    danger: "#FF4D4D",      // Warna badge terlambat (jika perlu)
    badgeDark: "rgba(0,0,0,0.2)", // Badge background transparan gelap
};

// --- DATA DUMMY ---
const ACTIVE_BILLS = [
    {
        id: 1,
        title: "Uang Kos September 2025",
        dueDate: "1 Oktober 2025",
        amount: "Rp. 800.000",
        status: "Terlambat", // Ada badge khusus
    },
    {
        id: 2,
        title: "Uang Kos Oktober 2025",
        dueDate: "1 November 2025",
        amount: "Rp. 800.000",
        status: "Unpaid",
    },
    {
        id: 3,
        title: "Uang Kos November 2025",
        dueDate: "1 Desember 2025",
        amount: "Rp. 800.000",
        status: "Unpaid",
    },
    {
        id: 4,
        title: "Uang Kos Desember 2025",
        dueDate: "1 Januari 2026",
        amount: "Rp. 800.000",
        status: "Unpaid",
    },
];

const HISTORY_BILLS = [
    {
        id: 101,
        title: "Uang Kos Juli 2025",
        dueDate: "1 Agustus 2025",
        amount: "Rp. 800.000",
        historyStatus: "Tepat Waktu",
    },
    {
        id: 102,
        title: "Uang Kos Agustus 2025",
        dueDate: "1 September 2025",
        amount: "Rp. 800.000",
        historyStatus: "Terlambat 10 Hari",
    },
];

export default function BillingPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"bills" | "paid">("bills");

    // --- KOMPONEN KARTU TAGIHAN (UNGU) ---
    const renderBillCard = (item: typeof ACTIVE_BILLS[0]) => (
        <View key={item.id} style={styles.billCard}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubtitle}>Jatuh Tempo : {item.dueDate}</Text>
            </View>

            {/* Garis Pemisah Tipis */}
            <View style={styles.divider} />

            <View style={styles.cardFooter}>
                <Text style={styles.amountText}>{item.amount}</Text>

                <View style={styles.actionRow}>
                    {item.status === "Terlambat" && (
                        <View style={styles.statusBadge}>
                            <Text style={styles.statusText}>Terlambat</Text>
                        </View>
                    )}
                    <TouchableOpacity style={styles.payButton}>
                        <Text style={styles.payButtonText}>Bayar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    // --- KOMPONEN KARTU RIWAYAT (GELAP) ---
    const renderHistoryCard = (item: typeof HISTORY_BILLS[0]) => (
        <View key={item.id} style={styles.historyCard}>
            <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: '#888' }]}>{item.title}</Text>
                <Text style={styles.cardSubtitle}>Jatuh Tempo : {item.dueDate}</Text>
            </View>

            <View style={[styles.divider, { backgroundColor: '#333' }]} />

            <View style={styles.cardFooter}>
                <Text style={[styles.amountText, { color: '#666' }]}>{item.amount}</Text>

                <View style={styles.historyBadge}>
                    <Text style={styles.historyBadgeText}>{item.historyStatus}</Text>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

            {/* 1. HEADER (Logo + Title) */}
            <View style={styles.header}>
                <View style={styles.headerTitleContainer}>
                    <View style={styles.logoBox}>
                        <ShoppingBag size={20} color={COLORS.purple} />
                    </View>
                    <Text style={styles.headerTitle}>
                        Tagihan . <Text style={{ fontWeight: 'normal' }}>Kostmunity</Text>
                    </Text>
                </View>
            </View>

            {/* 2. TAB SWITCHER */}
            <View style={styles.tabContainer}>
                <View style={styles.tabWrapper}>
                    <TouchableOpacity
                        style={[styles.tabButton, activeTab === "bills" && styles.tabActive]}
                        onPress={() => setActiveTab("bills")}
                    >
                        <Text style={[styles.tabText, activeTab === "bills" && styles.tabTextActive]}>Tagihan</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tabButton, activeTab === "paid" && styles.tabActive]}
                        onPress={() => setActiveTab("paid")}
                    >
                        <Text style={[styles.tabText, activeTab === "paid" && styles.tabTextActive]}>Lunas</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* 3. SCROLL CONTENT */}
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {activeTab === "bills"
                    ? ACTIVE_BILLS.map(renderBillCard)
                    : HISTORY_BILLS.map(renderHistoryCard)
                }

                {/* Space untuk Navbar */}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* 4. FLOATING NAVBAR (Menu "Bills" Aktif) */}
            <View style={styles.floatingNavContainer}>

                {/* Kiri */}
                <View style={styles.navGroupLeft}>
                    <TouchableOpacity style={styles.navItem} onPress={() => router.push("/dashboard/member")}>
                        <Home size={24} color={COLORS.purple} />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
                        <Wallet size={24} color="#000" />
                        <Text style={styles.navLabelActive}>Bills</Text>
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

    // Header
    header: {
        paddingTop: Platform.OS === 'android' ? 40 : 20,
        paddingHorizontal: 20,
        paddingBottom: 20,
        alignItems: 'center',
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    logoBox: {
        width: 32,
        height: 32,
        backgroundColor: 'rgba(108, 92, 231, 0.2)', // Ungu transparan
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textWhite,
    },

    // Tabs
    tabContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    tabWrapper: {
        flexDirection: 'row',
        backgroundColor: '#262A34',
        borderRadius: 20,
        padding: 4,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 16,
    },
    tabActive: {
        backgroundColor: '#333', // Sedikit lebih terang dari background wrapper jika tidak ada warna spesifik, tapi di desain sepertinya underline
        // Di desain ada garis bawah hijau lime, kita coba pakai borderBottom untuk simulasi atau background penuh
        borderBottomWidth: 2,
        borderBottomColor: COLORS.lime,
        backgroundColor: 'transparent',
        borderRadius: 0,
    },
    tabText: {
        color: '#666',
        fontWeight: '600',
        fontSize: 14,
    },
    tabTextActive: {
        color: COLORS.textWhite,
    },

    // Scroll Content
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        gap: 16,
    },

    // --- Bill Card (Ungu) ---
    billCard: {
        backgroundColor: COLORS.purple,
        borderRadius: 20,
        padding: 20,
    },
    cardHeader: {
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textWhite,
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginBottom: 12,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    amountText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textWhite,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statusBadge: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusText: {
        color: COLORS.textWhite,
        fontSize: 10,
        fontWeight: '600',
    },
    payButton: {
        backgroundColor: COLORS.cyan,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    payButtonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 12,
    },

    // --- History Card (Dark) ---
    historyCard: {
        backgroundColor: COLORS.cardDark,
        borderRadius: 20,
        padding: 20,
    },
    historyBadge: {
        backgroundColor: '#333',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    historyBadgeText: {
        color: '#AAA',
        fontSize: 10,
        fontWeight: '600',
    },

    // --- Navbar (Copied & Adjusted) ---
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
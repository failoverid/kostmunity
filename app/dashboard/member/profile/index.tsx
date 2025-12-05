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
} from "react-native";
import {
    ArrowRight,
    Home,
    Wallet,
    Package,
    User,
    AlertTriangle,
    Camera,
    FileText,
    Lock,
    Headphones,
    Star,
    ShieldCheck,
    Info,
    LogOut,
    ShoppingBag
} from "lucide-react-native";
import { useRouter } from "expo-router";

// --- WARNA TEMA ---
const COLORS = {
    background: "#181A20",
    navbar: "#262A34",
    purple: "#6C5CE7",
    lime: "#C6F432",
    textWhite: "#FFFFFF",
    textGray: "#9E9E9E",
    divider: "rgba(255, 255, 255, 0.1)",
};

// --- KOMPONEN MENU ITEM ---
const MenuItem = ({ icon, title, onPress }: { icon: React.ReactNode, title: string, onPress?: () => void }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <View style={styles.menuIconContainer}>
            {icon}
        </View>
        <Text style={styles.menuText}>{title}</Text>
    </TouchableOpacity>
);

export default function ProfilePage() {
    const router = useRouter();

    const handleSignOut = () => {
        // Logika logout bisa ditambahkan di sini
        router.replace("/(auth)/onboarding");
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
                    <Text style={styles.headerTitle}>Kostmunity</Text>
                </View>

                {/* 2. PROFILE SECTION */}
                <View style={styles.profileSection}>
                    <View style={styles.avatarContainer}>
                        {/* Placeholder Avatar */}
                        <View style={styles.avatarPlaceholder}>
                            <User size={64} color="#555" />
                        </View>
                        {/* Camera Icon Button */}
                        <TouchableOpacity style={styles.cameraButton}>
                            <Camera size={14} color="#000" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.userName}>Marsheli Diva Muftiasa</Text>
                    <Text style={styles.userStatus}>
                        Member <Text style={{ color: COLORS.purple, fontWeight: 'bold' }}>Kos Kurnia</Text> Sejak <Text style={{ color: COLORS.purple }}>Juli 2025</Text>
                    </Text>
                </View>

                {/* 3. MENU GROUP 1 (Settings) */}
                <View style={styles.menuGroup}>
                    <MenuItem
                        icon={<FileText size={20} color={COLORS.textWhite} />}
                        title="Riwayat Pembayaran"
                    />
                    <MenuItem
                        icon={<Lock size={20} color={COLORS.textWhite} />}
                        title="Ganti Password"
                    />
                    <MenuItem
                        icon={<Headphones size={20} color={COLORS.textWhite} />}
                        title="Customer Service"
                    />
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* 4. MENU GROUP 2 (Info) */}
                <View style={styles.menuGroup}>
                    <MenuItem
                        icon={<Star size={20} color={COLORS.textWhite} />}
                        title="Review Kami di PlayStore/AppStore"
                    />
                    <MenuItem
                        icon={<ShieldCheck size={20} color={COLORS.textWhite} />}
                        title="Kebijakan & Privasi"
                    />
                    <MenuItem
                        icon={<Info size={20} color={COLORS.textWhite} />}
                        title="Tentang Kostmunity"
                    />
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* 5. SIGN OUT BUTTON */}
                <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                    <LogOut size={20} color={COLORS.lime} style={{ marginRight: 8 }} />
                    <Text style={styles.signOutText}>Sign Out</Text>
                </TouchableOpacity>

                {/* App Version */}
                <Text style={styles.versionText}>App Version 0.0.1 © Kostmunity 2025</Text>

                {/* Space for Navbar */}
                <View style={{ height: 100 }} />

            </ScrollView>

            {/* 6. FLOATING NAVBAR */}
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
                    <TouchableOpacity style={styles.navItem}>
                        <Package size={24} color={COLORS.purple} />
                    </TouchableOpacity>

                    {/* Active Profile */}
                    <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
                        <User size={24} color="#000" />
                        <Text style={styles.navLabelActive}>Profile</Text>
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
        marginBottom: 32,
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

    // Profile Section
    profileSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 20, // Rounded square-ish like design
        backgroundColor: '#333',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cameraButton: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        backgroundColor: '#FFF',
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: COLORS.background,
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.lime, // Lime color for name
        marginBottom: 4,
        textAlign: 'center',
    },
    userStatus: {
        fontSize: 12,
        color: COLORS.textGray,
        textAlign: 'center',
    },

    // Menus
    menuGroup: {
        marginVertical: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    menuIconContainer: {
        width: 32,
        alignItems: 'center',
        marginRight: 12,
    },
    menuText: {
        fontSize: 16,
        color: COLORS.textWhite,
        fontWeight: '400',
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.divider,
        marginVertical: 8,
    },

    // Sign Out
    signOutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 24,
    },
    signOutText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.lime,
    },
    versionText: {
        textAlign: 'center',
        fontSize: 10,
        color: '#555',
        marginTop: 8,
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
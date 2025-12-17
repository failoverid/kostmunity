import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from "react-native";
import { Home, Wallet, Package, User, AlertTriangle } from "lucide-react-native";
import { useRouter, usePathname } from "expo-router";

const COLORS = {
    navbar: "#262A34",
    purple: "#6C5CE7",
    lime: "#C6F432",
    textWhite: "#FFFFFF",
    activeBackground: "#181A20",
};

export default function FloatingNavbar() {
    const router = useRouter();
    const pathname = usePathname();
    const { width } = useWindowDimensions();

    const showLabels = width > 450;

    const isActive = (route: string) => {
        if (route === "/dashboard/member" && pathname === "/dashboard/member") return true;
        if (route !== "/dashboard/member" && pathname.startsWith(route)) return true;
        return false;
    };

    return (
        <View style={styles.container}>

            {/* --- GROUP KIRI (Home & Bill) --- */}
            <View style={styles.navGroup}>
                <TouchableOpacity
                    style={[styles.item, isActive("/dashboard/member") && styles.itemActive]}
                    onPress={() => router.replace("/dashboard/member")}
                >
                    <Home size={24} color={isActive("/dashboard/member") ? COLORS.lime : COLORS.purple} />
                    {showLabels && isActive("/dashboard/member") && <Text style={styles.labelActive}>Home</Text>}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.item, isActive("/dashboard/member/billing") && styles.itemActive]}
                    onPress={() => router.replace("/dashboard/member/billing")}
                >
                    <Wallet size={24} color={isActive("/dashboard/member/billing") ? COLORS.lime : COLORS.purple} />
                    {showLabels && isActive("/dashboard/member/billing") && <Text style={styles.labelActive}>Bills</Text>}
                </TouchableOpacity>
            </View>

            {/* --- SPACER TENGAH (Untuk memberi ruang bagi tombol Warning) --- */}
            <View style={styles.centerSpacer} />

            {/* --- GROUP KANAN (Services & Profile) --- */}
            <View style={styles.navGroup}>
                <TouchableOpacity
                    style={[styles.item, isActive("/dashboard/member/services") && styles.itemActive]}
                    onPress={() => router.replace("/dashboard/member/services")}
                >
                    <Package size={24} color={isActive("/dashboard/member/services") ? COLORS.lime : COLORS.purple} />
                    {showLabels && isActive("/dashboard/member/services") && <Text style={styles.labelActive}>Services</Text>}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.item, isActive("/dashboard/member/profile") && styles.itemActive]}
                    onPress={() => router.replace("/dashboard/member/profile")}
                >
                    <User size={24} color={isActive("/dashboard/member/profile") ? COLORS.lime : COLORS.purple} />
                    {showLabels && isActive("/dashboard/member/profile") && <Text style={styles.labelActive}>Profile</Text>}
                </TouchableOpacity>
            </View>

            {/* --- TOMBOL WARNING (ABSOLUTE CENTER) --- */}
            {/* Ditaruh di luar flow agar posisinya absolut di tengah dan tidak terpengaruh lebar item lain */}
            <TouchableOpacity
                style={styles.fabButton}
                onPress={() => router.push("/dashboard/member/warning")}
                activeOpacity={0.8}
            >
                <AlertTriangle size={28} color="#000" fill="none" strokeWidth={2.5} />
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        height: 70,
        backgroundColor: COLORS.navbar,
        borderRadius: 35,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
        zIndex: 100,
    },
    navGroup: {
        flex: 1, // Mengambil sisa ruang yang ada
        flexDirection: 'row',
        justifyContent: 'space-evenly', // Membagi jarak antar item secara rata
        alignItems: 'center',
        height: '100%',
    },
    centerSpacer: {
        width: 70, // Memberi ruang kosong di tengah agar item tidak tertutup tombol Warning
    },
    item: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 44,
        borderRadius: 22,
        minWidth: 44, // Lebar minimum icon
    },
    itemActive: {
        flexDirection: 'row',
        backgroundColor: COLORS.activeBackground,
        paddingHorizontal: 12,
        gap: 8,
    },
    labelActive: {
        fontWeight: 'bold',
        color: COLORS.lime,
        fontSize: 12,
    },

    fabButton: {
        position: 'absolute',
        left: '50%',
        marginLeft: -28,
        bottom: 25,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.lime,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: '#181A20',
        elevation: 5,
        shadowColor: COLORS.lime,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        zIndex: 110,
    },
});
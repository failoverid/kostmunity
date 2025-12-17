import React, { useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Image, TouchableOpacity } from "react-native";
import { AlertTriangle } from "lucide-react-native";
import { useRouter } from "expo-router";

import FloatingNavbar from "@/components/FloatingNavbar";

// --- WARNA TEMA ---
const COLORS = {
    background: "#181A20",
    lime: "#C6F432",
    textWhite: "#FFFFFF",
    purple: "#6C5CE7",
};

export default function WarningPage() {
    const router = useRouter();

    useEffect(() => {
        console.log("EMERGENCY TRIGGERED!");
        // Logika kirim notifikasi darurat bisa ditaruh di sini
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

            {/* Header */}
            <View style={styles.header}>
                <Image
                    source={require("../../../../assets/kostmunity-logo.png")}
                    style={styles.logoSmall}
                    resizeMode="contain"
                    tintColor={COLORS.textWhite}
                />
                <Text style={styles.headerTitle}>Kostmunity</Text>
            </View>

            {/* Content Tengah (Digabung dengan tombol batal agar naik bareng) */}
            <View style={styles.centerContent}>

                {/* Lingkaran Peringatan Besar */}
                <View style={styles.warningCircle}>
                    <AlertTriangle size={120} color="#181A20" strokeWidth={2.5} />
                </View>

                {/* Teks Peringatan */}
                <Text style={styles.warningTitle}>Tombol Darurat</Text>
                <Text style={styles.warningTitle}>Telah Diaktifkan</Text>

                {/* Kotak Notifikasi */}
                <View style={styles.notificationBox}>
                    <Text style={styles.notificationText}>
                        Notifikasi darurat telah dikirimkan ke seluruh admin kos dan member
                    </Text>
                </View>

                {/* Tombol Kembali Darurat (Dimasukkan ke sini agar ikut naik) */}
                <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
                    <Text style={styles.cancelText}>Batalkan Status Darurat</Text>
                </TouchableOpacity>

            </View>

            <FloatingNavbar />

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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
        gap: 8,
    },
    logoSmall: {
        width: 24,
        height: 24,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textWhite,
    },

    // Center Content
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        marginTop: -100, // Dinaikkan lebih tinggi (tadinya -50)
    },
    warningCircle: {
        width: 220,
        height: 220,
        borderRadius: 110,
        backgroundColor: COLORS.lime,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        shadowColor: COLORS.lime,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 20,
        elevation: 15,
    },
    warningTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.textWhite,
        textAlign: 'center',
        lineHeight: 34,
    },
    notificationBox: {
        marginTop: 30,
        borderWidth: 1,
        borderColor: COLORS.lime,
        borderRadius: 20,
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: 'rgba(198, 244, 50, 0.1)',
    },
    notificationText: {
        color: COLORS.lime,
        textAlign: 'center',
        fontSize: 14,
        fontStyle: 'italic',
        fontWeight: '500',
    },

    // Cancel Button (Sekarang relatif terhadap konten di atasnya)
    cancelButton: {
        marginTop: 50, // Jarak dari kotak notifikasi
        paddingVertical: 10,
    },
    cancelText: {
        color: '#666',
        textDecorationLine: 'underline',
        fontSize: 14,
    },
});
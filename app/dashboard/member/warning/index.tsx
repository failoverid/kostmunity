import { useAuth } from "@/contexts/AuthContext";
import { createEmergency, updateEmergencyStatus } from "@/lib/emergency";
import { db } from "@/lib/firebase-clients";
import { useRouter } from "expo-router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { AlertTriangle } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Image, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, Vibration, View } from "react-native";

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
    const { user } = useAuth();
    const [emergencyId, setEmergencyId] = useState<string | null>(null);
    const [isActive, setIsActive] = useState(false);
    const notificationInterval = useRef<NodeJS.Timeout | null>(null);

    // Debug AuthContext
    useEffect(() => {
        console.log("=== AUTH CONTEXT DEBUG ===");
        console.log("User:", user);
        console.log("kostId:", user?.kostId);
        console.log("uid:", user?.uid);
        console.log("nama:", user?.nama);
    }, [user]);

    // Fungsi untuk trigger emergency
    const triggerEmergency = async () => {
        console.log("=== TRIGGER EMERGENCY ===");
        console.log("kostId:", user?.kostId);
        console.log("uid:", user?.uid);
        console.log("nama:", user?.nama);

        if (!user?.kostId || !user?.uid) {
            console.error("ERROR: Missing kostId or uid!");
            Alert.alert("Error", `Data user tidak lengkap\nkostId: ${user?.kostId}\nuid: ${user?.uid}`);
            return;
        }

        try {
            console.log("Creating emergency in Firestore...");
            
            // Buat emergency di Firestore
            const result = await createEmergency({
                userId: user.uid,
                kostId: user.kostId,
                message: `DARURAT! ${user.nama || "Member"} membutuhkan bantuan segera!`,
            });

            console.log("Emergency creation result:", result);

            if (result.success && result.id) {
                console.log("Emergency created successfully with ID:", result.id);
                setEmergencyId(result.id);
                setIsActive(true);
                
                // Vibration pattern: [wait, vibrate, wait, vibrate, ...]
                Vibration.vibrate([0, 500, 200, 500]);
            } else {
                console.error("Emergency creation failed:", result);
                Alert.alert("Error", "Gagal membuat emergency alert. Check console.");
            }
        } catch (error) {
            console.error("Exception creating emergency:", error);
            Alert.alert("Error", `Terjadi kesalahan: ${error}`);
        }
    };

    // Fungsi untuk batalkan emergency
    const cancelEmergency = async () => {
        if (emergencyId) {
            await updateEmergencyStatus(emergencyId, "handled");
            setIsActive(false);
            setEmergencyId(null);
            
            // Stop notifikasi
            if (notificationInterval.current) {
                clearInterval(notificationInterval.current);
                notificationInterval.current = null;
            }
            
            Alert.alert("Status Darurat Dibatalkan", "Emergency telah dinonaktifkan");
            router.back();
        }
    };

    // Auto-trigger emergency saat halaman dibuka
    useEffect(() => {
        // Tunggu sampai kostId dan uid tersedia
        if (user?.kostId && user?.uid) {
            console.log("Auth ready, triggering emergency...");
            triggerEmergency();
        } else {
            console.warn("Waiting for auth data...", { user });
        }

        return () => {
            // Cleanup saat unmount
            if (notificationInterval.current) {
                clearInterval(notificationInterval.current);
            }
        };
    }, [user?.kostId, user?.uid]); // Trigger ulang jika kostId/uid berubah

    // Setup notifikasi berulang setiap 5 detik
    useEffect(() => {
        if (isActive && user?.kostId) {
            // Notifikasi pertama langsung
            showNotification();

            // Notifikasi berulang setiap 5 detik
            notificationInterval.current = setInterval(() => {
                showNotification();
                Vibration.vibrate(500); // Vibrate setiap notifikasi
            }, 5000);

            return () => {
                if (notificationInterval.current) {
                    clearInterval(notificationInterval.current);
                }
            };
        }
    }, [isActive, user?.kostId]);

    // Listen untuk emergency status changes dari Firestore
    useEffect(() => {
        if (!emergencyId) return;

        const unsubscribe = onSnapshot(
            query(
                collection(db, "emergencies"),
                where("__name__", "==", emergencyId)
            ),
            (snapshot) => {
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.status === "handled") {
                        // Jika admin sudah handle, matikan alert
                        setIsActive(false);
                        if (notificationInterval.current) {
                            clearInterval(notificationInterval.current);
                        }
                    }
                });
            }
        );

        return () => unsubscribe();
    }, [emergencyId]);

    const showNotification = () => {
        Alert.alert(
            "🚨 DARURAT! 🚨",
            `${user?.nama || "Member"} membutuhkan bantuan!\n\nNotifikasi akan terus muncul setiap 5 detik sampai status darurat dibatalkan.`,
            [
                {
                    text: "OK",
                    style: "default"
                }
            ],
            { cancelable: true }
        );
    };

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

            {/* Content Tengah */}
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
                        {isActive 
                            ? "🚨 Notifikasi darurat sedang dikirim ke seluruh admin dan member setiap 5 detik!"
                            : "Notifikasi darurat telah dikirimkan ke seluruh admin kos dan member"
                        }
                    </Text>
                </View>

                {/* Status Indicator */}
                {isActive && (
                    <View style={styles.statusIndicator}>
                        <View style={styles.blinkingDot} />
                        <Text style={styles.statusText}>Emergency Active - Broadcasting...</Text>
                    </View>
                )}

                {/* Tombol Kembali Darurat */}
                <TouchableOpacity 
                    style={styles.cancelButton} 
                    onPress={cancelEmergency}
                    disabled={!isActive}
                >
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
    statusIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        gap: 10,
    },
    blinkingDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#ef4444',
    },
    statusText: {
        color: '#ef4444',
        fontSize: 14,
        fontWeight: '600',
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
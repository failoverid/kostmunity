import FloatingNavbar from "@/components/FloatingNavbar";
import { useRouter } from "expo-router";
import { Camera, FileText, Headphones, Info, Lock, LogOut, ShieldCheck, Star, User } from "lucide-react-native";
import React from "react";
import { Alert, Image, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../../../contexts/AuthContext";

const COLORS = {
    background: "#181A20",
    navbar: "#262A34",
    purple: "#6C5CE7",
    lime: "#C6F432",
    textWhite: "#FFFFFF",
    textGray: "#9E9E9E",
    divider: "rgba(255, 255, 255, 0.1)",
};

const MenuItem = ({ icon, title, onPress }: { icon: React.ReactNode, title: string, onPress?: () => void }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <View style={styles.menuIconContainer}>{icon}</View>
        <Text style={styles.menuText}>{title}</Text>
    </TouchableOpacity>
);

export default function ProfilePage() {
    const router = useRouter();
    const { user, signOut } = useAuth(); //

    const handleSignOut = async () => {
        try {
            await signOut();
            router.replace("/(auth)/onboarding");
        } catch (error) {
            Alert.alert("Error", "Gagal sign out");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Image source={require("../../../../assets/kostmunity-logo.png")} style={styles.logoSmall} resizeMode="contain" tintColor={COLORS.textWhite} />
                    <Text style={styles.headerTitle}>Kostmunity</Text>
                </View>

                <View style={styles.profileSection}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatarPlaceholder}><User size={64} color="#555" /></View>
                        <TouchableOpacity style={styles.cameraButton}><Camera size={14} color="#000" /></TouchableOpacity>
                    </View>
                    {/* Tampilkan Nama Asli */}
                    <Text style={styles.userName}>{user?.nama || "Member"}</Text>
                    {/* Tampilkan Kamar Asli */}
                    <Text style={styles.userStatus}>
                        Member <Text style={{ color: COLORS.purple, fontWeight: 'bold' }}>Kamar {user?.kamar || "-"}</Text>
                    </Text>
                    <Text style={{ color: COLORS.textGray, fontSize: 10, marginTop: 4 }}>{user?.email}</Text>
                </View>

                <View style={styles.menuGroup}>
                    <MenuItem icon={<FileText size={20} color={COLORS.textWhite} />} title="Riwayat Pembayaran" onPress={() => router.push("/dashboard/member/billing")} />
                    <MenuItem icon={<Lock size={20} color={COLORS.textWhite} />} title="Ganti Password" />
                    <MenuItem icon={<Headphones size={20} color={COLORS.textWhite} />} title="Customer Service" />
                </View>
                <View style={styles.divider} />
                <View style={styles.menuGroup}>
                    <MenuItem icon={<Star size={20} color={COLORS.textWhite} />} title="Review Kami" />
                    <MenuItem icon={<ShieldCheck size={20} color={COLORS.textWhite} />} title="Kebijakan & Privasi" />
                    <MenuItem icon={<Info size={20} color={COLORS.textWhite} />} title="Tentang Kostmunity" />
                </View>
                <View style={styles.divider} />
                <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                    <LogOut size={20} color={COLORS.lime} style={{ marginRight: 8 }} />
                    <Text style={styles.signOutText}>Sign Out</Text>
                </TouchableOpacity>
                <Text style={styles.versionText}>App Version 1.0.0 © Kostmunity 2025</Text>
                <View style={{ height: 100 }} />
            </ScrollView>
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
        marginBottom: 32,
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

    profileSection: {
        alignItems: "center",
        marginBottom: 32,
    },

    avatarContainer: {
        position: "relative",
        marginBottom: 16,
    },

    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 20,
        backgroundColor: "#333",
        alignItems: "center",
        justifyContent: "center",
    },

    cameraButton: {
        position: "absolute",
        bottom: -4,
        right: -4,
        backgroundColor: "#FFF",
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: COLORS.background,
    },

    userName: {
        fontSize: 20,
        fontWeight: "bold",
        color: COLORS.lime,
        marginBottom: 4,
        textAlign: "center",
    },

    userStatus: {
        fontSize: 12,
        color: COLORS.textGray,
        textAlign: "center",
    },

    menuGroup: {
        marginVertical: 8,
    },

    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
    },

    menuIconContainer: {
        width: 32,
        alignItems: "center",
        marginRight: 12,
    },

    menuText: {
        fontSize: 16,
        color: COLORS.textWhite,
        fontWeight: "400",
    },

    divider: {
        height: 1,
        backgroundColor: COLORS.divider,
        marginVertical: 8,
    },

    signOutButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 24,
    },

    signOutText: {
        fontSize: 16,
        fontWeight: "bold",
        color: COLORS.lime,
    },

    versionText: {
        textAlign: "center",
        fontSize: 10,
        color: "#555",
        marginTop: 8,
    },
});

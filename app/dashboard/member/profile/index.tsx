import FloatingNavbar from "@/components/FloatingNavbar";
import { useRouter } from "expo-router";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { Camera, Eye, EyeOff, FileText, Headphones, Info, Lock, LogOut, ShieldCheck, Star, User, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, Modal, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../../../contexts/AuthContext";
import { auth, db } from "../../../../lib/firebase-clients";

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
    const { user, signOut } = useAuth();
    const [memberData, setMemberData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    
    // Password change modal
    const [passwordModalVisible, setPasswordModalVisible] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    // Fetch member data
    useEffect(() => {
        if (!user?.memberId) {
            setLoading(false);
            return;
        }

        const unsubscribe = onSnapshot(
            doc(db, "memberInfo", user.memberId),
            (docSnap) => {
                if (docSnap.exists()) {
                    setMemberData({ id: docSnap.id, ...docSnap.data() });
                }
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching member:", error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [user?.memberId]);

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            Alert.alert("Error", "Semua field harus diisi");
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert("Error", "Password baru minimal 6 karakter");
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "Password baru dan konfirmasi tidak cocok");
            return;
        }

        setChangingPassword(true);
        try {
            const currentUser = auth.currentUser;
            if (!currentUser || !currentUser.email) {
                throw new Error("User tidak ditemukan");
            }

            // Reauthenticate user dengan password lama
            const credential = EmailAuthProvider.credential(currentUser.email, oldPassword);
            await reauthenticateWithCredential(currentUser, credential);

            // Update password
            await updatePassword(currentUser, newPassword);

            Alert.alert("Berhasil", "Password berhasil diubah!");
            setPasswordModalVisible(false);
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: any) {
            console.error("Error changing password:", error);
            let errorMessage = "Gagal mengubah password";
            
            if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                errorMessage = "Password lama salah";
            } else if (error.code === 'auth/weak-password') {
                errorMessage = "Password terlalu lemah";
            }
            
            Alert.alert("Error", errorMessage);
        } finally {
            setChangingPassword(false);
        }
    };

    const handleSignOut = async () => {
        const confirmLogout = Platform.OS === 'web'
            ? window.confirm("Yakin ingin keluar?")
            : await new Promise((resolve) => {
                Alert.alert(
                    "Konfirmasi",
                    "Yakin ingin keluar?",
                    [
                        { text: "Batal", style: "cancel", onPress: () => resolve(false) },
                        { text: "Ya", onPress: () => resolve(true) }
                    ]
                );
            });

        if (!confirmLogout) return;

        try {
            await signOut();
            router.replace("/landing");
        } catch (error) {
            Alert.alert("Error", "Gagal sign out");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={COLORS.lime} />
                </View>
            ) : (
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
                        <Text style={styles.userName}>{memberData?.name || user?.nama || "Member"}</Text>
                        <Text style={styles.userStatus}>
                            Member <Text style={{ color: COLORS.purple, fontWeight: 'bold' }}>Kamar {memberData?.room || user?.kamar || "-"}</Text>
                        </Text>
                        <Text style={{ color: COLORS.textGray, fontSize: 12, marginTop: 4 }}>{memberData?.email || user?.email}</Text>
                        {memberData?.phone && (
                            <Text style={{ color: COLORS.textGray, fontSize: 12 }}>📞 {memberData.phone}</Text>
                        )}
                        {memberData?.joinedAt && (
                            <Text style={{ color: COLORS.textGray, fontSize: 10, marginTop: 8 }}>
                                Bergabung: {new Date(memberData.joinedAt.toDate()).toLocaleDateString('id-ID')}
                            </Text>
                        )}
                    </View>

                    <View style={styles.menuGroup}>
                        <MenuItem icon={<FileText size={20} color={COLORS.textWhite} />} title="Riwayat Pembayaran" onPress={() => router.push("/dashboard/member/billing")} />
                        <MenuItem icon={<Lock size={20} color={COLORS.textWhite} />} title="Ganti Password" onPress={() => setPasswordModalVisible(true)} />
                        <MenuItem icon={<Headphones size={20} color={COLORS.textWhite} />} title="Customer Service" onPress={() => Alert.alert("Customer Service", "Hubungi admin kost Anda untuk bantuan")} />
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.menuGroup}>
                        <MenuItem icon={<Star size={20} color={COLORS.textWhite} />} title="Review Kami" onPress={() => Alert.alert("Review", "Terima kasih! Fitur review akan segera hadir")} />
                        <MenuItem icon={<ShieldCheck size={20} color={COLORS.textWhite} />} title="Kebijakan & Privasi" onPress={() => Alert.alert("Privasi", "Kami menghargai privasi Anda dan melindungi data Anda")} />
                        <MenuItem icon={<Info size={20} color={COLORS.textWhite} />} title="Tentang Kostmunity" onPress={() => Alert.alert("Kostmunity", "Platform manajemen kost terpadu\nVersi 1.0.0")} />
                    </View>
                    <View style={styles.divider} />
                    <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                        <LogOut size={20} color={COLORS.lime} style={{ marginRight: 8 }} />
                        <Text style={styles.signOutText}>Sign Out</Text>
                    </TouchableOpacity>
                    <Text style={styles.versionText}>App Version 1.0.0 © Kostmunity 2025</Text>
                    <View style={{ height: 100 }} />
                </ScrollView>
            )}

            {/* Change Password Modal */}
            <Modal animationType="slide" transparent={true} visible={passwordModalVisible} onRequestClose={() => setPasswordModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Ganti Password</Text>
                            <TouchableOpacity onPress={() => setPasswordModalVisible(false)}>
                                <View style={styles.closeButton}><X size={20} color="#FFF" /></View>
                            </TouchableOpacity>
                        </View>

                        <ScrollView contentContainerStyle={styles.modalScroll} showsVerticalScrollIndicator={false}>
                            {/* Old Password */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Password Lama</Text>
                                <View style={styles.passwordInputContainer}>
                                    <TextInput
                                        style={styles.passwordInput}
                                        placeholder="Masukkan password lama"
                                        placeholderTextColor="rgba(255,255,255,0.5)"
                                        value={oldPassword}
                                        onChangeText={setOldPassword}
                                        secureTextEntry={!showOldPassword}
                                        autoCapitalize="none"
                                    />
                                    <TouchableOpacity onPress={() => setShowOldPassword(!showOldPassword)} style={styles.eyeButton}>
                                        {showOldPassword ? <EyeOff size={20} color="#fff" /> : <Eye size={20} color="#fff" />}
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* New Password */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Password Baru</Text>
                                <View style={styles.passwordInputContainer}>
                                    <TextInput
                                        style={styles.passwordInput}
                                        placeholder="Minimal 6 karakter"
                                        placeholderTextColor="rgba(255,255,255,0.5)"
                                        value={newPassword}
                                        onChangeText={setNewPassword}
                                        secureTextEntry={!showNewPassword}
                                        autoCapitalize="none"
                                    />
                                    <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)} style={styles.eyeButton}>
                                        {showNewPassword ? <EyeOff size={20} color="#fff" /> : <Eye size={20} color="#fff" />}
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Confirm Password */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Konfirmasi Password Baru</Text>
                                <View style={styles.passwordInputContainer}>
                                    <TextInput
                                        style={styles.passwordInput}
                                        placeholder="Ketik ulang password baru"
                                        placeholderTextColor="rgba(255,255,255,0.5)"
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        secureTextEntry={!showConfirmPassword}
                                        autoCapitalize="none"
                                    />
                                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeButton}>
                                        {showConfirmPassword ? <EyeOff size={20} color="#fff" /> : <Eye size={20} color="#fff" />}
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <TouchableOpacity 
                                style={[styles.submitButton, changingPassword && { opacity: 0.5 }]} 
                                onPress={handleChangePassword}
                                disabled={changingPassword}
                            >
                                {changingPassword ? (
                                    <ActivityIndicator color="#000" />
                                ) : (
                                    <Text style={styles.submitButtonText}>Ubah Password</Text>
                                )}
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

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

    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-end',
    },

    modalContent: {
        backgroundColor: COLORS.purple,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 24,
        maxHeight: '85%',
    },

    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },

    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
    },

    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
    },

    modalScroll: {
        gap: 20,
        paddingBottom: 40,
    },

    inputGroup: {
        gap: 8,
    },

    label: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
    },

    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.lime,
    },

    passwordInput: {
        flex: 1,
        padding: 14,
        color: '#FFF',
        fontSize: 14,
    },

    eyeButton: {
        padding: 14,
    },

    submitButton: {
        backgroundColor: COLORS.lime,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },

    submitButtonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

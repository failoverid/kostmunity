import { useRouter } from "expo-router";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, Save, User } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../../../contexts/AuthContext";
import { auth, db } from "../../../../lib/firebase-clients";

export default function AdminProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  
  // Password fields
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.nama || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Nama tidak boleh kosong");
      return;
    }

    setLoading(true);
    try {
      if (user?.uid) {
        await updateDoc(doc(db, "users", user.uid), {
          nama: name
        });
        Alert.alert("Berhasil", "Profil berhasil diupdate");
      }
    } catch (error: any) {
      console.error("Update profile error:", error);
      Alert.alert("Error", error.message || "Gagal update profil");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Semua field password harus diisi");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Password baru tidak cocok");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "Password baru minimal 6 karakter");
      return;
    }

    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.email) {
        throw new Error("User tidak ditemukan");
      }

      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);

      // Update password
      await updatePassword(currentUser, newPassword);

      Alert.alert("Berhasil", "Password berhasil diubah");
      
      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Change password error:", error);
      if (error.code === 'auth/wrong-password') {
        Alert.alert("Error", "Password lama salah");
      } else {
        Alert.alert("Error", error.message || "Gagal ubah password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1f2937" />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Image
            source={require("../../../../assets/kostmunity-logo.png")}
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Profil Admin</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* Profile Info Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <User size={20} color="#1f2937" />
              <Text style={styles.cardTitle}>Informasi Profil</Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nama Lengkap</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nama lengkap"
                  value={name}
                  onChangeText={setName}
                  editable={!loading}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputDisabled}>
                  <Mail size={16} color="#9ca3af" style={{ marginRight: 8 }} />
                  <Text style={styles.inputDisabledText}>{email}</Text>
                </View>
                <Text style={styles.helperText}>Email tidak dapat diubah</Text>
              </View>

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleUpdateProfile}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <>
                    <Save size={16} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={styles.buttonText}>Simpan Perubahan</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Change Password Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Lock size={20} color="#1f2937" />
              <Text style={styles.cardTitle}>Ubah Password</Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password Lama</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Masukkan password lama"
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry={!showCurrentPassword}
                    editable={!loading}
                  />
                  <TouchableOpacity
                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                    style={styles.eyeIcon}
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={20} color="#7f8c8d" />
                    ) : (
                      <Eye size={20} color="#7f8c8d" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password Baru</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Minimal 6 karakter"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={!showNewPassword}
                    editable={!loading}
                  />
                  <TouchableOpacity
                    onPress={() => setShowNewPassword(!showNewPassword)}
                    style={styles.eyeIcon}
                  >
                    {showNewPassword ? (
                      <EyeOff size={20} color="#7f8c8d" />
                    ) : (
                      <Eye size={20} color="#7f8c8d" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Konfirmasi Password Baru</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ulangi password baru"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={true}
                  editable={!loading}
                />
              </View>

              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary, loading && styles.buttonDisabled]}
                onPress={handleChangePassword}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#1f2937" />
                ) : (
                  <>
                    <Lock size={16} color="#1f2937" style={{ marginRight: 8 }} />
                    <Text style={[styles.buttonText, { color: '#1f2937' }]}>Ubah Password</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f3f4f6" },
  scrollContent: { padding: 16, paddingBottom: 40 },
  
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  backButton: { width: 40 },
  headerLogo: { width: 30, height: 35, marginBottom: 4 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#1f2937" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    gap: 8,
  },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#1f2937" },
  cardContent: { padding: 16 },

  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#1f2937",
    backgroundColor: "#fff",
  },
  inputDisabled: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 12,
  },
  inputDisabledText: { fontSize: 14, color: "#6b7280" },
  helperText: { fontSize: 12, color: "#9ca3af", marginTop: 4 },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 14,
    color: "#1f2937",
  },
  eyeIcon: { paddingHorizontal: 12 },

  button: {
    backgroundColor: "#1f2937",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonSecondary: {
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

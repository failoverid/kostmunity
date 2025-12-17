import { useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// --- IMPORT DARI ROOT LIB ---
import { auth, db, signInWithEmailAndPassword } from "../../../lib/firebase-clients";
// Import Firestore
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

export default function OnboardingPage() {
  const [view, setView] = useState<"member" | "admin">("member");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // --- FUNGSI LOGIN UTAMA ---
  const handleLogin = async (loginRole: "member" | "admin") => {
    console.log("--- MULAI PROSES LOGIN ---");
    console.log("Role:", loginRole);
    console.log("Email:", email);

    setLoading(true);

    try {
      // 1. Validasi Input
      if (!email.includes("@")) {
        Alert.alert("Format Salah", "Email tidak valid.");
        setLoading(false);
        return;
      }

      // 2. Login Auth (Cek Password)
      console.log("Mencoba sign in auth...");
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Auth Berhasil. UID:", user.uid);

      // 3. Cek Data di Database Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      // --- LOGIKA JIKA DATA TIDAK DITEMUKAN (AUTO FIX UNTUK ADMIN) ---
      if (!userDocSnap.exists()) {
        console.log("Data user tidak ditemukan di Firestore.");

        if (loginRole === "admin") {
          // KHUSUS ADMIN PERTAMA KALI: Kita buatkan datanya otomatis
          console.log("Membuat data Admin baru otomatis...");
          try {
            await setDoc(userDocRef, {
              email: user.email,
              role: "admin", // Set role admin
              createdAt: serverTimestamp(),
              ownerId: user.uid // Admin adalah owner
            });
            console.log("Data Admin berhasil dibuat. Redirecting...");
            router.replace("/dashboard/admin");
            return; // Selesai
          } catch (createErr) {
            console.error("Gagal buat data admin:", createErr);
            Alert.alert("Error Database", "Gagal membuat profil admin.");
          }
        } else {
          // JIKA MEMBER: Tidak boleh auto-create, harus hubungi admin
          Alert.alert("Akun Tidak Dikenal", "Data member tidak ditemukan. Silakan hubungi Admin Kost.");
        }
        setLoading(false);
        return;
      }

      // --- LOGIKA JIKA DATA DITEMUKAN ---
      const userData = userDocSnap.data();
      console.log("Data User Ditemukan:", userData);

      if (loginRole === "admin") {
        // --- CEK LOGIN ADMIN ---
        if (userData.role === "admin") {
          console.log("Role Admin Valid. Masuk...");
          router.replace("/dashboard/admin");
        } else {
          Alert.alert("Akses Ditolak", "Email ini terdaftar sebagai Member, bukan Admin.");
          await auth.signOut();
        }
      } else {
        // --- CEK LOGIN MEMBER ---
        if (userData.role === "user") {
          // Cek apakah sudah punya idKost (artinya sudah dimasukkan ke kost oleh admin)
          if (userData.idKost && userData.idKost !== "-") {
            console.log("Role Member Valid. Masuk...");
            router.replace("/dashboard/member");
          } else {
            Alert.alert("Akun Belum Aktif", "Akun Anda belum dimasukkan ke dalam Kost oleh Admin.");
            await auth.signOut();
          }
        } else {
          Alert.alert("Salah Kamar", "Email ini terdaftar sebagai Admin. Silakan login di tab Admin.");
          await auth.signOut();
        }
      }

    } catch (err: any) {
      console.error("LOGIN ERROR:", err);

      let errorMessage = err.message;
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        errorMessage = "Email atau password salah.";
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = "Terlalu banyak percobaan. Coba lagi nanti.";
      } else if (err.code === 'auth/network-request-failed') {
        errorMessage = "Koneksi internet bermasalah.";
      }

      Alert.alert("Login Gagal", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleView = () => {
    const next = view === "member" ? "admin" : "member";
    setView(next);
    setEmail("");
    setPassword("");
    setShowPassword(false);
  };

  return (
      <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.mainContent}>

            {/* HEADER */}
            <View style={styles.headerContainer}>
              <Text style={styles.title}>
                Masuk
                {view === "admin" && (
                    <Text style={styles.titleAdmin}> untuk Admin Kos</Text>
                )}
              </Text>

              {view === "member" && (
                  <Text style={styles.subtitle}>
                    Masukkan email & password akun yang sudah diberikan pemilik kos
                  </Text>
              )}
            </View>

            {/* FORM */}
            <View style={styles.formContainer}>
              <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholderTextColor="#9ca3af"
              />

              <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    placeholderTextColor="#9ca3af"
                />
                <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                >
                  {showPassword ? (
                      <EyeOff size={20} color="#9ca3af" />
                  ) : (
                      <Eye size={20} color="#9ca3af" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* ACTION BUTTONS */}
            <View style={styles.actionContainer}>
              <TouchableOpacity
                  onPress={() => handleLogin(view)}
                  disabled={loading || !email || !password}
                  style={[
                    styles.primaryButton,
                    (loading || !email || !password) && styles.buttonDisabled,
                  ]}
              >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.primaryButtonText}>Masuk</Text>
                )}
              </TouchableOpacity>

              <View style={styles.separatorContainer}>
                <View style={styles.separatorLine} />
                <Text style={styles.separatorText}>atau</Text>
                <View style={styles.separatorLine} />
              </View>

              <TouchableOpacity onPress={toggleView} style={styles.outlineButton}>
                <Text style={styles.outlineButtonText}>
                  {view === "member"
                      ? "Masuk sebagai Admin Kos"
                      : "Masuk sebagai Member Kos"}
                </Text>
              </TouchableOpacity>

              {view === "admin" && (
                  <View style={styles.registerContainer}>
                    <Text style={styles.registerText}>
                      Belum Memiliki Akun Admin?{" "}
                    </Text>
                    {/* Pastikan rute ini benar, jika belum ada page register, ganti ke # */}
                    <TouchableOpacity onPress={() => router.push("/register-admin")}>
                      <Text style={styles.registerLink}>Daftar</Text>
                    </TouchableOpacity>
                  </View>
              )}
            </View>
          </View>

          {/* FOOTER */}
          <View style={styles.footer}>
            <Image
                source={require("../../../assets/kostmunity-logo.png")}
                style={styles.logo}
                resizeMode="contain"
            />
            <Text style={styles.brandText}>kostmunity.</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FDF9ED" },
  scrollContent: { flexGrow: 1, padding: 32, justifyContent: "space-between" },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  headerContainer: { marginBottom: 32 },
  title: { fontSize: 36, fontWeight: "bold", marginBottom: 8, color: "#1f2937" },
  titleAdmin: { fontSize: 24, fontWeight: "normal", color: "#ea580c" },
  subtitle: { color: "#4b5563", fontSize: 14 },
  formContainer: { marginBottom: 16 },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: "#1f2937",
    marginBottom: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: "#1f2937",
  },
  eyeIcon: { padding: 16 },
  actionContainer: { marginTop: 32 },
  primaryButton: {
    width: "100%",
    borderRadius: 999,
    backgroundColor: "#C7C6B8",
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonDisabled: { opacity: 0.6 },
  primaryButtonText: { fontSize: 16, fontWeight: "600", color: "#4b5563" },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    marginBottom: 16,
  },
  separatorLine: { flex: 1, height: 1, backgroundColor: "#d1d5db" },
  separatorText: { marginHorizontal: 16, fontSize: 14, color: "#9ca3af" },
  outlineButton: {
    width: "100%",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#9ca3af",
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 8,
  },
  outlineButtonText: { fontSize: 16, fontWeight: "600", color: "#6b7280" },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 8,
  },
  registerText: { fontSize: 14, color: "#4b5563" },
  registerLink: { fontSize: 14, fontWeight: "600", color: "#ef4444" },
  footer: { alignItems: "center", justifyContent: "center", paddingTop: 32 },
  logo: { width: 50, height: 50 },
  brandText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginTop: 8,
  },
});
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Eye, EyeOff } from "lucide-react-native"; // Gunakan versi native
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
    View
} from "react-native";
import { auth } from "../../../lib/firebase-client"; // Pastikan path benar

export default function OnboardingPage() {
  // --- STATE BARU UNTUK MENGGANTI TAMPILAN ---
  const [view, setView] = useState<'member' | 'admin'>('member');

  // State yang sudah ada
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Fungsi untuk menangani login
  const handleLogin = async (loginRole: 'member' | 'admin') => {
    setLoading(true);

    try {
      // Logika login tetap sama
      await signInWithEmailAndPassword(auth, username, password);
      router.replace("/dashboard/admin"); // Gunakan replace di mobile agar tidak bisa back
    } catch (err: any) {
      Alert.alert("Login Gagal", err.message); // Alert native pengganti console.error
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk mengganti view DAN mereset input
  const toggleView = () => {
    const newView = view === 'member' ? 'admin' : 'member';
    setView(newView);

    // Reset state saat ganti view
    setUsername("");
    setPassword("");
    setShowPassword(false);
  };

  return (
    // KeyboardAvoidingView: Agar keyboard tidak menutupi input di HP
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* 1. Konten Utama (Form) */}
        <View style={styles.mainContent}>

          {/* --- Judul dan Subjudul Dibuat Dinamis --- */}
          <View style={styles.headerContainer}>
            <Text style={styles.title}>
              Masuk
              {view === 'admin' && (
                <Text style={styles.titleAdmin}> untuk Admin Kos</Text>
              )}
            </Text>

            {view === 'member' && (
              <Text style={styles.subtitle}>
                Masukkan username dan password akun kalian yang sudah diberikan oleh pemilik kos
              </Text>
            )}
          </View>

          {/* Form Inputs */}
          <View style={styles.formContainer}>
            {/* Input Username */}
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              placeholderTextColor="#9ca3af"
            />

            {/* Input Password dengan Icon Mata */}
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

          {/* Tombol Aksi */}
          <View style={styles.actionContainer}>

            {/* Tombol Login Utama */}
            <TouchableOpacity
              onPress={() => handleLogin(view)}
              disabled={loading || !username || !password}
              style={[
                styles.primaryButton,
                (loading || !username || !password) && styles.buttonDisabled
              ]}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryButtonText}>Masuk</Text>
              )}
            </TouchableOpacity>

            {/* Separator "atau" */}
            <View style={styles.separatorContainer}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>atau</Text>
              <View style={styles.separatorLine} />
            </View>

            {/* Tombol Toggle View (Outline) */}
            <TouchableOpacity
              onPress={toggleView}
              style={styles.outlineButton}
            >
              <Text style={styles.outlineButtonText}>
                {view === 'member' ? 'Masuk sebagai Admin Kos' : 'Masuk sebagai Member Kos'}
              </Text>
            </TouchableOpacity>

            {/* Link Daftar (Hanya Admin) */}
            {view === 'admin' && (
              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Belum Memiliki Akun Admin? </Text>
                <TouchableOpacity onPress={() => router.push('/register-admin')}>
                  <Text style={styles.registerLink}>Daftar</Text>
                </TouchableOpacity>
              </View>
            )}

          </View>
        </View>

        {/* 2. Footer (Logo) */}
        <View style={styles.footer}>
          <Image
            source={require('../../../assets/kostmunity-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.brandText}>kostmunity.</Text>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Styles yang diterjemahkan dari Tailwind CSS Anda
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF9ED", // bg-[#FDF9ED]
  },
  scrollContent: {
    flexGrow: 1,
    padding: 32, // p-8
    justifyContent: 'space-between'
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    maxWidth: 400, // max-w-sm (approx)
    alignSelf: 'center',
  },
  headerContainer: {
    marginBottom: 32, // mb-8
  },
  title: {
    fontSize: 36, // text-6xl (di mobile 6xl terlalu besar, 36-40 lebih pas)
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1f2937", // text-gray-800
  },
  titleAdmin: {
    fontSize: 24, // text-2xl
    fontWeight: "normal",
    color: "#ea580c", // text-orange-600
  },
  subtitle: {
    color: "#4b5563", // text-gray-600
    fontSize: 14,
  },
  formContainer: {
    gap: 16, // space-y-4
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db", // border-gray-300
    borderRadius: 8, // rounded-lg
    padding: 16, // p-6 (di mobile p-4 atau p-16px lebih wajar)
    fontSize: 16,
    color: "#1f2937",
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: "#1f2937",
  },
  eyeIcon: {
    padding: 16,
  },
  actionContainer: {
    marginTop: 40, // mt-10
    gap: 16, // space-y-4
  },
  primaryButton: {
    width: "100%",
    borderRadius: 999, // rounded-full
    backgroundColor: "#C7C6B8", // bg-[#C7C6B8]
    paddingVertical: 16, // py-6
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.8, // disabled:bg...
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4b5563", // text-gray-600
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#d1d5db", // border-gray-300
  },
  separatorText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: "#9ca3af", // text-gray-400
  },
  outlineButton: {
    width: "100%",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#9ca3af", // border-gray-400
    backgroundColor: "transparent",
    paddingVertical: 16,
    alignItems: "center",
  },
  outlineButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280", // text-gray-500
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 8,
  },
  registerText: {
    fontSize: 14,
    color: "#4b5563",
  },
  registerLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ef4444", // text-red-500
  },
  footer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 32,
  },
  logo: {
    width: 50,
    height: 50,
  },
  brandText: {
    fontSize: 20, // text-xl
    fontWeight: "bold",
    color: "#1f2937",
    marginTop: 8,
  }
});

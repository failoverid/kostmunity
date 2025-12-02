import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
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
import { auth } from "../../../lib/firebase-client";

export default function OnboardingPage() {
  const [view, setView] = useState<"member" | "admin">("member");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (loginRole: "member" | "admin") => {
    setLoading(true);

    try {
      if (!username.includes("@")) {
        Alert.alert("Format Salah", "Username harus berupa email");
        setLoading(false);
        return;
      }

      await signInWithEmailAndPassword(auth, username, password);

      // Redirect sesuai role
      router.replace(
        loginRole === "admin"
          ? "/dashboard/admin"
          : "/dashboard/member"
      );
    } catch (err: any) {
      Alert.alert("Login Gagal", err.message);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleView = () => {
    const next = view === "member" ? "admin" : "member";
    setView(next);
    setUsername("");
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
              value={username}
              onChangeText={setUsername}
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
              disabled={loading || !username || !password}
              style={[
                styles.primaryButton,
                (loading || !username || !password) && styles.buttonDisabled,
              ]}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryButtonText}>Masuk</Text>
              )}
            </TouchableOpacity>

            {/* SEPARATOR */}
            <View style={styles.separatorContainer}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>atau</Text>
              <View style={styles.separatorLine} />
            </View>

            {/* SWITCH ROLE */}
            <TouchableOpacity onPress={toggleView} style={styles.outlineButton}>
              <Text style={styles.outlineButtonText}>
                {view === "member"
                  ? "Masuk sebagai Admin Kos"
                  : "Masuk sebagai Member Kos"}
              </Text>
            </TouchableOpacity>

            {/* REGISTER ADMIN */}
            {view === "admin" && (
              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>
                  Belum Memiliki Akun Admin?{" "}
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/register-admin")}
                >
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

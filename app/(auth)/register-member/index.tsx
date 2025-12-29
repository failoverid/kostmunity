import { auth, createUserWithEmailAndPassword, db } from '@/lib/firebase-clients';
import { useRouter } from 'expo-router';
import { collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { Eye, EyeOff } from 'lucide-react-native';
import { useState } from 'react';
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
} from 'react-native';

export default function RegisterMemberPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    // Validasi
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Semua field harus diisi');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Password tidak cocok');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password minimal 6 karakter');
      return;
    }

    setLoading(true);

    try {
      // 1. CEK WAJIB: Email harus sudah terdaftar di memberInfo (dibuat oleh admin)
      const memberInfoQuery = query(
        collection(db, 'memberInfo'), 
        where('email', '==', email)
      );
      const memberInfoSnapshot = await getDocs(memberInfoQuery);
      
      if (memberInfoSnapshot.empty) {
        // Email belum didaftarkan admin
        Alert.alert(
          'Email Tidak Terdaftar',
          'Email Anda belum terdaftar oleh admin kost. Silakan hubungi admin kost untuk mendaftarkan email Anda terlebih dahulu.'
        );
        setLoading(false);
        return;
      }

      // Ambil data member yang sudah dibuat admin
      const memberDoc = memberInfoSnapshot.docs[0];
      const memberData = memberDoc.data();
      const memberId = memberDoc.id;
      
      console.log('Found existing member data from admin:', memberData);

      // 2. Buat akun di Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 3. Simpan data di collection 'users' dengan data dari admin
      await setDoc(doc(db, 'users', user.uid), {
        nama: memberData.name,
        email: user.email,
        role: 'member',
        kostId: memberData.kostId,
        kamar: memberData.room,
        status: 'active', // Langsung active karena sudah didaftarkan admin
        createdAt: serverTimestamp(),
      });

      // 4. Update memberInfo dengan userId dan status active
      await updateDoc(doc(db, 'memberInfo', memberId), {
        userId: user.uid,
        status: 'active', // Activate member
      });
      
      // Langsung redirect ke dashboard member
      router.replace('/dashboard/member');
    } catch (error: any) {
      console.error('Register error:', error);
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Error', 'Email sudah terdaftar');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Error', 'Format email tidak valid');
      } else {
        Alert.alert('Error', error.message);
      }
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.mainContent}>
          {/* HEADER */}
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Daftar Member</Text>
            <Text style={styles.subtitle}>
              Email harus sudah terdaftar oleh admin kost terlebih dahulu
            </Text>
          </View>

          {/* FORM */}
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nama Lengkap"
              value={name}
              onChangeText={setName}
              editable={!loading}
              placeholderTextColor="#9ca3af"
            />

            <TextInput
              style={styles.input}
              placeholder="Email (yang sudah didaftarkan admin)"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
              placeholderTextColor="#9ca3af"
            />

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password (minimal 6 karakter)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!loading}
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

            <TextInput
              style={styles.input}
              placeholder="Konfirmasi Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={true}
              editable={!loading}
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* ACTIONS */}
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryButtonText}>Daftar Sekarang</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footerLinks}>
              <Text style={styles.footerText}>Sudah punya akun? </Text>
              <TouchableOpacity onPress={() => router.push('/landing')}>
                <Text style={styles.link}>Login</Text>
              </TouchableOpacity>
            </View>
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
  footerLinks: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  footerText: { fontSize: 14, color: "#4b5563" },
  link: { fontSize: 14, fontWeight: "600", color: "#3498db" },
  footer: { alignItems: "center", justifyContent: "center", paddingTop: 32 },
  logo: { width: 50, height: 50 },
  brandText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginTop: 8,
  },
});

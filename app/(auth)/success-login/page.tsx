import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native"; // Gunakan komponen Native

export default function SuccessRegisterPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Gunakan 'replace' agar user tidak bisa swipe back ke halaman sukses
      router.replace("/dashboard");
    }, 2000); // Saya ubah ke 2 detik agar user sempat membaca tulisan

    return () => clearTimeout(timer);
  }, [router]);

  return (
    // Pengganti 'div' dengan style flexbox
    <View style={styles.container}>

      {/* Pengganti Image next/image */}
      <View style={styles.imageContainer}>
        {/* PASTIKAN path gambar ini sesuai dengan struktur folder Anda */}
        <Image
          source={require("/kostmunity-logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Pengganti h1 dan p */}
      <Text style={styles.title}>Berhasil Registrasi</Text>
      <Text style={styles.subtitle}>di Akun Kostmunity.</Text>

      <Text style={styles.brand}>kostmunity.</Text>
    </View>
  );
}

// Styling (CSS dalam JS)
const styles = StyleSheet.create({
  container: {
    flex: 1, // min-h-screen
    backgroundColor: "#FDF9ED",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  imageContainer: {
    marginBottom: 16,
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 96,  // w-24
    height: 96, // h-24
  },
  title: {
    fontSize: 24, // text-2xl
    fontWeight: "bold",
    color: "#1f2937", // text-gray-800
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18, // text-lg
    color: "#4b5563", // text-gray-600
  },
  brand: {
    fontSize: 20, // text-xl
    fontWeight: "600", // font-semibold
    marginTop: 16,
    color: "#1f2937", // text-gray-800
  }
});

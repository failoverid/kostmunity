import { useRouter } from "expo-router"; // Navigasi tetap sama
import { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native"; // Pengganti div, p, img

export default function SuccessRegisterPage() {
  const router = useRouter();

  useEffect(() => {
    // Logika Timer TETAP SAMA
    const timer = setTimeout(() => {
      // Menggunakan replace agar user tidak bisa back ke screen ini
      router.replace("/dashboard/admin");
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    // Pengganti <div className="flex min-h-screen...">
    <View style={styles.container}>

      {/* Pengganti <div className="relative h-24 w-24..."> dan <Image> */}
      <Image
        // Pastikan path ini benar sesuai lokasi file di folder assets Anda
        source={require("/kostmunity-logo.png")}
        style={styles.logo}
        resizeMode="contain" // Pengganti objectFit="contain"
      />

      {/* Pengganti <h1 className="text-2xl font-bold..."> */}
      <Text style={styles.title}>Berhasil Registrasi</Text>

      {/* Pengganti <p className="text-lg..."> */}
      <Text style={styles.subtitle}>di Akun Kostmunity.</Text>

      {/* Pengganti <p className="text-xl font-semibold..."> */}
      <Text style={styles.brand}>kostmunity.</Text>

    </View>
  );
}

// Styling (CSS) yang diterjemahkan dari Tailwind agar tampilannya SAMA
const styles = StyleSheet.create({
  container: {
    flex: 1, // setara min-h-screen
    backgroundColor: "#FDF9ED", // bg-[#FDF9ED]
    alignItems: "center", // items-center
    justifyContent: "center", // justify-center
    padding: 16, // p-4
  },
  logo: {
    width: 96, // w-24 (24 * 4 = 96px)
    height: 96, // h-24
    marginBottom: 16, // mb-4
  },
  title: {
    fontSize: 24, // text-2xl
    fontWeight: "bold", // font-bold
    color: "#1f2937", // text-gray-800
    marginBottom: 8, // mb-2
  },
  subtitle: {
    fontSize: 18, // text-lg
    color: "#4b5563", // text-gray-600
  },
  brand: {
    fontSize: 20, // text-xl
    fontWeight: "600", // font-semibold
    marginTop: 16, // mt-4
    color: "#1f2937", // text-gray-800
  }
});

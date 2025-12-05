import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function SuccessRegisterPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Pastikan rute tujuannya benar
      router.replace("/dashboard/admin");
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>

      <Image
        // ❌ SALAH: require("/kostmunity-logo.png")
        // ✅ BENAR: Gunakan path relatif (naik 3 folder: success -> (auth) -> app -> ROOT)
        source={require("../../../assets/kostmunity-logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Berhasil Registrasi</Text>
      <Text style={styles.subtitle}>di Akun Kostmunity.</Text>
      <Text style={styles.brand}>kostmunity.</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF9ED",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  logo: {
    width: 96,
    height: 96,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#4b5563",
  },
  brand: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
    color: "#1f2937",
  }
});

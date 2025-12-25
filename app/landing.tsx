import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function LandingPage() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#3498db', '#2c3e50']}
        style={styles.header}
      >
        <Text style={styles.logo}>🏠</Text>
        <Text style={styles.title}>Kostmunity</Text>
        <Text style={styles.tagline}>
          Sistem Manajemen Kost Modern untuk Pemilik dan Penghuni
        </Text>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Pilih Cara Masuk</Text>

        {/* Member Section */}
        <View style={styles.card}>
          <Text style={styles.cardIcon}>👤</Text>
          <Text style={styles.cardTitle}>Saya Penghuni Kost</Text>
          <Text style={styles.cardDesc}>
            Akses dashboard penghuni, bayar tagihan, dan kelola layanan kost Anda
          </Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary]}
              onPress={() => router.push('/(auth)/login-member')}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonOutline]}
              onPress={() => router.push('/(auth)/register-member')}
            >
              <Text style={styles.buttonTextOutline}>Daftar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Admin Section */}
        <View style={[styles.card, styles.cardAdmin]}>
          <Text style={styles.cardIcon}>⚙️</Text>
          <Text style={styles.cardTitle}>Saya Pemilik/Admin Kost</Text>
          <Text style={styles.cardDesc}>
            Kelola seluruh kost, monitor penghuni, dan atur layanan
          </Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, styles.buttonAdmin]}
              onPress={() => router.push('/(auth)/login-admin')}
            >
              <Text style={styles.buttonText}>Login Admin</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonOutlineAdmin]}
              onPress={() => router.push('/(auth)/register-admin')}
            >
              <Text style={styles.buttonTextOutlineAdmin}>Daftar Kost Baru</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <Text style={styles.featuresTitle}>Fitur Unggulan</Text>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>💰</Text>
            <Text style={styles.featureText}>Manajemen Billing Otomatis</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🔔</Text>
            <Text style={styles.featureText}>Notifikasi Real-time</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📊</Text>
            <Text style={styles.featureText}>Dashboard Analytics</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🔍</Text>
            <Text style={styles.featureText}>Lost & Found System</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  logo: {
    fontSize: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 14,
    color: '#ecf0f1',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  cardAdmin: {
    borderLeftColor: '#e74c3c',
  },
  cardIcon: {
    fontSize: 40,
    marginBottom: 15,
    textAlign: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
    textAlign: 'center',
  },
  cardDesc: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#3498db',
  },
  buttonAdmin: {
    backgroundColor: '#e74c3c',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#3498db',
  },
  buttonOutlineAdmin: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#e74c3c',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonTextOutline: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonTextOutlineAdmin: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: 'bold',
  },
  features: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e1e8ed',
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  featureText: {
    fontSize: 16,
    color: '#34495e',
  },
});

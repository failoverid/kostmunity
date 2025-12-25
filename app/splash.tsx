import { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase-clients';
import { doc, getDoc } from 'firebase/firestore';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      // Tampilkan splash minimal 2 detik untuk UX yang baik
      const minDelay = new Promise(resolve => setTimeout(resolve, 2000));

      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        await minDelay; // Tunggu minimal delay

        if (user) {
          // User sudah login, cek role
          try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              if (userData.role === 'admin') {
                router.replace('/dashboard/admin');
              } else {
                router.replace('/dashboard/member');
              }
            } else {
              // User ada di auth tapi tidak ada di database
              router.replace('/landing');
            }
          } catch (error) {
            console.error('Error checking user role:', error);
            router.replace('/landing');
          }
        } else {
          // User belum login, ke landing page
          router.replace('/landing');
        }
      });

      return () => unsubscribe();
    };

    checkAuth();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🏠</Text>
      <Text style={styles.title}>Kostmunity</Text>
      <Text style={styles.subtitle}>Kelola Kost Anda dengan Mudah</Text>
      <ActivityIndicator size="large" color="#3498db" style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  logo: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 40,
  },
  loader: {
    marginTop: 20,
  },
});

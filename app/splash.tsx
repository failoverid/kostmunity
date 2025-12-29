import { auth, db } from '@/lib/firebase-clients';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';

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
              if (userData.role === 'admin' || userData.role === 'owner') {
                router.replace('/dashboard/admin');
              } else if (userData.role === 'member' || userData.role === 'user') {
                router.replace('/dashboard/member');
              } else {
                router.replace('/landing');
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
      <View style={styles.logoContainer}>
        <Image 
          source={require('../assets/kostmunity-logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.title}>Kostmunity</Text>
      <Text style={styles.subtitle}>Kelola Kost Anda dengan Mudah</Text>
      <ActivityIndicator size="large" color="#C6F432" style={styles.loader} />
      <Text style={styles.version}>Version 1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#181A20',
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: '#262A34',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#C6F432',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  logo: {
    width: 80,
    height: 80,
    tintColor: '#C6F432',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#9E9E9E',
    marginBottom: 40,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  loader: {
    marginTop: 20,
  },
  version: {
    position: 'absolute',
    bottom: 40,
    fontSize: 12,
    color: '#555',
  },
});

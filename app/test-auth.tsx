import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase-clients';
import { createUser, UserType } from '@/lib/users';

export default function TestAuthScreen() {
  // State untuk test koneksi
  const [connectionStatus, setConnectionStatus] = useState<string>('');

  // State untuk register
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerNama, setRegisterNama] = useState('');
  const [registerRole, setRegisterRole] = useState<'admin' | 'user'>('user');

  // State untuk login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState<string>('');

  // Test Koneksi Firebase
  const testConnection = async () => {
    try {
      setConnectionStatus('Testing connection...');
      
      // Test Firestore connection
      const testCollection = collection(db, 'users');
      await getDocs(testCollection);
      
      // Test Auth connection
      const auth = getAuth();
      if (auth) {
        setConnectionStatus('✅ Firebase Connected Successfully!\n- Firestore: OK\n- Auth: OK');
      }
    } catch (error: any) {
      setConnectionStatus(`❌ Connection Failed:\n${error.message}`);
    }
  };

  // Register User
  const handleRegister = async () => {
    // Validate all fields are filled
    if (!registerEmail || !registerPassword || !registerUsername || !registerNama) {
      Alert.alert('Error', 'Semua field harus diisi!');
      console.error('Validation failed: All fields are required');
      return;
    }

    // Validate password length (minimum 6 characters)
    if (registerPassword.length < 6) {
      Alert.alert('Error', 'Password harus minimal 6 karakter!');
      console.error('Validation failed: Password must be at least 6 characters');
      return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerEmail)) {
      Alert.alert('Error', 'Format email tidak valid!');
      console.error('Validation failed: Invalid email format');
      return;
    }

    try {
      console.log('Attempting to register user:', registerEmail);
      
      // Create Firebase Auth user
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );

      console.log('User signed up successfully! UID:', userCredential.user.uid);

      // Create user document in Firestore
      const userData: Omit<UserType, 'ownerId'> = {
        username: registerUsername,
        email: registerEmail,
        password: registerPassword, // Note: Sebaiknya tidak menyimpan password plain text
        nama: registerNama,
        role: registerRole,
      };

      await createUser(userData);
      console.log('User document created in Firestore');

      Alert.alert(
        'Success',
        `User registered successfully!\nUID: ${userCredential.user.uid}\nEmail: ${registerEmail}`
      );

      // Clear form
      setRegisterEmail('');
      setRegisterPassword('');
      setRegisterUsername('');
      setRegisterNama('');
    } catch (error: any) {
      console.error('Error signing up:', error.message);
      console.error('Error code:', error.code);
      
      // Handle specific Firebase Auth errors
      let errorMessage = error.message;
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email sudah terdaftar! Gunakan email lain atau login.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Format email tidak valid!';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password terlalu lemah! Gunakan password yang lebih kuat.';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'Registrasi dengan email/password tidak diaktifkan.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Koneksi internet bermasalah. Coba lagi.';
      }
      
      Alert.alert('Register Error', errorMessage);
    }
  };

  // Login User
  const handleLogin = async () => {
    // Validate fields
    if (!loginEmail || !loginPassword) {
      Alert.alert('Error', 'Email dan password harus diisi!');
      console.error('Validation failed: Email and password are required');
      return;
    }

    // Validate password length
    if (loginPassword.length < 6) {
      Alert.alert('Error', 'Password harus minimal 6 karakter!');
      console.error('Validation failed: Password must be at least 6 characters');
      return;
    }

    try {
      setLoginStatus('Logging in...');
      console.log('Attempting to login user:', loginEmail);
      
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );

      console.log('User logged in successfully! UID:', userCredential.user.uid);

      setLoginStatus(
        `✅ Login Successful!\n` +
        `UID: ${userCredential.user.uid}\n` +
        `Email: ${userCredential.user.email}\n` +
        `Email Verified: ${userCredential.user.emailVerified}`
      );

      Alert.alert('Success', 'Login berhasil!');
    } catch (error: any) {
      console.error('Error logging in:', error.message);
      console.error('Error code:', error.code);
      
      // Handle specific Firebase Auth errors
      let errorMessage = error.message;
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'User tidak ditemukan! Silakan register terlebih dahulu.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Password salah! Coba lagi.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Format email tidak valid!';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Email atau password salah! Periksa kembali.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'Akun ini telah dinonaktifkan.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Koneksi internet bermasalah. Coba lagi.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Terlalu banyak percobaan login. Coba lagi nanti.';
      }

      setLoginStatus(`❌ Login Failed:\n${errorMessage}`);
      Alert.alert('Login Error', errorMessage);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🔥 Firebase Auth Test Page</Text>

      {/* Test Koneksi Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Test Koneksi Firebase</Text>
        <TouchableOpacity style={styles.button} onPress={testConnection}>
          <Text style={styles.buttonText}>Test Connection</Text>
        </TouchableOpacity>
        {connectionStatus ? (
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>{connectionStatus}</Text>
          </View>
        ) : null}
      </View>

      {/* Register Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Register User</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={registerUsername}
          onChangeText={setRegisterUsername}
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Nama Lengkap"
          value={registerNama}
          onChangeText={setRegisterNama}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={registerEmail}
          onChangeText={setRegisterEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={registerPassword}
          onChangeText={setRegisterPassword}
          secureTextEntry
        />

        <View style={styles.roleContainer}>
          <Text style={styles.label}>Role:</Text>
          <TouchableOpacity
            style={[styles.roleButton, registerRole === 'user' && styles.roleButtonActive]}
            onPress={() => setRegisterRole('user')}
          >
            <Text style={styles.roleButtonText}>User</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleButton, registerRole === 'admin' && styles.roleButtonActive]}
            onPress={() => setRegisterRole('admin')}
          >
            <Text style={styles.roleButtonText}>Admin</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>

      {/* Login Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Test Login</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={loginEmail}
          onChangeText={setLoginEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={loginPassword}
          onChangeText={setLoginPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {loginStatus ? (
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>{loginStatus}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>📱 Kostmunity Test Page</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2c3e50',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultBox: {
    backgroundColor: '#ecf0f1',
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
  },
  resultText: {
    fontSize: 14,
    color: '#2c3e50',
    fontFamily: 'monospace',
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    marginRight: 10,
    color: '#333',
  },
  roleButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#3498db',
    marginRight: 10,
  },
  roleButtonActive: {
    backgroundColor: '#3498db',
  },
  roleButtonText: {
    color: '#3498db',
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  footerText: {
    color: '#95a5a6',
    fontSize: 14,
  },
});

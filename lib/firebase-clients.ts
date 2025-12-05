// lib/firebase-client.ts

// --- MOCK / DUMMY FIREBASE ---
// Karena Firebase belum disetup, kita buat fungsi palsu agar aplikasi tidak error.

// 1. Mock Objek Auth
const auth = {
  currentUser: null,
  // Properti lain bisa ditambahkan jika nanti error, tapi ini cukup untuk login sederhana
};

// 2. Mock Fungsi Login
const signInWithEmailAndPassword = async (authInstance: any, email: string, password: string) => {
  console.log(`[MOCK LOGIN] Email: ${email}, Password: ${password}`);

  // Simulasi loading selama 1.5 detik
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Simulasi validasi sederhana
  if (!email || !password) {
    throw new Error("Email dan password wajib diisi (Mock)");
  }

  // Simulasi sukses
  return {
    user: {
      uid: "user-dummy-123",
      email: email,
      emailVerified: true
    }
  };
};

// 3. Mock Fungsi Register (Jaga-jaga jika dipanggil)
const createUserWithEmailAndPassword = async (authInstance: any, email: string, password: string) => {
  console.log(`[MOCK REGISTER] Email: ${email}`);
  await new Promise(resolve => setTimeout(resolve, 1500));
  return {
    user: { uid: "new-user-123", email: email }
  };
};

// Export fungsi-fungsi palsu ini
export { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword };

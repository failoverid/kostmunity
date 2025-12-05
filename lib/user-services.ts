import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where
} from "firebase/firestore";
import { db } from "./firebase-clients"; // Pastikan path ini benar

// --- 1. INTERFACE USER DIPERBARUI ---
export interface UserType {
  id?: string;
  email: string;
  username: string; // Bisa diisi email atau nama lowercase
  password: string; // Disimpan string dulu (ideal dienkripsi/auth)
  nama: string;
  role: "admin" | "user";

  // Field Penting untuk Member
  idKost: string;   // ID Kost tempat member tinggal (penghubung Admin & User)
  kamar: string;    // Nomor kamar
  phone: string;    // Kontak

  ownerId: string;  // Opsional (bisa "-" untuk user)
  status: "Aktif" | "Non-Aktif";
  createdAt?: any;
  updatedAt?: any;
}

// COLLECTION REF
const usersRef = collection(db, "users");

// --- 2. CREATE MEMBER (Oleh Admin) ---
export async function createMember(
  adminKostId: string, // ID Kost milik Admin yang sedang login
  data: { nama: string; phone: string; kamar: string; email: string }
) {
  // Generate default password (misal: 123456)
  const defaultPassword = "123456";

  // Generate username simpel
  const username = data.email.split('@')[0];

  const newMember: Omit<UserType, "id"> = {
    ...data,
    username: username,
    password: defaultPassword, // Di real app, gunakan Firebase Auth createUser
    role: "user",              // AUTO ROLE USER
    idKost: adminKostId,       // TERHUBUNG KE KOST ADMIN
    ownerId: "-",
    status: "Aktif",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  return await addDoc(usersRef, newMember);
}

// --- 3. GET MEMBERS BY KOST (Realtime query) ---
// Fungsi ini tidak dipakai langsung di useEffect komponen karena kita pakai onSnapshot di sana,
// tapi ini contoh query-nya.
export async function getMembersByKost(idKost: string) {
  const q = query(
    usersRef,
    where("idKost", "==", idKost),
    where("role", "==", "user"),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

// --- 4. UPDATE MEMBER ---
export async function updateMember(id: string, data: Partial<UserType>) {
  const ref = doc(db, "users", id);
  return await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// --- 5. DELETE MEMBER ---
export async function deleteMember(id: string) {
  return await deleteDoc(doc(db, "users", id));
}

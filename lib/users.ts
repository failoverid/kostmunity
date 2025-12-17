import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";
import { db } from "./firebase-clients";

// INTERFACE
export interface UserType {
  username: string;
  email: string;
  password: string;
  nama: string;
  role: "admin" | "user";   // hanya dua role
  ownerId: string;           // admin → diisi, user biasa → "-"
  createdAt?: any;
  updatedAt?: any;
}

// COLLECTION REFERENCE
const usersRef = collection(db, "users");

// CREATE USER
// otomatis kasih ownerId sesuai role
export async function createUser(data: Omit<UserType, "ownerId">) {
  const ownerId = data.role === "admin" ? crypto.randomUUID() : "-";

  return await addDoc(usersRef, {
    ...data,
    ownerId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

// GET ALL USERS (sort by newest)
export async function getUsers() {
  const q = query(usersRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}

// GET USER BY ID
export async function getUserById(id: string) {
  const ref = doc(db, "users", id);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) return null;

  return { id: snapshot.id, ...snapshot.data() };
}

// UPDATE USER
// (jika role berubah, ownerId otomatis ikut berubah)
export async function updateUser(id: string, data: Partial<UserType>) {
  const ref = doc(db, "users", id);

  let updatedData = { ...data };

  if (data.role) {
    updatedData.ownerId = data.role === "admin" ? crypto.randomUUID() : "-";
  }

  return await updateDoc(ref, {
    ...updatedData,
    updatedAt: serverTimestamp(),
  });
}

// DELETE USER
export async function deleteUser(id: string) {
  return await deleteDoc(doc(db, "users", id));
}
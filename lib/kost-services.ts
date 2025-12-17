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
export interface ProfileKostType {
  id?: string;
  name: string;
  address: string;
  inviteCode: string;
  ownerId: string;
  rooms: string; // Kapasitas kamar
  createdAt?: any;
  updatedAt?: any;
}

// COLLECTION REFERENCE
const profileKostRef = collection(db, "profileKost");

// CREATE KOST PROFILE
export async function createKostProfile(data: ProfileKostType) {
  return await addDoc(profileKostRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

// GET ALL KOST
export async function getAllKost() {
  const q = query(profileKostRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}

// GET KOST BY ID (Digunakan untuk Admin Dashboard)
export async function getKostById(kostId: string) {
  const ref = doc(db, "profileKost", kostId);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) return null;

  return { id: snapshot.id, ...snapshot.data() } as ProfileKostType;
}

// UPDATE KOST PROFILE
export async function updateKostProfile(
  kostId: string,
  data: Partial<ProfileKostType>
) {
  const ref = doc(db, "profileKost", kostId);

  return await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// DELETE KOST PROFILE
export async function deleteKostProfile(kostId: string) {
  const ref = doc(db, "profileKost", kostId);
  return deleteDoc(ref);
}

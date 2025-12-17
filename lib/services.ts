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
} from "firebase/firestore";
import { db } from "./firebase-clients";

// ======================================================
// INTERFACE
// ======================================================
export interface AdsType {
  imageUrl: string;
  title?: string;
  link?: string;
  createdAt?: any;
  updatedAt?: any;
}

// ======================================================
// COLLECTION REFERENCE
// ======================================================
const adsRef = collection(db, "ads");

// ======================================================
// CREATE (Admin only)
// ======================================================
export async function createAd(data: AdsType) {
  return await addDoc(adsRef, {
    imageUrl: data.imageUrl,
    title: data.title ?? "",
    link: data.link ?? "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

// ======================================================
// READ (All users) — SORT newest first
// ======================================================
export async function getAds() {
  const q = query(adsRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}

// ======================================================
// UPDATE (Admin only)
// ======================================================
export async function updateAd(id: string, data: Partial<AdsType>) {
  const ref = doc(db, "ads", id);

  return await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// ======================================================
// DELETE (Admin only)
// ======================================================
export async function deleteAd(id: string) {
  const ref = doc(db, "ads", id);
  return await deleteDoc(ref);
}
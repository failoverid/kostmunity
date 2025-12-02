import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc
} from "firebase/firestore";
import { db } from "./firebase-clients";

const ADS_COLLECTION = "ads";

// Create Ad (Admin only)
export async function createAd(data: {
  imageUrl: string;
  title?: string;
  link?: string;
}) {
  return await addDoc(collection(db, ADS_COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

// Get all ads (User & Admin)
export async function getAds() {
  const q = query(collection(db, ADS_COLLECTION), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Update Ad (Admin)
export async function updateAd(id: string, data: any) {
  const ref = doc(db, ADS_COLLECTION, id);
  return updateDoc(ref, data);
}

// Delete Ad (Admin)
export async function deleteAd(id: string) {
  const ref = doc(db, ADS_COLLECTION, id);
  return deleteDoc(ref);
}
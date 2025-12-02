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

export interface FoundItemType {
  name: string;
  imageUrl?: string;
  status?: string;
  createdAt?: any;
  updatedAt?: any;
}

// COLLECTION REF
const foundRef = collection(db, "found");

// ===================================================================
// CREATE
// ===================================================================
export async function createFoundItem(data: { name: string; imageUrl?: string }) {
  return await addDoc(foundRef, {
    name: data.name,
    imageUrl: data.imageUrl ?? "",
    status: "Ditemukan",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

// ===================================================================
// READ (SORT BY NEWEST)
// ===================================================================
export async function getFoundItems() {
  const q = query(foundRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}

// ===================================================================
// UPDATE
// ===================================================================
export async function updateFoundItem(id: string, data: Partial<FoundItemType>) {
  return await updateDoc(doc(db, "found", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// ===================================================================
// DELETE
// ===================================================================
export async function deleteFoundItem(id: string) {
  return await deleteDoc(doc(db, "found", id));
}
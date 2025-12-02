// lib/emergency.ts
import { db } from "./firebase-client";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  serverTimestamp
} from "firebase/firestore";

// ====================================================================
// 1. USER: CREATE EMERGENCY (anak kos menekan tombol darurat)
// ====================================================================
export async function createEmergency({
  userId,
  kostId,
  message = "Emergency activated",
  location = null
}: {
  userId: string;
  kostId: string;
  message?: string;
  location?: { lat: number; lng: number } | null;
}) {
  try {
    const docRef = await addDoc(collection(db, "emergencies"), {
      userId,
      kostId,
      message,
      status: "active",
      createdAt: serverTimestamp(),
      location: location || null
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error creating emergency:", error);
    return { success: false, error };
  }
}

// ====================================================================
// 2. ADMIN: GET ALL EMERGENCIES BY KOST
// ====================================================================
export async function getEmergenciesByKost(kostId: string) {
  try {
    const q = query(
      collection(db, "emergencies"),
      where("kostId", "==", kostId)
    );

    const snaps = await getDocs(q);

    const data = snaps.docs.map((d) => ({
      id: d.id,
      ...d.data()
    }));

    return data;
  } catch (error) {
    console.error("Error fetching emergencies:", error);
    return [];
  }
}

// ====================================================================
// 3. ADMIN: UPDATE STATUS (handled)
// ====================================================================
export async function updateEmergencyStatus(id: string, newStatus: "active" | "handled") {
  try {
    const ref = doc(db, "emergencies", id);
    await updateDoc(ref, { status: newStatus });
    return { success: true };
  } catch (error) {
    console.error("Error updating emergency:", error);
    return { success: false, error };
  }
}
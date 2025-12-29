// lib/emergency.ts
import {
    addDoc,
    collection,
    doc,
    getDocs,
    query,
    serverTimestamp,
    updateDoc,
    where
} from "firebase/firestore";
import { db } from "./firebase-clients";

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
  console.log("=== createEmergency CALLED ===");
  console.log("userId:", userId);
  console.log("kostId:", kostId);
  console.log("message:", message);
  
  try {
    const emergencyData = {
      userId,
      kostId,
      message,
      status: "active",
      createdAt: serverTimestamp(),
      location: location || null
    };
    
    console.log("Attempting to add document to emergencies collection...");
    console.log("Data:", emergencyData);
    
    const docRef = await addDoc(collection(db, "emergencies"), emergencyData);

    console.log("Emergency document created successfully!");
    console.log("Document ID:", docRef.id);
    
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error("!!! ERROR creating emergency !!!");
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    console.error("Full error:", error);
    return { success: false, error: error.message };
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
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase-clients';
import { KostProfile, KostProfileCreateInput, KostProfileUpdateInput } from '@/models/KostProfile';

// Type alias for backwards compatibility
export type ProfileKostType = KostProfile;

const COLLECTION_NAME = 'profileKost';

/**
 * Get kost profile by ID
 */
export async function getKostById(kostId: string): Promise<KostProfile | null> {
  try {
    const kostDoc = await getDoc(doc(db, COLLECTION_NAME, kostId));
    if (kostDoc.exists()) {
      return { id: kostDoc.id, ...kostDoc.data() } as KostProfile;
    }
    return null;
  } catch (error) {
    console.error('Error getting kost:', error);
    throw error;
  }
}

/**
 * Get kost by owner ID
 */
export async function getKostByOwnerId(ownerId: string): Promise<KostProfile[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME), where('ownerId', '==', ownerId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as KostProfile));
  } catch (error) {
    console.error('Error getting kost by owner:', error);
    throw error;
  }
}

/**
 * Get kost by invite code
 */
export async function getKostByInviteCode(inviteCode: string): Promise<KostProfile | null> {
  try {
    const q = query(collection(db, COLLECTION_NAME), where('inviteCode', '==', inviteCode));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const kostDoc = querySnapshot.docs[0];
      return { id: kostDoc.id, ...kostDoc.data() } as KostProfile;
    }
    return null;
  } catch (error) {
    console.error('Error getting kost by invite code:', error);
    throw error;
  }
}

/**
 * Get all kost profiles
 */
export async function getAllKosts(): Promise<KostProfile[]> {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as KostProfile));
  } catch (error) {
    console.error('Error getting all kosts:', error);
    throw error;
  }
}

/**
 * Create a new kost profile
 */
export async function createKost(kostData: KostProfileCreateInput): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...kostData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating kost:', error);
    throw error;
  }
}

/**
 * Update kost profile
 */
export async function updateKost(kostId: string, kostData: KostProfileUpdateInput): Promise<void> {
  try {
    await updateDoc(doc(db, COLLECTION_NAME, kostId), {
      ...kostData,
    });
  } catch (error) {
    console.error('Error updating kost:', error);
    throw error;
  }
}

// Alias for backwards compatibility
export const updateKostProfile = updateKost;

/**
 * Update kost profile (old implementation kept for compatibility)
 */
export async function _updateKostOld(kostId: string, kostData: KostProfileUpdateInput): Promise<void> {
  try {
    await updateDoc(doc(db, COLLECTION_NAME, kostId), {
      ...kostData,
    });
  } catch (error) {
    console.error('Error updating kost:', error);
    throw error;
  }
}

/**
 * Delete kost profile
 */
export async function deleteKost(kostId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, kostId));
  } catch (error) {
    console.error('Error deleting kost:', error);
    throw error;
  }
}

/**
 * Generate unique invite code
 */
export function generateInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Check if invite code exists
 */
export async function isInviteCodeExists(inviteCode: string): Promise<boolean> {
  try {
    const kost = await getKostByInviteCode(inviteCode);
    return kost !== null;
  } catch (error) {
    console.error('Error checking invite code:', error);
    throw error;
  }
}

import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query,
  orderBy,
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase-clients';
import { Ad, AdCreateInput, AdUpdateInput } from '@/models/Ad';

const COLLECTION_NAME = 'ads';

/**
 * Get ad by ID
 */
export async function getAdById(adId: string): Promise<Ad | null> {
  try {
    const adDoc = await getDoc(doc(db, COLLECTION_NAME, adId));
    if (adDoc.exists()) {
      return { id: adDoc.id, ...adDoc.data() } as Ad;
    }
    return null;
  } catch (error) {
    console.error('Error getting ad:', error);
    throw error;
  }
}

/**
 * Get all ads
 */
export async function getAllAds(): Promise<Ad[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('displayOrder', 'asc'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Ad));
  } catch (error) {
    console.error('Error getting all ads:', error);
    throw error;
  }
}

/**
 * Get active ads only
 */
export async function getActiveAds(): Promise<Ad[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('isActive', '==', true),
      orderBy('displayOrder', 'asc'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Ad));
  } catch (error) {
    console.error('Error getting active ads:', error);
    throw error;
  }
}

/**
 * Create a new ad
 */
export async function createAd(adData: AdCreateInput): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...adData,
      isActive: adData.isActive !== undefined ? adData.isActive : true,
      displayOrder: adData.displayOrder || 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating ad:', error);
    throw error;
  }
}

/**
 * Update ad
 */
export async function updateAd(adId: string, adData: AdUpdateInput): Promise<void> {
  try {
    await updateDoc(doc(db, COLLECTION_NAME, adId), {
      ...adData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating ad:', error);
    throw error;
  }
}

/**
 * Delete ad
 */
export async function deleteAd(adId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, adId));
  } catch (error) {
    console.error('Error deleting ad:', error);
    throw error;
  }
}

/**
 * Activate ad
 */
export async function activateAd(adId: string): Promise<void> {
  try {
    await updateAd(adId, { isActive: true });
  } catch (error) {
    console.error('Error activating ad:', error);
    throw error;
  }
}

/**
 * Deactivate ad
 */
export async function deactivateAd(adId: string): Promise<void> {
  try {
    await updateAd(adId, { isActive: false });
  } catch (error) {
    console.error('Error deactivating ad:', error);
    throw error;
  }
}

/**
 * Reorder ads
 */
export async function reorderAds(adIds: string[]): Promise<void> {
  try {
    const promises = adIds.map((id, index) => 
      updateAd(id, { displayOrder: index })
    );
    await Promise.all(promises);
  } catch (error) {
    console.error('Error reordering ads:', error);
    throw error;
  }
}

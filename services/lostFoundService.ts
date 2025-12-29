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
    where
} from 'firebase/firestore';
import { db } from '../lib/firebase-clients';

export interface LostItem {
  id: string;
  kostId: string;
  reporterId: string;
  reporterName: string;
  itemName: string;
  description: string;
  category: 'electronics' | 'clothing' | 'accessories' | 'documents' | 'other';
  location: string;
  dateReported: Date;
  status: 'lost' | 'found' | 'returned';
  imageUrl?: string;
  contactInfo: string;
  foundById?: string;
  foundByName?: string;
  foundDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface LostItemCreateInput {
  kostId: string;
  reporterId: string;
  reporterName: string;
  itemName: string;
  description: string;
  category: 'electronics' | 'clothing' | 'accessories' | 'documents' | 'other';
  location: string;
  contactInfo: string;
  imageUrl?: string;
}

export interface LostItemUpdateInput {
  itemName?: string;
  description?: string;
  category?: 'electronics' | 'clothing' | 'accessories' | 'documents' | 'other';
  location?: string;
  status?: 'lost' | 'found' | 'returned';
  contactInfo?: string;
  foundById?: string;
  foundByName?: string;
}

// Get lost item by ID
export async function getLostItemById(id: string): Promise<LostItem | null> {
  try {
    const docRef = doc(db, 'lostItems', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        dateReported: data.dateReported?.toDate() || new Date(),
        foundDate: data.foundDate?.toDate(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      } as LostItem;
    }
    return null;
  } catch (error) {
    console.error('Error getting lost item:', error);
    throw error;
  }
}

// Get all lost items for a kost
export async function getLostItemsByKostId(kostId: string): Promise<LostItem[]> {
  try {
    const q = query(
      collection(db, 'lostItems'),
      where('kostId', '==', kostId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        dateReported: data.dateReported?.toDate() || new Date(),
        foundDate: data.foundDate?.toDate(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      } as LostItem;
    });
  } catch (error) {
    console.error('Error getting lost items:', error);
    throw error;
  }
}

// Get lost items by reporter
export async function getLostItemsByReporterId(reporterId: string): Promise<LostItem[]> {
  try {
    const q = query(
      collection(db, 'lostItems'),
      where('reporterId', '==', reporterId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        dateReported: data.dateReported?.toDate() || new Date(),
        foundDate: data.foundDate?.toDate(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      } as LostItem;
    });
  } catch (error) {
    console.error('Error getting lost items:', error);
    throw error;
  }
}

// Create new lost item report
export async function createLostItem(data: LostItemCreateInput): Promise<string> {
  try {
    // Remove undefined fields to avoid Firestore errors
    const cleanData: any = { ...data };
    if (cleanData.imageUrl === undefined) {
      delete cleanData.imageUrl;
    }
    
    const docRef = await addDoc(collection(db, 'lostItems'), {
      ...cleanData,
      status: 'lost',
      dateReported: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating lost item:', error);
    throw error;
  }
}

// Update lost item
export async function updateLostItem(id: string, data: LostItemUpdateInput): Promise<void> {
  try {
    console.log('updateLostItem called with:', { id, data });
    const docRef = doc(db, 'lostItems', id);
    const updateData: any = {
      ...data,
      updatedAt: serverTimestamp()
    };

    // If item is being marked as found, add foundDate
    if (data.status === 'found' || data.status === 'returned') {
      updateData.foundDate = serverTimestamp();
    }

    console.log('Updating document with data:', updateData);
    await updateDoc(docRef, updateData);
    console.log('Document updated successfully');
  } catch (error) {
    console.error('Error updating lost item:', error);
    throw error;
  }
}

// Delete lost item
export async function deleteLostItem(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'lostItems', id));
  } catch (error) {
    console.error('Error deleting lost item:', error);
    throw error;
  }
}

// Mark item as found
export async function markItemAsFound(
  id: string,
  foundById: string,
  foundByName: string
): Promise<void> {
  try {
    console.log('markItemAsFound called with:', { id, foundById, foundByName });
    await updateLostItem(id, {
      status: 'found',
      foundById,
      foundByName
    });
    console.log('Item marked as found successfully');
  } catch (error) {
    console.error('Error marking item as found:', error);
    throw error;
  }
}

// Mark item as returned
export async function markItemAsReturned(id: string): Promise<void> {
  try {
    await updateLostItem(id, {
      status: 'returned'
    });
  } catch (error) {
    console.error('Error marking item as returned:', error);
    throw error;
  }
}

// Get active (lost + found but not returned) items count
export async function getActiveLostItemsCount(kostId: string): Promise<number> {
  try {
    const q = query(
      collection(db, 'lostItems'),
      where('kostId', '==', kostId),
      where('status', 'in', ['lost', 'found'])
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting active lost items count:', error);
    throw error;
  }
}

// Get unreturned items count (lost + found)
export async function getUnreturnedItemsCount(kostId: string): Promise<number> {
  try {
    const q = query(
      collection(db, 'lostItems'),
      where('kostId', '==', kostId),
      where('status', '!=', 'returned')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting unreturned items count:', error);
    throw error;
  }
}

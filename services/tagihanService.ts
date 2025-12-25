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
  orderBy,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase-clients';
import { Tagihan, TagihanCreateInput, TagihanUpdateInput } from '@/models/Tagihan';

const COLLECTION_NAME = 'tagihan';

/**
 * Get tagihan by ID
 */
export async function getTagihanById(tagihanId: string): Promise<Tagihan | null> {
  try {
    const tagihanDoc = await getDoc(doc(db, COLLECTION_NAME, tagihanId));
    if (tagihanDoc.exists()) {
      return { id: tagihanDoc.id, ...tagihanDoc.data() } as Tagihan;
    }
    return null;
  } catch (error) {
    console.error('Error getting tagihan:', error);
    throw error;
  }
}

/**
 * Get all tagihan
 */
export async function getAllTagihan(): Promise<Tagihan[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Tagihan));
  } catch (error) {
    console.error('Error getting all tagihan:', error);
    throw error;
  }
}

/**
 * Get tagihan by member ID
 */
export async function getTagihanByMemberId(memberId: string): Promise<Tagihan[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('memberId', '==', memberId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Tagihan));
  } catch (error) {
    console.error('Error getting tagihan by member:', error);
    throw error;
  }
}

/**
 * Get tagihan by status
 */
export async function getTagihanByStatus(status: 'Belum Lunas' | 'Lunas' | 'Terlambat'): Promise<Tagihan[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Tagihan));
  } catch (error) {
    console.error('Error getting tagihan by status:', error);
    throw error;
  }
}

/**
 * Get tagihan by kost ID
 */
export async function getTagihanByKostId(kostId: string): Promise<Tagihan[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('kostId', '==', kostId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Tagihan));
  } catch (error) {
    console.error('Error getting tagihan by kost:', error);
    throw error;
  }
}

/**
 * Get unpaid tagihan (Belum Lunas)
 */
export async function getUnpaidTagihan(kostId?: string): Promise<Tagihan[]> {
  try {
    let q;
    if (kostId) {
      q = query(
        collection(db, COLLECTION_NAME),
        where('kostId', '==', kostId),
        where('status', '==', 'Belum Lunas'),
        orderBy('createdAt', 'desc')
      );
    } else {
      q = query(
        collection(db, COLLECTION_NAME),
        where('status', '==', 'Belum Lunas'),
        orderBy('createdAt', 'desc')
      );
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Tagihan));
  } catch (error) {
    console.error('Error getting unpaid tagihan:', error);
    throw error;
  }
}

/**
 * Create new tagihan
 */
export async function createTagihan(tagihanData: TagihanCreateInput): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...tagihanData,
      status: tagihanData.status || 'Belum Lunas',
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating tagihan:', error);
    throw error;
  }
}

/**
 * Update tagihan
 */
export async function updateTagihan(tagihanId: string, tagihanData: TagihanUpdateInput): Promise<void> {
  try {
    await updateDoc(doc(db, COLLECTION_NAME, tagihanId), {
      ...tagihanData,
    });
  } catch (error) {
    console.error('Error updating tagihan:', error);
    throw error;
  }
}

/**
 * Mark tagihan as paid
 */
export async function markTagihanAsPaid(tagihanId: string): Promise<void> {
  try {
    await updateDoc(doc(db, COLLECTION_NAME, tagihanId), {
      status: 'Lunas',
      paidAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error marking tagihan as paid:', error);
    throw error;
  }
}

/**
 * Mark tagihan as overdue
 */
export async function markTagihanAsOverdue(tagihanId: string): Promise<void> {
  try {
    await updateDoc(doc(db, COLLECTION_NAME, tagihanId), {
      status: 'Terlambat',
    });
  } catch (error) {
    console.error('Error marking tagihan as overdue:', error);
    throw error;
  }
}

/**
 * Delete tagihan
 */
export async function deleteTagihan(tagihanId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, tagihanId));
  } catch (error) {
    console.error('Error deleting tagihan:', error);
    throw error;
  }
}

/**
 * Calculate total unpaid amount for a member
 */
export async function getTotalUnpaidAmount(memberId: string): Promise<number> {
  try {
    const unpaidTagihan = await getTagihanByMemberId(memberId);
    const unpaid = unpaidTagihan.filter(t => t.status === 'Belum Lunas' || t.status === 'Terlambat');
    return unpaid.reduce((total, t) => total + t.amount, 0);
  } catch (error) {
    console.error('Error calculating total unpaid amount:', error);
    throw error;
  }
}

/**
 * Get tagihan summary for dashboard
 */
export async function getTagihanSummary(kostId?: string): Promise<{
  total: number;
  lunas: number;
  belumLunas: number;
  terlambat: number;
  totalAmount: number;
  totalPaid: number;
  totalUnpaid: number;
}> {
  try {
    let allTagihan: Tagihan[];
    
    if (kostId) {
      allTagihan = await getTagihanByKostId(kostId);
    } else {
      allTagihan = await getAllTagihan();
    }
    
    const lunas = allTagihan.filter(t => t.status === 'Lunas');
    const belumLunas = allTagihan.filter(t => t.status === 'Belum Lunas');
    const terlambat = allTagihan.filter(t => t.status === 'Terlambat');
    
    return {
      total: allTagihan.length,
      lunas: lunas.length,
      belumLunas: belumLunas.length,
      terlambat: terlambat.length,
      totalAmount: allTagihan.reduce((sum, t) => sum + t.amount, 0),
      totalPaid: lunas.reduce((sum, t) => sum + t.amount, 0),
      totalUnpaid: [...belumLunas, ...terlambat].reduce((sum, t) => sum + t.amount, 0),
    };
  } catch (error) {
    console.error('Error getting tagihan summary:', error);
    throw error;
  }
}

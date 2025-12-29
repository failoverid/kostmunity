import { db } from '@/lib/firebase-clients';
import { MemberInfo, MemberInfoCreateInput, MemberInfoUpdateInput } from '@/models/MemberInfo';
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

const COLLECTION_NAME = 'memberInfo';

/**
 * Get member by ID
 */
export async function getMemberById(memberId: string): Promise<MemberInfo | null> {
  try {
    const memberDoc = await getDoc(doc(db, COLLECTION_NAME, memberId));
    if (memberDoc.exists()) {
      return { id: memberDoc.id, ...memberDoc.data() } as MemberInfo;
    }
    return null;
  } catch (error) {
    console.error('Error getting member:', error);
    throw error;
  }
}

/**
 * Get all members
 */
export async function getAllMembers(): Promise<MemberInfo[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('joinedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as MemberInfo));
  } catch (error) {
    console.error('Error getting all members:', error);
    throw error;
  }
}

/**
 * Get members by kost ID
 */
export async function getMembersByKostId(kostId: string): Promise<MemberInfo[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME), 
      where('kostId', '==', kostId),
      orderBy('joinedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as MemberInfo));
  } catch (error) {
    console.error('Error getting members by kost:', error);
    throw error;
  }
}

/**
 * Get member by room number
 */
export async function getMemberByRoom(room: string): Promise<MemberInfo | null> {
  try {
    const q = query(collection(db, COLLECTION_NAME), where('room', '==', room));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const memberDoc = querySnapshot.docs[0];
      return { id: memberDoc.id, ...memberDoc.data() } as MemberInfo;
    }
    return null;
  } catch (error) {
    console.error('Error getting member by room:', error);
    throw error;
  }
}

/**
 * Get active members
 */
export async function getActiveMembers(kostId?: string): Promise<MemberInfo[]> {
  try {
    let q;
    if (kostId) {
      q = query(
        collection(db, COLLECTION_NAME),
        where('kostId', '==', kostId),
        where('status', '==', 'active'),
        orderBy('joinedAt', 'desc')
      );
    } else {
      q = query(
        collection(db, COLLECTION_NAME),
        where('status', '==', 'active'),
        orderBy('joinedAt', 'desc')
      );
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as MemberInfo));
  } catch (error) {
    console.error('Error getting active members:', error);
    throw error;
  }
}

/**
 * Create a new member (data only, without Firebase Auth account)
 * Member needs to register themselves using the email provided here
 * Or use default password: 123456 if you uncomment the auth creation code
 */
export async function createMember(memberData: MemberInfoCreateInput): Promise<string> {
  try {
    // Create member info document only
    // Member will need to register themselves later with this email
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...memberData,
      status: memberData.status || 'pending', // Set to pending until member registers
      joinedAt: serverTimestamp(),
    });

    // Note: Member needs to register via register-member page
    // They should use the email that admin provided here
    
    return docRef.id;
  } catch (error: any) {
    console.error('Error creating member:', error);
    throw error;
  }
}

/**
 * Update member data
 */
export async function updateMember(memberId: string, memberData: MemberInfoUpdateInput): Promise<void> {
  try {
    await updateDoc(doc(db, COLLECTION_NAME, memberId), {
      ...memberData,
    });
  } catch (error) {
    console.error('Error updating member:', error);
    throw error;
  }
}

/**
 * Delete member
 */
export async function deleteMember(memberId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, memberId));
  } catch (error) {
    console.error('Error deleting member:', error);
    throw error;
  }
}

/**
 * Deactivate member (soft delete)
 */
export async function deactivateMember(memberId: string): Promise<void> {
  try {
    await updateMember(memberId, { status: 'inactive' });
  } catch (error) {
    console.error('Error deactivating member:', error);
    throw error;
  }
}

/**
 * Check if room is occupied
 */
export async function isRoomOccupied(room: string): Promise<boolean> {
  try {
    const member = await getMemberByRoom(room);
    return member !== null && member.status === 'active';
  } catch (error) {
    console.error('Error checking room occupancy:', error);
    throw error;
  }
}

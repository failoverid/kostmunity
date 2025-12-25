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
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase-clients';

export interface Feedback {
  id: string;
  kostId: string;
  memberId: string;
  memberName: string;
  category: 'complaint' | 'suggestion' | 'praise';
  subject: string;
  message: string;
  status: 'pending' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  response?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

export interface FeedbackCreateInput {
  kostId: string;
  memberId: string;
  memberName: string;
  category: 'complaint' | 'suggestion' | 'praise';
  subject: string;
  message: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface FeedbackUpdateInput {
  subject?: string;
  message?: string;
  status?: 'pending' | 'in-progress' | 'resolved';
  priority?: 'low' | 'medium' | 'high';
  response?: string;
}

// Get feedback by ID
export async function getFeedbackById(id: string): Promise<Feedback | null> {
  try {
    const docRef = doc(db, 'feedback', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        resolvedAt: data.resolvedAt?.toDate()
      } as Feedback;
    }
    return null;
  } catch (error) {
    console.error('Error getting feedback:', error);
    throw error;
  }
}

// Get all feedback for a kost
export async function getFeedbackByKostId(kostId: string): Promise<Feedback[]> {
  try {
    const q = query(
      collection(db, 'feedback'),
      where('kostId', '==', kostId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        resolvedAt: data.resolvedAt?.toDate()
      } as Feedback;
    });
  } catch (error) {
    console.error('Error getting feedback:', error);
    throw error;
  }
}

// Get feedback by member
export async function getFeedbackByMemberId(memberId: string): Promise<Feedback[]> {
  try {
    const q = query(
      collection(db, 'feedback'),
      where('memberId', '==', memberId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        resolvedAt: data.resolvedAt?.toDate()
      } as Feedback;
    });
  } catch (error) {
    console.error('Error getting feedback:', error);
    throw error;
  }
}

// Create new feedback
export async function createFeedback(data: FeedbackCreateInput): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'feedback'), {
      ...data,
      status: 'pending',
      priority: data.priority || 'medium',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating feedback:', error);
    throw error;
  }
}

// Update feedback
export async function updateFeedback(id: string, data: FeedbackUpdateInput): Promise<void> {
  try {
    const docRef = doc(db, 'feedback', id);
    const updateData: any = {
      ...data,
      updatedAt: serverTimestamp()
    };

    // If status is being set to resolved, add resolvedAt timestamp
    if (data.status === 'resolved') {
      updateData.resolvedAt = serverTimestamp();
    }

    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating feedback:', error);
    throw error;
  }
}

// Delete feedback
export async function deleteFeedback(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'feedback', id));
  } catch (error) {
    console.error('Error deleting feedback:', error);
    throw error;
  }
}

// Get pending feedback count for a kost
export async function getPendingFeedbackCount(kostId: string): Promise<number> {
  try {
    const q = query(
      collection(db, 'feedback'),
      where('kostId', '==', kostId),
      where('status', '==', 'pending')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting pending feedback count:', error);
    throw error;
  }
}

// Get active (pending + in-progress) feedback count
export async function getActiveFeedbackCount(kostId: string): Promise<number> {
  try {
    const q = query(
      collection(db, 'feedback'),
      where('kostId', '==', kostId),
      where('status', 'in', ['pending', 'in-progress'])
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting active feedback count:', error);
    throw error;
  }
}

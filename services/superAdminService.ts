import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  deleteDoc,
  query,
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase-clients';
import { SuperAdmin, SuperAdminCreateInput } from '@/models/SuperAdmin';

const COLLECTION_NAME = 'superAdmin';

/**
 * Get super admin by ID
 */
export async function getSuperAdminById(adminId: string): Promise<SuperAdmin | null> {
  try {
    const adminDoc = await getDoc(doc(db, COLLECTION_NAME, adminId));
    if (adminDoc.exists()) {
      return { id: adminDoc.id, ...adminDoc.data() } as SuperAdmin;
    }
    return null;
  } catch (error) {
    console.error('Error getting super admin:', error);
    throw error;
  }
}

/**
 * Get super admin by user ID (Auth UID)
 */
export async function getSuperAdminByUserId(userId: string): Promise<SuperAdmin | null> {
  try {
    const q = query(collection(db, COLLECTION_NAME), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const adminDoc = querySnapshot.docs[0];
      return { id: adminDoc.id, ...adminDoc.data() } as SuperAdmin;
    }
    return null;
  } catch (error) {
    console.error('Error getting super admin by user ID:', error);
    throw error;
  }
}

/**
 * Get all super admins
 */
export async function getAllSuperAdmins(): Promise<SuperAdmin[]> {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as SuperAdmin));
  } catch (error) {
    console.error('Error getting all super admins:', error);
    throw error;
  }
}

/**
 * Create a new super admin
 */
export async function createSuperAdmin(adminData: SuperAdminCreateInput): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...adminData,
      role: 'superadmin',
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating super admin:', error);
    throw error;
  }
}

/**
 * Delete super admin
 */
export async function deleteSuperAdmin(adminId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, adminId));
  } catch (error) {
    console.error('Error deleting super admin:', error);
    throw error;
  }
}

/**
 * Check if user is super admin
 */
export async function isSuperAdmin(userId: string): Promise<boolean> {
  try {
    const admin = await getSuperAdminByUserId(userId);
    return admin !== null;
  } catch (error) {
    console.error('Error checking super admin status:', error);
    throw error;
  }
}

/**
 * Check if email is super admin
 */
export async function isSuperAdminByEmail(email: string): Promise<boolean> {
  try {
    const q = query(collection(db, COLLECTION_NAME), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking super admin by email:', error);
    throw error;
  }
}

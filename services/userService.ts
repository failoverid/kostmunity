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
import { User, UserCreateInput, UserUpdateInput } from '@/models/User';

const COLLECTION_NAME = 'users';

/**
 * Get a user by ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const userDoc = await getDoc(doc(db, COLLECTION_NAME, userId));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() } as User;
    }
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const q = query(collection(db, COLLECTION_NAME), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return { id: userDoc.id, ...userDoc.data() } as User;
    }
    return null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
}

/**
 * Get user by username
 */
export async function getUserByUsername(username: string): Promise<User | null> {
  try {
    const q = query(collection(db, COLLECTION_NAME), where('username', '==', username));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return { id: userDoc.id, ...userDoc.data() } as User;
    }
    return null;
  } catch (error) {
    console.error('Error getting user by username:', error);
    throw error;
  }
}

/**
 * Get all users (admin only)
 */
export async function getAllUsers(): Promise<User[]> {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as User));
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
}

/**
 * Get users by role
 */
export async function getUsersByRole(role: string): Promise<User[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME), where('role', '==', role));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as User));
  } catch (error) {
    console.error('Error getting users by role:', error);
    throw error;
  }
}

/**
 * Get users by owner ID
 */
export async function getUsersByOwnerId(ownerId: string): Promise<User[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME), where('ownerId', '==', ownerId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as User));
  } catch (error) {
    console.error('Error getting users by owner:', error);
    throw error;
  }
}

/**
 * Create a new user
 */
export async function createUser(userData: UserCreateInput): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...userData,
      ownerId: userData.ownerId || '-',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

/**
 * Update user data
 */
export async function updateUser(userId: string, userData: UserUpdateInput): Promise<void> {
  try {
    await updateDoc(doc(db, COLLECTION_NAME, userId), {
      ...userData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

/**
 * Delete a user
 */
export async function deleteUser(userId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, userId));
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

/**
 * Check if username exists
 */
export async function isUsernameExists(username: string): Promise<boolean> {
  try {
    const user = await getUserByUsername(username);
    return user !== null;
  } catch (error) {
    console.error('Error checking username:', error);
    throw error;
  }
}

/**
 * Check if email exists
 */
export async function isEmailExists(email: string): Promise<boolean> {
  try {
    const user = await getUserByEmail(email);
    return user !== null;
  } catch (error) {
    console.error('Error checking email:', error);
    throw error;
  }
}

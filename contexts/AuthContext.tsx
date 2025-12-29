import { signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase-clients';

export type UserRole = 'admin' | 'owner' | 'member' | 'user';

export interface AuthUser {
  uid: string;
  email: string;
  role: UserRole;
  nama: string;
  // Admin/Owner specific
  kostId?: string;
  // Member specific
  memberId?: string;
  kamar?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            
            // Set auth user based on role
            const authUser: AuthUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              role: userData.role || 'user',
              nama: userData.nama || '',
            };

            // Add role-specific data
            if (userData.role === 'admin' || userData.role === 'owner') {
              authUser.kostId = userData.ownerId; // ownerId in users collection = kostId in profileKost
            }

            if (userData.role === 'member' || userData.role === 'user') {
              // Fetch member info for additional data
              // Query by userId field instead of document ID
              const memberQuery = query(
                collection(db, 'memberInfo'),
                where('userId', '==', firebaseUser.uid)
              );
              const memberSnapshot = await getDocs(memberQuery);
              
              if (!memberSnapshot.empty) {
                const memberDoc = memberSnapshot.docs[0];
                const memberData = memberDoc.data();
                authUser.memberId = memberDoc.id;
                authUser.kamar = memberData.room; // Field di memberInfo adalah "room"
                authUser.kostId = memberData.kostId;
              } else {
                // Fallback: Try to find by email and update userId
                console.log('Member not found by userId, trying by email...');
                const emailQuery = query(
                  collection(db, 'memberInfo'),
                  where('email', '==', firebaseUser.email)
                );
                const emailSnapshot = await getDocs(emailQuery);
                
                if (!emailSnapshot.empty) {
                  const memberDoc = emailSnapshot.docs[0];
                  const memberData = memberDoc.data();
                  
                  // Update memberInfo dengan userId
                  console.log('Updating memberInfo with userId:', firebaseUser.uid);
                  await updateDoc(doc(db, 'memberInfo', memberDoc.id), {
                    userId: firebaseUser.uid
                  });
                  
                  authUser.memberId = memberDoc.id;
                  authUser.kamar = memberData.room;
                  authUser.kostId = memberData.kostId;
                }
              }
            }

            setUser(authUser);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

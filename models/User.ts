import { Timestamp } from 'firebase/firestore';

export interface User {
  id: string; // Document ID
  nama: string;
  email: string;
  username: string;
  password: string; // Note: Consider hashing in future
  role: 'user' | 'owner' | 'admin' | 'member';
  ownerId: string; // "-" if not applicable
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface UserCreateInput {
  nama: string;
  email: string;
  username: string;
  password: string;
  role: 'user' | 'owner' | 'admin' | 'member';
  ownerId?: string;
}

export interface UserUpdateInput {
  nama?: string;
  email?: string;
  username?: string;
  password?: string;
  role?: 'user' | 'owner' | 'admin' | 'member';
  ownerId?: string;
}

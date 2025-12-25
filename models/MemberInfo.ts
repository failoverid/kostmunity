import { Timestamp } from 'firebase/firestore';

export interface MemberInfo {
  id: string; // Document ID
  name: string;
  email: string; // Email for login
  phone: string;
  room: string; // Room number/name
  joinedAt: Timestamp;
  kostId?: string; // Reference to Kost ID (optional, for filtering)
  userId?: string; // Reference to User ID (optional)
  status?: 'active' | 'inactive'; // Member status
}

export interface MemberInfoCreateInput {
  name: string;
  email: string;
  phone: string;
  room: string;
  kostId?: string;
  userId?: string;
  status?: 'active' | 'inactive';
}

export interface MemberInfoUpdateInput {
  name?: string;
  email?: string;
  phone?: string;
  room?: string;
  kostId?: string;
  userId?: string;
  status?: 'active' | 'inactive';
}

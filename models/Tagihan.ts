import { Timestamp } from 'firebase/firestore';

export interface Tagihan {
  id: string; // Document ID
  memberId: string; // Reference to Member ID
  memberName?: string; // Cached member name for display
  amount: number; // e.g., 5000000
  room: string;
  dueDate: string; // e.g., "25 Okt" (consider using Timestamp in future)
  status: 'Belum Lunas' | 'Lunas' | 'Terlambat';
  createdAt: Timestamp;
  paidAt?: Timestamp; // When payment was made
  kostId?: string; // Reference to Kost ID
}

export interface TagihanCreateInput {
  memberId: string;
  memberName?: string;
  amount: number;
  room: string;
  dueDate: string;
  status?: 'Belum Lunas' | 'Lunas' | 'Terlambat';
  kostId?: string;
}

export interface TagihanUpdateInput {
  memberId?: string;
  memberName?: string;
  amount?: number;
  room?: string;
  dueDate?: string;
  status?: 'Belum Lunas' | 'Lunas' | 'Terlambat';
  paidAt?: Timestamp;
  kostId?: string;
}

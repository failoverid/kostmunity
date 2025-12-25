import { Timestamp } from 'firebase/firestore';

export interface SuperAdmin {
  id: string; // Document ID
  userId: string; // Reference to Authentication UID
  name: string;
  email: string;
  role: 'superadmin';
  createdAt?: Timestamp;
}

export interface SuperAdminCreateInput {
  userId: string;
  name: string;
  email: string;
}

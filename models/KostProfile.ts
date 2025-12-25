import { Timestamp } from 'firebase/firestore';

export interface KostProfile {
  id: string; // Document ID (e.g., "kost01")
  idKost: string; // Custom ID (e.g., "kost_kurnia_01")
  name: string; // Nama Kost
  address: string;
  rooms: string; // Total rooms (stored as string in DB)
  inviteCode: string; // Code for members to join
  ownerId: string; // Reference to user ID who owns this
  createdAt: Timestamp;
}

export interface KostProfileCreateInput {
  idKost: string;
  name: string;
  address: string;
  rooms: string;
  inviteCode: string;
  ownerId: string;
}

export interface KostProfileUpdateInput {
  idKost?: string;
  name?: string;
  address?: string;
  rooms?: string;
  inviteCode?: string;
  ownerId?: string;
}

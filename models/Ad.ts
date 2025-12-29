import { Timestamp } from 'firebase/firestore';

export interface Ad {
  id: string; // Document ID
  title: string;
  imageUrl: string;
  link: string; // Contact or external link
  kostId?: string; // Reference to Kost ID
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isActive?: boolean; // Whether ad is currently active
  displayOrder?: number; // Order of display
}

export interface AdCreateInput {
  title: string;
  imageUrl: string;
  link: string;
  kostId?: string;
  isActive?: boolean;
  displayOrder?: number;
}

export interface AdUpdateInput {
  title?: string;
  imageUrl?: string;
  link?: string;
  kostId?: string;
  isActive?: boolean;
  displayOrder?: number;
}

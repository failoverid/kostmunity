import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebase-clients";

export interface Feedback {
  memberId: string;
  message: string;
  createdAt: Date;
}

// Submit feedback baru
export async function submitFeedback(memberId: string, message: string): Promise<void> {
  const feedback: Feedback = { memberId, message, createdAt: new Date() };
  await addDoc(collection(db, "feedback"), feedback);
}
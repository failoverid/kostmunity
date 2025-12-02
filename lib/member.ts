import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase-clients";

// Interface member
export interface Member {
  name: string;
  phone: string;
  room: string;
  joinedAt: Date;
}

// Registrasi member baru
export async function registerMember(
  userId: string,
  name: string,
  phone: string,
  room: string
): Promise<void> {
  const member: Member = {
    name,
    phone,
    room,
    joinedAt: new Date(),
  };
  await setDoc(doc(db, "memberInfo", userId), member);
}

// Update info member
export async function updateMemberInfo(
  userId: string,
  updatedData: Partial<Member>
): Promise<void> {
  await setDoc(doc(db, "memberInfo", userId), updatedData, { merge: true });
}
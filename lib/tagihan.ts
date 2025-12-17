import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase-clients";

// Interface Tagihan
export interface Tagihan {
  memberId: string;
  room: string;
  amount: number;
  dueDate: string;
  status: string;      // "belum bayar", "lunas", dll
  createdAt: Date;
}

// Buat tagihan baru
export async function createTagihan(
  tagihanId: string,
  memberId: string,
  room: string,
  amount: number,
  dueDate: string
): Promise<void> {
  const tagihan: Tagihan = {
    memberId,
    room,
    amount,
    dueDate,
    status: "belum bayar",
    createdAt: new Date(),
  };
  await setDoc(doc(db, "tagihan", tagihanId), tagihan);
}

// Update status tagihan
export async function updateTagihanStatus(tagihanId: string, status: string): Promise<void> {
  await setDoc(doc(db, "tagihan", tagihanId), { status }, { merge: true });
}

// Update informasi tagihan lain (opsional)
export async function updateTagihanInfo(
  tagihanId: string,
  updatedData: Partial<Tagihan>
): Promise<void> {
  await setDoc(doc(db, "tagihan", tagihanId), updatedData, { merge: true });
}
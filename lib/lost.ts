import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { db } from "./firebase-clients";

export interface LostItem {
  item: string;
  memberId: string;
  type: "lost";          
  found: boolean;        
  reportedAt: Date;
  photoURL?: string;
  description?: string;
  location?: string;
  itemId?: string;
}

export async function reportLostItem(
  itemName: string,
  memberId: string,
  fileUri?: string,       // URI dari Expo ImagePicker
  description?: string,
  location?: string
): Promise<void> {
  const itemId = `${memberId}_${Date.now()}`;
  let photoURL: string | undefined;

  // Upload foto kalau ada
  if (fileUri) {
    const storage = getStorage();
    const storageRef = ref(storage, `lostItems/${itemId}.jpg`);

    const response = await fetch(fileUri);
    const blob = await response.blob();

    await uploadBytes(storageRef, blob);
    photoURL = await getDownloadURL(storageRef);
  }

  const item: LostItem = {
    item: itemName,
    memberId,
    type: "lost",
    found: false, // default status
    reportedAt: new Date(),
    photoURL,
    description,
    location,
    itemId,
  };

  await setDoc(doc(db, "lostItems", itemId), item);
}
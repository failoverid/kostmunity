import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { db } from "./firebase-clients";

export type LostFoundType = "lost" | "found";

export interface LostAndFoundItem {
  item: string;
  memberId: string;
  type: LostFoundType;
  found?: boolean;
  claimed?: boolean;
  reportedAt: Date;
  photoURL?: string;
  description?: string;
  location?: string;
  itemId?: string;
}

export async function reportItem(
  itemName: string,
  memberId: string,
  type: LostFoundType,
  fileUri?: string,          // pakai URI string dari Expo ImagePicker
  description?: string,
  location?: string
): Promise<void> {
  const itemId = `${memberId}_${Date.now()}`;
  let photoURL: string | undefined;

  // Upload foto kalau ada
  if (fileUri) {
    const storage = getStorage();
    const storageRef = ref(storage, `lostAndFound/${itemId}.jpg`);

    // Ambil data dari URI → Blob
    const response = await fetch(fileUri);
    const blob = await response.blob();

    await uploadBytes(storageRef, blob);
    photoURL = await getDownloadURL(storageRef);
  }

  const item: LostAndFoundItem = {
    item: itemName,
    memberId,
    type,
    reportedAt: new Date(),
    photoURL,
    description,
    location,
    itemId,
  };

  if (type === "lost") item.found = false;
  if (type === "found") item.claimed = false;

  await setDoc(doc(db, "lostAndFound", itemId), item);
}
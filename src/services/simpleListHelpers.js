import {
  doc,
  addDoc,
  getDocs,
  deleteDoc,
  onSnapshot,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";

export async function addSimpleItem({ name, qty }) {
  await addDoc(collection(db, "simpleItems"), {
    name,
    qty,
    createdAt: serverTimestamp(),
    date: new Date().toISOString().split("T")[0],
  });
}

export function subscribeSimpleItems(callback) {
  return onSnapshot(collection(db, "simpleItems"), (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(data);
  });
}

export async function deleteOldSimpleItems() {
  try {
    const today = new Date();
    const snap = await getDocs(collection(db, "simpleItems"));

    for (const document of snap.docs) {
      const data = document.data();
      if (!data.date) continue;

      const createdDate = new Date(data.date);
      const diffDays = Math.floor(
        (today - createdDate) / (1000 * 60 * 60 * 24)
      );

      if (diffDays > 7) {
        await deleteDoc(doc(db, "simpleItems", document.id));
        console.log(`🗑️ Deleted old item: ${document.id}`);
      }
    }
  } catch (error) {
    console.error("Error deleting old simple items:", error);
  }
}

import {
  doc,
  addDoc,
  getDocs,
  getDoc,
  onSnapshot,
  deleteDoc,
  updateDoc,
  increment,
  collection,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

export async function addItem({
  name,
  qty,
  type,
  price,
  description,
  purchase_rate,
  purchase_shop,
}) {
  const today = new Date();
  const createdDate = today.toISOString().split("T")[0];

  const docRef = await addDoc(collection(db, "items"), {
    name,
    qty: Number(qty),
    type,
    price: Number(price),
    description: description || "",
    purchase_rate: Number(purchase_rate) || 0,
    purchase_shop: purchase_shop || "",
    created: createdDate,
    createdAt: serverTimestamp(),
    editedAt: serverTimestamp(),
  });

  const snap = await getDoc(docRef);
  return { id: snap.id, ...snap.data() };
}

export async function getAllItems() {
  const snap = await getDocs(collection(db, "items"));
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function updateItem(itemId, updates) {
  const itemRef = doc(db, "items", itemId);
  await updateDoc(itemRef, {
    ...updates,
    editedAt: serverTimestamp(),
  });

  const snap = await getDoc(itemRef);
  return { id: snap.id, ...snap.data() };
}

export async function decreaseQty(itemId) {
  const itemRef = doc(db, "items", itemId);
  await updateDoc(itemRef, {
    qty: increment(-1),
    editedAt: serverTimestamp(),
  });

  const snap = await getDoc(itemRef);
  return { id: snap.id, ...snap.data() };
}

export function subscribeItems(callback) {
  return onSnapshot(collection(db, "items"), (snapshot) => {
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(data);
  });
}

export const deleteAllItems = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "items"));
    if (querySnapshot.empty) {
      console.log("No items to delete.");
      return;
    }

    const batch = writeBatch(db);
    querySnapshot.forEach((document) => {
      batch.delete(doc(db, "items", document.id));
    });

    await batch.commit();
    console.log("All items deleted successfully");
  } catch (error) {
    console.error("Error deleting items: ", error);
  }
};

export const deleteSingleItem = async (itemId) => {
  try {
    await deleteDoc(doc(db, "items", itemId));
    console.log(`Item ${itemId} deleted successfully`);
  } catch (error) {
    console.error("Error deleting item: ", error);
  }
};

import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  addDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { firebaseApp } from "./firebase-config";

const db = getFirestore(firebaseApp);
const chatCollection = collection(db, "chats");

export const getAllChats = async (currentUser) => {
  const q = query(
    chatCollection,
    where("users", "array-contains", currentUser),
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.reduce((prev, cur) => {
    const item = cur.data();
    const otherUser =
      item.users[0] === currentUser ? item.users[1] : item.users[0];

    return {
      ...prev,
      [otherUser]: item,
    };
  }, {});
};

export const deleteAllChats = async (currentUser) => {
  const q = query(
    chatCollection,
    where("users", "array-contains", currentUser),
  );
  const snapshot = await getDocs(q);

  const deletions = snapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));
  return Promise.all(deletions);
};

export const listenNewMessages = (currentUser) => {
  return query(chatCollection, where("users", "array-contains", currentUser));
};

export const deleteChat = async ({ currentUser, otherUser }) => {
  const q = query(
    chatCollection,
    where(`usersNormalized.${currentUser}`, "==", true),
    where(`usersNormalized.${otherUser}`, "==", true),
  );
  const snapshot = await getDocs(q);

  if (!snapshot.docs.length) return false;

  await deleteDoc(snapshot.docs[0].ref);
  return true;
};

export const sendMessage = async ({ currentUser, otherUser, message }) => {
  const q = query(
    chatCollection,
    where(`usersNormalized.${currentUser}`, "==", true),
    where(`usersNormalized.${otherUser}`, "==", true),
  );
  const snapshot = await getDocs(q);

  if (!snapshot.docs.length) {
    await addDoc(chatCollection, {
      users: [currentUser, otherUser],
      usersNormalized: {
        [currentUser]: true,
        [otherUser]: true,
      },
      messages: [message],
      lastSeens: {
        [currentUser]: new Date(),
        [otherUser]: null,
      },
    });
  } else {
    await updateDoc(snapshot.docs[0].ref, {
      messages: arrayUnion(message),
    });
  }
};

export const updateLastSeen = async ({ currentUser, otherUser }) => {
  const q = query(
    chatCollection,
    where(`usersNormalized.${currentUser}`, "==", true),
    where(`usersNormalized.${otherUser}`, "==", true),
  );
  const snapshot = await getDocs(q);

  if (snapshot.docs.length) {
    const ref = snapshot.docs[0].ref;
    const data = snapshot.docs[0].data();

    await updateDoc(ref, {
      lastSeens: {
        [currentUser]: new Date(),
        [otherUser]: data?.lastSeens?.[otherUser] ?? null,
      },
    });
  }
};

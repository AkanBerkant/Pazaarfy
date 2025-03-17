import firestore from "@react-native-firebase/firestore";

const chatCollection = firestore().collection("chats");

export const getAllChats = async (currentUser) => {
  const { docs } = await chatCollection
    .where("users", "array-contains", currentUser)
    .get();

  return docs.reduce((prev, cur) => {
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
  const { docs } = await chatCollection
    .where("users", "array-contains", currentUser)
    .get();

  const x = await Promise.all(
    docs.map((item) => {
      return item.ref.delete();
    }),
  );

  return x;
};

export const listenNewMessages = (currentUser) => {
  return chatCollection.where("users", "array-contains", currentUser);
};

export const deleteChat = async ({ currentUser, otherUser }) => {
  const { docs } = await chatCollection
    .where(`usersNormalized.${currentUser}`, "==", true)
    .where(`usersNormalized.${otherUser}`, "==", true)
    .get();

  if (!docs[0]) {
    return false;
  }

  await docs[0].ref.delete();

  return true;
};

export const sendMessage = async ({ currentUser, otherUser, message }) => {
  const { docs } = await chatCollection
    .where(`usersNormalized.${currentUser}`, "==", true)
    .where(`usersNormalized.${otherUser}`, "==", true)
    .get();

  if (!docs[0]) {
    chatCollection.add({
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
    docs[0].ref.update({
      messages: firestore.FieldValue.arrayUnion(message),
    });
  }
};

export const updateLastSeen = async ({ currentUser, otherUser }) => {
  const { docs } = await chatCollection
    .where(`usersNormalized.${currentUser}`, "==", true)
    .where(`usersNormalized.${otherUser}`, "==", true)
    .get();

  if (docs[0]) {
    docs[0].ref.update({
      lastSeens: {
        [currentUser]: new Date(),
        [otherUser]: docs[0]?.data()?.lastSeens?.[otherUser] ?? null,
      },
    });
  }
};

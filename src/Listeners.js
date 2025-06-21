import React, { useEffect } from "react";
import { StyleSheet } from "react-native";

import { useAtomValue, useSetAtom } from "jotai";
import moment from "moment";

import { chatsAtom, userAtom } from "./utils/atoms";
import { listenNewMessages } from "./utils/firestore-queries";
import { onSnapshot, getDocs } from "firebase/firestore";

const Listeners = () => {
  const user = useAtomValue(userAtom);
  const setChats = useSetAtom(chatsAtom);

  const fetchChats = async (chatsQuery) => {
    const snapshot = await getDocs(chatsQuery);
    const changesNormalized = snapshot.docs.reduce((prev, cur) => {
      const item = cur.data();
      const otherUser =
        item.users[0] === user._id ? item.users[1] : item.users[0];

      const unreadMessageCount =
        item.messages?.filter((message) => {
          if (message.sender !== otherUser) return false;
          return (
            !item.lastSeens?.[user._id] ||
            moment(message.date?.seconds * 1000).isAfter(
              (item.lastSeens[user._id]?.seconds || 0) * 1000,
            )
          );
        }).length || 0;

      return {
        ...prev,
        [otherUser]: {
          ...item,
          unreadMessageCount,
          messages: item.messages || [],
        },
      };
    }, {});

    setChats(changesNormalized);
  };

  useEffect(() => {
    if (user?._id) {
      const chatsQuery = listenNewMessages(user._id);

      fetchChats(chatsQuery);

      const unsubscribe = onSnapshot(chatsQuery, () => {
        fetchChats(chatsQuery);
      });

      return () => unsubscribe();
    } else {
      setChats({});
    }
  }, [user?._id]);

  return null;
};

export default Listeners;

const styles = StyleSheet.create({});

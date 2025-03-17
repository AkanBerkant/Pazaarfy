import React from 'react';
import { StyleSheet } from 'react-native';

import { useAtomValue, useSetAtom } from 'jotai';
import moment from 'moment';

import { chatsAtom, userAtom } from './utils/atoms';
import { listenNewMessages } from './utils/firestore-queries';

const Listeners = () => {
  const user = useAtomValue(userAtom);
  const setChats = useSetAtom(chatsAtom);

  const fetchChats = async (chatsQuery) => {
    const { docs: changes } = await chatsQuery.get();

    const changesNormalized = changes.reduce((prev, cur) => {
      const item = cur.data();
      const otherUser = item.users[0] === user._id ? item.users[1] : item.users[0];

      const unreadMessageCount = item.messages.filter((message) => {
        if (message.sender !== otherUser) return false;

        return (
          !item.lastSeens?.[user._id]
          || moment(message.date.seconds * 1000).isAfter(
            item.lastSeens[user._id].seconds * 1000,
          )
        );
      }).length;

      return {
        ...prev,
        [otherUser]: {
          ...item,
          unreadMessageCount,
          messages: item.messages,
        },
      };
    }, {});

    setChats(changesNormalized);
  };

  React.useEffect(() => {
    if (user) {
      let unsubscribe;
      const chatsQuery = listenNewMessages(user._id);

      fetchChats(chatsQuery).then(() => {
        unsubscribe = chatsQuery.onSnapshot({
          next: () => { return fetchChats(chatsQuery); },
        });
      }, []);

      return () => {
        return unsubscribe?.();
      };
    // eslint-disable-next-line no-else-return
    } else {
      setChats({});
    }
  }, [user?._id]);

  return null;
};

export default Listeners;

const styles = StyleSheet.create({});

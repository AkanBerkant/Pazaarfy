import React, { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  View,
  StyleSheet,
} from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";
import { useAtomValue } from "jotai";
import moment from "moment";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { MessageInput } from "../../components";
import { chatsAtom, userAtom } from "../../utils/atoms";
import * as FirestoreQueries from "../../utils/firestore-queries";
import * as Queries from "../../utils/queries";

import Header from "./Header";
import Message from "./Message";
import PortalView from "./PortalView";

const MessageScreen = () => {
  const navigation = useNavigation();
  const listRef = React.useRef();
  const route = useRoute();
  const user = useAtomValue(userAtom);
  const { item: chatItem } = route.params;
  const [text, setText] = React.useState("");
  const chats = useAtomValue(chatsAtom);
  const messages = chats[chatItem.user._id]?.messages || [];

  const [messageCordinates, setMessageCordinates] = useState({ x: 0, y: 0 });
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isSender, setSender] = useState(false);

  const onLongPress = (e, message) => {
    const { pageY, locationY } = e.nativeEvent;
    const y = pageY - locationY;

    setMessageCordinates({
      x: 0,
      y,
    });
    setSelectedMessage(message);
  };

  React.useEffect(() => {
    /* updateLastSeen({
      currentUser: user.id,
      otherUser: chatItem.user.id,
    }); */

    return () => {
      FirestoreQueries.updateLastSeen({
        currentUser: user._id,
        otherUser: chatItem.user._id,
      });
    };
  }, []);

  const onSendMessagePress = () => {
    if (text.trim().length) {
      FirestoreQueries.sendMessage({
        message: {
          id: Math.random().toString(16).slice(2),
          sender: user._id,
          text,
          date: new Date(),
        },
        currentUser: user._id,
        otherUser: chatItem.user._id,
      })
        .finally(() => {
          return setText("");
        })
        .finally(() => {
          Queries.sendMessage({
            message: text,
            user: chatItem.user._id,
          });
        });
    }
  };

  const scrollToEnd = () => {
    listRef.current?.scrollToOffset({ offset: 999 * 9999, animated: false });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <Header
        firstname={chatItem.user.firstname}
        username={chatItem.user.username}
        photo={chatItem.user.photo}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <FlatList
          ref={listRef}
          data={messages}
          onContentSizeChange={() => {
            scrollToEnd();
          }}
          keyExtractor={(item) => {
            return item.createdAt;
          }}
          renderItem={({ item }) => {
            const messageDate = moment(
              new Date(
                item.date.seconds * 1000 + item.date.nanoseconds / 1000000,
              ),
            );

            return (
              <Message
                content={{
                  text: item.text,
                }}
                isSender={item.sender === user._id}
                sender={{
                  avatar:
                    item.sender === user._id ? user.photo : chatItem.user.photo,
                }}
                onLongPress={onLongPress}
                onPressIn={setSender}
                date={messageDate.format("hh:mm")}
              />
            );
          }}
        />
        <PortalView
          selectedMessage={selectedMessage}
          messageCordinates={messageCordinates}
          setSelectedMessage={setSelectedMessage}
          isSender={isSender}
        />
        <View
          style={{
            backgroundColor: "#151515",
            padding: 10,
          }}
        >
          <MessageInput
            value={text}
            onChangeText={setText}
            onSubmitEditing={onSendMessagePress}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default MessageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

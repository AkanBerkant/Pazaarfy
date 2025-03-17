import React, { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  Alert,
} from "react-native";

import { useNavigation, StackActions } from "@react-navigation/native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";
import { useAtomValue } from "jotai";
import moment from "moment";
import Swipeable from "react-native-gesture-handler/Swipeable";

import { Container } from "../../components";
import ReactNativeAnimatedSearchbox from "../../components/animated/card/AnimatedSearchBar";
import routes from "../../constants/routes";
import { sizes } from "../../theme";
import fonts from "../../theme/fonts";
import { chatsAtom, userAtom } from "../../utils/atoms";
import { deleteChat } from "../../utils/firestore-queries";
import * as Queries from "../../utils/queries";

const Messages = () => {
  const navigation = useNavigation();
  const chats = useAtomValue(chatsAtom);
  const queryClient = useQueryClient();
  const user = useAtomValue(userAtom);

  const swipeEnabled = true;
  const [searchText, setSearchText] = React.useState("");

  const swipeableRef = React.useRef();

  const refreshQuery = useQuery(["refreshMessages"], () => {
    return new Promise((resolve) => {
      return setTimeout(resolve, 1000);
    });
  });

  const leftSwipe = (otherUser) => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            Alert.alert(t("sureToDeleteChat"), null, [
              {
                text: t("no"),
              },
              {
                text: t("yes"),
                onPress: () => {
                  deleteChat({
                    currentUser: user._id,
                    otherUser,
                  });
                },
              },
            ]);
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: 60,

              marginTop: 10,
            }}
          >
            <Image
              resizeMode="contain"
              source={require("../../assets/delete.png")}
              style={{
                width: 55,
                height: 55,
              }}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const [isScaled, setIsScaled] = useState(false);

  const RenderItem = ({ item: [itemId, itemValue], searchText }) => {
    const otherUser =
      itemValue.users[0] === user._id ? itemValue.users[1] : itemValue.users[0];

    const getUserQuery = useQuery(
      ["PROFILE", otherUser],
      () => {
        return Queries.getUserById(otherUser);
      },
      {
        placeholderData: {},
      },
    );

    const lastMessage = itemValue.messages?.length
      ? itemValue.messages[itemValue.messages.length - 1]
      : {};
    const { photo, firstname, username } = getUserQuery.data;

    const lastMessageDate = moment(
      new Date(
        lastMessage.date.seconds * 1000 +
          lastMessage.date.nanoseconds / 1000000,
      ),
    );

    if (
      !(
        firstname?.toLowerCase().includes(searchText.toLowerCase()) ||
        username?.toLowerCase().includes(searchText.toLowerCase())
      )
    )
      return null;

    return (
      <Swipeable
        ref={swipeableRef}
        enabled={swipeEnabled}
        renderRightActions={() => {
          return leftSwipe(otherUser);
        }}
        overshootLeft={false}
        overshootRight={false}
        onSwipeableWillClose={() => {}}
        onSwipeableWillOpen={() => {}}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(routes.MessageScreen, {
              item: {
                user: {
                  _id: otherUser,
                  firstname,
                  username,
                  photo,
                },
              },
            });
          }}
          style={styles.item}
        >
          <View style={[styles.row, { flex: 1 }]}>
            <TouchableOpacity
              onPress={() => {
                navigation.dispatch(
                  StackActions.push(routes.UserProfile, {
                    userId: otherUser,
                  }),
                );
              }}
            >
              {photo ? (
                <Image source={{ uri: photo }} style={styles.pp} />
              ) : (
                <Image
                  source={require("../../assets/person.png")}
                  style={styles.person}
                />
              )}
            </TouchableOpacity>
            <View style={styles.left}>
              <Text style={styles.name}>{username}</Text>
              <View style={styles.row}>
                <Text style={styles.message}>
                  {lastMessage.text.length > 30
                    ? `${lastMessage.text.substring(0, 24)}...`
                    : lastMessage.text}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.left}>
            <Text style={styles.day}>{lastMessageDate.fromNow()}</Text>
            {itemValue.unreadMessageCount > 0 && (
              <View style={styles.lengthBg}>
                <Text style={styles.length}>
                  {itemValue.unreadMessageCount}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  return (
    <Container scrollview={false}>
      <View style={styles.between}>
        <View style={styles.row}>
          <View
            style={styles.backContainer}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Text style={styles.title}>{t("Messages")}</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate(routes.Friends);
          }}
        >
          <Image
            source={require("../../assets/messagess.png")}
            style={styles.messages}
          />
        </TouchableOpacity>
      </View>

      <ReactNativeAnimatedSearchbox
        isScaled={isScaled}
        setIsScaled={setIsScaled}
        value={searchText}
        onChangeText={setSearchText}
      />

      <View style={styles.borderBottom} />

      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshQuery.isFetching}
            tintColor="#FFF"
            onRefresh={() => {
              queryClient.invalidateQueries(["refreshMessages"]);
            }}
          />
        }
        contentContainerStyle={styles.items}
        data={Object.entries(chats).sort((a, b) => {
          const lastMessageA = a[1].messages?.length
            ? a[1].messages[a[1].messages.length - 1]
            : {};
          const lastMessageDateA = moment(
            new Date(
              lastMessageA.date.seconds * 1000 +
                lastMessageA.date.nanoseconds / 1000000,
            ),
          );

          const lastMessageB = b[1].messages?.length
            ? b[1].messages[b[1].messages.length - 1]
            : {};
          const lastMessageDateB = moment(
            new Date(
              lastMessageB.date.seconds * 1000 +
                lastMessageB.date.nanoseconds / 1000000,
            ),
          );

          return moment(lastMessageDateA).isAfter(lastMessageDateB) ? -1 : 1;
        })}
        renderItem={({ item }) => {
          return <RenderItem item={item} searchText={searchText} />;
        }}
      />
    </Container>
  );
};

export default Messages;

const styles = StyleSheet.create({
  between: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",

    width: sizes.width / 1.07,
    alignSelf: "center",
  },
  backIcon: {
    width: 12.43,
    height: 22,
    tintColor: "#BBBBBB",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  borderBottom: {
    backgroundColor: "#181818",
    width: sizes.width,
    height: 1,
  },
  title: {
    color: "#FFF",
    fontSize: 32,
    fontFamily: fonts.medium,
    alignSelf: "center",
    marginLeft: 5,
  },
  pp: {
    width: 59,
    height: 59,
    borderRadius: 59,
    backgroundColor: "#CDCDCD",
  },
  item: {
    padding: 10,
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#222222",
    alignItems: "center",
    height: sizes.width / 4.5,
    justifyContent: "space-between",
  },
  name: {
    fontSize: 16,
    color: "#fff",
    fontFamily: fonts.medium,
  },
  left: {
    marginLeft: 10,
  },
  backContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  message: {
    color: "#959394",
    fontSize: 14,
    fontFamily: fonts.regular,
    marginTop: 4,
  },
  day: {
    color: "#959394",
    fontSize: 14,
    marginTop: 4,
    fontFamily: fonts.medium,
  },
  lengthBg: {
    backgroundColor: "#A8A8A8",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 7.5,
    width: 22,
    alignSelf: "flex-end",
    height: 15,
    marginTop: 5,
  },
  length: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  messages: {
    width: 23.12,
    marginRight: 15,
    height: 22.99,
    tintColor: "#969394",
  },
  person: {
    tintColor: "#606060",
    width: 52,
    height: 52,
    borderRadius: 52,
  },
});

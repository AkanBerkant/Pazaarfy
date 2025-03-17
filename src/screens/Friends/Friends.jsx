import React from "react";
import { FlatList, StyleSheet, View } from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";
import { useAtomValue } from "jotai";
import { RefreshControl } from "react-native-gesture-handler";

import { BackHeader, Container } from "../../components";
import { colors, sizes } from "../../theme";
import fonts from "../../theme/fonts";
import { userAtom } from "../../utils/atoms";
import * as Queries from "../../utils/queries";

import FriendItem from "./FriendItem";

const Friends = () => {
  const user = useAtomValue(userAtom);
  const queryClient = useQueryClient();

  const getFollowingsQuery = useQuery(
    ["USER_FOLLOWINGS", user._id],
    () => {
      return Queries.getFollowings(user._id);
    },
    {
      placeholderData: [],
    },
  );

  const renderItem = ({ item }) => {
    return <FriendItem targetUser={item.following} initialStatus />;
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#000",
      }}
    >
      <BackHeader title={t("NewMessage")} />
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={getFollowingsQuery.isFetching}
            tintColor={"#918E8D"}
            onRefresh={() => {
              queryClient.invalidateQueries(["USER_FOLLOWINGS"]);
            }}
          />
        }
        data={getFollowingsQuery.data}
        renderItem={renderItem}
        keyExtractor={(item) => {
          return item._id;
        }}
        style={styles.flatlist}
      />
    </View>
  );
};

export default Friends;

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    width: sizes.width / 1.03,
    justifyContent: "space-between",
    alignSelf: "center",
    margin: 5,
  },
  pp: {
    width: 57,
    height: 57,
    borderRadius: 57,
    backgroundColor: "#CDCDCD",
  },
  name: {
    fontSize: 18,
    color: "#FFF",
    marginLeft: 10,
    fontFamily: fonts.avenir,
  },
  button: {
    backgroundColor: "#181818",
    borderRadius: 14,
    width: 70,
    justifyContent: "center",
    alignItems: "center",
    height: 27,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  flatlist: {
    marginTop: 20,
  },
  person: {
    tintColor: "#606060",
    width: 57,
    height: 57,
    borderRadius: 57,
  },
});

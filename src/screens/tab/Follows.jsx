import React from "react";
import { FlatList, View, StyleSheet } from "react-native";

import { useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { t } from "i18next";

import { BackHeader } from "../../components";
import * as Queries from "../../utils/queries";

import FollowItem from "./FollowItem";

const Follows = () => {
  const route = useRoute();

  const getFollowingsQuery = useQuery(
    ["USER_FOLLOWINGS", route.params.userId],
    () => {
      return Queries.getFollowings(route.params.userId);
    },
    {
      placeholderData: [],
    },
  );

  const renderItem = ({ item }) => {
    return (
      <FollowItem
        targetUser={item.following}
        initialStatus={item.doCurrentUserFollow}
      />
    );
  };

  return (
    <View style={styles.container}>
      <BackHeader bg={"#101010"} title={t("Followss")} />
      <FlatList
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

export default Follows;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  flatlist: {
    marginTop: 20,
  },
});

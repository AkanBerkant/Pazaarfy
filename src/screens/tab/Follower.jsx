import React from "react";
import { FlatList, StyleSheet } from "react-native";

import { useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { t } from "i18next";

import { BackHeader, Container } from "../../components";
import * as Queries from "../../utils/queries";

import FollowItem from "./FollowItem";

const Follower = () => {
  const route = useRoute();

  const getFollowersQuery = useQuery(
    ["USER_FOLLOWERS", route.params.userId],
    () => {
      return Queries.getFollowers(route.params.userId);
    },
    {
      placeholderData: [],
    },
  );

  const renderItem = ({ item }) => {
    return (
      <FollowItem
        targetUser={item.follower}
        initialStatus={item.doCurrentUserFollow}
      />
    );
  };

  return (
    <Container header={<BackHeader bg={"#101010"} title={t("FollowersL")} />}>
      <FlatList
        data={getFollowersQuery.data}
        renderItem={renderItem}
        keyExtractor={(item) => {
          return item._id;
        }}
        style={styles.flatlist}
      />
    </Container>
  );
};

export default Follower;

const styles = StyleSheet.create({
  flatlist: {
    marginTop: 20,
  },
});

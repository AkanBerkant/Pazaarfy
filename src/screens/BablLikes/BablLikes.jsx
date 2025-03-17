import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";

import {
  useRoute,
  useNavigation,
  StackActions,
} from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";

import { BackHeader } from "../../components";
import Button from "../../components/buttons/Button";
import routes from "../../constants/routes";
import { useActionStatus } from "../../hooks/useActionStatus";
import { sizes } from "../../theme";
import fonts from "../../theme/fonts";
import * as Queries from "../../utils/queries";

const LikeItem = ({ item }) => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const {
    actionStatus: followStatus,
    onNegativeAction,
    onPositiveAction,
  } = useActionStatus({
    initialCount: 1,
    initialStatus: item.doCurrentUserFollow,
  });

  const followMutation = useMutation(Queries.follow, {
    onSuccess: (res) => {
      onPositiveAction();
      queryClient.invalidateQueries(["PROFILE"]);
    },
    onError: (err) => {
      console.log("err", err);
    },
  });

  const unfollowMutation = useMutation(Queries.unfollow, {
    onSuccess: (res) => {
      onNegativeAction();
      queryClient.invalidateQueries(["PROFILE"]);
    },
    onError: (err) => {
      console.log("err", err);
    },
  });

  const onFollowPress = () => {
    if (followStatus) {
      unfollowMutation.mutate(item.user._id);
    } else {
      followMutation.mutate(item.user._id);
    }
  };

  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        navigation.dispatch(
          StackActions.push(routes.UserProfile, { userId: item.user._id }),
        );
      }}
    >
      <View style={styles.row}>
        <Image source={{ uri: item.user.photo }} style={styles.pp} />
        <View style={styles.left}>
          <Text style={styles.name}>{item.user.firstname}</Text>
          <Text style={styles.username}>{item.user.username}</Text>
        </View>
      </View>
      <Button
        onPress={onFollowPress}
        title={followStatus ? t("Following") : t("Follow")}
      />
    </TouchableOpacity>
  );
};

const BablLikes = () => {
  const route = useRoute();
  const { bablId } = route.params;

  const listLikesQuery = useQuery(
    ["LIST_BABL_LIKES", bablId],
    () => {
      return Queries.listLikes(bablId);
    },
    {
      placeholderData: [],
    },
  );

  const renderItem = ({ item }) => {
    return <LikeItem item={item} />;
  };

  return (
    <View style={styles.container}>
      <BackHeader title={t("Likes")} />
      <FlatList
        data={listLikesQuery.data}
        contentContainerStyle={styles.contentContainerStyle}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#000",
  },
  item: {
    width: sizes.width / 1.1,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    marginTop: 7,
    justifyContent: "space-between",
  },
  name: {
    color: "#FFF",
    fontFamily: fonts.roboto,
  },
  left: {
    marginLeft: 10,
  },
  username: {
    color: "#FFF",
    fontFamily: fonts.roboto,
    color: "#929394",
    fontFamily: "Roboto-Ligt",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  pp: {
    width: 40,
    height: 40,
    borderRadius: 40,
  },
  contentContainerStyle: {
    marginTop: 20,
  },
});

export default BablLikes;

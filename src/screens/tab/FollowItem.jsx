import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useNavigation, StackActions } from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";

import Button from "../../components/buttons/Button";
import routes from "../../constants/routes";
import { useActionStatus } from "../../hooks/useActionStatus";
import { sizes } from "../../theme";
import fonts from "../../theme/fonts";
import * as Queries from "../../utils/queries";

const FollowItem = ({ targetUser, initialStatus = true }) => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const {
    actionStatus: followStatus,
    onNegativeAction,
    onPositiveAction,
  } = useActionStatus({
    initialCount: 1,
    initialStatus,
  });

  const followMutation = useMutation(Queries.follow, {
    onSuccess: (res) => {
      onPositiveAction();
      queryClient.invalidateQueries(["PROFILE"]);
      queryClient.invalidateQueries(["PROFILE_X"]);
    },
    onError: (err) => {
      console.log("err", err);
    },
  });

  const unfollowMutation = useMutation(Queries.unfollow, {
    onSuccess: (res) => {
      onNegativeAction();
      queryClient.invalidateQueries(["PROFILE"]);
      queryClient.invalidateQueries(["PROFILE_X"]);
    },
    onError: (err) => {
      console.log("err", err);
    },
  });

  const onFollowPress = () => {
    if (followStatus) {
      unfollowMutation.mutate(targetUser._id);
    } else {
      followMutation.mutate(targetUser._id);
    }
  };

  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        navigation.dispatch(
          StackActions.push(routes.UserProfile, {
            userId: targetUser._id,
          }),
        );
      }}
    >
      <View style={styles.row}>
        {targetUser.photo ? (
          <Image source={{ uri: targetUser.photo }} style={styles.pp} />
        ) : (
          <Image
            source={require("../../assets/person.png")}
            style={styles.person}
          />
        )}

        <Text style={styles.name}>{targetUser.username}</Text>
      </View>

      {followStatus ? (
        <Button
          fontSize={12}
          style={styles.button}
          color="#606060"
          title={t("Unfollow")}
          onPress={onFollowPress}
        />
      ) : (
        <Button
          fontSize={12}
          style={styles.buttonFollow}
          title={t("Follow")}
          onPress={onFollowPress}
        />
      )}
    </TouchableOpacity>
  );
};

export default FollowItem;

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    width: sizes.width / 1.03,
    justifyContent: "space-between",
    alignSelf: "center",
    margin: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#171717",
  },
  pp: {
    width: 57,
    height: 57,
    borderRadius: 57,
    backgroundColor: "#CDCDCD",
  },
  name: {
    fontSize: 14,
    color: "#FFF",
    marginLeft: 10,
    fontFamily: fonts.medium,
  },
  button: {
    backgroundColor: "#181818",
    borderRadius: 14,
    width: 70,
    justifyContent: "center",
    alignItems: "center",
    height: 27,
  },
  buttonFollow: {
    backgroundColor: "#0AAFF6",
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

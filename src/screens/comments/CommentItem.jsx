import React from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";
import { useAtomValue } from "jotai";
import moment from "moment";
import Swipeable from "react-native-gesture-handler/Swipeable";
import HapticFeedback from "react-native-haptic-feedback";

import TextGradient from "../../components/TextGradient";
import routes from "../../constants/routes";
import { notify } from "../../helpers/notify";
import { useActionStatus } from "../../hooks/useActionStatus";
import { sizes } from "../../theme";
import fonts from "../../theme/fonts";
import { userAtom } from "../../utils/atoms";
import * as Queries from "../../utils/queries";

const CommentItem = ({
  item,
  setSelectedCommentId,
  setVisible,
  setIsOpen,
  answer,
  swipeEnabled = true,
  showReply = true,
}) => {
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const user = useAtomValue(userAtom);
  const [deleted, setDeleted] = React.useState(false);

  const swipeableRef = React.useRef();

  const deleteCommentMutation = useMutation(Queries.deleteComment, {
    onSuccess: () => {
      setDeleted(true);
      notify({
        title: t("YourCommentHasBeenDeleted"),
      });
      queryClient.invalidateQueries(["BABL"]);
    },
  });

  const {
    actionStatus: likeStatus,
    currentCount: likeCount,
    setCurrentCount,
    onNegativeAction,
    onPositiveAction,
  } = useActionStatus({
    initialCount: item.likeCount,
    initialStatus: item.likeStatus,
  });

  const likeCommentMutation = useMutation(
    () => {
      return Queries.likeComment(item._id);
    },
    {
      onSuccess: (res) => {
        onPositiveAction();
      },
      onError: (err) => {
        console.log("err", err);
      },
    },
  );

  const unlikeCommentMutation = useMutation(
    () => {
      return Queries.unlikeComment(item._id);
    },
    {
      onSuccess: (res) => {
        onNegativeAction();
      },
      onError: (err) => {
        console.log("err", err);
      },
    },
  );

  const leftSwipe = (cmmntId, showDelete) => {
    return showDelete ? (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            Alert.alert(t("wouldYouLikeToDeleteYourComment"), null, [
              {
                text: t("no"),
              },
              {
                text: t("yes"),
                onPress: () => {
                  deleteCommentMutation.mutate(cmmntId);
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
    ) : (
      <TouchableOpacity
        onPress={() => {
          setSelectedCommentId(cmmntId);
          setVisible(true);
        }}
        activeOpacity={0.6}
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
            source={require("../../assets/warning.png")}
            style={{
              width: 45,
              height: 45,
            }}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const onLikePress = () => {
    if (likeStatus) {
      HapticFeedback.trigger("impactLight");
      unlikeCommentMutation.mutate();
    } else {
      HapticFeedback.trigger("impactLight");
      likeCommentMutation.mutate();
    }
  };

  if (deleted) return null;

  const showDelete = item.user._id === user._id || item.isOwnedBabl;

  return (
    <Swipeable
      ref={swipeableRef}
      enabled={swipeEnabled}
      renderRightActions={() => {
        return leftSwipe(item._id, showDelete);
      }}
      overshootLeft={false}
      overshootRight={false}
      onSwipeableWillClose={() => {
        setIsOpen(false);
      }}
      onSwipeableWillOpen={() => {
        setIsOpen(true);
      }}
    >
      <View style={styles.item}>
        <View style={styles.between}>
          <View style={styles.row}>
            <Image
              resizeMode="contain"
              source={{ uri: item.user.photo }}
              style={styles.pp}
            />
            <View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text style={styles.name}>{item.user.username}</Text>
                <Text style={styles.day}>
                  {moment(item.createdAt).fromNow()}
                </Text>
              </View>
              <Text style={styles.comments}>{item.content}</Text>
              {showReply && (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate(routes.CommentAnswers, { item });
                  }}
                >
                  <TextGradient
                    style={{
                      fontFamily: fonts.roboto,
                      marginTop: 4,
                      marginLeft: 10,
                    }}
                    locations={[0, 1]}
                    colors={["#B5A0FF", "#755CCC"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    text={`${item.replyCount} ${t("reply")}`}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <TouchableOpacity style={[styles.row]} onPress={onLikePress}>
            <View style={styles.center}>
              <Image
                source={
                  likeStatus
                    ? require("../../assets/heartt.png")
                    : require("../../assets/heart.png")
                }
                style={[
                  styles.heart,
                  {
                    tintColor: likeStatus ? "red" : "#A2ABB4",
                  },
                ]}
                resizeMode="contain"
              />
              <Text style={styles.likeLength}>{likeCount}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  item: {
    width: sizes.width / 1.1,
    alignSelf: "center",
    marginTop: 30,
  },
  between: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  pp: {
    width: 42,
    height: 42,
    borderRadius: 42,
    backgroundColor: "#CDCDCD",
  },
  comments: {
    color: "#878787",
    marginTop: 4,
    marginLeft: 10,
    fontSize: 15,
    fontFamily: fonts.roboto,
    width: sizes.width / 1.5,
  },
  row: {
    flexDirection: "row",
  },
  name: {
    marginLeft: 10,
    color: "#FFF",
    fontFamily: fonts.regular,
  },
  day: {
    color: "#A2ABB4",
    fontFamily: fonts.regular,
    fontSize: 12,
    marginLeft: 5,
  },
  center: {
    alignItems: "center",
  },
  heart: {
    width: 15,
    height: 15,
  },
  likeLength: {
    fontFamily: fonts.medium,
    color: "#A2ABB4",
    fontSize: 12,
    marginTop: 5,
  },
});

export default CommentItem;

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
import { useMutation } from "@tanstack/react-query";
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

const CommentItemAnswer = ({
  item,
  setSelectedReplyId,
  setVisible,
  setIsOpen,
  answer,
}) => {
  const navigation = useNavigation();
  const user = useAtomValue(userAtom);
  const [deleted, setDeleted] = React.useState(false);

  const swipeableRef = React.useRef();

  const deleteReplyMutation = useMutation(Queries.deleteReply, {
    onSuccess: () => {
      setDeleted(true);
      notify({
        title: t("YourCommentHasBeenDeleted"),
      });
    },
  });

  const {
    actionStatus: likeStatus,
    currentCount: likeCount,
    setCurrentCount,
    onNegativeAction,
    onPositiveAction,
  } = useActionStatus({
    initialCount: item?.likeCount,
    initialStatus: item?.likeStatus,
  });

  const likeReplyMutation = useMutation(
    () => {
      return Queries.likeReply(item?._id);
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

  const unlikeReplyMutation = useMutation(
    () => {
      return Queries.unlikeReply(item?._id);
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
                text: "No",
              },
              {
                text: "Yes",
                onPress: () => {
                  deleteReplyMutation.mutate(cmmntId);
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

        <TouchableOpacity
          onPress={() => {
            setSelectedReplyId(cmmntId);
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
      </View>
    ) : (
      <TouchableOpacity
        onPress={() => {
          setSelectedReplyId(cmmntId);
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
      unlikeReplyMutation.mutate();
    } else {
      HapticFeedback.trigger("impactLight");
      likeReplyMutation.mutate();
    }
  };

  if (deleted) return null;

  const showDelete = item?.user?._id === user?._id;

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={() => {
        return leftSwipe(item?._id, showDelete);
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
              source={{ uri: item.user?.photo }}
              style={styles.pp}
            />
            <View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text style={styles.name}>{item.user?.username}</Text>
                <Text style={styles.day}>
                  {moment(item?.createdAt).fromNow()}
                </Text>
              </View>
              <Text style={styles.comments}>{item?.content}</Text>
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
    marginLeft: 20,
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

export default CommentItemAnswer;

import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  RefreshControl,
} from "react-native";

import { useRoute } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";
import { useAtomValue } from "jotai";
import moment from "moment";

import { BackHeader } from "../../components";
import { sizes } from "../../theme";
import fonts from "../../theme/fonts";
import { userAtom } from "../../utils/atoms";
import * as Queries from "../../utils/queries";

import CommentItem from "./CommentItem";
import WarningModal from "./WarningModal";

const Comments = () => {
  const route = useRoute();
  const queryClient = useQueryClient();
  const user = useAtomValue(userAtom);
  const [commentText, setCommentText] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedCommentId, setSelectedCommentId] = React.useState();
  const [visible, setVisible] = React.useState(null);

  const commentsQuery = useQuery(
    ["COMMENTS", route.params.bablId],
    () => {
      return Queries.getComments(route.params.bablId);
    },
    {
      placeholderData: [],
    },
  );

  const createCommentMutation = useMutation(Queries.createComment, {
    onMutate: (body) => {
      queryClient.setQueryData(
        ["COMMENTS", route.params.bablId],
        [
          {
            __v: 0,
            _id: `PLACEHOLDER_${(Math.random() + 1).toString(36).substring(7)}`,
            babl: route.params.bablId,
            content: body.content,
            createdAt: moment().toDate(),
            updatedAt: moment().toDate(),
            user: {
              _id: user._id,
              photo: user.photo,
              username: user.username,
            },
            likeCount: 0,
            replyCount: 0,
            commentCount: 0,
          },
          ...commentsQuery.data,
        ],
      );
      return setCommentText("");
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries(["BABL"]);
      queryClient.invalidateQueries(["COMMENTS", route.params.bablId]);
    },
    onError: (err) => {
      console.log("err", err);
    },
  });

  const onSendPress = () => {
    if (commentText.trim()) {
      createCommentMutation.mutate({
        content: commentText,
        user: user._id,
        babl: route.params.bablId,
      });
    }
  };

  const renderItem = ({ item }) => {
    return (
      <CommentItem
        item={item}
        setIsOpen={setIsOpen}
        setVisible={setVisible}
        setSelectedCommentId={setSelectedCommentId}
      />
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <BackHeader title={t("Comments")} />

      <WarningModal
        visible={visible}
        commentId={selectedCommentId}
        onClose={() => {
          setVisible(false);
        }}
      />
      <FlatList
        scrollEnabled={false}
        data={commentsQuery.data}
        keyExtractor={(item) => {
          return item._id;
        }}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={commentsQuery.isFetching}
            colors={["#fff"]}
            tintColor={"#918E8D"}
          />
        }
      />
      <View style={styles.bottom}>
        <Image source={{ uri: user.photo }} style={styles.inputPp} />
        <TextInput
          placeholder={t("AddComment")}
          style={styles.input}
          value={commentText}
          placeholderTextColor={"#474747"}
          onChangeText={setCommentText}
          onSubmitEditing={onSendPress}
        />
        <TouchableOpacity onPress={onSendPress}>
          <Image
            source={require("../../assets/sende.png")}
            style={styles.sendContainer}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  inputPp: {
    width: 42,
    height: 42,
    borderRadius: 42,
    backgroundColor: "#CDCDCD",
  },
  bottom: {
    backgroundColor: "#151515",
    flexDirection: "row",
    shadowOffset: {
      width: 0,

      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 10,
    height: sizes.width / 5,
    width: sizes.width,

    justifyContent: "space-between",
  },
  input: {
    backgroundColor: "#191919",
    width: sizes.width / 1.5,
    height: 46,
    borderRadius: 50,
    color: "#FFF",
    fontFamily: fonts.medium,
    paddingHorizontal: 10,
  },
  sendContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 42,
    height: 42,
    borderRadius: 10,
  },
});

export default Comments;

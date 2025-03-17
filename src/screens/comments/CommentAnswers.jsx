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
import { colors, sizes } from "../../theme";
import fonts from "../../theme/fonts";
import { userAtom } from "../../utils/atoms";
import * as Queries from "../../utils/queries";

import CommentItem from "./CommentItem";
import CommentItemAnswer from "./CommentItemAnswer";
import WarningModal from "./WarningModal";

const Comments = () => {
  const route = useRoute();
  const queryClient = useQueryClient();
  const user = useAtomValue(userAtom);
  const [commentText, setCommentText] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedReplyId, setSelectedReplyId] = React.useState();
  const [visible, setVisible] = React.useState(null);

  const { item } = route.params || {};

  const repliesQuery = useQuery(
    ["REPLIES", item._id],
    () => {
      return Queries.getReplies(item._id);
    },
    {
      placeholderData: [],
    },
  );

  const createReplyMutation = useMutation(Queries.createReply, {
    onMutate: (body) => {
      queryClient.setQueryData(
        ["REPLIES", item._id],
        [
          {
            __v: 0,
            _id: `PLACEHOLDER_${(Math.random() + 1).toString(36).substring(7)}`,
            comment: item._id,
            content: body.content,
            createdAt: moment().toDate(),
            updatedAt: moment().toDate(),
            user: {
              _id: user._id,
              photo: user.photo,
              username: user.username,
            },
            likeCount: 0,
            commentCount: 0,
          },
          ...repliesQuery.data,
        ],
      );
      return setCommentText("");
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries(["BABL"]);
      queryClient.invalidateQueries(["COMMENTS"]);
      queryClient.invalidateQueries(["REPLIES", item._id]);
    },
    onError: (err) => {
      console.log("err", err);
    },
  });

  const onSendPress = () => {
    if (commentText.trim()) {
      createReplyMutation.mutate({
        content: commentText,
        user: user._id,
        comment: item._id,
      });
    }
  };

  const renderItem = ({ item }) => {
    return (
      <CommentItemAnswer
        item={item}
        setIsOpen={setIsOpen}
        setVisible={setVisible}
        setSelectedReplyId={setSelectedReplyId}
      />
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <BackHeader title={t("Answers")} />

      <WarningModal
        visible={visible}
        replyId={selectedReplyId}
        onClose={() => {
          setVisible(false);
        }}
      />
      <CommentItem
        item={item}
        setIsOpen={setIsOpen}
        answer={false}
        setVisible={setVisible}
        swipeEnabled={false}
        showReply={false}
      />

      <View
        source={require("../../assets/linearborder.png")}
        resizeMode="contain"
        style={{
          width: sizes.width / 1.1,
          alignSelf: "center",
          marginTop: 20,
          borderBottomWidth: 0.5,
          borderBottomColor: "#A2ABB4",
        }}
      />

      <FlatList
        data={repliesQuery.data}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={repliesQuery.isFetching && !repliesQuery.data?.length}
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
    backgroundColor: "#131313",
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
    borderTopRightRadius: 30,
    justifyContent: "space-between",
    borderTopLeftRadius: 30,
  },
  input: {
    backgroundColor: "#282828",
    width: sizes.width / 1.5,
    height: 42,
    borderRadius: 8,
    color: "#FFF",
    fontFamily: fonts.roboto,
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

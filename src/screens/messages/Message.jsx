import React, { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

import ImageMessage from "./ImageMessage";
import TextMessage from "./TextMessage";

const Message = (props) => {
  const { type, isSender, sender, onLongPress, onPressIn, ...rest } = props;

  return (
    <View>
      <View style={[styles.container, isSender && styles.sender]}>
        {!isSender && (
          <Image
            source={
              sender.avatar
                ? { uri: sender.avatar }
                : require("../../assets/person.png")
            }
            style={[
              styles.avatar,
              {
                tintColor: sender.avatar ? null : "#787878",
              },
            ]}
          />
        )}
        {rest.content.text.includes("bablworld.page") ? (
          <ImageMessage
            {...rest}
            text={rest?.content?.text}
            isSender={isSender}
          />
        ) : (
          <TextMessage
            {...rest}
            text={rest?.content?.text}
            isSender={isSender}
          />
        )}
      </View>
    </View>
  );
};

export default Message;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  sender: {
    justifyContent: "flex-end",
  },
  avatar: {
    width: 44,
    marginLeft: 5,
    height: 44,
    marginTop: 15,
    borderRadius: 99,
  },
});

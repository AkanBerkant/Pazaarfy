import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import dynamicLinks from "@react-native-firebase/dynamic-links";
import { useNavigation } from "@react-navigation/native";

import routes from "../../constants/routes";
import fonts from "../../theme/fonts";

const TextMessage = ({ text, isSender, date, textStyle }) => {
  const navigation = useNavigation();

  if (text.startsWith("https://bablworld.page.link")) {
    return (
      <TouchableOpacity
        style={[styles.container, isSender && styles.sender]}
        onPress={() => {
          dynamicLinks()
            .resolveLink(text)
            .then((res) => {
              const bablId = res.url.split("?bablId=")[1];
              navigation.navigate(routes.BablContent, {
                bablId,
              });
            });
        }}
      >
        <Text style={[styles.text, isSender && styles.senderText]}>{text}</Text>
        <Text style={styles.date}>{date}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View
      pointerEvents="none"
      style={[styles.container, isSender && styles.sender]}
    >
      <Text style={[styles.text, isSender && styles.senderText, textStyle]}>
        {text}
      </Text>
      <Text style={styles.date}>{date}</Text>
    </View>
  );
};

export default TextMessage;

const styles = StyleSheet.create({
  container: {
    maxWidth: Dimensions.get("window").width * 0.8,

    backgroundColor: "#111111",
    padding: 10,

    marginHorizontal: 12,
    marginTop: 8,
    borderRadius: 13,
  },
  text: {
    fontSize: 15,
    fontFamily: fonts.avenir,
    color: "#FFF",
    marginRight: 10,
  },
  senderText: {
    color: "#FFF",
    fontFamily: fonts.medium,
  },
  sender: {
    backgroundColor: "#3D3754",
    paddingRight: 0,
    paddingLeft: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  date: {
    color: "#FFF",
    fontFamily: fonts.medium,
    alignSelf: "flex-end",
    marginRight: 5,
    fontSize: 12,
  },
});

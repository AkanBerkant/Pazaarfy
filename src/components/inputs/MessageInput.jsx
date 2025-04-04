import React from "react";
import {
  StyleSheet,
  TextInput,
  Image,
  View,
  Touchable,
  TouchableOpacity,
  Platform,
} from "react-native";

import { sizes } from "../../theme";
import fonts from "../../theme/fonts";
import { useTranslation } from "react-i18next";

const MessageInput = ({ value, onChangeText, onSubmitEditing }) => {
  const { t } = useTranslation();
  return (
    <View style={styles.row}>
      <View style={styles.inputContainer}>
        <View style={styles.row}>
          {/* <Image
          source={require('../../assets/photomes.png')}
          style={styles.icon}
        /> */}
          <TextInput
            style={styles.input}
            placeholder={t("writemessage")}
            returnKeyType="send"
            placeholderTextColor="#464646"
            onChangeText={onChangeText}
            value={value}
            onSubmitEditing={onSubmitEditing}
          />
        </View>
      </View>
      <TouchableOpacity onPress={onSubmitEditing} style={styles.row}>
        <Image source={require("../../assets/sende.png")} style={styles.mic} />
      </TouchableOpacity>
    </View>
  );
};

export default MessageInput;

const styles = StyleSheet.create({
  inputContainer: {
    width: sizes.width / 1.2,
    alignSelf: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: Platform.OS == "ios" ? 35 : 0,
    marginBottom: 20,
    padding: 10,
  },
  input: {
    width: sizes.width / 1.2,
    paddingVertical: 0,
    color: "#FFF",
    marginLeft: 5,
    fontFamily: fonts.regular,
    backgroundColor: "#1A1A1A",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  mic: {
    width: 35,
    marginLeft: 5,
    height: 35,
    marginBottom: 20,
  },
});

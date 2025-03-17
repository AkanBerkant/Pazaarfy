import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { t } from "i18next";

import routes from "../../constants/routes";
import { sizes } from "../../theme";
import fonts from "../../theme/fonts";
import TextGradient from "../TextGradient";

const PasswordInput = ({
  forgotIcon,
  onFocus,
  placeholder,
  title,
  forgot,
  ...props
}) => {
  const [secure, setSecure] = useState(false);

  const navigation = useNavigation();
  return (
    <View style={styles.inputContainer}>
      <TextInput
        secureTextEntry={!secure}
        placeholderTextColor="#595959"
        placeholder={placeholder}
        onFocus={onFocus}
        style={styles.input}
        {...props}
      />

      {forgotIcon && (
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => {
              setSecure(!secure);
            }}
          >
            <Image
              source={require("../../assets/pass.png")}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setSecure(!secure);
            }}
          />
        </View>
      )}
      {forgot && (
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => {
              setSecure(!secure);
            }}
          >
            <Image
              source={require("../../assets/pass.png")}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default PasswordInput;

const styles = StyleSheet.create({
  forgot: {
    width: 54,
    height: 21,
    marginRight: 10,
    marginLeft: 5,
  },
  inputContainer: {
    backgroundColor: "#121212",
    alignSelf: "center",
    borderRadius: 50,
    width: sizes.width / 1.07,
    padding: 10,
    height: 55,
    margin: 5,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    width: sizes.width / 1.8,
    marginLeft: 10,
    color: "#595959",
    fontFamily: fonts.regular,
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 5,
    tintColor: "#595959",
  },
});

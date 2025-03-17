import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";

import LinearGradient from "react-native-linear-gradient";

import { sizes } from "../../theme";
import fonts from "../../theme/fonts";

const ButtonLinear = ({
  title,
  width,
  radius,
  onPress,
  linearWidth,
  loading,
  style,
  bottom,
  icon,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.button,
        {
          width: width || sizes.width / 1.07,
          borderRadius: radius || 29,
          marginBottom: bottom || 0,
        },
      ]}
    >
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={["#B5A0FF", "#755CCC"]}
        style={styles.button}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={[styles.buttonText]}>{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default ButtonLinear;

const styles = StyleSheet.create({
  button: {
    height: 47.12,
    flexDirection: "row",
    width: sizes.width / 1.07,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10,
    alignSelf: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: fonts.medium,
  },
});

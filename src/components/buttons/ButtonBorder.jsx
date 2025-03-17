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

const ButtonBorder = ({
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
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      colors={["#B5A0FF", "#755CCC"]}
      style={[
        styles.linearGradient,
        {
          width: width || sizes.width / 1.07,
          borderRadius: radius || 12,
          marginBottom: bottom || 0,
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.button,
          {
            width: linearWidth || sizes.width / 1.08,
            borderRadius: radius || 12,
          },
        ]}
        onPress={onPress}
        disabled={loading}
      >
        {icon && <Image source={icon} style={styles.icon} />}
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text
            style={[
              styles.buttonText,
              {
                marginLeft: icon ? 5 : 0,
              },
            ]}
          >
            {title}
          </Text>
        )}
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default ButtonBorder;

const styles = StyleSheet.create({
  linearGradient: {
    width: sizes.width / 1.07,
    alignSelf: "center",
    height: 47.12,

    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
    marginTop: 15,
  },
  buttonText: {
    color: "#FFF",
    fontFamily: fonts.medium,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#141022",
    height: 44.12,
    flexDirection: "row",
    width: sizes.width / 1.08,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 17,
    height: 17,
  },
});

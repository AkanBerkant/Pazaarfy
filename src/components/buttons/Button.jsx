import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

import LinearGradient from "react-native-linear-gradient";

import { sizes } from "../../theme";
import fonts from "../../theme/fonts";

const ButtonLinear = ({ title, onPress, loading }) => {
  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      colors={["#B5A0FF", "#755CCC", "#B5A0FF"]}
      style={styles.linearGradient}
    >
      <TouchableOpacity onPress={onPress} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>{title}</Text>
        )}
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default ButtonLinear;

const styles = StyleSheet.create({
  linearGradient: {
    borderRadius: 8,
    width: 70,
    justifyContent: "center",
    alignItems: "center",
    height: 27,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
    fontFamily: fonts.medium,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#000",
    borderRadius: 14,
    width: 68,
    justifyContent: "center",
    alignItems: "center",
    height: 30,
  },
});

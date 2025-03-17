import React from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  SafeAreaView,
  ImageBackground,
  Platform,
} from "react-native";

import { BlurView } from "expo-blur";
import { Notifier, Easing } from "react-native-notifier";

import { colors, sizes } from "../theme";
import fonts from "../theme/fonts";

const styles = StyleSheet.create({
  blur: {
    width: sizes.width / 1.1,
    marginTop: 50,
    alignSelf: "center",
    height: 45,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#B5A0FF",
    justifyContent: "center",
  },

  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    padding: 10,
  },
  checked: {
    width: 37,
    height: 37,
    marginLeft: 7,
  },
  title: {
    color: colors.white,
    fontSize: 14,
    fontFamily: fonts.bold,
    marginLeft: 17,
    width: sizes.width / 1.5,
  },
});

const CustomComponent = ({ title, description }) => {
  return (
    <>
      {Platform.OS == "ios" ? (
        <View
          style={{
            borderRadius: 15,
          }}
        >
          <View style={styles.blur}>
            <View style={styles.container}>
              <Text style={styles.title}>{title}</Text>
            </View>
          </View>
        </View>
      ) : (
        <View
          source={require("../assets/blur.png")}
          style={{
            backgroundColor: "#1E1A19",
            width: sizes.width / 1.07,
            marginTop: 50,
            alignSelf: "center",
            height: 70,
            borderRadius: 15,

            justifyContent: "center",
          }}
        >
          <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
          </View>
        </View>
      )}
    </>
  );
};

export const notify = ({
  title = "",
  description = "",
  duration = 3000,
  showAnimationDuration = 800,
  hideOnPress = false,

  onHidden = () => {},

  onPress = () => {},
}) => {
  Notifier.showNotification({
    title,
    description,
    duration,
    showAnimationDuration,
    Component: CustomComponent,
    showEasing: Easing.bounce,

    onHidden,
    onPress,
    hideOnPress,
  });
};

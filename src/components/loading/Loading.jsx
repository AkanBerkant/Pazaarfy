import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
} from "react-native";

import Video from "react-native-video";

import { sizes } from "../../theme";

// SplashScreen.preventAutoHideAsync();

const Loading = () => {
  return (
    <ImageBackground
      style={styles.container}
      source={require("../../assets/pazaarfy/loginbg.png")}
    >
      <Image
        style={styles.logo}
        resizeMode="contain"
        source={require("../../assets/pazaarfy/logo.png")}
      />
    </ImageBackground>
  );
};

export default Loading;

const styles = StyleSheet.create({
  container: {
    height: sizes.height,
    justifyContent: "center",
    alignItems: "center",
    width: sizes.width,
  },
  logo: {
    width: 120,
    height: 100,
  },
});

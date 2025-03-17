import React, { useState, useRef } from "react";
import {
  View,
  Animated,
  Easing,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
} from "react-native";

import Svg, { Path } from "react-native-svg";

import { sizes } from "../../../theme";
import fonts from "../../../theme/fonts";

const ReactNativeAnimatedSearchbox = ({
  height = 48,
  borderRadius = 48,
  searchIconColor = "#555555",
  searchIconSize = 20,
  focusAfterOpened = false,
  placeholderTextColor = "#555555",
  fontSize = 16,
  backgroundColor = "rgba(255,255,255,0.70)",
  shadowColor = "rgba(0,0,0,0.12)",
  animationSpeed = [200, 250],
  placeholder,
  onOpened,
  onClosed,
  onOpening,
  onClosing,
  value,
  onChangeText,
}) => {
  const [width, setWidth] = useState(0);
  const [textInputAnimated] = useState(new Animated.Value(0));
  const [parentViewWidthAnimated] = useState(new Animated.Value(height));
  const [isOpen, setIsOpen] = useState(false);

  const refTextInput = useRef(null);

  const onLayout = (e) => {
    const { width } = e.nativeEvent.layout;
    setWidth(width);
  };

  const searchIcon = () => {
    return (
      <Image
        style={{
          width: 21,
          height: 21,
          tintColor: "#969394",
        }}
        source={require("../../../assets/search.png")}
      />
    );
  };

  const open = () => {
    onOpening && onOpening();

    Animated.timing(textInputAnimated, {
      toValue: 1,
      duration: animationSpeed[0],
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => {
      setTimeout(() => {
        setIsOpen(true);

        Animated.timing(parentViewWidthAnimated, {
          toValue: width,
          duration: animationSpeed[1],
          easing: Easing.linear,
          useNativeDriver: false,
        }).start(() => {
          onOpened && onOpened();
          if (focusAfterOpened) refTextInput.current.focus();
        });
      }, 125);
    });
  };

  const close = () => {
    onClosing && onClosing();

    Animated.timing(parentViewWidthAnimated, {
      toValue: height,
      duration: animationSpeed[1],
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => {
      setIsOpen(false);

      setTimeout(() => {
        Animated.timing(textInputAnimated, {
          toValue: 0,
          duration: animationSpeed[0],
          easing: Easing.linear,
          useNativeDriver: false,
        }).start(() => {
          onClosed && onClosed();
        });
      }, 125);
    });
  };

  return (
    <View onLayout={onLayout} styles={styles.container}>
      <Animated.View
        style={[
          styles.animatedContainer,
          {
            transform: [
              { scaleX: textInputAnimated },
              { scaleY: textInputAnimated },
            ],
            opacity: textInputAnimated,
            width: parentViewWidthAnimated,
          },
        ]}
      >
        <TextInput
          ref={refTextInput}
          placeholderTextColor={isOpen ? placeholderTextColor : "transparent"}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          style={[
            styles.searchInput,
            {
              shadowColor,
              backgroundColor: "#252525",
              height,
              borderRadius,
              fontSize,
              paddingLeft: height,
              color: "#FFF",
              fontFamily: fonts.bold,
            },
          ]}
        />

        {isOpen ? (
          <TouchableOpacity
            onPress={() => {
              close();
            }}
            style={[styles.inputSearchIcon, { width: height, height }]}
          >
            {searchIcon()}
          </TouchableOpacity>
        ) : null}
      </Animated.View>

      {isOpen ? null : (
        <TouchableOpacity
          onPress={open}
          style={[styles.inputClosedSearchIcon, { width: height, height }]}
        >
          {searchIcon()}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
  },
  animatedContainer: {
    marginLeft: "auto",
  },
  searchInput: {
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 12,
    marginTop: 10,
  },
  inputSearchIcon: {
    position: "absolute",
    left: 10,
    flex: 1,
    justifyContent: "center",

    marginTop: 10,
  },
  inputClosedSearchIcon: {
    position: "absolute",
    right: 12,
    flex: 1,

    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ReactNativeAnimatedSearchbox;

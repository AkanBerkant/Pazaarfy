import React, { useState } from "react";
import {
  ScrollView,
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import FastImage from "react-native-fast-image";
import Video from "react-native-video"; // video desteği
import { sizes } from "../../../theme";
import CustomVideo from "../../../components/CustomVideo";
import fonts from "../../../theme/fonts";
import { useTranslation } from "react-i18next";

const { width } = Dimensions.get("window");

const ImagesSlider = ({
  items = [],
  onFollowPress,
  onMessagePress,
  followStatus,
  shouldPlay,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { t } = useTranslation();
  if (!items || items.length === 0) return null;

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  return (
    <View>
      <ScrollView
        horizontal
        pagingEnabled
        onScroll={handleScroll}
        showsHorizontalScrollIndicator={false}
        style={{ width: sizes.width, height: sizes.width * 1.2 }}
        scrollEventThrottle={16}
      >
        {items.map((item, index) => (
          <View
            key={item._id || index}
            style={{ width, height: sizes.width * 1.2 }}
          >
            {item.coverVideo ? (
              <CustomVideo
                source={{ uri: item.coverVideo }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
                ignoreSilentSwitch="ignore"
                repeat
                shouldPlay={shouldPlay}
                isLooping
                isMuted={false}
                volume={0.5}
              />
            ) : (
              <FastImage
                source={{ uri: item.cover }}
                style={{ width: "100%", height: "100%" }}
                resizeMode={FastImage.resizeMode.cover}
              />
            )}
            {/* Butonlar */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={onMessagePress} style={styles.button}>
                <Text style={styles.buttonText}>sohbete başla</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onFollowPress} style={styles.button}>
                <Text style={styles.buttonText}>
                  {followStatus ? t("following") : t("Follow")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Paginator */}
      <View style={styles.paginator}>
        {items.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, { opacity: activeIndex === index ? 1 : 0.4 }]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  button: {
    backgroundColor: "#1e1e1e",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: sizes.width / 2.2,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#b087f8",
  },
  buttonText: {
    color: "#fff",
    fontFamily: fonts.medium,
  },
  paginator: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#b087f8",
    marginHorizontal: 5,
  },
});

export default ImagesSlider;

import React from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import FastImage from "react-native-fast-image";
import { sizes } from "../../../theme";
import { BackHeader } from "../../../components";
import CustomVideo from "../../../components/CustomVideo";
const ImageModal = ({ route }) => {
  const { data, isEmbed } = route.params || {};

  const scrollRef = React.useRef();
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const handleScrollTo = (index) => {
    if (data?.babl?.items?.length > 0 && scrollRef.current) {
      const xOffset = index * sizes.width;
      scrollRef.current.scrollTo({ x: xOffset, animated: true });
      setCurrentIndex(index);
    }
  };

  const goLeft = () => {
    if (currentIndex > 0) handleScrollTo(currentIndex - 1);
  };

  const goRight = () => {
    if (currentIndex < data.babl.items.length - 1) {
      handleScrollTo(currentIndex + 1);
    }
  };

  console.log("ad", data);

  return (
    <View style={{ flex: 1 }}>
      <BackHeader />
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / sizes.width);
          setCurrentIndex(index);
        }}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
        contentContainerStyle={{
          width: sizes.width * data.babl.items.length,
        }}
      >
        {data?.babl?.items?.map((item, index) => {
          const isActive = index === currentIndex;
          const isVideo = !!item.coverVideo;

          return (
            <View
              key={index}
              style={{
                width: sizes.width,
                height: sizes.height,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {isVideo ? (
                <CustomVideo
                  source={{ uri: item.coverVideo }}
                  style={{ width: sizes.width, height: sizes.height }}
                  ignoreSilentSwitch="ignore"
                  volume={0.5}
                  shouldPlay={isActive}
                  isLooping
                  isMuted={false}
                />
              ) : (
                <FastImage
                  source={{ uri: item.cover }}
                  style={{ width: sizes.width, height: sizes.height }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              )}
            </View>
          );
        })}
      </ScrollView>

      <TouchableOpacity
        onPress={goLeft}
        style={{
          position: "absolute",
          left: 10,
          top: sizes.height / 2 - 30,
          backgroundColor: "rgba(0,0,0,0.4)",
          padding: 10,
          borderRadius: 30,
          zIndex: 99,
        }}
      >
        <Text style={{ color: "white", fontSize: 24 }}>‹</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={goRight}
        style={{
          position: "absolute",
          right: 10,
          top: sizes.height / 2 - 30,
          backgroundColor: "rgba(0,0,0,0.4)",
          padding: 10,
          borderRadius: 30,
          zIndex: 99,
        }}
      >
        <Text style={{ color: "white", fontSize: 24 }}>›</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  modalBackGround: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 20,
  },
  header: {
    width: "100%",
    height: 40,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  image: {
    width: sizes.width,
    height: 200,
  },
});

export default ImageModal;

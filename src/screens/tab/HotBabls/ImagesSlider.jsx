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

  return (
    <View style={{ flex: 1 }}>
      <BackHeader />
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{
          width: sizes.width * data.babl.items.length,
        }}
      >
        {data?.babl?.items?.map((item, index) => (
          <FastImage
            key={index}
            source={{ uri: item.cover }} // ya da item, kontrol et
            style={{
              width: sizes.width,
              height: sizes.height,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        ))}
      </ScrollView>

      {/* Sol ok */}
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

      {/* Sağ ok */}
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

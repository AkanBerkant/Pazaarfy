import React from "react";
import {
  DeviceEventEmitter,
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from "react-native";

import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Asset } from "expo-asset";
import LinearGradient from "react-native-linear-gradient";
import { Easing } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";

import routes from "../../../constants/routes";
import { sizes } from "../../../theme";
import fonts from "../../../theme/fonts";

import HomeItem from "./HomeItem";

const xyz = sizes.width / 2.42;

const scrollAnimation = {
  type: "timing",
  config: {
    duration: 10 * 1000,
    easing: Easing.linear,
  },
};

const HomeItemWrapper = ({ item, index, categoryIndex, getAllData }) => {
  const navigation = useNavigation();

  const onItemPress = () => {
    navigation.navigate(routes.DetailList, {
      item,
      allData: getAllData(),
      categoryIndex,
      itemIndex: index,
    });
  };

  return (
    <LinearGradient
      colors={["yellow", "#FF0072", "#FF00BE", "#FEC80E"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        width: 82,
        height: 82,
        borderRadius: 82,
        alignItems: "center",
        justifyContent: "center",
        margin: 5,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(routes.HotBablDetail, item);
        }}
        style={{
          backgroundColor: "#000",
          padding: 2,
          borderRadius: 70 / 2,
        }}
      >
        <Image
          source={{ uri: item.cover }}
          style={{
            width: 70,
            height: 70,
            borderRadius: 35,
          }}
        />
      </TouchableOpacity>
    </LinearGradient>
  );
};

const SnapList = ({ data, isReverse, getAllData, categoryIndex }) => {
  const progressRef = React.useRef(0);
  const playingIndexRef = React.useRef(isReverse ? 3 : 0);
  const [direction, setDirection] = React.useState(isReverse);

  const renderItem = ({ item, index }) => {
    return (
      <HomeItemWrapper
        item={item}
        index={index}
        getAllData={getAllData}
        categoryIndex={categoryIndex}
      />
    );
  };

  if (!data.length) {
    return null;
  }

  const onProgressChange = (_, absoluteProgress) => {
    const prevIndex = Number(playingIndexRef.current);
    const activeIndex = Math.floor(absoluteProgress);

    setDirection(progressRef.current > absoluteProgress);
    progressRef.current = absoluteProgress;

    if (Math.abs(activeIndex - playingIndexRef.current) > 2 && direction) {
      playingIndexRef.current = activeIndex;
    } else if (!direction) {
      if (activeIndex - 1 === playingIndexRef.current) {
        playingIndexRef.current = activeIndex + 2;
      } else if (activeIndex < 3 && playingIndexRef.current > 10) {
        playingIndexRef.current = 3;
      }
    }

    if (prevIndex !== playingIndexRef.current) {
      DeviceEventEmitter.emit(
        `PLAYING_INDEX_${categoryIndex}`,
        playingIndexRef.current,
      );
    }
  };

  return (
    <FlatList
      style={styles.carousel}
      autoPlay
      data={data}
      autoFillData={false}
      autoPlayReverse={isReverse}
      horizontal
      showsHorizontalScrollIndicator={false}
      onProgressChange={Platform.OS === "ios" ? onProgressChange : undefined}
      withAnimation={scrollAnimation}
      pagingEnabled={false}
      renderItem={renderItem}
    />
  );
};

export default SnapList;

const styles = StyleSheet.create({
  carousel: {
    width: Dimensions.get("window").width,
  },
});

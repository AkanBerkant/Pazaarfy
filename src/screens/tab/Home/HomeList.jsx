import React from "react";
import {
  DeviceEventEmitter,
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  View,
} from "react-native";

import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Asset } from "expo-asset";

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

const HomeItemWrapper = ({ item, data, index, categoryIndex, getAllData }) => {
  const navigation = useNavigation();

  const onItemPress = () => {
    navigation.navigate(routes.DetailList, {
      item,
      allData: data,
      categoryIndex,
      itemIndex: index,
    });
  };

  return (
    <HomeItem
      item={item}
      index={index}
      onPress={onItemPress}
      categoryIndex={categoryIndex}
    />
  );
};

const HomeList = ({ data, isReverse, getAllData, categoryIndex }) => {
  const progressRef = React.useRef(0);
  const playingIndexRef = React.useRef(isReverse ? 3 : 0);
  const [direction, setDirection] = React.useState(isReverse);

  const renderItem = ({ item, index }) => {
    return (
      <HomeItemWrapper
        item={item}
        data={data}
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

export default HomeList;

const styles = StyleSheet.create({
  carousel: {
    width: Dimensions.get("window").width,
  },
});

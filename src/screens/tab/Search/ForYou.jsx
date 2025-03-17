import React from "react";
import { TouchableOpacity, Dimensions, Image, StyleSheet } from "react-native";
import { useSetAtom, useAtomValue } from "jotai";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { sizes } from "../../../theme";
import { tabBarVisibleAtom } from "../../../utils/atoms";
import MasonryList from "@react-native-seoul/masonry-list";
import { useNavigation } from "@react-navigation/native";
import routes from "../../../constants/routes";
const ForYou = ({ data }) => {
  const tabBarVisible = useAtomValue(tabBarVisibleAtom);
  const height = useSharedValue(0);

  const navigation = useNavigation();

  React.useEffect(() => {
    if (tabBarVisible) {
      height.value = withTiming(0, { duration: 500 });
    } else {
      height.value = withTiming(-sizes.width / 4, { duration: 500 });
    }
  }, [tabBarVisible]);

  const setTabBarVisible = useSetAtom(tabBarVisibleAtom);
  const currentPosRef = React.useRef(0);

  const numColumns = 3;
  const screenWidth = Dimensions.get("window").width;
  const columnWidth = screenWidth / numColumns - 4;

  // Farklı yükseklik değerleri belirleyelim
  const heights = [130, 130, 265, 130, 130, 130];

  // Her görsele sırayla yükseklik atayalım
  const updatedData = data?.map((item, index) => ({
    ...item,
    height: heights[index % heights.length], // Döngüsel olarak yükseklikleri ata
  }));

  const onScroll = (event) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const dif = currentOffset - currentPosRef.current;

    if (currentOffset === 0) {
      setTabBarVisible(true);
    }
    if (Math.abs(dif) < 3) {
    } else if (dif < 0) {
      setTabBarVisible(true);
    } else {
      setTabBarVisible(false);
    }

    currentPosRef.current = currentOffset;
  };

  return (
    <MasonryList
      data={updatedData}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(routes.HotBablDetail, item);
          }}
        >
          <Image
            source={{ uri: item.cover }}
            style={{
              width: columnWidth,
              height: item.height, // Yüksekliği dinamik olarak ekledik
              margin: 2,
              borderRadius: 1,
            }}
            resizeMode={"cover"}
          />
        </TouchableOpacity>
      )}
    />
  );
};

export default ForYou;

const styles = StyleSheet.create({});

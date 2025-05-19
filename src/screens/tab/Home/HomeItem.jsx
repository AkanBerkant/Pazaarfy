import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Platform,
} from "react-native";

import { Asset } from "expo-asset";
import { useTranslation } from "react-i18next";
import FastImage from "react-native-fast-image";

import { sizes } from "../../../theme";
import fonts from "../../../theme/fonts";
import i18n from "../../../utils/i18n-setup";
import { bablCategoriesIcon } from "../../createbabl/CreateBabl";

import HomeItemAsset from "./HomeItemAsset";

const HomeItem = ({ item, index, onPress, categoryIndex }) => {
  const { t, i18n } = useTranslation();
  const [localAsset, setLocalAsset] = React.useState();

  React.useEffect(() => {
    if (item.coverCropped && Platform.OS === "android") {
      Asset.loadAsync([item.coverCropped]).then((res) => {
        setLocalAsset(res[0].localUri);
      });
    } else if (item.coverVideoCropped && Platform.OS === "ios") {
      Asset.loadAsync([item.coverVideoCropped]).then((res) => {
        setLocalAsset(res[0].localUri);
      });
    }
  }, [item?.coverVideoCropped]);

  return (
    <TouchableOpacity style={styles.items} onPress={onPress}>
      <HomeItemAsset
        item={item}
        index={index}
        categoryIndex={categoryIndex}
        coverCropped={
          Platform.OS === "android" ? localAsset : item?.coverCropped
        }
        localAsset={Platform.OS === "ios" && localAsset}
      />
      {/* <View style={styles.positionContainer}>
        <View style={styles.position}>
          <FastImage
            source={{
              uri: item?.user?.photo,
              priority: FastImage.priority.low,
            }}
            style={styles.pp}
          />
        </View>
      </View> */}

      <Text pointerEvents="none" style={styles.itemTitle}>
        {item.title?.length > 10
          ? `${item.title?.slice(0, 10)}...`
          : item.title}
      </Text>
    </TouchableOpacity>
  );
};

export default HomeItem;

const styles = StyleSheet.create({
  items: {
    width: sizes.width / 3.42,
    height: 180,
    borderRadius: 17,
    elevation: 5,
  },
  name: {
    color: "#FFF",
    fontFamily: fonts.roboto,
    marginLeft: 3,
    fontSize: 11,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    shadowOpacity: 3,
    shadowOffset: { width: 3, height: 2 },
    shadowColor: "rgba(0, 0, 0, 0.8)",
    elevation: 5,
    ...Platform.select({
      ios: {
        shadowColor: "rgba(0, 0, 0, 0.8)",
        shadowOffset: { width: 3, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
      },
      android: {
        textShadowColor: "rgba(0, 0, 0, 0.8)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        elevation: 5, // Android'de gölge için
      },
    }),
  },

  pp: {
    width: 33,
    height: 33,
    borderRadius: 33,
    backgroundColor: "#CDCDCD",
  },
  positionContainer: {
    position: "absolute",
    zIndex: 99,
    top: 0,
    flexDirection: "row",
    alignItems: "center",
    left: 7,
    width: 40,
    height: 40,
    borderWidth: 2,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    top: 7,
    borderColor: "#755CCC",
  },
  position: {
    position: "absolute",
    zIndex: 99,
  },
  blurIcon: {
    position: "absolute",
    zIndex: 99,
    top: 14,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    shadowOpacity: 3,
    shadowOffset: { width: 3, height: 2 },
    shadowColor: "rgba(0, 0, 0, 0.8)",
    elevation: 5,
    right: 14,
  },
  categoryIcon: {
    width: 17,
    height: 17,
    tintColor: "#FFF",
    shadowOpacity: 0.2,
    shadowColor: "rgba(0, 0, 0, 0.8)",
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowRadius: 0.4,
    elevation: 5,
  },
  itemTitle: {
    fontFamily: fonts.roboto,
    bottom: 7,
    position: "absolute",
    zIndex: 99,
    left: 14,
    fontSize: 14,
    color: "white",
    fontFamily: fonts.medium,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    shadowOpacity: 3,
    shadowOffset: { width: 3, height: 2 },
    shadowColor: "rgba(0, 0, 0, 0.8)",
    elevation: 5,
    width: sizes.width / 3,
    ...Platform.select({
      ios: {
        shadowColor: "rgba(0, 0, 0, 0.5)",

        shadowOffset: { width: 3, height: 2 },
        shadowOpacity: 3,
        shadowRadius: 2,
      },
      android: {
        textShadowColor: "rgba(0, 0, 0, 0.8)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        elevation: 5, // Android'de gölge için
      },
    }),
  },
  reloadImg: {
    width: 5,
    height: 5,
  },
  rebabledContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 5,
  },
  rebabledBy: {
    fontSize: 7,
    color: "#FFF",
    marginLeft: 2,
    fontFamily: "Roboto-Italic",
    ...Platform.select({
      ios: {
        shadowColor: "rgba(0, 0, 0, 0.8)",
        shadowOffset: { width: 3, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
      },
      android: {
        textShadowColor: "rgba(0, 0, 0, 0.8)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        elevation: 5, // Android'de gölge için
      },
    }),
    elevation: 2, // Sadece Android için gerekliadowColor: 'rgba(0, 0, 0, 0.5)',
  },
});

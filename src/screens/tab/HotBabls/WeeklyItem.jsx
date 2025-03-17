import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  ImageBackground,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { Asset } from "expo-asset";
import { BlurView } from "expo-blur";
import { useTranslation } from "react-i18next";
import FastImage from "react-native-fast-image";
import Animated from "react-native-reanimated";
import { BoxShadow } from "react-native-shadow";

import CustomVideo from "../../../components/CustomVideo";
import ItemTypeIcon from "../../../components/ItemTypeIcon";
import { bgPhotos } from "../../../components/templates/TemplateItem";
import routes from "../../../constants/routes";
import { sizes } from "../../../theme";
import fonts from "../../../theme/fonts";
import {
  getPlatformFromUrl,
  platformLogos,
} from "../../../utils/platform-colors";
import { bablCategoriesIcon } from "../../createbabl/CreateBabl";

const WeeklyItem = ({
  item,
  index,
  onPress,
  showRank = false,
  isPlaying = false,
  shouldPlay,
  isFocused,
  onFinish,
  getAllData,
}) => {
  const navigation = useNavigation();
  const randomBgRef = React.useRef(Math.floor(Math.random() * 16));

  const [localAsset, setLocalAsset] = React.useState();

  const { t, i18n } = useTranslation();
  React.useEffect(() => {
    if (isPlaying && !item.coverVideoCropped) {
      onFinish?.();
    }
  }, [isPlaying]);

  React.useEffect(() => {
    if (item.coverVideoCropped && !localAsset && isPlaying) {
      Asset.loadAsync([item.coverVideoCropped]).then((res) => {
        setLocalAsset(res[0].localUri);
      });
    }
  }, [localAsset, isPlaying]);

  const videoItem = (
    <CustomVideo
      source={{ uri: localAsset || item.cover }}
      style={styles.weeklyPost}
      shouldPlay={shouldPlay && isPlaying && isFocused}
      onPlaybackStatusUpdate={(st) => {
        if (st.didJustFinish) {
          onFinish?.();
        }
      }}
    />
  );

  const imgItem = item.cover ? (
    <FastImage source={{ uri: item.cover }} style={styles.weeklyPost} />
  ) : (
    <ImageBackground
      source={bgPhotos[randomBgRef.current]}
      style={styles.weeklyPost}
    >
      <BlurView
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
        tint="dark"
        intensity={10}
      >
        {platformLogos[getPlatformFromUrl(item.url)] && (
          <Image
            source={platformLogos[getPlatformFromUrl(item.url)]}
            resizeMode="contain"
            style={{
              height: 36,
              tintColor: "white",
            }}
          />
        )}
      </BlurView>
    </ImageBackground>
  );

  return (
    <View>
      <View
        swapShadows // <- change zIndex of each shadow color
        resizeMode={Platform.OS === "ios" ? null : "contain"}
        style={styles.items}
      >
        <Text style={styles.text} pointerEvents="none">
          {item.title?.length > 30
            ? `${item.title?.slice(0, 30)}...`
            : item.title}
        </Text>

        {showRank && index == 0 ? (
          <ImageBackground
            style={[
              styles.rankContainer,
              {
                backgroundColor: null,
              },
            ]}
            source={require("../../../assets/gold.png")}
          >
            <Text style={styles.rank}>{index + 1}</Text>
          </ImageBackground>
        ) : showRank && index == 1 ? (
          <ImageBackground
            style={[
              styles.rankContainer,
              {
                backgroundColor: null,
              },
            ]}
            source={require("../../../assets/silver.png")}
          >
            <Text style={styles.rank}>{index + 1}</Text>
          </ImageBackground>
        ) : showRank && index == 2 ? (
          <ImageBackground
            style={[
              styles.rankContainer,
              {
                backgroundColor: null,
              },
            ]}
            source={require("../../../assets/bronze.png")}
          >
            <Text style={styles.rank}>{index + 1}</Text>
          </ImageBackground>
        ) : showRank ? (
          <View style={styles.rankContainer}>
            <Text style={styles.rank}>{index + 1}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          key={item._id}
          onPress={() => {
            if (onPress) return onPress();

            onFinish?.();

            if (getAllData) {
              return navigation.navigate(routes.DetailList, {
                item,
                allData: getAllData(),
                categoryIndex: 0,
                itemIndex: index,
                showIndex: true,
              });
            }

            navigation.navigate(routes.HotBablDetail, item);
          }}
        >
          <Animated.View>
            {(localAsset && isPlaying && isFocused) ||
            item.cover?.endsWith("mp4") ||
            item.cover?.endsWith("m3u8")
              ? videoItem
              : imgItem}

            {item.user && (
              <View style={styles.position}>
                <Image source={{ uri: item.user.photo }} style={styles.pp} />
                <View>
                  <Text style={styles.name}>{item.user.username}</Text>

                  {false && (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginLeft: 5,
                      }}
                    >
                      <Image
                        source={require("../../../assets/reload.png")}
                        style={{
                          width: 5,
                          height: 5,
                          shadowOpacity: 10,
                          shadowColor: "rgba(0, 0, 0, 0.8)",
                          shadowOffset: {
                            width: 0,
                            height: 2,
                          },

                          shadowRadius: 13,
                          elevation: 5,
                        }}
                      />
                      <Text
                        style={{
                          fontSize: 7,
                          color: "#FFF",
                          marginLeft: 2,
                          fontFamily: "Roboto-Italic",
                          shadowOpacity: 10,
                          textShadowColor: "rgba(0, 0, 0, 0.5)",
                          shadowColor: "rgba(0, 0, 0, 0.8)",
                          shadowOffset: {
                            width: 0,
                            height: 2,
                          },
                          textShadowColor: "rgba(0, 0, 0, 0.8)",
                          textShadowRadius: 1,
                          shadowRadius: 13,
                          elevation: 5,
                        }}
                      >
                        {i18n.language == "en" ? (
                          <>
                            {t("rebabledby")} {item.repostedBy.username}
                          </>
                        ) : (
                          <>
                            {item.repostedBy.username} {t("rebabledby")}
                          </>
                        )}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {Platform.OS == "ios" ? (
              item.category ? (
                <View style={styles.blurIconCategory}>
                  <Image
                    source={bablCategoriesIcon[item.category]}
                    style={styles.categoryIcon}
                  />
                </View>
              ) : (
                <View style={styles.blurIcon}>
                  <ItemTypeIcon
                    iconType={item.type ? item.type.split("_")[0] : "MIXED"}
                  />
                </View>
              )
            ) : item.category ? (
              <View style={styles.blurIconCategory}>
                <BoxShadow
                  setting={{
                    width: 20,
                    height: 20,
                    color: "#E5E5E5",
                    border: 10,
                    radius: 10,
                    opacity: 0.5,
                    x: 0,
                    y: 2,
                    style: {
                      justifyContent: "center",
                      alignItems: "center",
                      top: 2,
                      left: 2,
                    },
                  }}
                >
                  <Image
                    resizeMode="contain"
                    source={bablCategoriesIcon[item.category]}
                    style={styles.categoryIcon}
                  />
                </BoxShadow>
              </View>
            ) : (
              <View style={styles.blurIcon}>
                <BoxShadow
                  setting={{
                    width: 20,
                    height: 20,
                    color: "#E5E5E5",
                    border: 10,
                    radius: 10,
                    opacity: 0.5,
                    x: 0,
                    y: 2,
                    style: {
                      top: 2,
                      left: 2,
                    },
                  }}
                >
                  <ItemTypeIcon
                    iconType={item.type ? item.type.split("_")[0] : "MIXED"}
                  />
                </BoxShadow>
              </View>
            )}
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default React.memo(WeeklyItem);

const styles = StyleSheet.create({
  items: {
    borderRadius: 14,
    width: sizes.width / 3.07,
    height: sizes.width / 3.07,

    margin: 2,
    backgroundColor: "#000",

    justifyContent: "center",
    alignItems: "center",
  },
  weeklyPost: {
    borderRadius: 14,
    width: sizes.width / 3.07,
    height: sizes.width / 3.07,
    overflow: "hidden",
  },
  pp: {
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: "#CDCDCD",
  },
  position: {
    position: "absolute",
    zIndex: 99,
    bottom: 5,
    flexDirection: "row",
    alignItems: "center",
    left: 5,
  },
  blurIconCategory: {
    position: "absolute",
    bottom: 7,
    zIndex: 99,
    right: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  blurIcon: {
    position: "absolute",
    bottom: 5,
    zIndex: 99,
    height: 15,
    width: 15,
    right: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    color: "#FFF",
    fontFamily: fonts.roboto,
    marginLeft: 5,
    fontSize: 10,
    textShadowColor: "rgba(0, 0, 0, 0.5)",

    zIndex: 99,
    shadowOffset: { width: 3, height: 2 },

    elevation: 5,

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
  text: {
    color: "#FFF",
    fontFamily: fonts.roboto,
    top: 5,
    position: "absolute",
    zIndex: 99,
    left: 5,
    fontSize: 11,
    shadowOpacity: 10,
    shadowColor: "rgba(0, 0, 0, 0.8)",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    width: sizes.width / 4,
    shadowRadius: 13,
    elevation: 5,

    ...Platform.select({
      ios: {
        shadowColor: "rgba(0, 0, 0, 0.5)",
        shadowOffset: {
          width: 0,
          height: 2,
        },
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
  rankContainer: {
    top: 5,
    position: "absolute",
    zIndex: 99,
    right: 5,
    backgroundColor: "#343535",
    justifyContent: "center",
    alignItems: "center",
    width: 15,
    height: 15,
    borderRadius: 14,
  },
  rank: {
    fontFamily: fonts.roboto,
    fontSize: 8,
    color: "#FFF",
    textAlign: "center",
    shadowColor: "rgba(0, 0, 0, 0.8)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,

    elevation: 2, // Sadece Android için gerekliadowColor: 'rgba(0, 0, 0, 0.5)',

    ...Platform.select({
      ios: {
        shadowColor: "rgba(0, 0, 0, 0.5)",
        shadowOffset: {
          width: 0,
          height: 2,
        },
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
  categoryIcon: {
    width: 17,
    height: 17,
    tintColor: "#FFF",
    shadowColor: "rgba(0, 0, 0, 0.8)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 3,
    shadowRadius: 2,
  },
});

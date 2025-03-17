/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/destructuring-assignment */
import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  useNavigation,
  useRoute,
  StackActions,
} from "@react-navigation/native";
import { useAtomValue } from "jotai";
import LinearGradient from "react-native-linear-gradient";
import { Modalize } from "react-native-modalize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import WebView from "react-native-webview";

import LockClosedIcon from "../../components/LockClosedIcon";
import LockOpenIcon from "../../components/LockOpenIcon";
import routes from "../../constants/routes";
import { useBablAnalytics } from "../../hooks/useBablAnalytics";
import { sizes } from "../../theme";
import fonts from "../../theme/fonts";
import { userAtom } from "../../utils/atoms";
import DailymotionPlayer from "../DailymotionPlayer";
import ShortPlayer from "../ShortPlayer/ShortPlayer";
import SoundPlayerPage from "../SoundPlayerPage/SoundPlayerPage";
import SpotifyPlayer from "../SpotifyPlayer/SpotifyPlayer";
import HotBablDetailContentWrapper from "../tab/HotBabls/HotBablDetailContentWrapper";
import Rebabls from "../tab/HotBabls/Rebabls";
import TiktokPlayer from "../TiktokPlayer";
import TwitchPlayer from "../TwitchPlayer/TwitchPlayer";
import VideoPlayer from "../VideoPlayer";
import InstagramWidget, { InstagramWidgetHeader } from "./InstagramWidget";
import ManualPhotoWidget from "./ManualPhotoWidget";
import TextWidget from "./TextWidget";
import TwitterWidget from "./TwitterWidget";

const sendIcon = require("../../assets/ned.png");

const ITEM_HEIGHT =
  sizes.height + (Platform.OS === "android" ? StatusBar.currentHeight : 0);

const getContent = ({
  navigation,
  isLocked,
  CONTENT_HEIGHT,
  items,
  top,
  bottom,
  setIsLocked,
  createdBy,
}) => {
  return (item, isVisible = false) => {
    const itemType = item.resourceType || item.type;

    if (itemType === "VIDEO_DAILYMOTION") {
      return <DailymotionPlayer videoId={item.url.split("video/")[1]} />;
    }

    if (itemType === "VIDEO_MANUAL") {
      return (
        <View style={{ flex: 1 }}>
          <InstagramWidgetHeader item={item} createdBy={createdBy} />
          <VideoPlayer url={item.coverVideo} shouldPlay={isVisible} isManual />
        </View>
      );
    }

    if (itemType === "PHOTO_MANUAL") {
      return (
        <View style={{ flex: 1 }}>
          <InstagramWidgetHeader item={item} createdBy={createdBy} />
          <ManualPhotoWidget url={item.url} />
        </View>
      );
    }

    if (itemType === "SHORT_TIKTOK") {
      if (item.coverVideo) {
        return (
          <View style={{ flex: 1 }}>
            <InstagramWidgetHeader item={item} />
            <VideoPlayer url={item.coverVideo} shouldPlay={isVisible} />
          </View>
        );
      }

      return (
        <TiktokPlayer
          url={`https://www.tiktok.com/oembed?url=${item.url}`}
          opacity={1}
        />
      );
    }

    if (itemType === "SHORT_YOUTUBE") {
      const videoId = item.url.split("shorts/")[1] || item.url.split("v=")[1];

      return (
        <View style={{ flex: 1 }}>
          <InstagramWidgetHeader item={item} />
          <ShortPlayer
            videoId={videoId}
            shouldPlay={isVisible}
            height={CONTENT_HEIGHT}
          />
        </View>
      );
    }

    if (itemType === "VIDEO_TWITCH") {
      return <TwitchPlayer videoId={item.id} shouldPlay={isVisible} />;
    }

    if (itemType === "STREAM_TWITCH") {
      return <TwitchPlayer channel={item.id} shouldPlay={isVisible} />;
    }

    if (itemType === "TEXT_TWITTER") {
      return <TwitterWidget item={item} shouldPlay={isVisible} />;
    }

    if (itemType === "TEXT_CHATGPT") {
      return <TextWidget item={item} />;
    }

    if (itemType === "PHOTO_INSTAGRAM" && item.metadata) {
      return <InstagramWidget item={item} shouldPlay={isVisible} />;
    }

    if (itemType === "SHORT_INSTAGRAM" && item.metadata) {
      return (
        <View style={{ flex: 1 }}>
          <InstagramWidgetHeader item={item} />
          <VideoPlayer url={item.coverVideo} shouldPlay={isVisible} />
        </View>
      );
    }

    if (itemType === "MUSIC_SPOTIFY") {
      return <SpotifyPlayer item={item} shouldPlay={isVisible} />;
    }

    if (itemType.startsWith("MUSIC")) {
      return <SoundPlayerPage item={item} />;
    }

    if (itemType.startsWith("BABL_EMBED")) {
      return (
        <HotBablDetailContentWrapper
          bablId={item.url}
          lowerChapter
          forcePlay={isVisible}
          showBack={false}
          isEmbed
          onPress={() => {
            navigation.dispatch(
              StackActions.push(routes.BablContent, {
                bablId: item.url,
                cover: item.cover,
              }),
            );
          }}
        />
      );
    }

    if (itemType === "TEXT_MANUAL") {
      return (
        <View style={{ flex: 1, paddingTop: top - 30 }}>
          <WebView
            source={{
              html: `<head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <style>
                  body { background-color: #000; }
                  h2 { 
                    color: #FFF;
                    font-family: sans-serif;
                  }
                </style>
              </head>
              <body><h2>${item.url}</h1></body>`,
            }}
            style={{
              flex: 1,
            }}
          />
        </View>
      );
    }

    if (!isVisible) return null;

    return (
      <View style={{ flex: 1 }}>
        <WebView
          allowsInlineMediaPlayback
          allowsFullscreenVideo={false}
          scrollEnabled={!isLocked || items.length === 1}
          domStorageEnabled
          javaScriptEnabled
          // mediaPlaybackRequiresUserAction
          source={{
            uri: item.url,
          }}
          style={{
            flex: 1,
          }}
        />
        {items.length > 1 && (
          <LinearGradient
            colors={["#F9B092", "#D5D399", "#0AAFF6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              position: "absolute",
              top: Dimensions.get("window").height / 2 - top - bottom - 30,
              width: 44,
              height: 44,
              borderRadius: 44,
              right: 20,
              backgroundColor: "yellow",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setIsLocked((prev) => {
                  return !prev;
                });
              }}
              style={{
                width: 41,
                height: 41,
                borderRadius: 41,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#000",
              }}
            >
              {isLocked ? (
                <LockClosedIcon color="#F55" width={24} height={24} />
              ) : (
                <LockOpenIcon color="#5F5" width={24} height={24} />
              )}
            </TouchableOpacity>
          </LinearGradient>
        )}
      </View>
    );
  };
};

const BablContentList = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [visibleIndex, setVisibleIndex] = React.useState(0);
  const { top, bottom } = useSafeAreaInsets();
  const flatListRef = React.useRef();
  const modalizeRef = React.useRef();
  const currentUser = useAtomValue(userAtom);
  const [isLocked, setIsLocked] = React.useState(true);
  const HEADER_HEIGHT = top + 40;
  const CONTENT_HEIGHT = ITEM_HEIGHT - HEADER_HEIGHT;

  const {
    bablId,
    title,
    items,
    itemIndex,
    onNextPress,
    showNext = true,
    bablUser,
  } = route.params;
  const createdBy = bablUser || currentUser;

  useBablAnalytics(bablId);

  const onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems[0]?.index !== undefined) {
      setVisibleIndex(viewableItems[0]?.index);
    }
  };

  const viewabilityConfigCallbackPairs = React.useRef([
    {
      viewabilityConfig: {
        minimumViewTime: 150,
        itemVisiblePercentThreshold: 30,
      },
      onViewableItemsChanged,
    },
  ]);

  const data = items;

  return (
    <>
      {Platform.OS === "android" && (
        <StatusBar translucent backgroundColor="transparent" />
      )}
      <View style={styles.flex1}>
        <View
          style={{
            top: 0,
            height: HEADER_HEIGHT,
            left: 0,
            right: 0,
            backgroundColor: "#000",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              transform: [
                {
                  translateY: top / 3,
                },
              ],
            }}
          >
            <TouchableOpacity
              onPress={navigation.goBack}
              style={styles.backBtn}
            >
              <Image
                source={require("../../assets/back.png")} // Geri ok resminin yolunu belirtin
                style={styles.back}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <Text numberOfLines={1} style={styles.title}>
              {title}
            </Text>

            <Image
              style={styles.appLogo}
              resizeMode="contain"
              source={require("../../assets/bab.png")}
            />
          </View>
        </View>

        <FlatList
          ref={flatListRef}
          initialScrollIndex={itemIndex}
          data={data}
          overScrollMode="never"
          style={{
            height: CONTENT_HEIGHT,
          }}
          pagingEnabled
          viewabilityConfigCallbackPairs={
            viewabilityConfigCallbackPairs.current
          }
          estimatedItemSize={CONTENT_HEIGHT}
          getItemLayout={(data, index) => {
            return {
              length: CONTENT_HEIGHT,
              offset: CONTENT_HEIGHT * index,
              index,
            };
          }}
          // keyExtractor={(item) => { return item.id; }}
          extraData={visibleIndex}
          renderItem={({ item, index }) => {
            return (
              <View
                style={{
                  height: CONTENT_HEIGHT,
                  width: sizes.width,
                }}
              >
                {getContent({
                  navigation,
                  isLocked,
                  CONTENT_HEIGHT,
                  items,
                  top,
                  bottom,
                  setIsLocked,
                  createdBy,
                })(item, index === visibleIndex)}

                {!!bablId && item.type !== "BABL_EMBED" && (
                  <TouchableOpacity
                    onPress={async () => {
                      modalizeRef.current.open();
                    }}
                  >
                    <Image
                      source={sendIcon}
                      resizeMode="contain"
                      style={styles.sendIcon}
                    />
                  </TouchableOpacity>
                )}
              </View>
            );
          }}
        />

        <Modalize
          adjustToContentHeight
          handlePosition="inside"
          handleStyle={styles.handleStyle}
          modalStyle={styles.modalStyle}
          scrollViewProps={{
            scrollEnabled: false,
          }}
          ref={modalizeRef}
        >
          <Rebabls
            title={title}
            bablId={bablId}
            itemId={data[visibleIndex]?.id}
            onClose={() => {
              modalizeRef.current?.close();
            }}
          />
        </Modalize>
      </View>
    </>
  );
};

export default BablContentList;

const styles = StyleSheet.create({
  flex1: { flex: 1, backgroundColor: "#000" },
  appLogo: {
    width: 34,
    height: 28,
    position: "absolute",
    right: 10,
  },
  backBtn: {
    position: "absolute",
    left: 10,
    width: 30,
    height: 30,
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 15,
    color: "white",
    fontFamily: fonts.roboto,
    maxWidth: sizes.width * 0.6,
  },
  sendIcon: {
    width: 28,
    height: 28,
    tintColor: "#FFF",
    position: "absolute",
    right: 20,
    bottom: 70,
  },
  back: {
    width: 40, // Resim genişliği
    height: 24, // Resim yüksekliği
    marginRight: 8, // Resim ile metin arasındaki boşluk
    tintColor: "#BBBBBB",
  },
  handleStyle: {
    backgroundColor: "#212121",
    height: 5,
    width: 36,
  },
  modalStyle: {
    borderTopRightRadius: 26,
    borderTopLeftRadius: 26,
    backgroundColor: "#101010",
    justifyContent: "space-between",
  },
});

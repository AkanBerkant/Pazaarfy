import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Asset } from "expo-asset";
import moment from "moment";

import Carousel from "react-native-reanimated-carousel";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CustomVideo from "../../components/CustomVideo";
import InstagramWidgetModal from "../BablContent/InstagramWidgetModal";

import InstagramIconSvg from "./InstagramIconSvg";
import TiktokIconSvg from "./TiktokIconSvg";

export const InstagramWidgetHeader = ({ item, createdBy }) => {
  const { bottom } = useSafeAreaInsets();
  const [visible, setVisible] = React.useState(null);
  const { metadata, type: firstType, resourceType } = item;
  const type = resourceType || firstType;

  return (
    <>
      <InstagramWidgetModal
        title={item.title}
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
      />
    </>
  );
};

const InstagramWidget = ({ item, shouldPlay }) => {
  const { metadata } = item;
  const sliderWidth = Dimensions.get("window").width;
  const [localAssets, setLocalAssets] = React.useState([]);

  React.useEffect(() => {
    if (metadata?.assets?.length && !localAssets.length) {
      Asset.loadAsync(metadata.assets).then((res) => {
        setLocalAssets(
          res.map((x) => {
            return x.localUri;
          }),
        );
      });
    }
  }, [metadata?.assets]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#000",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <InstagramWidgetHeader item={item} />

      <View
        style={{
          alignSelf: "stretch",
        }}
      >
        {(!!item.cover || !!metadata?.assets?.length) && (
          <View style={{ marginTop: 12, height: sliderWidth / 1.3 }}>
            <Carousel
              data={localAssets?.length ? localAssets : [item.cover]}
              pagingEnabled
              autoPlay={false}
              loop={false}
              autoFillData={false}
              width={sliderWidth}
              height={sliderWidth / 1.3}
              renderItem={({ item: media }) => {
                if (media.includes("mp4") || media.includes("m3u8")) {
                  return (
                    <CustomVideo
                      style={{
                        alignSelf: "stretch",
                        aspectRatio: 1.3,
                      }}
                      source={{
                        uri: media,
                      }}
                      resizeMode="contain"
                      isMuted={false}
                      shouldPlay={shouldPlay}
                      useNativeControls
                    />
                  );
                }

                return (
                  <Image
                    style={{
                      alignSelf: "stretch",
                      aspectRatio: 1.3,
                    }}
                    source={{
                      uri: media,
                    }}
                    resizeMode="contain"
                  />
                );
              }}
            />
          </View>
        )}

        {false && (
          <View
            style={{
              paddingHorizontal: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text
                style={{
                  marginTop: 10,
                  color: "#FFF",
                  fontSize: 14,
                  fontWeight: "600",
                }}
              >
                {metadata.likeCount} beğenme
              </Text>

              <Text
                numberOfLines={1}
                style={{
                  marginTop: 10,
                  color: "#FFF",
                  fontSize: 14,
                  fontWeight: "400",
                }}
              >
                {item.title}
              </Text>

              <Text
                style={{
                  marginTop: 16,
                  fontSize: 14,
                  color: "rgb(115, 115, 115)",
                }}
              >
                {moment(metadata.date).format("DD MMMM YYYY")}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default InstagramWidget;

const styles = StyleSheet.create({});

import React from "react";
import { DeviceEventEmitter, Platform, StyleSheet } from "react-native";

import { useIsFocused } from "@react-navigation/native";
import FastImage from "react-native-fast-image";

import CustomVideo from "../../../components/CustomVideo";
import SpeakerIcon from "../../../components/SpeakerIcon";
import { sizes } from "../../../theme";
import fonts from "../../../theme/fonts";

const HomeItemAsset = ({
  item,
  index,
  categoryIndex,
  coverCropped,
  localAsset,
}) => {
  const isFocused = useIsFocused();
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(true);

  React.useEffect(() => {
    const playingRowListener = DeviceEventEmitter.addListener(
      "PLAYING_ROW",
      (p) => {
        setIsMuted(p !== categoryIndex);
      },
    );

    const playingIndexListener = DeviceEventEmitter.addListener(
      `PLAYING_INDEX_${categoryIndex}`,
      (p) => {
        setIsPlaying(p === index);
      },
    );

    return () => {
      playingRowListener.remove();
      playingIndexListener.remove();
    };
  }, []);

  const videoComponent = React.useMemo(() => {
    return (
      <CustomVideo
        resizeMode="cover"
        source={{
          uri: localAsset,
        }}
        style={styles.itemImage}
        shouldPlay={isPlaying && isFocused}
        isMuted={isMuted || !isFocused}
        ignoreSilentSwitch="ignore"
        volume={0.03}
        isLooping
      />
    );
  }, [isPlaying, isMuted, isFocused, localAsset]);

  const imgComponent = React.useMemo(() => {
    return (
      <FastImage source={{ uri: coverCropped }} style={styles.itemImage} />
    );
  }, [coverCropped]);

  return (
    <>
      {!isMuted && !!localAsset && isPlaying && (
        <SpeakerIcon
          color="#FFF"
          style={styles.speakerIcon}
          width={20}
          height={20}
        />
      )}
      {!!localAsset && isPlaying && Platform.OS === "ios"
        ? videoComponent
        : imgComponent}
    </>
  );
};

export default HomeItemAsset;

const styles = StyleSheet.create({
  itemImage: {
    flex: 1,
    margin: 3,
    borderRadius: 13.2,
    overflow: "hidden",
  },
  speakerIcon: {
    position: "absolute",
    top: 5,
    right: 10,
    zIndex: 3,
  },
});

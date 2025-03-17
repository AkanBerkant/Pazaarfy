import React from 'react';
import { StyleSheet } from 'react-native';

import { Asset } from 'expo-asset';

import CustomVideo from '../components/CustomVideo';

const VideoPlayer = ({ url, shouldPlay = false, isManual = false }) => {
  const [localAsset, setLocalAsset] = React.useState();

  React.useEffect(() => {
    if (url && !localAsset) {
      if (url.endsWith('.mp4')) {
        Asset.loadAsync([url]).then((res) => {
          setLocalAsset(res[0].localUri);
        });
      } else {
        setLocalAsset(url);
      }
    }
  }, [localAsset]);

  if (!localAsset || !shouldPlay) return null;

  return (
    <CustomVideo
      source={{ uri: localAsset }}
      style={styles.video}
      useNativeControls
      isLooping
      shouldPlay={shouldPlay}
      isMuted={!shouldPlay}
      resizeMode={isManual ? 'contain' : 'cover'}
    />
  );
};

const styles = StyleSheet.create({
  video: { flex: 1 },
});

export default VideoPlayer;

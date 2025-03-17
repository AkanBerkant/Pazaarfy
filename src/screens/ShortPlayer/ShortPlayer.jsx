import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import YoutubePlayer from 'react-native-youtube-iframe';

const ShortPlayer = ({ videoId, shouldPlay = false, height }) => {
  const playerRef = React.useRef();
  const { top } = useSafeAreaInsets();

  return (
    <View
      pointerEvents="none"
      style={{
        width: Dimensions.get('window').width,
        height,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <YoutubePlayer
        ref={playerRef}
        height={height}
        width={Dimensions.get('window').width}
        webViewProps={{
          androidLayerType: 'hardware',
          injectedJavaScript: `
        var element = document.getElementsByClassName('container')[0];
        element.style.position = 'unset';

        true;
      `,
        }}
        onChangeState={(state) => {
          if (state === 'ended') {
            playerRef.current?.seekTo(0);
          }
        }}
        play={shouldPlay}
        initialPlayerParams={{
          controls: 0,
          rel: 0,
          showClosedCaptions: 0,
        }}
        videoId={videoId}
      />
    </View>
  );
};

export default ShortPlayer;

const styles = StyleSheet.create({});

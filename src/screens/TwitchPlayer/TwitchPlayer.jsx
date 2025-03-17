import React from 'react';
import { StyleSheet, View } from 'react-native';

import WebView from 'react-native-webview';

const INJECTEDJAVASCRIPT = "const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=0.99, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); ";

const TwitchPlayer = ({ channel, videoId, shouldPlay }) => {
  if (!shouldPlay) {
    return null;
  }

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <WebView
        injectedJavaScript={INJECTEDJAVASCRIPT}
        scalesPageToFit
        allowsInlineMediaPlayback
        allowsFullscreenVideo={false}
        domStorageEnabled
        javaScriptEnabled
        source={{
          // uri: !!videoId ? `https://player.twitch.tv/?video=v${videoId}&=true&parent=www.babl.com`: `https://player.twitch.tv/?channel=${channel}&autoplay=true&parent=www.babl.com`,
          uri: videoId
            ? `https://twitch.tv/videos/${videoId}`
            : `https://player.twitch.tv/?channel=${channel}&autoplay=true&parent=www.babl.com`,
        }}
        style={{
          alignSelf: 'stretch',
          height: 300,
        }}
      />
    </View>
  );
};

export default TwitchPlayer;

const styles = StyleSheet.create({});

import React from 'react';

import WebView from 'react-native-webview';

const DailymotionPlayer = ({ videoId }) => {
  return (
    <WebView
      allowsInlineMediaPlayback
      allowsFullscreenVideo={false}
      scrollEnabled={false}
      domStorageEnabled
      javaScriptEnabled
      source={{
        html: `
          <body style="background-color: #000;  display: flex; align-items:center; justify-content: center;"><div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.0417%;"><iframe src="https://www.dailymotion.com/embed/video/${videoId}?pubtool=oembed&autoplay=true" style="top: 0; left: 0; width: 100%; height: 100%; position: absolute; border: 0;" allowfullscreen scrolling="no" allow="autoplay; encrypted-media;"></iframe></div></body>`,
      }}
      style={{
        flex: 1,
        backgroundColor: '#000',
      }}
    />
  );
};

export default DailymotionPlayer;

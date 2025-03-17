import React from 'react';

import { WebView } from 'react-native-webview';

const SpotifyPlayer = ({ item, shouldPlay }) => {
  const embedType = item.metadata?.type === 'PODCAST' ? 'episode' : item.metadata?.type === 'PLAYLIST' ? 'playlist' : 'track';

  return (
    <WebView
      allowsInlineMediaPlayback
      allowsFullscreenVideo={false}
      scrollEnabled={false}
      domStorageEnabled
      javaScriptEnabled
      source={{
        html: `
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <body style="background-color: #000; display: flex; align-items:center; justify-content: center;">
            ${
              shouldPlay && `<iframe width="100%" height="400" style="border-radius: 12px" frameborder="0" allowfullscreen allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" src="https://open.spotify.com/embed/${embedType}/${item.id}?utm_source=oembed"></iframe>`
            }
          </body>`,
      }}
      style={{
        flex: 1,
        backgroundColor: '#000',
      }}
    />
  );
};

export default SpotifyPlayer;

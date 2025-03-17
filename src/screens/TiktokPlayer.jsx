import React from 'react';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import WebView from 'react-native-webview';

const TiktokPlayer = ({ url, opacity = 0 }) => {
  const fetchQuery = useQuery(['FETCH_TIKTOK', url], () => {
    return axios.get(url);
  });

  if (fetchQuery.isFetching || fetchQuery.isError) {
    return null;
  }

  return (
    <WebView
      allowsInlineMediaPlayback
      allowsFullscreenVideo={false}
      scrollEnabled={false}
      domStorageEnabled
      javaScriptEnabled
      // mediaPlaybackRequiresUserAction
      source={{
        html: `
          <head>
            <meta content="width=width, initial-scale=1, maximum-scale=1" name="viewport"></meta>
          </head>${fetchQuery.data.data.html}`,
      }}
      style={{
        flex: 1,
        opacity,
      }}
    />
  );
};

export default TiktokPlayer;

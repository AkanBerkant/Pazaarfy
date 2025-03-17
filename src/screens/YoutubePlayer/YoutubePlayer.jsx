import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import YouTube from 'react-native-youtube';

import { sizes } from '../../theme';

const YoutubePlayer = ({ videoId, shouldPlay = false }) => {
  const [show, setShow] = React.useState(false);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
      }}
    >
      <YouTube
        videoId={videoId} // The YouTube video ID
        play={shouldPlay} // control playback of video with true/false
        fullscreen // control whether the video should play in fullscreen or inline
        //    loop // control whether the video should loop when ended
        //    onReady={e => this.setState({isReady: true})}
        //    onChangeState={e => this.setState({status: e.state})}
        //    onChangeQuality={e => this.setState({quality: e.quality})}
        //    onError={e => this.setState({error: e.error})}
        style={{
          alignSelf: 'stretch',
          height: show ? sizes.height / 2 : 0,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#000',
        }}
        onReady={(e) => { return setShow(true); }}
        origin="http://www.youtube.com"
      />
      {
        !show && (
          <ActivityIndicator
            size="large"
            style={{
              position: 'absolute',
            }}
          />
        )
      }
    </View>
  );
};

export default YoutubePlayer;

const styles = StyleSheet.create({});

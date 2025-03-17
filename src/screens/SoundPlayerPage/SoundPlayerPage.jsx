import React from 'react';
import { Image, StyleSheet } from 'react-native';

import SoundPlayer from 'react-native-sound-player';

const SoundPlayerPage = ({ item }) => {
  React.useEffect(() => {
    SoundPlayer.playUrl(item.url);

    return () => {
      SoundPlayer.stop();
      SoundPlayer.seek(0);
    };
  }, []);

  return (
    <Image style={{ flex: 1 }} source={{ uri: item.cover }} resizeMode="contain" />
  );
};

export default SoundPlayerPage;

const styles = StyleSheet.create({});

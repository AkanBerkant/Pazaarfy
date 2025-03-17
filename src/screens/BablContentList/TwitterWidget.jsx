import React from 'react';
import {
  Dimensions, Image, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';

import { Asset } from 'expo-asset';
import moment from 'moment';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import Carousel from 'react-native-reanimated-carousel';

import CustomVideo from '../../components/CustomVideo';

import TwitterIconSvg from './TwitterIconSvg';

const sliderWidth = Dimensions.get('window').width - 30;

const TwitterWidget = ({ item, shouldPlay }) => {
  const { metadata } = item;
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

  const onPress = () => {
    InAppBrowser.open(item.url);
  };

  return (
    <View
      style={styles.container}
    >
      <View
        style={styles.content}
      >
        <TouchableOpacity
          onPress={onPress}
          style={styles.btn}
        >
          <View>
            <TwitterIconSvg width={30} height={30} />
          </View>

          <View style={styles.usernameContainer}>
            <Text
              style={styles.username}
            >
              {metadata.username}
            </Text>
            <Text
              style={styles.username2}
            >
              @
              {metadata.username}
            </Text>
          </View>
        </TouchableOpacity>

        <Text
          style={styles.title}
        >
          {item.title}
        </Text>

        {metadata?.assets?.[0] && (
          <View style={styles.assetContainer}>
            <Carousel
              data={localAssets}
              pagingEnabled
              autoPlay={false}
              loop={false}
              autoFillData={false}
              width={sliderWidth}
              height={sliderWidth / 1.3}
              renderItem={({ item: media }) => {
                if (media.includes('mp4') || media.includes('m3u8')) {
                  return (
                    <CustomVideo
                      style={styles.twitterVideo}
                      source={{
                        uri: media,
                      }}
                      resizeMode="contain"
                      isMuted={false}
                      shouldPlay={shouldPlay}
                      isLooping
                      useNativeControls
                    />
                  );
                }

                return (
                  <Image
                    style={styles.img}
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

        <Text
          style={styles.date}
        >
          {moment(metadata.date).format('DD MMM YYYY, hh:mm')}
        </Text>
      </View>
    </View>
  );
};

export default TwitterWidget;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgb(47, 51, 54)',
    padding: 12,
    alignSelf: 'stretch',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assetContainer: { marginTop: 12, height: sliderWidth / 1.3 },
  twitterVideo: {
    alignSelf: 'stretch',
    aspectRatio: 1.3,
    borderRadius: 16,
  },
  img: {
    alignSelf: 'stretch',
    aspectRatio: 1.3,
    borderRadius: 16,
  },
  date: {
    marginTop: 12,
    fontSize: 14,
    color: '#71767B',
  },
  usernameContainer: { flex: 1, marginLeft: 12 },
  username: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFF',
  },
  username2: {
    fontSize: 15,
    fontWeight: '400',
    color: '#FFF',
  },
  title: {
    marginTop: 12,
    fontSize: 17,
    color: '#FFF',
  },
});

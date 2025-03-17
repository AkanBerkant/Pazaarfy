import React from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { BlurView } from 'expo-blur';
import { useSetAtom } from 'jotai';
import FastImage from 'react-native-fast-image';

import { bgPhotos } from '../../../../components/templates/TemplateItem';
import { bablFormAtom } from '../../../../utils/atoms';
import {
  getPlatformFromUrl,
  platformLogos,
} from '../../../../utils/platform-colors';

const binIcon = require('../../../../assets/bin.png');

const BablSearchSelectedItem = ({ item }) => {
  const setBablForm = useSetAtom(bablFormAtom);
  const randomBgRef = React.useRef(Math.floor(Math.random() * 16));

  const onPress = () => {
    setBablForm((prev) => {
      const { [item.id]: extractedItem, ...rest } = prev.items[item.type];

      return {
        ...prev,
        items: {
          ...prev.items,
          [item.type]: rest,
        },
      };
    });
  };

  return (
    <View>
      <TouchableOpacity style={styles.zIndex} onPress={onPress}>
        <View style={styles.deleteIcon}>
          <Image style={styles.delete} resizeMode="contain" source={binIcon} />
        </View>
      </TouchableOpacity>

      {item.coverCopy || item.cover ? (
        <FastImage
          source={{ uri: item.coverCopy || item.cover }}
          style={styles.deleteImage}
        />
      ) : (
        <ImageBackground
          source={bgPhotos[randomBgRef.current]}
          style={[styles.deleteImage, { overflow: 'hidden' }]}
        >
          <BlurView
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
            tint="dark"
            intensity={10}
          >
            {platformLogos[getPlatformFromUrl(item.url)] && (
              <Image
                source={platformLogos[getPlatformFromUrl(item.url)]}
                resizeMode="contain"
                style={{
                  height: 36,
                  tintColor: 'white',
                }}
              />
            )}
          </BlurView>
        </ImageBackground>
      )}
    </View>
  );
};

export default BablSearchSelectedItem;

const styles = StyleSheet.create({
  zIndex: {
    zIndex: 99,
  },
  deleteIcon: {
    width: 25,
    height: 25,
    position: 'absolute',
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
    backgroundColor: '#FFF',
    borderRadius: 30,
  },
  delete: {
    width: 15,
    height: 15,
  },
  deleteImage: {
    width: 75,
    height: 75,
    margin: 5,
    borderRadius: 6,
  },
});

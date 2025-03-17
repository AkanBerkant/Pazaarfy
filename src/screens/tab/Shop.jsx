import React from 'react';
import {
  FlatList, Image, StyleSheet, View,
} from 'react-native';

import { BlurView } from 'expo-blur';

import { BackHeader, Container } from '../../components';
import { sizes } from '../../theme';

import { sampleImages } from './HotBabls/data';

const Shop = () => {
  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.center}>
        <Image
          style={[
            styles.image,
            {
              height: 88,
              width: index % 2 === 0 ? sizes.width / 2.54 : sizes.width / 1.87,
            },
          ]}
          source={{ uri: item.uri }}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Container>
        <BackHeader title="Shop" />
        <View style={styles.center}>
          <Image
            source={{ uri: sampleImages[0].uri }}
            style={[
              styles.firstImage,
              {
                marginTop: 5,
              },
            ]}
          />

          <BlurView
            style={[
              styles.item,
              {
                right: 18,
              },
            ]}
            tint="light"
          >
            <Image
              source={require('../../assets/nktr.png')}
              style={styles.itemFirstBlurIcon}
              resizeMode="contain"
            />
          </BlurView>
        </View>

        <View style={styles.center}>
          <FlatList
            data={sampleImages.slice(7)}
            key="#"
            numColumns={2}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => {
              return item.id.toString();
            }}
            renderItem={renderItem}
            bounces={false}
            contentContainerStyle={{
              marginTop: 2,
            }}
          />
        </View>

        <View style={styles.center}>
          <Image source={{ uri: sampleImages[7].uri }} style={[styles.firstImage, { height: 88 }]} />

          <BlurView
            style={[
              styles.item,
              {
                right: 18,
              },
            ]}
            tint="light"
          >
            <Image
              source={require('../../assets/nktr.png')}
              style={styles.itemFirstBlurIcon}
              resizeMode="contain"
            />
          </BlurView>
        </View>
        <View style={styles.center}>
          <FlatList
            data={sampleImages.slice(9)}
            key="#"
            numColumns={2}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => {
              return item.id.toString();
            }}
            renderItem={renderItem}
            bounces={false}
            contentContainerStyle={{
              marginTop: 2,
            }}
          />
        </View>
      </Container>
    </View>
  );
};

export default Shop;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  image: {
    borderRadius: 7,
    margin: 1,
  },
  firstImage: {
    width: sizes.width / 1.07,
    height: 179,
    alignSelf: 'center',
    borderRadius: 7,
    marginTop: 2,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    position: 'absolute',
    zIndex: 99,
    width: 27,
    height: 25,
    borderRadius: 13.5,
    bottom: 12,
    right: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemFirstBlurIcon: {
    width: 17.5,
    height: 13.83,
  },
});

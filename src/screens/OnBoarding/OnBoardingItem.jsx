import React from 'react';
import {
  View, Image, Text, StyleSheet, useWindowDimensions,
} from 'react-native';

import { sizes } from '../../theme/theme';

const OnboardingItem = ({ item }) => {
  const { width } = useWindowDimensions();

  return (
    <View style={{ alignItems: 'center' }}>
      <Image resizeMode="contain" source={require('../../assets/logo.png')} style={styles.logo} />
      <Image source={item.image} style={[styles.image]} />

      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.descriptionText}>{item.description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    marginTop: 30,
    height: sizes.width,
    resizeMode: 'contain',
    width: sizes.width,
    alignSelf: 'center',
  },
  logo: {
    height: 40,
    width: sizes.width / 1.3,
    alignSelf: 'center',
    marginTop: 30,
  },
  title: {
    fontSize: 20,
    color: '#FFF',
    fontFamily: 'DMSans-Bold',
    width: sizes.width / 1.2,
    textAlign: 'center',
  },
  descriptionText: {
    paddingTop: 11,
    fontSize: 16,
    fontFamily: 'DMSans-Regular',
    width: sizes.width / 1.5,
    textAlign: 'center',
    color: '#FFF',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
});

export default OnboardingItem;

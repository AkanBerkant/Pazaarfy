import React from 'react';
import {
  Image, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { sizes } from '../../theme';
import fonts from '../../theme/fonts';

const BoostHeader = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.header}>
      <View style={styles.top}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.left}
        >
          <Image
            resizeMode="contain"
            source={require('../../assets/back.png')}
            style={styles.back}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Boost</Text>
        <View style={styles.left}>
          <Image
            resizeMode="contain"
            source={require('../../assets/boost.png')}
            style={styles.babl}
          />
        </View>
      </View>
    </View>
  );
};

export default BoostHeader;

const styles = StyleSheet.create({
  left: {
    width: 80,
  },
  back: {
    width: 40,
    height: 22,
    tintColor: '#FFF',
  },
  title: {
    fontWeight: '500',
    fontSize: 18,
    color: '#FFF',
    fontFamily: fonts.roboto,
  },
  header: {
    shadowColor: '#EE558F',
    backgroundColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginTop: 0,
    elevation: 5,
  },
  babl: {
    width: 100,
    height: 41.36,
  },
  top: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    height: sizes.width / 7,
    width: sizes.width,
    justifyContent: 'space-between',
  },
});

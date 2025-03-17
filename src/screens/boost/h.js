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
      <View style={styles.between}>
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
  },
  title: {
    fontWeight: '500',
    fontSize: 18,
    color: '#FFF',
    fontFamily: fonts.roboto,
  },
  header: {
    width: sizes.width,
    height: sizes.width / 4,
    alignSelf: 'center',
    backgroundColor: '#101010',
  },
  between: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: sizes.width,
    marginTop: 20,
    height: sizes.width / 5,
    alignSelf: 'center',

    backgroundColor: '#101010',
  },
  babl: {
    width: 100,
    height: 41.36,
  },
});

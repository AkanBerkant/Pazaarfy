import React, { useEffect } from 'react';
import {
  StyleSheet, Text, Image, View,
} from 'react-native';

import { t } from 'i18next';

import { Vertices } from '../../../src/components/examples';
import { sizes } from '../../theme';
import fonts from '../../theme/fonts';

import AlarmContainer from './AlarmContainer';

const Connection = () => {
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Vertices />

      <View
        style={{
          position: 'absolute',
          top: sizes.width,
          alignItems: 'center',
        }}
      >
        <Image
          source={require('../../assets/b.png')}
          resizeMode="contain"
          style={{
            width: 40,
            height: sizes.width / 6,
          }}
        />
        <Text
          style={{
            alignSelf: 'center',
            fontFamily: fonts.roboto,
            color: '#262626',
            fontSize: 18,
            marginTop: 10,
          }}
        >
          {t('PleaseCheckYourInternetConnection')}
        </Text>
        <AlarmContainer />
      </View>
    </View>
  );
};

export default Connection;

const styles = StyleSheet.create({});

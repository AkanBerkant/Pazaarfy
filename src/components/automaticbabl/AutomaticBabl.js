import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { t } from 'i18next';
import Lottie from 'lottie-react-native';

import fonts from '../../theme/fonts';
import BackHeader from '../header/BackHeader';

const AutomaticBabl = () => {
  return (
    <>
      <BackHeader
        title=""
        style={{
          marginTop: 0,
          paddingTop: 20,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1,
        }}
      />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#000',
        }}
      >
        <Lottie
          source={require('../../assets/automaticlottie.json')}
          style={{
            width: 120,
            height: 110,
          }}
          autoPlay
        />
        <Text
          style={{
            color: '#FFF',
            fontFamily: fonts.roboto,
          }}
        >
          {t('AutomaticBablCreation')}
        </Text>
      </View>
    </>
  );
};

export default AutomaticBabl;

const styles = StyleSheet.create({});

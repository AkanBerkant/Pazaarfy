import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';

import { Loading } from '../../components';
import { fonts } from '../../constants/fonts';

const CreatingBablModal = () => {
  return <Loading />;
};

export default CreatingBablModal;

const styles = StyleSheet.create({
  modal: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  img: {
    width: Dimensions.get('window').width * 1,
    aspectRatio: 1,
  },
  text: {
    fontSize: 22,
    color: '#FFF',
    fontFamily: fonts.robotoBlack,
  },
});

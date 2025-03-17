import { Dimensions } from 'react-native';

import { textColors } from './colors';

const dimensions = Dimensions.get('window');

export const height = {
  input: 50,
  button: 40,
  searchInput: 38,
  sectionBox: 30,
  cryptoCard: 76,
};

export const radius = {
  s: 5,
  m: 10,
  l: 18,
  xl: 30,
};

export const spacing = {
  xxs: 3,
  xs: 5,
  s: 10,
  m: 15,
  l: 20,
  xl: 24,
  xxl: 30,
};

export const fontSize = {
  h1: 56,
  h2: 40,
  h3: 30,
  h4: 20,
  title: 22,
  medium: 20,
  normal: 16,
  small: 13,
  xs: 11,
};

export const sizes = {
  // app dimensions
  ...dimensions,
};

const textBase = {
  color: textColors.primary,
};

const h1 = {
  fontFamily: 'GothamNarrow-Book',
  fontSize: 16,
};

const h2 = {
  fontFamily: 'Belleza-Regular',
  fontSize: 22,
};

const h3 = {
  ...textBase,
  lineHeight: 45,
  fontSize: fontSize.h3,
  fontWeight: 'bold',
};

const h4 = {
  ...textBase,
  lineHeight: 32,
  fontSize: fontSize.h4,
  fontWeight: 'bold',
};

const title = {
  ...textBase,
  fontWeight: '700',
  fontSize: fontSize.title,
  lineHeight: 22,
};

const medium = {
  ...textBase,
  fontWeight: '500',
  fontSize: fontSize.medium,
  lineHeight: 22,
};

const normal = {
  ...textBase,
  fontSize: fontSize.normal,
  fontWeight: '400',
  lineHeight: 22,
};

const small = {
  ...textBase,
  fontWeight: '500',
  fontSize: fontSize.small,
  lineHeight: 22,
};

const smallBold = {
  ...small,
  fontWeight: '700',
};

export const textStyles = {
  h1,
  h2,
  h3,
  h4,
  title,
  medium,
  normal,
  small,
  smallBold,
  textBase,
};

export const shadow = {
  sm: {
    shadowColor: 'gray',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  md: {
    shadowColor: '#dcd3d6',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
};

const theme = {};

export default theme;

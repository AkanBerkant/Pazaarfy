import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Pressable,
  Image,
  Platform,
} from 'react-native';

import { t } from 'i18next';

import { sizes } from '../../theme';
import fonts from '../../theme/fonts';

import Gifts from './Gifts';
import MyGifts from './MyGifts';

const BottomSheet = ({ setStatus }) => {
  const slide = React.useRef(new Animated.Value(300)).current;
  const tabs = [
    {
      time: 'Gifts',
      _id: 'giff',
    },
    {
      time: 'My Gifts',
      _id: 'mygiff',
    },
  ];

  const [customFilter, setCustomFilter] = React.useState(tabs[0]._id);

  const slideUp = () => {
    // Will change slide up the bottom sheet
    Animated.timing(slide, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  const slideDown = () => {
    // Will slide down the bottom sheet
    Animated.timing(slide, {
      toValue: 300,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  React.useEffect(() => {
    slideUp();
  });

  const closeModal = () => {
    slideDown();

    setTimeout(() => {
      setStatus(false);
    }, 800);
  };

  return (
    <Pressable onPress={closeModal} style={styles.backdrop}>
      <Pressable
        style={{ width: '100%', height: sizes.width > 375 ? sizes.width * 1.8 : sizes.width * 1.6 }}
      >
        <Animated.View style={[styles.bottomSheet, { transform: [{ translateY: slide }] }]}>
          {/* <TouchableOpacity onPress={closeModal}>
            <Image source={require('../../assets/closes.png')} style={styles.closes} />
          </TouchableOpacity> */}
          <Text style={styles.title}>{t('YouCanSendGift')}</Text>

          <View style={styles.borderBottom} />
          {/* <View style={styles.header}>
            {tabs.map((item, index) => {
              const isSelected = customFilter === item._id;
              return (
                <TouchableOpacity
                  onPress={() => {
                    setCustomFilter(item._id);
                  }}
                  style={styles.menu}>
                  <Text
                    style={[
                      styles.time,
                      {
                        color: isSelected ? '#FFFFFF' : '#6A6A6A',
                        fontFamily: fonts.roboto,
                        margin: 10,
                        fontSize: 15,
                      },
                    ]}>
                    {item.time}
                  </Text>
                  {isSelected && (
                    <Image
                      tintColor={'#FFFFFF'}
                      style={styles.bottomIcon}
                      source={require('../../assets/bottom.png')}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View> */}
          {/* <View style={styles.borderBottom} /> */}

          {customFilter == 'giff' ? <Gifts /> : customFilter == 'mygiff' ? <MyGifts /> : null}
        </Animated.View>
      </Pressable>
    </Pressable>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    flex: 1,
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    width: '100%',
    height: sizes.width * 1.8,
    backgroundColor: '#101106',
    borderTopRightRadius: 26,
    borderTopLeftRadius: 26,
  },

  title: {
    color: '#FFF',
    fontFamily: fonts.roboto,
    fontSize: 18,

    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 35,
  },
  closes: {
    width: 40,
    height: 40,
    borderRadius: 40,
    position: 'absolute',
    zIndex: 99,
    right: 20,
    top: 20,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#222222',
    width: sizes.width,
    marginTop: 20,
  },

  contentContainerStyle: {
    marginLeft: 7,
  },
  kvkkDescription: {
    color: '#FFF',
    fontFamily: 'Roboto-Light',
    textAlign: 'center',
    marginTop: 10,
  },
  kvkk: {
    color: '#FFF',
    fontFamily: fonts.roboto,
    textAlign: 'center',
    marginTop: 10,
  },
  linearGradient: {
    width: sizes.width / 1.1,
    height: 55,
    alignSelf: 'center',
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  button: {
    backgroundColor: '#000',
    width: sizes.width / 1.11,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  btnText: {
    color: '#FFF',
    fontFamily: fonts.roboto,
  },
  buttonCoin: {
    width: 43,
    height: 43,
  },
  header: {
    marginLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    zIndex: 99,
    marginTop: 10,
  },
  bottomIcon: {
    width: 20,
    position: 'absolute',
    top: 45,
    zIndex: 99,
    height: 4,
    borderRadius: 2,
  },
  menu: {
    alignItems: 'center',
  },
});

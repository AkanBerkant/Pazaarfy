import React from 'react';
import {
  Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import PagerView from 'react-native-pager-view';

import { BackHeader } from '../../components';
import { sizes } from '../../theme';
import fonts from '../../theme/fonts';

import Boost from './Boost';
import Gifts from './Gifts';
import MyGifts from './MyGifts';

const Giff = ({ route }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { buy, initialTab } = route.params || {};

  const tabs = [
    {
      time: t('Gifts'),
      _id: 'giff',
    },
    {
      time: t('MyGifts'),
      _id: 'mygiff',
    },
  ];

  const pagerRef = React.useRef();
  const [customFilter, setCustomFilter] = React.useState(initialTab || tabs[0]._id);
  const [visible, setVisible] = React.useState(null);

  return (
    <View style={styles.container}>
      <BackHeader shadow={0} title={t('Gifts')} />
      <View style={styles.header}>
        {tabs.map((item, index) => {
          const isSelected = customFilter === item._id;
          return (
            <TouchableOpacity
              onPress={() => {
                setCustomFilter(item._id);
              }}
              style={styles.menu}
            >
              <Text
                style={[
                  styles.time,
                  {
                    color: isSelected ? '#FFFFFF' : '#6A6A6A',
                    fontFamily: fonts.roboto,
                    margin: 10,
                  },
                ]}
              >
                {item.time}
              </Text>
              {isSelected && (
                <Image
                  tintColor="#FFFFFF"
                  style={styles.bottomIcon}
                  source={require('../../assets/bottom.png')}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.borderBottom} />

      <PagerView
        style={{ flex: 1 }}
        initialPage={0}
        ref={pagerRef}
        onPageScroll={(e) => {
          setCustomFilter(tabs[e.nativeEvent.position]._id);
        }}
      >
        {tabs.map((item) => {
          return (
            <View key={item.id}>
              {customFilter == 'giff' ? (
                <Gifts buy={buy} />
              ) : customFilter == 'mygiff' ? (
                <MyGifts />
              ) : null}
            </View>
          );
        })}
      </PagerView>
      <Boost
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
      />
    </View>
  );
};

export default Giff;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  between: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  backIcon: {
    width: 12.43,
    height: 22,
    tintColor: '#FFFFFF',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  disableItem: {
    height: 33,
    width: sizes.width / 1.1,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
  },
  icon: {
    width: 7,
    height: 7,
    marginLeft: 12,
    tintColor: '#FFFFFF',
  },
  disableLabel: {
    marginLeft: 10,
    color: '#FFFFFF',
    fontFamily: fonts.roboto,
    fontWeight: 'bold',
    fontSize: 16,
  },

  activeLabel: {
    marginLeft: 15,
    color: '#000000',
    fontWeight: '500',
    fontFamily: fonts.roboto,
    fontSize: 16,
  },
  borderBottom: {
    backgroundColor: '#181818',
    width: sizes.width,
    height: 1,
  },
  title: {
    color: '#FFF',
    fontSize: 18,
    alignSelf: 'center',
    fontFamily: fonts.roboto,
  },
  left: {
    width: 22,
  },
  cancelIcon: {
    tintColor: '#A5A5A5',
    width: 18,
    height: 18,
    marginRight: 5,
  },
  header: {
    marginLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    zIndex: 99,
  },
  bottomIcon: {
    width: 50,
    position: 'absolute',
    top: 35,
    zIndex: 99,
    height: 4,
    borderRadius: 2,
  },
  menu: {
    alignItems: 'center',
  },
});

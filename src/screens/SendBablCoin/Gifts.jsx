import React from 'react';
import {
  FlatList, Image, StyleSheet, TouchableOpacity, View, Text, Alert,
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import Lottie from 'lottie-react-native';
import { useTranslation } from 'react-i18next';
import { Notifier } from 'react-native-notifier';

import routes from '../../constants/routes';
import { sizes } from '../../theme';
import fonts from '../../theme/fonts';
import { userAtom } from '../../utils/atoms';
import { getGiftsData } from '../../utils/gifts';

const Gifts = ({ buy }) => {
  const route = useRoute();
  const { t } = useTranslation();
  const user = useAtomValue(userAtom);
  const data = getGiftsData(t);

  const allGiftsQuery = useQuery(
    ['ALL_GIFTS'],
    () => {
      return data;
    },
    {
      placeholderData: [],
    },
  );

  const navigation = useNavigation();

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (item.number > user.coin) {
            return Alert.alert(t('dontHaveEnoughCoins'), t('wouldYouLikeToBuyCoins'), [
              {
                text: t('no'),
                style: 'cancel',
              },
              {
                text: t('yes'),
                isPreferred: true,
                onPress: () => {
                  navigation.navigate(routes.Deposit);
                },
              },
            ]);
          }

          navigation.navigate(routes.GiffBoost, {
            item,
            targetUser: user,
            buy,
            bablId: route.params?.bablId,
          });
        }}
        style={styles.giftContainer}
      >
        {item.text == 'Diamond' || item.text == 'Elmas' ? (
          <Lottie autoPlay style={styles.image} source={require('../../assets/diamond.json')} />
        ) : (
          <Image source={item.image} style={styles.image} />
        )}
        <View style={styles.between}>
          <Text style={styles.text}>{item.text}</Text>
          <View style={styles.row}>
            <Text style={styles.number}>{item.number}</Text>
            <Image style={styles.coin} source={require('../../assets/sendbabl.png')} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.top} />
      <FlatList data={data} renderItem={renderItem} numColumns={3} />
    </View>
  );
};

export default Gifts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  between: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  top: {
    marginTop: 30,
  },
  image: {
    width: 74,
    height: 74,
    alignSelf: 'center',
  },
  giftContainer: {
    width: sizes.width / 3.3,
    height: sizes.width / 3.3,
    backgroundColor: '#0F0F0F',
    borderRadius: 10,
    margin: 5,
    justifyContent: 'center',
  },
  text: {
    color: '#FFF',
    fontFamily: fonts.roboto,
    fontSize: 8,
    marginLeft: 10,
    marginTop: 10,
    width: sizes.width / 7,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginRight: 3,
  },
  number: {
    fontSize: 14,
    color: '#FFF',
    fontFamily: fonts.roboto,
    marginRight: 3,
  },
  coin: {
    width: 18,
    height: 18,
  },
});

import React from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { StackActions, useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';

import { BackHeader, ButtonLinear } from '../../components';
import routes from '../../constants/routes';
import { sizes } from '../../theme';
import fonts from '../../theme/fonts';
import { userAtom } from '../../utils/atoms';
import * as Queries from '../../utils/queries';

import Boost from './Boost';

const GiffBoost = ({ route }) => {
  const navigation = useNavigation();
  const [user, setUser] = useAtom(userAtom);
  const { t } = useTranslation();

  const {
    item, buy, targetUser, ownedGift, bablId,
  } = route.params || {};

  const [visible, setVisible] = React.useState(null);

  const sendGiftMutation = useMutation(Queries.sendGift, {
    onSuccess: (res) => {
      setUser(async (prev) => {
        return {
          ...(await prev),
          coin: res.coin,
        };
      });
      setVisible(true);
    },
    onError: (err) => {
      if (err?.response?.data?.message === 'DONT_HAVE_ENOUGH_COIN') {
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

      return Alert.alert(t('ErrorGift'));
    },
  });

  return (
    <View style={styles.container} backgroundColor="#000">
      <BackHeader title={item.text} />

      <View style={styles.borderBottom} />

      <View style={styles.center}>
        <Image source={item?.image} resizeMode="contain" style={styles.image} />
        <ImageBackground source={require('../../assets/sendCoinBg.png')} style={styles.sendCoinBg}>
          <Text style={styles.text}>{item.number}</Text>
        </ImageBackground>
        <Text style={styles.textDesc}>
          {`${buy ? t('YouAreBuying') : t('YouAreSending')} ${t('AreYourSure')}`}
        </Text>
      </View>

      <View style={styles.top} />

      <ButtonLinear
        title={buy ? t('Buy') : t('Gift')}
        onPress={() => {
          /* if (item.number > user.coin) {
            return Alert.alert(
              'Bu hediyeyi göndermek için yeterli coininiz yok.',
            );
          } */

          sendGiftMutation.mutate({
            type: item.type,
            babl: bablId,
            receiver: targetUser._id,
            ownedGift,
          });
        }}
      />

      <Boost
        visible={visible}
        buy={buy}
        icon={item?.image}
        onClose={() => {
          if (buy) {
            navigation.dispatch(StackActions.pop(2));
          } else {
            navigation.dispatch(StackActions.pop(3));
          }
        }}
      />
    </View>
  );
};

export default GiffBoost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  center: {
    alignItems: 'center',
  },
  image: {
    width: sizes.width / 2,
    height: sizes.width / 2,
    marginTop: sizes.width / 4.5,
    marginBottom: 30,
  },
  text: {
    color: '#FFF',
    fontFamily: fonts.roboto,
    fontSize: 20,
  },
  sendCoinBg: {
    width: 82,
    height: 82,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  textDesc: {
    marginTop: 40,
    color: '#FFF',
    fontFamily: fonts.roboto,
    fontSize: 17,
  },
  top: {
    marginTop: 30,
  },
});

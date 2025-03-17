import React from 'react';
import {
  View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Alert,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { t } from 'i18next';
import { useAtom } from 'jotai';
import LinearGradient from 'react-native-linear-gradient';
import MaskInput from 'react-native-mask-input';

import { ButtonLinear } from '../../components';
import TextGradient from '../../components/TextGradient';
import routes from '../../constants/routes';
import { sizes } from '../../theme';
import fonts from '../../theme/fonts';
import { userAtom } from '../../utils/atoms';
import { GiftPrices } from '../../utils/gift-prices';
import * as Queries from '../../utils/queries';

const Pull = ({ onFocus, onBlur }) => {
  const [user, setUser] = useAtom(userAtom);
  const [coinConvert, setCoinConvert] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [iban, setIban] = React.useState('');
  const queryClient = useQueryClient();
  const navigation = useNavigation();

  const myGiftsQuery = useQuery(['MY_GIFTSS'], Queries.myGifts, {
    placeholderData: [],
  });

  const giftCoinAmount = myGiftsQuery.data.reduce((prev, cur) => {
    return prev + GiftPrices[cur.giftType];
  }, 0) * 0.7;

  const convertCoinsMutation = useMutation(Queries.convertCoins, {
    onSuccess: (res) => {
      setUser(async (prev) => {
        return {
          ...(await prev),
          coin: res.coin,
          balance: res.balance,
        };
      });
      setCoinConvert('');
    },
    onError: (err) => {
      console.log('err', err.response.data);
    },
  });

  const convertBalanceMutation = useMutation(Queries.convertBalance, {
    onSuccess: (res) => {
      setUser(async (prev) => {
        return {
          ...(await prev),
          coin: res.coin,
          balance: res.balance,
        };
      });
    },
    onError: (err) => {
      console.log('err', err.response.data);
    },
  });

  const convertGiftsMutation = useMutation(Queries.convertGifts, {
    onSuccess: (res) => {
      setUser(async (prev) => {
        return {
          ...(await prev),
          balance: res.balance,
        };
      });
      queryClient.invalidateQueries(['MY_GIFTSS']);
    },
    onError: (err) => {
      console.log('err', err);
    },
  });

  const withdrawMutation = useMutation(Queries.createWithdrawRequest, {
    onSuccess: (res) => {
      setUser(async (prev) => {
        return {
          ...(await prev),
          balance: res.balance,
        };
      });
      setIban('');
      setAmount('');
      Alert.alert(t('YourCreated'));
      queryClient.invalidateQueries(['W_REQUESTS']);
    },
    onError: (err) => {
      console.log('err', err.response.data);
    },
  });

  const onConvertBalancePress = () => {
    convertBalanceMutation.mutate();
  };

  const onConvertCoinPress = () => {
    if (+coinConvert > user.coin) {
      return Alert.alert(t('YouBuy'), null, [
        {
          text: t('no'),
        },
        {
          text: t('yes'),
          onPress: () => {
            navigation.navigate(routes.Deposit);
          },
        },
      ]);
    }

    convertCoinsMutation.mutate({ amount: +coinConvert });
  };

  const onConvertGiftPress = () => {
    if (!giftCoinAmount) {
      return Alert.alert(t('ThereIsNoGiftInYourAccount'));
    }

    convertGiftsMutation.mutate();
  };

  const onWithdrawPress = () => {
    if (iban.trim().length !== 32) {
      return Alert.alert('Please make sure you entered your Iban number correctly.');
    }

    if (+amount > user.balance) {
      return Alert.alert(t('YouDoNotHaveEnoughFunds'));
    }

    withdrawMutation.mutate({
      amount: +amount,
      iban,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.between}>
        <View style={[styles.row]}>
          <Image source={require('../../assets/co.png')} style={styles.coin} />
          <Text style={styles.price}>{(user.coin || 0).toFixed(2)}</Text>
        </View>
        <Text style={styles.title}>{t('Pull')}</Text>
        <View style={styles.center}>
          <View style={styles.row}>
            <Image source={require('../../assets/dol.png')} style={styles.coin} />
            <Text style={styles.price}>{(user.balance || 0).toFixed(2)}</Text>
          </View>
        </View>
      </View>
      <View
        style={{
          width: sizes.width / 1.1,
          alignSelf: 'center',
          zIndex: 99,
        }}
      >
        <TouchableOpacity onPress={onConvertBalancePress}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            colors={['#F9B092', '#D5D399', '#0AAFF6']}
            style={styles.reloadButton}
          >
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              colors={['#2A2A2A', '#000000', '#383838']}
              style={styles.reloadButtonIn}
            >
              <Image
                resizeMode="contain"
                source={require('../../assets/linr.png')}
                style={styles.reloadIcon}
              />
              <Text style={styles.reloadButtonText}>{t('ConvertToBablCoin')}</Text>
            </LinearGradient>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <Image source={require('../../assets/neon2.png')} style={styles.neon} />
      <View style={styles.itemContainer}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          colors={['#2A2A2A', '#000000', '#383838']}
          style={[styles.linearGradient]}
        >
          <View style={styles.row}>
            <Image style={styles.gifted} source={require('../../assets/gifted.png')} />
          </View>
          <View
            style={[
              styles.row,
              {
                marginTop: 20,
              },
            ]}
          >
            <Text style={styles.text}>{t('ConvertibleCoin')}</Text>
            <Text
              style={[
                styles.text,
                {
                  marginLeft: 3,
                  marginRight: 3,
                },
              ]}
            >
              =
            </Text>
            <TextGradient
              style={{ fontFamily: fonts.roboto, fontSize: 13 }}
              locations={[0, 1]}
              colors={['#F9B092', '#D5D399', '#0AAFF6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              text={`${user.coin * 0.7}$`}
            />
          </View>

          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            colors={['#2A2A2A', '#000000', '#383838']}
            style={styles.inputContainer}
          >
            <TextInput
              placeholder={t('Amount')}
              style={styles.miniInput}
              placeholderTextColor="#484848"
              value={coinConvert}
              onChangeText={(text) => {
                if ((Number.isSafeInteger(+text) && +text > 0) || text === '') {
                  setCoinConvert(text);
                }
              }}
              keyboardType="number-pad"
            />
          </LinearGradient>
          <TouchableOpacity onPress={onConvertCoinPress}>
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              colors={['#F9B092', '#D5D399', '#0AAFF6']}
              style={styles.buttonLinear}
            >
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                colors={['#2A2A2A', '#000000', '#383838']}
                style={styles.button}
              >
                <Text style={styles.buttonText}>{t('Convert')}</Text>
              </LinearGradient>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>

        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          colors={['#2A2A2A', '#000000', '#383838']}
          style={[styles.linearGradient]}
        >
          <View style={styles.row}>
            <Image style={styles.gifted} source={require('../../assets/gifted.png')} />
          </View>
          <View
            style={[
              styles.row,
              {
                marginTop: 20,
              },
            ]}
          >
            <Text style={styles.text}>{t('ConvertibleGift')}</Text>
            <Text
              style={[
                styles.text,
                {
                  marginLeft: 3,
                  marginRight: 3,
                },
              ]}
            >
              =
            </Text>
            <TextGradient
              style={{ fontFamily: fonts.roboto, fontSize: 13 }}
              locations={[0, 1]}
              colors={['#F9B092', '#D5D399', '#0AAFF6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              text={`${parseFloat(giftCoinAmount).toFixed(2)}$`}
            />
          </View>

          <View style={styles.inputContainer} />
          <TouchableOpacity onPress={onConvertGiftPress}>
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              colors={['#F9B092', '#D5D399', '#0AAFF6']}
              style={styles.buttonLinear}
            >
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                colors={['#2A2A2A', '#000000', '#383838']}
                style={styles.button}
              >
                <Text style={styles.buttonText}>{t('Convert')}</Text>
              </LinearGradient>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </View>
      <TextInput
        placeholder={t('AmountOfMoney')}
        placeholderTextColor="#C3C3C3"
        style={styles.input}
        onFocus={onFocus}
        onBlur={onBlur}
        value={amount}
        onChangeText={(text) => {
          if ((Number.isSafeInteger(+text) && +text > 0) || text === '') {
            setAmount(text);
          }
        }}
        keyboardType="number-pad"
      />
      <MaskInput
        placeholder="IBAN"
        placeholderTextColor="#C3C3C3"
        style={styles.input}
        onFocus={onFocus}
        onBlur={onBlur}
        value={iban}
        onChangeText={setIban}
        mask={[
          'T',
          'R',
          /\d/,
          /\d/,
          ' ',
          /\d/,
          /\d/,
          /\d/,
          /\d/,
          ' ',
          /\d/,
          /\d/,
          /\d/,
          /\d/,
          ' ',
          /\d/,
          /\d/,
          /\d/,
          /\d/,
          ' ',
          /\d/,
          /\d/,
          /\d/,
          /\d/,
          ' ',
          /\d/,
          /\d/,
          /\d/,
          /\d/,
          ' ',
          /\d/,
          /\d/,
        ]}
      />
      <View style={styles.top} />
      <ButtonLinear title={t('WithDraw')} onPress={onWithdrawPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  coin: {
    width: 20,
    height: 20,
  },
  title: {
    color: '#FFF',
    fontFamily: fonts.roboto,
    fontSize: 21,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 20,
    fontFamily: fonts.roboto,
    fontWeight: '600',
    color: '#FFF',
    marginLeft: 3,
  },
  between: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    width: sizes.width / 1.1,
    alignSelf: 'center',
    marginTop: 30,
  },
  linearGradient: {
    width: sizes.width / 2.2,
    height: 231,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  giftedPrice: {
    color: '#FFF',
    fontSize: 39,
    fontFamily: fonts.roboto,
    height: 42,
  },
  gifted: {
    width: 42,
    height: 42,
  },
  text: {
    fontSize: 13,
    color: '#FFF',
    fontFamily: fonts.roboto,
  },
  inputContainer: {
    width: sizes.width / 2.5,
    borderRadius: 7,
    height: 30,
    marginTop: 20,
    justifyContent: 'center',
    padding: 5,
  },
  miniInput: {
    width: sizes.width / 2.5,
    color: '#FFF',
    fontFamily: fonts.roboto,
  },
  buttonLinear: {
    width: 134,
    borderRadius: 18,
    height: 31,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  button: {
    width: 132,
    borderRadius: 18,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontFamily: fonts.roboto,
  },
  input: {
    width: sizes.width / 1.1,
    alignSelf: 'center',
    height: 55,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#393939',
    color: '#FFF',
    padding: 10,
    marginTop: 20,
    fontFamily: fonts.regular,
  },
  top: {
    marginTop: 40,
  },
  center: {
    alignItems: 'center',
  },
  reloadButton: {
    width: 124,
    borderRadius: 18,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  reloadButtonText: {
    color: '#FFF',
    fontFamily: fonts.roboto,
    fontSize: 11,
  },
  reloadButtonIn: {
    width: 122,
    borderRadius: 18,
    height: 25,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  neon: {
    position: 'absolute',

    width: sizes.width,
    height: 503,
  },
  reloadIcon: {
    width: 13,
    height: 13,
    marginRight: 5,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 30,
    width: sizes.width / 1.07,
    alignSelf: 'center',
  },
});

export default Pull;

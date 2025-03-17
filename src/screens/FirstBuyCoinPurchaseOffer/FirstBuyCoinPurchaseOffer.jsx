import React from 'react';
import {
  View, Text, Image, StyleSheet, TouchableOpacity, ScrollView,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import TextGradient from '../../components/TextGradient';
import { sizes } from '../../theme';
import fonts from '../../theme/fonts';

const FirstBuyCoinPurchaseOffer = () => {
  const [number, setNumber] = React.useState('3303');
  const [price, setPrice] = React.useState('₺1.499,99');
  const data = [
    {
      number: '2503',
      price: '₺1.499,99',
    },
    {
      number: '3303',
      price: '₺1.499,99',
    },
    {
      number: '2503',
      price: '₺1.499,99',
    },
    {
      number: '1400',
      price: '₺499,99',
    },
    {
      number: '3303',
      price: '₺1.499,99',
    },
  ];
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/closes.png')} style={styles.closes} />
      <Text style={styles.title}>Buy Coin purchase offer</Text>
      <View style={styles.borderBottom} />

      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.unlock}>Unlock animated Gift</Text>
          <Text style={styles.description}>
            Send this exlusive Gift for only 1 Coin. You can send it 3 times in 24 hours.
          </Text>
        </View>
        <Image style={styles.giff} source={require('../../assets/gifted.png')} />
      </View>
      <View style={styles.borderBottom} />
      <View style={styles.bottomDescriptionContainer}>
        <Image
          source={require('../../assets/sendbabl.png')}
          style={styles.bablCoin}
          resizeMode="contain"
        />
        <View style={styles.left}>
          <TextGradient
            style={{ fontFamily: fonts.roboto, fontSize: 18 }}
            locations={[0, 1]}
            colors={['#F9B092', '#D5D399', '#0AAFF6', '#0AAFF6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            text="Get Bonus Coins"
          />
          <Text style={styles.useCoins}>Use Coins on virtual items such as Gifts</Text>
        </View>
      </View>
      <View style={styles.borderBottom} />
      <View style={styles.twoTextContainer}>
        <Text style={styles.titleTwo}>Select recharge amount</Text>
        <Text style={styles.descriptionTwo}>Select recharge amount</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.contentContainerStyle}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {data.map((item, index) => {
          return (
            <TouchableOpacity
              onPress={() => {
                setNumber(item.number);
                setPrice(item.price);
              }}
              style={styles.item}
            >
              <Image
                source={require('../../assets/sendbabl.png')}
                style={styles.bablCoin}
                resizeMode="contain"
              />

              <View style={styles.left}>
                <Text style={styles.number}>{item.number}</Text>
                <Text style={styles.price}>{item.price}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <ScrollView
        contentContainerStyle={styles.contentContainerStyle}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {data.map((item, index) => {
          return (
            <TouchableOpacity
              onPress={() => {
                setNumber(item.number);
                setPrice(item.price);
              }}
              style={styles.item}
            >
              <Image
                source={require('../../assets/sendbabl.png')}
                style={styles.bablCoin}
                resizeMode="contain"
              />

              <View style={styles.left}>
                <Text style={styles.number}>{item.number}</Text>
                <Text style={styles.price}>{item.price}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <Text style={styles.kvkkDescription}>
        By continuing you agree to the
        <Text style={styles.kvkk}> Virtual Items Policy</Text>
      </Text>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        colors={['#FF5406', '#D5D399', '#0AAFF6']}
        style={[styles.linearGradient]}
      >
        <TouchableOpacity style={[styles.button]}>
          <Text style={styles.btnText}>Get </Text>
          <Image
            source={require('../../assets/sendbabl.png')}
            style={styles.buttonCoin}
            resizeMode="contain"
          />
          <Text style={styles.btnText}>
            {' '}
            {number}
          </Text>
          <Text style={styles.btnText}>
            {' '}
            (
            {price}
            )
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    color: '#FFF',
    fontFamily: fonts.roboto,
    fontSize: 28,
    width: sizes.width / 2,
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
  unlock: {
    color: '#FFF',
    fontFamily: fonts.roboto,
    fontSize: 18,
  },
  description: {
    color: '#FFF',
    fontFamily: 'Roboto-Light',
    marginTop: 5,
    fontSize: 14,
    width: sizes.width / 1.6,
  },
  headerContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    width: sizes.width / 1.1,
    justifyContent: 'space-around',
    marginTop: 30,
  },
  giff: {
    width: 55,
    height: 55,
  },
  center: {
    alignItems: 'center',
  },
  useCoins: {
    fontSize: 14,
    fontFamily: 'Roboto-Light',
    color: '#FFF',
    width: sizes.width / 2.2,
    marginTop: 5,
  },
  bottomDescriptionContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    width: sizes.width / 1.1,
    marginTop: 30,
  },
  left: {
    marginLeft: 10,
  },
  bablCoin: {
    width: 60,
    height: 60,
  },
  twoTextContainer: {
    width: sizes.width / 1.1,
    alignSelf: 'center',
  },
  titleTwo: {
    color: '#FFF',
    fontFamily: fonts.roboto,
    fontSize: 20,
    marginTop: 20,
  },
  descriptionTwo: {
    color: '#FFF',
    fontFamily: 'Roboto-Light',
    fontSize: 14,
    marginTop: 5,
  },
  item: {
    backgroundColor: '#242427',
    borderWidth: 1,
    borderColor: '#555456',
    borderRadius: 17,
    width: sizes.width / 2.2,
    flexDirection: 'row',
    alignItems: 'center',
    height: 90,
    padding: 7,
    margin: 10,
    marginTop: 15,
  },
  left: {
    marginLeft: 5,
  },
  number: {
    color: '#FFF',
    fontFamily: fonts.roboto,
    fontSize: 28,
  },
  price: {
    color: '#929394',
    fontFamily: 'Roboto-Ligt',
    fontSize: 14,
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
});

export default FirstBuyCoinPurchaseOffer;

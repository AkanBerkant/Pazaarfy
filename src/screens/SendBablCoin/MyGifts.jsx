import React from 'react';
import {
  FlatList, Image, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { BlurView } from 'expo-blur';
import Lottie from 'lottie-react-native';
import { useTranslation } from 'react-i18next';

import { Container } from '../../components';
import routes from '../../constants/routes';
import { sizes } from '../../theme';
import fonts from '../../theme/fonts';
import { getGiftsData } from '../../utils/gifts';
import * as Queries from '../../utils/queries';

const MyGifts = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { t } = useTranslation();
  const giftsData = getGiftsData(t);

  const myGiftsQuery = useQuery(['MY_GIFTSS'], Queries.myGifts, {
    placeholderData: [],
  });

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => {
        navigation.navigate(routes.GiffBoost, {
          item,
          targetUser: route.params?.targetUser,
          buy: false,
          bablId: route.params?.bablId,
          ownedGift: true,
        });
      }}
      >
        <BlurView style={styles.giftContainer}>
          {item.text == 'Diamond' || item.text == 'Elmas' ? (
            <Lottie autoPlay style={styles.image} source={require('../../assets/diamond.json')} />
          ) : (
            <Image source={item.image} style={styles.image} />
          )}
          <View style={styles.between}>
            <Text style={styles.text}>{item.text}</Text>
          </View>
        </BlurView>
      </TouchableOpacity>
    );
  };

  const myGiftTypes = myGiftsQuery.data.map((item) => {
    return item.giftType;
  });

  return (
    <Container>
      {myGiftsQuery.isSuccess && !myGiftsQuery.data.length ? (
        <>
          <View style={styles.center} />
          <Image
            source={require('../../assets/defaultgiff.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </>
      ) : (
        <FlatList
          data={giftsData.filter((item) => {
            return myGiftTypes.includes(item.type);
          })}
          contentContainerStyle={styles.contentContainerStyle}
          renderItem={renderItem}
          numColumns={3}
          showsVerticalScrollIndicator={false}
        />
      )}
    </Container>
  );
};

export default MyGifts;

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    overflow: 'hidden',
  },
  giftContainer: {
    width: sizes.width / 3.3,
    height: sizes.width / 3.3,
    overflow: 'hidden',

    borderRadius: 10,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#FFF',
    fontFamily: fonts.roboto,
    fontSize: 10,

    marginTop: 10,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginRight: 3,
  },

  contentContainerStyle: {
    alignItems: 'center',
    marginTop: 10,
  },
});

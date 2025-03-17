import React from 'react';
import {
  FlatList, Image, StyleSheet, TouchableOpacity, View, Text,
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { BlurView } from 'expo-blur';
import Lottie from 'lottie-react-native';
import { useTranslation } from 'react-i18next';

import routes from '../../constants/routes';
import { sizes } from '../../theme';
import fonts from '../../theme/fonts';
import { getGiftsData } from '../../utils/gifts';

const Gifts = ({ buy }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { t } = useTranslation();

  const data = getGiftsData(t);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(routes.GiffBoost, {
            item,
            targetUser: route.params.targetUser,
            bablId: route.params.bablId,
            buy,
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
            <View style={styles.row}>
              <Text style={styles.number}>{item.number}</Text>
              <Image style={styles.coin} source={require('../../assets/sendbabl.png')} />
            </View>
          </View>
        </BlurView>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        contentContainerStyle={styles.contentContainerStyle}
        renderItem={renderItem}
        numColumns={3}
        showsVerticalScrollIndicator={false}
      />
      <View
        style={{
          marginBottom: 30,
        }}
      />
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
    borderRadius: 10,
    margin: 5,
    borderRadius: 10,
    overflow: 'hidden',
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
  contentContainerStyle: {
    alignItems: 'center',
    marginTop: 10,
  },
});

import React from 'react';
import {
  FlatList, Image, StyleSheet, TouchableOpacity, View, Text,
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';

import routes from '../../constants/routes';
import { sizes } from '../../theme';
import fonts from '../../theme/fonts';
import { getGiftsData } from '../../utils/gifts';
import * as Queries from '../../utils/queries';

const MyGifts = ({ buy }) => {
  const route = useRoute();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const giftsData = getGiftsData(t);

  const myGiftsQuery = useQuery(['MY_GIFTSS'], Queries.myGifts, {
    placeholderData: [],
  });
  const myGiftTypes = myGiftsQuery.data.map((item) => {
    return item.giftType;
  });

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(routes.GiffBoost, {
            item,
            targetUser: route.params.targetUser,
            buy,
            ownedGift: true,
          });
        }}
      >
        <BlurView style={styles.giftContainer}>
          <Image source={item.image} style={styles.image} />
          <View style={styles.between}>
            <Text style={styles.text}>{item.text}</Text>
          </View>
        </BlurView>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={giftsData.filter((item) => {
          return myGiftTypes.includes(item.type);
        })}
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

export default MyGifts;

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

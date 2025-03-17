import React from 'react';
import {
  FlatList, Image, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';

import { useNavigation, useRoute, StackActions } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { t } from 'i18next';

import { BackHeader, Container } from '../../components';
import routes from '../../constants/routes';
import { sizes } from '../../theme';
import fonts from '../../theme/fonts';
import * as Queries from '../../utils/queries';

const BablFollowers = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const getBablFollowersQuery = useQuery(
    ['BABL_FOLLOWERS', route.params.bablId],
    () => {
      return Queries.getBablFollowers(route.params.bablId);
    },
    {
      placeholderData: [],
    },
  );

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          navigation.dispatch(
            StackActions.push(routes.UserProfile, {
              userId: item.follower._id,
            }),
          );
        }}
      >
        <View style={styles.row}>
          {item.follower.photo ? (
            <Image source={{ uri: item.follower.photo }} style={styles.pp} />
          ) : (
            <Image source={require('../../assets/person.png')} style={styles.person} />
          )}

          <Text style={styles.name}>{item.follower.username}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Container header={<BackHeader title={t('BablFollowers')} />}>
      <FlatList
        data={getBablFollowersQuery.data}
        renderItem={renderItem}
        keyExtractor={(item) => {
          return item._id;
        }}
        style={styles.flatlist}
      />
    </Container>
  );
};

export default BablFollowers;

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    width: sizes.width / 1.03,
    justifyContent: 'space-between',
    alignSelf: 'center',
    margin: 5,
  },
  pp: {
    width: 57,
    height: 57,
    borderRadius: 57,
    backgroundColor: '#CDCDCD',
  },
  name: {
    fontSize: 18,
    color: '#FFF',
    marginLeft: 10,
    fontFamily: fonts.avenir,
  },
  button: {
    backgroundColor: '#181818',
    borderRadius: 14,
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    height: 27,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flatlist: {
    marginTop: 20,
  },
  person: {
    tintColor: '#606060',
    width: 57,
    height: 57,
    borderRadius: 57,
  },
});

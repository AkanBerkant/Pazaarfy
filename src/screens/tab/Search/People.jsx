import React from 'react';
import {
  View, Text, StyleSheet, Image, FlatList, TouchableOpacity,
} from 'react-native';

import { useNavigation, StackActions } from '@react-navigation/native';

import routes from '../../../constants/routes';
import { sizes } from '../../../theme';
import fonts from '../../../theme/fonts';

const People = ({ data }) => {
  const navigation = useNavigation();

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          navigation.dispatch(
            StackActions.push(routes.UserProfile, {
              userId: item._id,
            }),
          );
        }}
      >
        <Image source={{ uri: item.photo }} style={styles.pp} />
        <View style={styles.left}>
          <Text style={styles.username}>{item.username}</Text>
          {item.firstname ? <Text style={styles.name}>{item.firstname}</Text> : null}
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <FlatList data={data} renderItem={renderItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    width: sizes.width / 1.1,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
    padding: 5,
  },
  pp: {
    width: 35,
    height: 35,
    borderRadius: 35,
  },
  username: {
    fontFamily: fonts.roboto,
    color: '#FFF',
  },
  name: {
    fontFamily: fonts.regular,
    color: '#BBBBBB',
  },
  left: {
    marginLeft: 10,
  },
});

export default People;

import React from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
} from 'react-native';

import { sizes } from '../../../theme';
import fonts from '../../../theme/fonts';

const Hastag = ({ data, setCustomFilter, setSearchTerm }) => {
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          setCustomFilter('babls');
          setSearchTerm(item.title);
        }}
      >
        <View style={styles.borderLine}>
          <Text style={styles.ticket}>#</Text>
        </View>
        <View style={styles.left}>
          <Text style={styles.hastag}>{item.title}</Text>
          <Text style={styles.total}>{item.usedCount}</Text>
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
  borderLine: {
    borderWidth: 1,
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#FFF',
    borderRadius: 35,
  },
  ticket: {
    fontSize: 22,
    color: '#FFF',
    fontFamily: fonts.roboto,
  },
  hastag: {
    marginLeft: 10,
    color: '#FFF',
    fontFamily: fonts.roboto,
  },
  total: {
    color: '#BBBBBB',
    fontFamily: fonts.regular,
    marginLeft: 10,
  },
});

export default Hastag;

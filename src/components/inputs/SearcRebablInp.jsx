import React from 'react';
import {
  Image, StyleSheet, TextInput, View,
} from 'react-native';

import { sizes } from '../../theme';
import fonts from '../../theme/fonts';

const SearcRebablInp = ({ value, onChangeText }) => {
  return (
    <View style={styles.inputArea}>
      <View style={styles.row}>
        <Image
          source={require('../../assets/search.png')}
          style={styles.search}
        />
        <TextInput style={styles.input} placeholder="Search" value={value} onChangeText={onChangeText} />
      </View>
      {/* <Image
        source={require('../../assets/searchPeople.png')}
        style={styles.icon}
      /> */}
    </View>
  );
};

export default SearcRebablInp;

const styles = StyleSheet.create({
  inputArea: {
    backgroundColor: '#151515',
    borderRadius: 26.5,
    width: sizes.width / 1.06,
    alignSelf: 'center',
    marginTop: 35,
    height: 53,
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    marginLeft: 5,
    color: '#A5A5A5',
    fontFamily: fonts.roboto,
    width: sizes.width / 1.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  search: {
    width: 23,
    height: 23,
    tintColor: '#A5A5A5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  icon: {
    width: 37,
    height: 37,
  },
});

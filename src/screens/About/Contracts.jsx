import React from 'react';
import {
  Image, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';

import WebView from 'react-native-webview';

import { Container } from '../../components';
import { sizes } from '../../theme';
import fonts from '../../theme/fonts';

const Contracts = ({ navigation, route }) => {
  const { title } = route.params || {};

  return (
    <Container scrollview={false}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.row}
        >
          <Image
            source={require('../../assets/contHeader.png')}
            style={styles.icon}
          />
          <Text
            style={{
              color: '#000',
            }}
          >
            asdadss
          </Text>
        </TouchableOpacity>

        <Text style={styles.title}>{title}</Text>
        <View style={styles.row}>
          <Text
            style={{
              color: '#000',
            }}
          >
            asdadss
          </Text>
          <View
            source={require('../../assets/contHeader.png')}
            style={styles.icon}
          />
        </View>
      </View>

      <WebView style={{ flex: 1 }} source={{ uri: 'https://bablworld.com/privacy' }} />
    </Container>
  );
};

export default Contracts;

const styles = StyleSheet.create({
  arrowR: {
    width: 10,
    height: 16,
    tintColor: '#FFF',
  },
  items: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: sizes.width / 1.07,
    height: 67,
    alignSelf: 'center',
    padding: 10,
    borderRadius: 14,
    backgroundColor: '#101010',
    marginTop: 10,
  },
  label: {
    fontFamily: fonts.roboto,
    color: '#FFF',
  },
  top: {
    marginTop: 20,
  },
  header: {
    width: sizes.width / 1.1,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  icon: {
    width: 48,
    height: 48,
  },
  title: {
    color: '#FFF',
    fontFamily: fonts.roboto,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contracts: {
    color: '#7B7B7B',
    fontFamily: fonts.regular,
    fontSize: 14,
    letterSpacing: 3,
    width: sizes.width / 1.1,
    alignSelf: 'center',
    marginTop: 20,
  },
});

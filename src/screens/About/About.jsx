import React from 'react';
import {
  FlatList, Image, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';

import { t } from 'i18next';

import { BackHeader } from '../../components';
import routes from '../../constants/routes';
import { sizes } from '../../theme';
import fonts from '../../theme/fonts';

const About = ({ navigation }) => {
  const sections = [
    {
      label: t('PrivacyPolicy'),
      onPress: () => {
        navigation.navigate(routes.Contracts, {
          title: t('PrivacyPolicy'),
        });
      },
    },
    {
      label: t('TermsOfUse'),
      onPress: () => {
        navigation.navigate(routes.Contracts, {
          title: t('TermsOfUse'),
        });
      },
    },
  ];

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={item.onPress} style={styles.items}>
        <Text style={styles.label}>{item.label}</Text>
        <Image source={require('../../assets/arrowr.png')} style={styles.arrowR} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <BackHeader title={t('About')} />
      <View style={styles.top} />
      <FlatList data={sections} renderItem={renderItem} />
    </View>
  );
};

export default About;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
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
});

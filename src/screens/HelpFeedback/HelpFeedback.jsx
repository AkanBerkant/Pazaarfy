import React from 'react';
import {
  View, Text, StyleSheet, FlatList, Image, TouchableOpacity,
} from 'react-native';

import { useTranslation } from 'react-i18next';

import { BackHeader } from '../../components';
import routes from '../../constants/routes';
import { sizes } from '../../theme';
import fonts from '../../theme/fonts';

const HelpFeedback = ({ navigation }) => {
  const { t } = useTranslation();
  const menu = [
    {
      label: t('feedback'),
      onPress: () => {
        navigation.navigate(routes.Feedback);
      },
    },
    {
      label: t('help'),
      onPress: () => {
        navigation.navigate(routes.Faq);
      },
    },
  ];

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={item.onPress} style={styles.between}>
        <Text style={styles.text}>{item.label}</Text>
        <Image source={require('../../assets/right.png')} style={styles.right} />
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <BackHeader title={t('help')} />

      <FlatList data={menu} renderItem={renderItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#000',
  },
  text: {
    fontFamily: fonts.roboto,
    color: '#FFF',
  },
  between: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: sizes.width / 1.07,
    height: 67,
    alignSelf: 'center',
    padding: 10,
    borderRadius: 14,
    backgroundColor: '#101010',
    marginTop: 7,
  },
  right: {
    width: 10,
    height: 16,
    tintColor: '#FFF',
  },
});

export default HelpFeedback;

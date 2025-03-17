import React from 'react';
import {
  FlatList, Image, StyleSheet, Text, View,
} from 'react-native';

import { BackHeader, Container } from '../../../components';
import routes from '../../../constants/routes';
import { sizes } from '../../../theme';
import fonts from '../../../theme/fonts';

const YourActivity = ({ navigation }) => {
  const sections = [
    {
      label: 'Ekran Süresi',
      onPress: () => {
        navigation.navigate(routes.ProfilSettingsMenu);
      },
    },

    {
      label: 'Zaman Sınırı',
    },
    {
      label: 'Günlük Geçirilen Zaman',
    },
    {
      label: 'Son Etkileşimler',
    },
    {
      label: 'İzleme Geçmişi',
    },
  ];

  const renderItem = ({ item }) => {
    return (
      <View style={styles.items}>
        <Text style={styles.label}>{item.label}</Text>
        <Image
          source={require('../../../assets/arrowr.png')}
          style={styles.arrowR}
        />
      </View>
    );
  };

  return (
    <Container header={<BackHeader title="Aktiviten" />}>
      <View style={styles.top} />
      <FlatList data={sections} renderItem={renderItem} />
    </Container>
  );
};

export default YourActivity;

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
    fontFamily: fonts.regular,
    color: '#FFF',
  },
  top: {
    marginTop: 20,
  },
});

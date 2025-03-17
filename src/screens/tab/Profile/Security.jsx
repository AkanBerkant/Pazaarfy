import React from 'react';
import {
  FlatList, Image, StyleSheet, Text, View,
} from 'react-native';

import { BackHeader, Container } from '../../../components';
import routes from '../../../constants/routes';
import { sizes } from '../../../theme';
import fonts from '../../../theme/fonts';

const Security = ({ navigation }) => {
  const sections = [
    {
      label: 'Güvenlik Uyarıları',
      onPress: () => {
        navigation.navigate(routes.ProfilSettingsMenu);
      },
    },
    {
      label: 'Giriş Geçmişi',
    },
    {
      label: 'Cihazları Yönet',
    },
    {
      label: 'İkili Doğrulama',
    },
    {
      label: 'Uygulama İzinlerini Yönetin',
    },
    {
      label: 'Kısıtlanmış İçerikler',
    },
    {
      label: 'Kısıtlanmış İçerikler',
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
    <Container header={<BackHeader title="Gizlilik" />}>
      <View style={styles.top} />
      <FlatList data={sections} renderItem={renderItem} />
    </Container>
  );
};

export default Security;

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

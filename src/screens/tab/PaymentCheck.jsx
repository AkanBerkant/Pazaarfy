import React from 'react';
import {
  Image, StyleSheet, Text, View,
} from 'react-native';

import { useTranslation } from 'react-i18next';

import {
  BackHeader, ButtonLinear, Container, Input,
} from '../../components';

const PaymentCheck = ({ navigation }) => {
  const { t } = useTranslation();

  return (
    <Container header={<BackHeader title="Ayarlar" />}>
      <View style={styles.center}>
        <Image source={require('../../assets/bob.png')} style={styles.babl} />
        <Text style={styles.text}>Çekmek istediğiniz Miktar</Text>
        <View style={styles.top} />
        <Input placeholder="0,00" />
      </View>

      <View style={styles.top} />
      <ButtonLinear title="Çekim Yap" />
    </Container>
  );
};

export default PaymentCheck;

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    marginTop: 50,
  },
  babl: {
    width: 80.64,
    height: 80.64,
  },
  text: {
    fontSize: 18,
    color: '#000000',
    fontWeight: '500',
    marginTop: 7,
  },
  top: {
    marginTop: 30,
  },
});

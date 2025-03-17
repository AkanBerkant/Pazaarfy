import React from 'react';
import {
  Image, StyleSheet, View,
} from 'react-native';

import {
  BackHeader,
  ButtonLinear,
  Container,
  PasswordInput,
} from '../../../components';
import { sizes } from '../../../theme';

const Account = () => {
  return (
    <Container header={<BackHeader title="Şifre" />}>
      <Image source={require('../../../assets/logo.png')} style={styles.logo} />
      <View style={styles.top} />
      <PasswordInput placeholder="Yeni Şifre" />
      <PasswordInput placeholder="Yeni Şifre Tekrar" />
      <View style={styles.button} />
      <ButtonLinear style={styles.button} title="Yeni Şifre Oluştur" />
    </Container>
  );
};

export default Account;

const styles = StyleSheet.create({
  top: {
    marginTop: 75,
  },
  logo: {
    width: sizes.width / 2,
    height: 59,
    alignSelf: 'center',
    marginTop: sizes.width / 3,
  },
  button: {
    marginTop: sizes.width / 1.9,
  },
});

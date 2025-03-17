import React from 'react';
import {
  Text, StyleSheet, Image, ImageBackground, TouchableOpacity,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { t } from 'i18next';

import routes from '../../../constants/routes';
import { sizes } from '../../../theme';
import fonts from '../../../theme/fonts';

const DeleteAccountResponse = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground source={require('../../../assets/deletebge.png')} style={styles.container}>
      <Image
        source={require('../../../assets/delkg.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.text}>{t('Sorry')}</Text>
      <Text style={styles.desription}>{t('YourAccountHasBeenSuccessfullyDeleted')}</Text>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate(routes.Login);
        }}
      >
        <ImageBackground source={require('../../../assets/linek.png')} style={styles.linek}>
          <Text style={styles.buttonText}>{t('CreateNewAccount')}</Text>
        </ImageBackground>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    height: sizes.height * 1.1,
    width: sizes.width,
    backgroundColor: '#000',
  },
  logo: {
    marginTop: sizes.width,
    width: sizes.width / 2,
    height: 59,
    alignSelf: 'center',
  },
  text: {
    color: '#FFF',
    fontFamily: fonts.roboto,
    fontSize: 24,
    textAlign: 'center',
  },
  desription: {
    fontSize: 16,
    color: '#7A7A7A',
    textAlign: 'center',
    marginTop: 5,
  },
  linek: {
    height: 62,
    borderRadius: 12,
    width: sizes.width / 1.1,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: sizes.width / 2,
  },
  buttonText: {
    color: '#FFF',
    fontFamily: fonts.roboto,
    textAlign: 'center',
  },
});

export default DeleteAccountResponse;

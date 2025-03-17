import React from 'react';
import {
  View, Text, Image, StyleSheet,
} from 'react-native';

import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Notifier } from 'react-native-notifier';

import { BackHeader, ButtonLinear, PasswordInput } from '../../components';
import routes from '../../constants/routes';
import { sizes } from '../../theme';
import fonts from '../../theme/fonts';
import * as Queries from '../../utils/queries';

const EnterYourNewPassword = ({ navigation, route }) => {
  const [password, setPassword] = React.useState('');
  const [password2, setPassword2] = React.useState('');
  const { t } = useTranslation();

  const resetPasswordMutation = useMutation(Queries.resetPassword, {
    onSuccess: () => {
      Notifier.showNotification({
        title: t('YourPasswordHasBeenReset'),
      });
      navigation.navigate(routes.CongratulationsPassword);
    },
    onError: (err) => {
      if (err.response.data.message === 'OTP_IS_NOT_EXISTS') {
        return Notifier.showNotification({
          title: t('VerificationCodeNotFound'),
        });
      }
      if (err.response.data.message === 'OTP_IS_NOT_CORRECT') {
        return Notifier.showNotification({
          title: t('VerificationCodeIsIncorrect'),
        });
      }

      Notifier.showNotification({
        title: t('AnErrorPassword'),
      });
    },
  });

  return (
    <View style={styles.container}>
      <BackHeader title={t('changePassword')} shadow={0} />
      <Image source={require('../../assets/key.png')} style={styles.key} />
      <Text style={styles.text}>{t('EnterYourNewPassword')}</Text>
      <View
        style={{
          marginTop: 30,
        }}
      />
      <PasswordInput
        placeholder={t('YourNewPassword')}
        forgotIcon
        value={password}
        onChangeText={setPassword}
      />
      <PasswordInput
        placeholder={t('YourNewPasswordAgain')}
        forgotIcon
        value={password2}
        onChangeText={setPassword2}
      />
      <View style={{ marginTop: sizes.width / 2 }} />
      <ButtonLinear
        onPress={() => {
          if (password !== password2) {
            return Notifier.showNotification({
              title: t('PasswordRepeat'),
            });
          }

          resetPasswordMutation.mutate({
            email: route.params.email,
            otpCode: route.params.otpCode,
            password,
          });
        }}
        title={t('UpdateMyNewPassword')}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  key: {
    width: 70,
    height: 70,
    alignSelf: 'center',
    marginTop: sizes.width / 3,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: fonts.regular,
    width: sizes.width / 3,
    alignSelf: 'center',
    marginTop: 10,
    textAlign: 'center',
    marginTop: 30,
  },
  mailInput: {
    borderWidth: 1,
    borderColor: '#C3C3C3',
    width: sizes.width / 1.07,
    alignSelf: 'center',
    marginTop: 30,
    height: 55,
    borderRadius: 12,
    padding: 10,
    fontFamily: fonts.regular,
  },
});

export default EnterYourNewPassword;

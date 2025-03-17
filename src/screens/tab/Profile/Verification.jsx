import React from 'react';
import {
  Image, StyleSheet, Text, View, KeyboardAvoidingView, Platform,
} from 'react-native';

import { useMutation } from '@tanstack/react-query';
import { t } from 'i18next';
import { useAtomValue } from 'jotai';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Notifier } from 'react-native-notifier';

import {
  BackHeader, ButtonLinear, Container, Input,
} from '../../../components';
import routes from '../../../constants/routes';
import { sizes } from '../../../theme';
import fonts from '../../../theme/fonts';
import { userAtom } from '../../../utils/atoms';
import * as Queries from '../../../utils/queries';

const Verification = ({ navigation }) => {
  const user = useAtomValue(userAtom);

  const sendOtpMutation = useMutation(Queries.sendOtp, {
    onSuccess: () => {
      navigation.navigate(routes.Code, { email: user.email });
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
        title: t('AnUnexpectedErrorOccurred'),
      });
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <BackHeader title={t('Verification')} shadow={0} />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContainer}
        enableOnAndroid
        extraScrollHeight={100}
      >
        <Image
          source={require('../../../assets/mailed.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.text}>{t('VerificationSystem')}</Text>
        <View style={styles.top} />
        {/* <Input title={'Telefon Numaranı Gir'} placeholder={'Telefon Numaran'} /> */}
        <View style={styles.inputTop} />
        <Input placeholder={t('Email')} editable={false} value={user.email} />
        <View style={styles.button} />
        <ButtonLinear
          style={styles.button}
          onPress={() => {
            sendOtpMutation.mutate({ email: user.email, type: 'VERIFICATION' });
          }}
          title={t('SendVerificationCode')}
        />
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

export default Verification;

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
    marginTop: sizes.width / 1.7,
  },
  inputTop: {
    marginTop: 35,
  },
  text: {
    color: '#FFF',
    textAlign: 'center',
    marginTop: 12,
    width: sizes.width / 4,
    alignSelf: 'center',
    fontFamily: fonts.regular,
  },
});

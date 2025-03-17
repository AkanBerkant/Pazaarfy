import React from 'react';
import {
  View, TextInput, StyleSheet, Keyboard,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { BackHeader, ButtonLinear, Input } from '../../components';
import { notify } from '../../helpers/notify';
import { sizes } from '../../theme';
import fonts from '../../theme/fonts';
import * as Queries from '../../utils/queries';

const Feedback = () => {
  const { t } = useTranslation();
  const [content, setContent] = React.useState('');
  const navigation = useNavigation();

  const sendFeedbackMutation = useMutation(Queries.sendFeedback, {
    onSuccess: () => {
      notify({
        title: t('feedbackSent'),
      });
      navigation.goBack();
    },
  });

  const handleSendPress = () => {
    Keyboard.dismiss(); // Klavyeyi kapatır
    // Buraya gönderme işlemi ile ilgili kodları ekleyebilirsiniz

    sendFeedbackMutation.mutate({
      content,
    });
  };

  const handleSubmitEditing = () => {
    Keyboard.dismiss(); // "Next" veya "Done" tuşuna basılınca klavyeyi kapatır

    sendFeedbackMutation.mutate({
      content,
    });
  };

  return (
    <View style={styles.container}>
      <BackHeader title={t('feedback')} />
      <TextInput
        style={styles.input}
        value={content}
        onChangeText={setContent}
        placeholder={t('pleasefeedback')}
        onSubmitEditing={handleSubmitEditing} // Bu satırı ekleyin
        returnKeyType="done" // Klavye üzerinde "Done" tuşunu gösterir
      />
      <View
        style={{
          marginTop: sizes.width / 3,
        }}
      />
      <View
        style={{
          position: 'absolute',
          zIndex: 99,
          bottom: 30,
          alignSelf: 'center',
        }}
      >
        <ButtonLinear title={t('Send')} onPress={handleSendPress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  text: {
    fontSize: 18,
    color: '#000',
  },
  input: {
    backgroundColor: '#000',
    width: sizes.width / 1.07,
    alignSelf: 'center',
    borderRadius: 18,
    margin: 5,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#272727',
    color: '#FFF',
    marginTop: 30,
    fontFamily: fonts.roboto,
  },
});

export default Feedback;

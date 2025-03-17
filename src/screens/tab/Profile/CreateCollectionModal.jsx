import React from 'react';
import {
  Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, Switch,
} from 'react-native';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BlurView } from 'expo-blur';
import { t } from 'i18next';
import LinearGradient from 'react-native-linear-gradient';

import { fonts } from '../../../constants/fonts';
import { notify } from '../../../helpers/notify';
import { sizes } from '../../../theme';
import * as Queries from '../../../utils/queries';

const CreateCollectionModal = ({ onClose }) => {
  const [title, setTitle] = React.useState('');
  const queryClient = useQueryClient();

  const createCollectionMutation = useMutation(Queries.createCollection, {
    onSuccess: (res) => {
      notify({
        title: t('Congratulations'),
      });
      queryClient.invalidateQueries(['COLLECTIONS']);
      onClose();
    },
    onError: (err) => {
      console.log('err', err);
    },
  });

  const [toggleValue, setToggleValue] = React.useState(false);
  return (
    <Modal visible style={{ flex: 1 }}>
      <BlurView style={styles.modal} tint="dark" intensity={4}>
        <View style={styles.content}>
          <TextInput
            placeholder={t('EnterCollectionName')}
            style={styles.input}
            value={title}
            onChangeText={setTitle}
          />

          <View style={styles.btnContainer}>
            <TouchableOpacity style={styles.btn} onPress={onClose}>
              <Text style={styles.btnText}>{t('Cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => {
                createCollectionMutation.mutate({
                  title,
                  isPrivate: !toggleValue,
                });
              }}
            >
              <LinearGradient
                style={styles.btn}
                start={{ x: 1.2, y: 0 }}
                end={{ x: 0, y: 1 }}
                colors={['#F9B092', '#D5D399', '#0AAFF6']}
              >
                <View style={styles.button}>
                  <Text style={[styles.btnText, styles.saveBtnText]}>{t('Save')}</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View style={styles.between}>
            <View>
              <Text style={styles.text}>{t('MakeItPublic')}</Text>
              <Text style={styles.description}>{t('CollectionsDesc')}</Text>
            </View>

            <Switch
              trackColor={{ false: '#D9D9D9', true: '#5B5B5B' }}
              thumbColor={toggleValue ? '#FFF' : '#5B5B5B'}
              onValueChange={() => {
                setToggleValue(!toggleValue);
              }}
              value={toggleValue}
            />
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

export default CreateCollectionModal;

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
    backgroundColor: '#000',
  },
  content: {
    backgroundColor: '#000',
    borderRadius: 22,
    padding: 11,

    marginHorizontal: 44,
    width: sizes.width / 1.1,
  },
  input: {
    fontSize: 16,
    fontFamily: fonts.robotoRegular,
    color: '#FFF',
    backgroundColor: '#191919',
    padding: 16,
    borderRadius: 11,
  },
  btnContainer: {
    marginTop: 11,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
  },
  btn: {
    flex: 1,
    backgroundColor: '#212121',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  btnText: {
    fontSize: 18,
    fontFamily: fonts.avenir,
    color: '#BBBBBB',
    fontWeight: 'bold',
  },
  saveBtnText: {
    color: '#FFF',
  },
  button: {
    backgroundColor: '#000',
    width: sizes.width / 2.4,
    borderRadius: 12,
    height: 47,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: fonts.robotoBlack,
    color: '#FFF',
  },
  between: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: sizes.width / 1.2,
    alignSelf: 'center',
    marginTop: 30,
  },
  description: {
    fontFamily: 'Roboto-Light',
    color: '#FFF',
    width: sizes.width / 1.5,
    marginTop: 5,
  },
});

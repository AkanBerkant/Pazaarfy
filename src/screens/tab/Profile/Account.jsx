import React from 'react';
import {
  FlatList, Image, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';

import { CommonActions } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';
import { Modalize } from 'react-native-modalize';
import { Notifier } from 'react-native-notifier';

import { BackHeader } from '../../../components';
import routes from '../../../constants/routes';
import { sizes } from '../../../theme';
import fonts from '../../../theme/fonts';
import { userAtom } from '../../../utils/atoms';
import * as FirestoreQueries from '../../../utils/firestore-queries';
import * as Queries from '../../../utils/queries';
import SharedStorage from '../../../utils/shared-storage';
import Storage from '../../../utils/storage';

const Account = ({ navigation }) => {
  const [user, setUser] = useAtom(userAtom);
  const { t } = useTranslation();

  const deleteAccountMutation = useMutation(Queries.deleteAccount, {
    onSuccess: async () => {
      modalizeRef.current.close();
      await FirestoreQueries.deleteAllChats(user._id);
      await Storage.clear();
      await SharedStorage.removeItem('accessToken');

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: routes.DeleteAccountResponse,
            },
          ],
        }),
      );
      setUser(null);
    },
    onError: (err) => {
      Notifier.showNotification({
        title: t('AnErrorOccurredLater'),
      });
    },
  });

  const sections = [
    {
      label: t('userDetails'),
      onPress: () => {
        navigation.navigate(routes.ProfilSettings);
      },
    },

    {
      label: t('password'),
      onPress: () => {
        navigation.navigate(routes.MailScreen);
      },
    },
    /* {
      label: t('verification'),
      onPress: () => {
        navigation.navigate(routes.Verification);
      },
    }, */
    {
      label: t('language'),
      onPress: () => {
        navigation.navigate(routes.ChangeLanguage);
      },
    },
    {
      label: t('deleteMyAccount'),
      onPress: () => {
        return modalizeRef.current.open();
      },
    },
  ];

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={item.onPress} style={styles.items}>
        <Text style={styles.label}>{item.label}</Text>
        <Image source={require('../../../assets/arrowr.png')} style={styles.arrowR} />
      </TouchableOpacity>
    );
  };

  const modalizeRef = React.useRef();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#000',
      }}
    >
      <BackHeader title={t('myAccount')} />
      <View style={styles.top} />
      <FlatList data={sections} renderItem={renderItem} />

      <Modalize
        snapPoint={sizes.width * 1.1}
        overlayStyle={{
          opacity: 1,
        }}
        handlePosition="inside"
        handleStyle={{
          backgroundColor: '#161616',
        }}
        modalStyle={{
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          backgroundColor: '#161616',
        }}
        ref={modalizeRef}
        contentContainerStyle={styles.container}
      >
        <TouchableOpacity
          onPress={() => {
            modalizeRef.current?.close();
          }}
        >
          <Image source={require('../../../assets/closekk.png')} style={styles.icon} />
        </TouchableOpacity>
        <Image source={require('../../../assets/deletek.png')} style={styles.delete} />
        <Text style={styles.title}>{t('sureToDeleteAccount')}</Text>
        <View style={styles.row}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            colors={['#FF5406', '#D5D399', '#0AAFF6']}
            style={[styles.linearGradient]}
          >
            <TouchableOpacity
              style={[styles.button]}
              onPress={() => {
                modalizeRef.current?.close();
              }}
            >
              <Text style={[styles.buttonText]}>{t('cancel')}</Text>
            </TouchableOpacity>
          </LinearGradient>
          <TouchableOpacity
            onPress={() => {
              deleteAccountMutation.mutate();
            }}
            style={styles.approve}
          >
            <Text style={styles.approveText}>{t('yes')}</Text>
          </TouchableOpacity>
        </View>
      </Modalize>
    </View>
  );
};

export default Account;

const styles = StyleSheet.create({
  arrowR: {
    width: 10,
    height: 16,
    tintColor: '#fff',
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
  top: {
    marginTop: 20,
  },
  label: {
    fontFamily: fonts.roboto,
    color: '#FFF',
  },
  delete: {
    width: 99,
    height: 99,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  icon: {
    width: 40,
    height: 40,
    alignSelf: 'flex-end',
    margin: 10,
  },
  title: {
    color: '#FFF',
    fontFamily: fonts.roboto,
    fontSize: 24,
    alignSelf: 'center',
    width: sizes.width / 2,
    textAlign: 'center',
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 50,
    width: sizes.width / 1.1,
    alignSelf: 'center',
  },
  approve: {
    width: sizes.width / 2.4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#929292',
    borderRadius: 12,
    height: 55,
  },
  linearGradient: {
    width: sizes.width / 2.34,
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#161616',
    justifyContent: 'center',
    borderRadius: 12,
    alignItems: 'center',
    width: sizes.width / 2.4,
    height: 50,
  },
  approveText: {
    fontSize: 18,
    color: '#FFF',
    fontFamily: fonts.roboto,
  },
  buttonText: {
    color: '#FFF',
    fontFamily: fonts.roboto,
  },
});

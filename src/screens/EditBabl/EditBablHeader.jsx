import React from 'react';
import {
  Alert, Image, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import { useResetAtom } from 'jotai/utils';
import { useTranslation } from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';

import TrashIcon from '../../components/TrashIcon';
import routes from '../../constants/routes';
import { sizes } from '../../theme';
import fonts from '../../theme/fonts';
import { bablFormAtom } from '../../utils/atoms';
import i18n from '../../utils/i18n-setup';

const EditBablHeader = ({
  edited, title, onPress, showTrash, setShowTrash,
}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { t } = useTranslation();
  const resetBablForm = useResetAtom(bablFormAtom);

  return (
    <View style={styles.header}>
      <View style={styles.row}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => {
            if (route.params?.edit) {
              return Alert.alert(t('areYouSureToCancelBabl'), null, [
                {
                  text: t('yes'),
                  style: 'destructive',
                  onPress: () => {
                    navigation.goBack();

                    setTimeout(() => {
                      resetBablForm();
                    }, 500);
                  },
                },
                {
                  text: t('no'),
                  isPreferred: true,
                },
              ]);
            }

            navigation.goBack();
          }}
        >
          <Image
            resizeMode="contain"
            source={require('../../assets/back.png')}
            style={styles.back}
          />
          {i18n.language == 'tr' ? (
            <Text
              style={{
                color: '#000',
              }}
            >
              asdadas
            </Text>
          ) : (
            <Text
              style={{
                color: '#000',
              }}
            >
              asdadasd
            </Text>
          )}
        </TouchableOpacity>

        <View
          style={[
            {
              flexDirection: 'row',
              marginLeft: edited ? 32 : 30,
              alignItems: 'center',
            },
            styles.child2,
          ]}
        >
          <Text style={styles.title}>
            {title.length > 10 ? `${title?.slice(0, 10)}...` : title}
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(routes.EditCover);
            }}
          >
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              colors={['#F9B092', '#D5D399', '#0AAFF6']}
              style={styles.linearButton}
            >
              <View style={styles.linearPencilContainer}>
                <Image
                  resizeMode="contain"
                  source={require('../../assets/penn.png')}
                  style={styles.pen}
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View
          style={[
            {
              flexDirection: 'row',
              alignItems: 'center',
            },
          ]}
        >
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
            }}
          >
            <TouchableOpacity
              style={{
                marginRight: 5,
              }}
              onPress={() => {
                setShowTrash((prev) => {
                  return !prev;
                });
              }}
            >
              <TrashIcon width={16} height={16} color={showTrash ? '#5F5' : '#F55'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onPress}>
              <Text style={styles.edit}>{edited ? t('finish') : t('edit')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default EditBablHeader;

const styles = StyleSheet.create({
  header: {
    width: sizes.width,
    backgroundColor: '#000',
    shadowColor: '#FFF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    height: sizes.width / 4.5,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    justifyContent: 'space-between',
    width: sizes.width,
    backgroundColor: '#000',
    shadowColor: '#FFF',
    shadowOffset: {
      width: 0,
      height: 2,
    },

    marginTop: 40,
  },
  back: {
    width: 14.43,
    height: 22,
    tintColor: '#FFF',
  },
  title: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '500',
    marginRight: 5,
    fontFamily: fonts.roboto,
  },
  edit: {
    fontSize: 15,

    color: '#FFF',

    fontFamily: fonts.roboto,
  },
  linearButton: {
    width: 27,
    height: 27,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 27,
    marginLeft: 0,
  },
  linearPencilContainer: {
    backgroundColor: '#000',
    width: 25,
    height: 25,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },

  pen: {
    width: 15,
    height: 15,
  },
});

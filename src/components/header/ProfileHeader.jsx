import React from 'react';
import {
  Image, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { sizes } from '../../theme';
import fonts from '../../theme/fonts';

const ProfileHeader = ({ title, shadow, onPress }) => {
  const navigation = useNavigation();
  const safeAreaInsets = useSafeAreaInsets();

  const handleGeriTusu = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View
      style={[
        styles.headerContainer,
        {
          shadowOpacity: shadow == false ? 0 : 0.1,
          paddingTop: safeAreaInsets.top,
          paddingBottom: 10,
          marginBottom: 10,
          backgroundColor: '#000',
          zIndex: 3,
        },
      ]}
    >
      <View
        style={[
          styles.headerIn,
        ]}
      >
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={handleGeriTusu}
        >
          <Image
            source={require('../../assets/back.png')} // Geri ok resminin yolunu belirtin
            style={styles.back}
            resizeMode="contain"
          />
          <Text
            style={{
              color: '#000',
            }}
          >
            asdasdasda
          </Text>
        </TouchableOpacity>
        <View style={styles.centeredText}>
          <Text style={[styles.title]}>{title}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#000',
            }}
          >
            asdasdasda
          </Text>
          <View
            style={{
              width: 40, // Resim genişliği
              height: 24, // Resim yüksekliği
              marginRight: 8, // Resim ile metin arasındaki boşluk
              tintColor: '#BBBBBB',
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    backgroundColor: '#000',

    width: sizes.width,
    alignItems: 'center',
    shadowColor: '#FFF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerIn: {
    backgroundColor: '#000',
    flexDirection: 'row',
    width: sizes.width,
    alignItems: 'center',
  },
  left: {
    flexDirection: 'row',
    width: 40,
    alignItems: 'center',
  },
  centeredText: {
    flex: 1, // Yazıyı ortalayabilmek için kullanılır
    alignItems: 'center',
    color: '#FFF',
  },
  back: {
    width: 40, // Resim genişliği
    height: 24, // Resim yüksekliği
    marginRight: 8, // Resim ile metin arasındaki boşluk
    tintColor: '#BBBBBB',
  },
  title: {
    fontSize: 18,
    color: '#FFF',
    fontFamily: fonts.roboto,
  },
});

export default ProfileHeader;

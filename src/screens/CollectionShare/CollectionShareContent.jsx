import 'react-native-url-polyfill/auto';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import axios from 'axios';

import { sizes } from '../../theme';
import fonts from '../../theme/fonts';
import { API_URL } from '../../utils/config';
import { getPlatformFromUrl, platformLogos } from '../../utils/platform-colors';
import SharedStorage from '../../utils/shared-storage';
import Storage from '../../utils/storage';
import en from '../../utils/translates/en';
import tr from '../../utils/translates/tr';

const SelectedStorage = Platform.OS === 'android' ? Storage : SharedStorage;

const bgPhotos = [
  require('../../assets/bg_photos/1.png'),
  require('../../assets/bg_photos/2.png'),
  require('../../assets/bg_photos/3.png'),
  require('../../assets/bg_photos/4.png'),
  require('../../assets/bg_photos/5.png'),
  require('../../assets/bg_photos/6.png'),
  require('../../assets/bg_photos/7.png'),
  require('../../assets/bg_photos/8.png'),
  require('../../assets/bg_photos/9.png'),
  require('../../assets/bg_photos/10.png'),
  require('../../assets/bg_photos/11.png'),
  require('../../assets/bg_photos/12.png'),
  require('../../assets/bg_photos/13.png'),
  require('../../assets/bg_photos/14.png'),
  require('../../assets/bg_photos/15.png'),
  require('../../assets/bg_photos/16.png'),
];

const CollectionShareContent = ({ getData, dismissExtension }) => {
  const [selectedItem, setSelectedItem] = React.useState();
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [lang, setLang] = React.useState('tr');

  const t = (k) => {
    return lang === 'tr' ? tr[k] : en[k];
  };

  React.useEffect(() => {
    SelectedStorage.getItem('accessToken').then((accessToken) => {
      axios
        .get('/user/lang/detail', {
          baseURL: API_URL,
          headers: { authorization: `Bearer ${accessToken}` },
        })
        .then((res) => {
          setLang(res.data);
        });
    });
  }, []);

  React.useEffect(() => {
    getData().then((item) => {
      const formatted = Platform.OS === 'android' ? item : item.data.find((val) => {
        return val.data.includes('http');
      });

      setSelectedItem(formatted);
    });
  }, []);

  const parseSaveMutation = {
    mutate: async (url) => {
      try {
        const accessToken = await SelectedStorage.getItem('accessToken');
        await axios.post(
          '/collection/parse-save',
          { url },
          {
            baseURL: API_URL,
            headers: { authorization: `Bearer ${accessToken}` },
          },
        );
        setSuccess(true);
        setVisible(true);
        setTimeout(() => {
          dismissExtension();
        }, 2000);
      } catch (error) {
        console.log('err', error);
      }
    },
  };

  const addResourceToCollectionMutation = {
    mutate: async (data) => {
      const accessToken = await SelectedStorage.getItem('accessToken');
      await axios.patch('/collection/resources', data, {
        baseURL: API_URL,
        headers: { authorization: `Bearer ${accessToken}` },
      });
      setSuccess(true);
      setVisible(true);
      setTimeout(() => {
        dismissExtension();
      }, 2000);
    },
  };

  if (!selectedItem) {
    return null;
  }

  const selectedPlatformLogo = platformLogos[getPlatformFromUrl(selectedItem.data)];

  if (success) {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <ImageBackground
            resizeMode="contain"
            style={styles.successImageBackground}
            source={require('../../assets/logoblur.png')}
          >
            <ImageBackground
              resizeMode="contain"
              style={{
                width: sizes.width / 1.2,
                height: sizes.width / 1.1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              source={require('../../assets/bgblur.png')}
            >
              <Image
                source={require('../../assets/babo.png')}
                resizeMode="contain"
                style={styles.babl}
              />
              <Text style={styles.share}>{t('Shared')}</Text>
              <Text style={styles.success}>
                {t('CongratulationsSsuccessfully')}
              </Text>
            </ImageBackground>
          </ImageBackground>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            return dismissExtension();
          }}
          style={styles.backContainer}
        >
          <Image
            source={require('../../assets/back.png')}
            style={styles.back}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Share</Text>
        <View style={{ width: 40, height: 40 }} />
      </View>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: 70,
        }}
      >
        {selectedItem.mimeType === 'image/jpeg' && (
          <Image style={styles.image} source={{ uri: selectedItem.data }} />
        )}
        <View style={styles.textBorder}>
          {selectedItem.mimeType === 'text/plain' && (
            <Text style={styles.text} numberOfLines={5}>
              {selectedItem.data}
            </Text>
          )}
        </View>

        {selectedItem.mimeType === 'text/plain' && !!selectedPlatformLogo && (
          <ImageBackground
            source={bgPhotos[2]}
            blurRadius={10}
            style={{
              backgroundColor: 'red',
              width: sizes.width / 1.1,
              aspectRatio: 1.5,
              alignSelf: 'center',
              borderRadius: 15,
              marginTop: 20,
              overflow: 'hidden',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image
              source={selectedPlatformLogo}
              resizeMode="contain"
              style={{
                height: sizes.width / 6,
                tintColor: '#FFF',
              }}
            />
          </ImageBackground>
        )}
      </View>
      <TouchableOpacity
        disabled={loading}
        onPress={async () => {
          try {
            const url = new RegExp(/(?:www|https?)[^\s]+/).exec(
              selectedItem.data,
            )[0];
            if (
              !(
                selectedItem.mimeType === 'text/plain' && url.startsWith('http')
              )
            ) {
              dismissExtension();
            }
            setLoading(true);
            parseSaveMutation.mutate(url);
          } catch (error) {
            console.log('err', error.response.data);
            setLoading(false);
          }
        }}
      >
        <ImageBackground
          style={styles.borderLine}
          resizeMode="contain"
          source={require('../../assets/button.png')}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <Text style={styles.buttonText}>{t('AddToShareLibrary')}</Text>
          )}
        </ImageBackground>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          return dismissExtension();
        }}
        style={styles.cancelContainer}
      >
        <Text style={styles.buttonText}>{t('Cancel')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CollectionShareContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingBottom: 50,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successImageBackground: {
    width: sizes.width,
    alignSelf: 'center',
    height: sizes.height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  back: {
    width: 12,
    height: 22,
    tintColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#313131',
    width: sizes.width,
    borderBottomWidth: 1,
    alignSelf: 'center',
    padding: 5,
  },
  title: {
    color: '#FFF',
    fontFamily: fonts.roboto,
    fontSize: 18,
    fontWeight: 'bold',
  },
  textBorder: {
    borderWidth: 1,
    borderColor: '#202020',
    width: sizes.width / 1.1,
    alignSelf: 'center',
    borderRadius: 15,
    marginTop: sizes.width / 5,
    alignItems: 'center',
  },
  text: {
    padding: 15,
    fontSize: 18,
    color: '#FFF',
    fontWeight: '500',
    textAlign: 'center',
  },
  image: {
    marginTop: 50,
    width: 200,
    height: 200,
  },
  cancelContainer: {
    backgroundColor: '#202020',
    width: sizes.width / 1.09,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 15,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontFamily: fonts.roboto,
    fontWeight: 'bold',
    fontSize: 18,
  },
  borderLine: {
    width: sizes.width / 1.07,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    alignSelf: 'center',
  },
  babl: {
    width: 113,
    height: 113,
  },
  share: {
    color: '#FFF',
    fontFamily: fonts.roboto,
    fontSize: 22,
    marginTop: 20,
  },
  success: {
    color: '#7A7A7A',
    fontFamily: fonts.regular,
    fontSize: 16,
    marginTop: 2,
  },
});

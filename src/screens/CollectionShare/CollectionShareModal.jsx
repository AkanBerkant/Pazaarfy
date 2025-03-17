import React from 'react';
import {
  View, StyleSheet, Modal, ImageBackground, Image, Text, Animated,
} from 'react-native';

import { t } from 'i18next';

import fonts from '../../theme/fonts';

const CollectionShareModal = ({ visible, children }) => {
  const [showModal, setShowModal] = React.useState(visible);
  const scaleValue = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    toggleModal();
  }, [visible]);
  const toggleModal = () => {
    if (visible) {
      setShowModal(true);
      Animated.spring(scaleValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      setTimeout(() => {
        return setShowModal(false);
      }, 200);
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };
  return (
    <Modal transparent visible={showModal}>
      <View style={styles.modalBackGround}>
        <Animated.View style={[styles.modalContainer, { transform: [{ scale: scaleValue }] }]}>
          <Image source={require('../../assets/bigModal.png')} />
          <Text>{t('SHARED')}</Text>
          <Text>{t('CongratulationsItHasBeenAddedSuccessfully')}</Text>
          <ImageBackground
            style={styles.borderLine}
            resizeMode="contain"
            source={require('../../assets/button.png')}
          >
            <Text style={styles.buttonText}>{t('OK')}</Text>
          </ImageBackground>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackGround: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 20,
  },
  header: {
    width: '100%',
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  borderLine: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    height: 55,
    width: '70%',
  },
  buttonText: {
    fontFamily: fonts.roboto,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFF',
    fontSize: 18,
  },
});

export default CollectionShareModal;

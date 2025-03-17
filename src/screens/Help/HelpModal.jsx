import React from 'react';
import {
  Animated,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import fonts from '../../theme/fonts';

const HelpModal = ({ visible, onClose }) => {
  const navigation = useNavigation();
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
      setTimeout(() => { return setShowModal(false); }, 200);
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  if (visible) {
    setShowModal(true);
    Animated.spring(scaleValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  } else {
    setTimeout(() => { return setShowModal(false); }, 200);
    Animated.timing(scaleValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }

  return (
    <Modal transparent visible={showModal}>
      <View style={styles.modalBackGround}>
        <View style={[styles.modalContainer]}>
          <TouchableOpacity onPress={onClose}>
            <Image
              source={require('../../assets/checke.png')}
              style={styles.check}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.title}>Tebrikler!</Text>
          <Text style={styles.description}>Mesajınız gönderild!</Text>
        </View>
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
    backgroundColor: '#161616',
    padding: 10,
    borderRadius: 26,
    elevation: 20,
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  check: {
    width: 79,
    height: 79,
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.roboto,
    color: '#fff',
    marginTop: 20,
  },
  description: {
    fontSize: 18,
    fontFamily: fonts.roboto,
    color: '#fff',
  },
});

export default HelpModal;

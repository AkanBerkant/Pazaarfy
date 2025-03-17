import React from 'react';
import {
  View, StyleSheet, Modal, Image, Text, TouchableOpacity, Animated,
} from 'react-native';

import fonts from '../../theme/fonts';

const InformationModal = ({ visible, onClose, content }) => {
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
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <TouchableOpacity onPress={onClose}>
              <Image
                source={require('../../assets/bab.png')}
                style={styles.close}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose}>
              <Image
                source={require('../../assets/clos.png')}
                style={styles.close}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>{content}</Text>
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
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 20,
  },
  header: {
    width: '100%',
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  title: {
    fontFamily: fonts.roboto,
    color: '#FFF',
    marginTop: 20,
    alignSelf: 'center',
  },
  close: {
    width: 30,
    height: 30,
    alignSelf: 'flex-end',
  },
});

export default InformationModal;

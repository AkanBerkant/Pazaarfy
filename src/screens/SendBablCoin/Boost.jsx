import React from 'react';
import {
  View, StyleSheet, Modal, Image, Text, Animated,
} from 'react-native';

import { ButtonLinear } from '../../components';
import { sizes } from '../../theme';
import fonts from '../../theme/fonts';

const Boost = ({
  visible, buy, icon, onClose,
}) => {
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
          <Image resizeMode="contain" source={icon} style={styles.icon} />
          <Text style={styles.congrulations}>TEBRİKLER!</Text>
          <Text style={styles.congrulationsCompleted}>
            {buy ? 'Satın Alındı' : 'Hediye Gönderildi'}
          </Text>
          <View
            style={{
              marginTop: 30,
            }}
          />
          <ButtonLinear
            title="Tamam"
            onPress={onClose}
            width={sizes.width / 1.4}
            linearWidth={sizes.width / 1.42}
          />
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
    backgroundColor: '#121212',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 30,
    elevation: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  icon: {
    width: 120,
    height: 120,
    alignSelf: 'center',
  },
  congrulations: {
    fontFamily: fonts.roboto,
    fontSize: 24,
    color: '#FFF',
  },
  congrulationsCompleted: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: fonts.regular,
    marginTop: 5,
  },
});

export default Boost;

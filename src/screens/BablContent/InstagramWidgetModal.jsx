import React from 'react';
import {
  Animated,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from 'react-native';

import { BlurView } from 'expo-blur';

import { sizes } from '../../theme';
import fonts from '../../theme/fonts';

const InstagramWidgetModal = ({ title, visible, onClose }) => {
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
      <ImageBackground source={require('../../assets/logoblur.png')} style={styles.modalBackGround}>
        <BlurView
          intensity={50}
          tint="dark"
          style={{
            width: '90%',
            overflow: 'hidden',
            alignSelf: 'center',
            borderRadius: 26,
            elevation: 20,
            justifyContent: 'center',
          }}
        >
          <Animated.View
            style={[
              styles.modalContainer,
              { justifyContent: 'center' },
              { height: title.length > 120 ? sizes.width / 1.5 : null },

              { transform: [{ scale: scaleValue }] },
            ]}
          >
            <TouchableOpacity onPress={onClose}>
              <Image
                resizeMode="contain"
                source={require('../../assets/closea.png')}
                style={{
                  width: 25,
                  height: 25,
                  alignSelf: 'flex-end',
                  position: 'absolute',
                  right: -15,
                  marginTop: 10,
                }}
              />
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text
                style={{
                  fontFamily: fonts.avenir,
                  marginTop: 10,
                  fontSize: 16,
                  color: '#FFF',
                  marginBottom: 10,
                }}
              >
                {title}
              </Text>
            </ScrollView>
          </Animated.View>
        </BlurView>
      </ImageBackground>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackGround: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',

    alignSelf: 'center',
    borderRadius: 26,
    elevation: 20,
    justifyContent: 'center',
  },
});

export default InstagramWidgetModal;

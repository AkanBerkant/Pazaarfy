import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Image,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';

import { BlurView } from 'expo-blur';

import { sizes } from '../../../theme';

const ProfilePhotoModal = ({ visible, ProfilePhoto, onClose }) => {
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
  return (
    <Modal animationType="fade" transparent visible={showModal}>
      <TouchableWithoutFeedback
        activeOpacity={0.0}
        onPress={onClose}
        style={{ flex: 1 }}
      >
        <BlurView style={styles.container} intensity={5}>
          <View style={styles.modalBackGround}>
            <Animated.View
              style={[
                styles.modalContainer,
                { transform: [{ scale: scaleValue }] },
              ]}
            >
              <Image source={{ uri: ProfilePhoto }} style={styles.profilePhoto} />
            </Animated.View>
          </View>
        </BlurView>
      </TouchableWithoutFeedback>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 20,
  },
  container: {
    flex: 1,
  },
  profilePhoto: {
    width: sizes.width / 2,
    height: sizes.width / 2,
    borderRadius: sizes.width / 2,
    backgroundColor: '#CDCDCD',
    borderWidth: 1,
    borderColor: '#000',
  },
});

export default ProfilePhotoModal;

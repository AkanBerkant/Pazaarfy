import React from 'react';
import {
  Animated, Image, Modal, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import routes from '../../../constants/routes';
import fonts from '../../../theme/fonts';

const SharedModal = ({ visible, onClose }) => {
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

  const menu = [
    {
      label: 'Saved',
      icon: require('../../../assets/saved.png'),
      onPress: () => {
        navigation.navigate(routes.Bookmarks);
        onClose();
      },
    },
    {
      label: 'Shared',
      icon: require('../../../assets/shared.png'),
      onPress: () => {
        navigation.navigate(routes.SharedSavings);
        onClose();
      },
    },
  ];

  return (
    <Modal transparent visible={showModal}>
      <View style={styles.modalBackGround}>
        <View style={[styles.modalContainer]}>
          <TouchableOpacity onPress={onClose}>
            <Image
              source={require('../../../assets/closek.png')}
              style={styles.close}
              resizeMode="contain"
            />
          </TouchableOpacity>
          {menu.map((item, index) => {
            return (
              <TouchableOpacity
                onPress={item.onPress}
                style={[
                  styles.item,
                  {
                    borderBottomWidth: index == 0 ? 1 : 0,
                  },
                ]}
              >
                <Image resizeMode="contain" source={item.icon} style={styles.icon} />
                <Text style={styles.label}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
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
    width: '60%',
    backgroundColor: '#101010',

    height: 106,

    borderRadius: 26,
    elevation: 20,
    justifyContent: 'center',
    position: 'absolute',
    top: 120,
    right: 40,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'center',
    borderBottomColor: '#272727',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 5,
    tintColor: '#494949',
  },
  label: {
    color: '#FFF',
    fontFamily: fonts.roboto,
    marginLeft: 5,
  },
  close: {
    width: 28,
    height: 28,
    position: 'absolute',
    right: -20,
    zIndex: 99,
    top: -30,
  },
});

export default SharedModal;

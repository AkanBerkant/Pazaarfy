import React from 'react';
import {
  Image, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import { Modalize } from 'react-native-modalize';

import { ButtonLinear, Container } from '../../components';
import { sizes } from '../../theme';

import BoostHeader from './BoostHeader';
import Modal from './Modal';

const Boost = () => {
  const data = [
    {
      image: require('../../assets/listboost.png'),
    },
    {
      image: require('../../assets/listboost.png'),
    },
    {
      image: require('../../assets/listboost.png'),
    },
    {
      image: require('../../assets/listboost.png'),
    },
    {
      image: require('../../assets/listboost.png'),
    },
    {
      image: require('../../assets/listboost.png'),
    },
    {
      image: require('../../assets/listboost.png'),
    },
    {
      image: require('../../assets/listboost.png'),
    },
    {
      image: require('../../assets/listboost.png'),
    },
  ];

  const [visible, setVisible] = React.useState(null);
  const [yes, setYes] = React.useState(null);

  const onBoost = () => {
    modalizeRef.current?.open();
  };

  const onOpenModal = () => {
    setYes(true);
  };

  const renderItem = ({ item }) => {
    return <Image source={item.image} style={styles.image} />;
  };

  const modalizeRef = React.useRef();

  const buttons = [
    {
      label: 'Yes',
    },
    {
      label: 'No',
    },
  ];

  return (
    <>
      <Container safearea={false}>
        <BoostHeader />

        <View style={styles.center}>
          <Image source={require('../../assets/sand.png')} style={styles.giff} />
        </View>
        <View style={styles.center}>
          <Image source={require('../../assets/BB.png')} style={styles.bb} />
        </View>
        <View style={styles.top}>
          <ButtonLinear onPress={onBoost} title="Hediye Et" />
        </View>
      </Container>

      <Modalize
        snapPoint={sizes.width * 1.3}
        overlayStyle={{
          opacity: 1,
        }}
        handlePosition="inside"
        handleStyle={{
          backgroundColor: '#FFF',
        }}
        modalStyle={{
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        }}
        ref={modalizeRef}
        contentContainerStyle={styles.container}
      >
        <View style={styles.header}>
          <View style={styles.icon} />
          <Image source={require('../../assets/sttipe.png')} style={styles.logo} />
          <TouchableOpacity
            onPress={() => {
              setVisible(true);
            }}
          >
            <Image source={require('../../assets/cros.png')} style={styles.icon} />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Stripe ile ödeme yapıyorsunuz</Text>
        <Image
          source={require('../../assets/bigBoost.png')}
          style={styles.bigIcon}
          resizeMode="contain"
        />
        <Text style={styles.pink}>1000</Text>

        <Modal
          visible={visible}
          onClose={() => {
            setVisible(!visible);
          }}
          children={(
            <>
              <Image
                source={require('../../assets/bigBoost.png')}
                style={styles.bigIcon}
                resizeMode="contain"
              />
              <Text style={styles.cancelText}>Are you sure you want to cancel?</Text>

              <View style={styles.row}>
                {buttons.map((item, index) => {
                  return (
                    <>
                      {index == 0 ? (
                        <TouchableOpacity
                          onPress={() => {
                            setVisible(false);
                          }}
                          style={styles.yesButton}
                        >
                          <Text style={styles.buttonText}>{item.label}</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity>
                          <LinearGradient
                            start={{ x: 1, y: 0 }}
                            end={{ x: 0, y: 0 }}
                            colors={['#FFE8AD', '#F1656E', '#EA45AF']}
                            style={styles.linearGradient}
                          >
                            <Text style={styles.whiteColor}>No</Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      )}
                    </>
                  );
                })}
              </View>
            </>
          )}
        />

        <Modal
          visible={yes}
          onClose={() => {
            setYes(!yes);
          }}
          children={(
            <>
              <Image
                source={require('../../assets/bigBoost.png')}
                style={[
                  styles.bigIcon,
                  {
                    width: 133,
                    height: 133,
                  },
                ]}
                resizeMode="contain"
              />
              <Text style={styles.cancelText}>Tebrikler</Text>

              <Text style={styles.desciptionText}>Bakiyeniz Hesabınıza Yansıtıldı</Text>
              <TouchableOpacity
                onPress={() => {
                  setYes(false);
                }}
              >
                <LinearGradient
                  start={{ x: 1, y: 0 }}
                  end={{ x: 0, y: 0 }}
                  colors={['#FFE8AD', '#F1656E', '#EA45AF']}
                  style={styles.linearOk}
                >
                  <Text style={styles.whiteColor}>Tamam</Text>
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}
        />
        <View style={styles.top}>
          <ButtonLinear onPress={onOpenModal} title="Hediye Et" />
        </View>
      </Modalize>
    </>
  );
};

export default Boost;

const styles = StyleSheet.create({
  bigIcon: {
    width: sizes.width / 4,
    height: sizes.width / 4,
    alignSelf: 'center',
    marginTop: 25,
  },
  text: {
    color: '#9C9C9C',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 15,
    width: sizes.width / 1.1,
    alignSelf: 'center',
  },
  image: {
    width: sizes.width / 3.3,
    height: 117,
    margin: 5,
    borderRadius: 16,
  },
  center: {
    alignItems: 'center',
    marginTop: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  top: {
    marginTop: 30,
  },
  logo: {
    height: 62,
    width: sizes.width / 3,
  },
  icon: {
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
  },
  pink: {
    color: '#EE558F',
    fontWeight: '900',
    fontSize: 23,
    textAlign: 'center',
    marginTop: 20,
  },
  cancelText: {
    fontWeight: '600',
    fontSize: 24,
    width: sizes.width / 1.2,
    textAlign: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
    alignItems: 'center',
  },
  yesButton: {
    backgroundColor: '#FFF',
    width: sizes.width / 2.4,
    borderRadius: 12,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginRight: 5,
    borderColor: '#DFDFDF',
  },

  buttonText: {
    color: '#717171',
    fontSize: 18,
  },
  linearGradient: {
    width: sizes.width / 2.4,
    borderRadius: 12,
    height: 55,
    marginLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteColor: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  desciptionText: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 5,
  },
  linearOk: {
    width: sizes.width / 1.3,
    borderRadius: 12,
    height: 55,
    marginLeft: 5,
    marginTop: 30,

    justifyContent: 'center',
    alignItems: 'center',
  },
  giff: {
    width: 220,
    height: 220,
  },
  bb: {
    width: 81,
    height: 81,
  },
});

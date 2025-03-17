import React, { useEffect } from 'react';
import {
  Pressable, StyleSheet, TouchableOpacity, Image, Text, View,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import routes from 'babl/src/constants/routes';
import fonts from 'babl/src/theme/fonts';
import { t } from 'i18next';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { DIFinalWidth, DIWidth } from '../helpers/constants';

const AirpodsConnect = () => {
  const airpodsValue = useSharedValue(0);
  const airpodsTextContainerValue = useSharedValue(0);

  const navigation = useNavigation();

  const [visible, setVisible] = React.useState(null);

  const containerStyle = useAnimatedStyle(() => {
    const width = interpolate(airpodsValue.value, [0, 1], [DIWidth, DIFinalWidth]);
    const height = interpolate(airpodsValue.value, [0, 1], [40, 95]);

    return {
      width,
      height,
      borderRadius: 10,
    };
  });

  const airpodsConnectTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(airpodsTextContainerValue.value, [0, 1], [0, 1]);

    return {
      opacity,
      width: airpodsTextContainerValue.value === 0 ? 0 : 140,
    };
  });

  const startTimingAnimation = () => {
    const isActiveAirpods = airpodsValue.value === 1;
    const isActiveAirpodsText = airpodsTextContainerValue.value === 1;

    airpodsValue.value = withSpring(isActiveAirpods ? 0 : 1, {
      damping: isActiveAirpods ? 12 : 10,
    });

    airpodsTextContainerValue.value = withTiming(isActiveAirpodsText ? 0 : 1, {
      duration: isActiveAirpodsText ? 100 : 800,
    });
  };

  const imageItemStyle = useAnimatedStyle(() => {
    const width = interpolate(airpodsValue.value, [0, 1], [28, 52]);

    return {
      width,
    };
  });

  const animation = () => {
    setVisible(!visible);
    startTimingAnimation();
  };
  return (
    <Pressable onPress={startTimingAnimation}>
      <Animated.View style={[styles.container, containerStyle]}>
        <Animated.View style={[styles.airpodTextContainer, airpodsConnectTextStyle]}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(routes.Bookmarks);
              animation();
            }}
          >
            <Text style={styles.airpodFirstLineText}>{t('Saved')}</Text>
          </TouchableOpacity>
          <View
            style={{
              borderBottomWidth: 1,
              marginBottom: 7,
              borderBottomColor: '#fff',
              marginTop: 7,
            }}
          />
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(routes.SharedLibrary);
              animation();
            }}
          >
            <Text style={styles.airpodSecondLineText} />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1B1C20',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    bottom: 90,
    left: 100,
  },
  imageItem: {
    width: 16,
  },
  airpodTextContainer: { flex: 1, marginHorizontal: 16 },
  airpodFirstLineText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: fonts.regular,
  },
  airpodSecondLineText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: fonts.regular,
  },
  me: {
    width: 37,
    height: 37,
    position: 'absolute',
    right: 20,
    top: 30,
  },
});

export default AirpodsConnect;

import React, { useEffect } from 'react';
import {
  Dimensions, Image, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';

import { t } from 'i18next';
import Animated, {
  FadeIn,
  FadeInRight,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const DetailScreen = ({ route, navigation }) => {
  // get uri and imageSpecs from route.params
  const { uri, imageSpecs } = route.params;
  // create animated value
  const anim = useSharedValue(0);
  useEffect(() => {
    // reset to zero
    anim.value = 0;
    // start animation
    anim.value = withTiming(1);
  }, []);

  const onClosePress = () => {
    const callback = () => {
      return navigation.goBack();
    };
    anim.value = withTiming(0, {}, (isFinished) => {
      return isFinished && runOnJS(callback)();
    });
  };
  // create image containner style
  const imageContainerStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      top: interpolate(anim.value, [0, 1], [imageSpecs.pageY, 0]),
      left: interpolate(anim.value, [0, 1], [imageSpecs.pageX, 0]),
      width: interpolate(anim.value, [0, 1], [imageSpecs.width, width]),
      height: interpolate(anim.value, [0, 1], [imageSpecs.height, 250]),
      borderRadius: interpolate(anim.value, [0, 1], [imageSpecs.borderRadius, 0]),
      overflow: 'hidden',
    };
  }, []);
  const bottomContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: anim.value,
    };
  }, []);
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.imageContainer, imageContainerStyle]}>
        <Image style={styles.image} source={{ uri }} />
      </Animated.View>
      <Animated.View style={[styles.bottomContainer, bottomContainerStyle]}>
        <TouchableOpacity onPress={onClosePress} style={styles.btnClose}>
          <Text style={styles.text}>{t('close')}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};
// That's all guys, I hope you enjoy it, See you on next tutorial !! happy hacking
export default DetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 250,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  btnClose: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#000',
  },
  text: {
    color: '#fff',
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: 'red',
  },
});

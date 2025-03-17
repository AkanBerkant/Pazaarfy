import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { BackgroundGradient } from './BackgroundGradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HEIGHT = 256;
const WIDTH = SCREEN_WIDTH * 0.9;

const CARD_HEIGHT = HEIGHT - 5;
const CARD_WIDTH = WIDTH - 5;

function CardDetail({ selectedItem, children, onClose }) {
  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);

  const navigation = useNavigation();

  const gesture = Gesture.Pan()
    .onBegin((event) => {
      rotateX.value = withTiming(
        interpolate(event.y, [0, CARD_HEIGHT], [10, -10], Extrapolate.CLAMP),
      );
      rotateY.value = withTiming(
        interpolate(event.x, [0, CARD_WIDTH], [-10, 10], Extrapolate.CLAMP),
      );
    })
    .onUpdate((event) => {
      // topLeft (10deg, -10deg)
      // topRight (10deg, 10deg)
      // bottomRight (-10deg, 10deg)
      // bottomLeft (-10deg, -10deg)

      rotateX.value = interpolate(
        event.y,
        [0, CARD_HEIGHT],
        [10, -10],
        Extrapolate.CLAMP,
      );
      rotateY.value = interpolate(
        event.x,
        [0, CARD_WIDTH],
        [-10, 10],
        Extrapolate.CLAMP,
      );
    })
    .onFinalize(() => {
      rotateX.value = withTiming(0);
      rotateY.value = withTiming(0);
    });

  const rStyle = useAnimatedStyle(() => {
    const rotateXvalue = `${rotateX.value}deg`;
    const rotateYvalue = `${rotateY.value}deg`;

    return {
      transform: [
        {
          perspective: 300,
        },
        { rotateX: rotateXvalue },
        { rotateY: rotateYvalue },
      ],
    };
  }, []);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <View style={styles.container}>
        <BackgroundGradient width={WIDTH} height={HEIGHT} />
        <GestureDetector gesture={gesture}>
          <Animated.View
            style={[
              {
                height: CARD_HEIGHT,
                width: CARD_WIDTH,
                backgroundColor: 'white',
                position: 'absolute',
                borderRadius: 20,
                zIndex: 300,
              },
              rStyle,
            ]}
          >
            {children}
          </Animated.View>
        </GestureDetector>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
});

export default ({ onClose, children, selectedItem }) => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <CardDetail
        children={children}
        selectedItem={selectedItem}
        onClose={onClose}
      />
    </GestureHandlerRootView>
  );
};

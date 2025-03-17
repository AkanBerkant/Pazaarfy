import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  ZoomIn,
  ZoomOut,
  measure,
  runOnJS,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const MIN_HEIGHT = 56;
const BUTTON_MARGIN = 10;

const AppleButtonLayoutAnim = () => {
  const [animSteps, setAnimSteps] = useState(0);
  const widthAnim = useSharedValue(MIN_HEIGHT);

  const textRef = useAnimatedRef<Animated.Text>();

  const playAnimation = () => setAnimSteps(animSteps < 5 ? 1 : 6);

  const containerStyle = useAnimatedStyle(() => {
    return { width: widthAnim.value };
  });

  const mainContainerStyle = useAnimatedStyle(() => {
    return { bottom: withTiming(animSteps === 0 ? -50 : 0) };
  });

  const updateStep = (nextStep: number) => {
    'worklet';
    return (finished?: boolean) => {
      'worklet';
      finished && runOnJS(setAnimSteps)(nextStep);
    };
  };

  return (
    <View>
      <View style={styles.container}>
        <Animated.View
          style={[{ minWidth: 56, minHeight: 72 }, mainContainerStyle]}
        >
          {animSteps === 1 && (
            <Animated.View
              style={{ position: 'absolute' }}
              entering={ZoomIn.withCallback(updateStep(2))}
              exiting={ZoomOut.withCallback(updateStep(3))}
            >
              <View style={styles.scaledBg} />
            </Animated.View>
          )}
          {animSteps >= 1 && animSteps <= 6 && (
            <Animated.View
              entering={ZoomIn.easing(Easing.inOut(Easing.ease))}
              exiting={ZoomOut.withCallback(updateStep(0))}
              style={[styles.btnContainer, containerStyle]}
            >
              {animSteps === 5 && (
                <Animated.Text
                  entering={FadeIn}
                  exiting={FadeOut}
                  style={styles.btnText}
                >
                  Learn how it all works
                </Animated.Text>
              )}
              {animSteps >= 3 && animSteps <= 5 && (
                <Animated.View
                  entering={ZoomIn.withCallback(finished => {
                    if (finished) {
                      runOnJS(setAnimSteps)(4);

                      const textDimen = measure(textRef);
                      const textWidth = textDimen?.width ?? 260;
                      widthAnim.value = withSequence(
                        withTiming(textWidth + 10, undefined, updateStep(5)),
                        withTiming(textWidth),
                      );
                    }
                  })}
                  exiting={ZoomOut.withCallback(finished => {
                    if (finished) {
                      widthAnim.value = withTiming(
                        56,
                        undefined,
                        updateStep(7),
                      );
                    }
                  })}
                  style={styles.plusIcon}
                >
                  <Text style={styles.plusText}>+</Text>
                </Animated.View>
              )}
            </Animated.View>
          )}
        </Animated.View>

        <TouchableOpacity style={{ marginTop: 16 }} onPress={playAnimation}>
          <Text>Trigger Animation</Text>
        </TouchableOpacity>
      </View>
      <View style={{ position: 'absolute', opacity: 0 }} pointerEvents="none">
        <Animated.Text style={styles.btnText} ref={textRef}>
          Learn how it all works
        </Animated.Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  scaledBg: {
    width: 56,
    height: 56,
    borderRadius: 32,
    backgroundColor: '#0071e3',
    transform: [{ scale: 1.5 }],
  },
  btnContainer: {
    width: 56,
    height: 56,
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(66, 66, 69, 0.7)',
  },
  btnText: {
    fontSize: 17,
    color: 'rgb(245,245,247)',
    fontWeight: '600',
    paddingVertical: 16,
    paddingStart: 24,
    paddingEnd: MIN_HEIGHT + 16 - BUTTON_MARGIN,
  },
  plusIcon: {
    position: 'absolute',
    right: 0,
    width: MIN_HEIGHT - BUTTON_MARGIN * 2,
    height: MIN_HEIGHT - BUTTON_MARGIN * 2,
    borderRadius: 50,
    backgroundColor: '#0071e3',
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: BUTTON_MARGIN,
  },
  plusText: { fontSize: 28, color: 'white', lineHeight: 28 },
});

export default AppleButtonLayoutAnim;

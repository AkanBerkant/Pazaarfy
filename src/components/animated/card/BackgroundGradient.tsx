import {
  BlurMask,
  Canvas,
  RoundedRect,
  SweepGradient,
  vec,
} from '@shopify/react-native-skia';
import {View} from 'react-native';
import React, {useEffect} from 'react';
import {useSharedValue, withRepeat, withTiming} from 'react-native-reanimated';

type BackgroundGradientProps = {
  width: number;
  height: number;
};

const BackgroundGradient: React.FC<BackgroundGradientProps> = React.memo(
  ({width, height}) => {
    const canvasPadding = 15;
    const rValue = useSharedValue(0);
    const skValue = useSharedValue(0);

    useEffect(() => {
      rValue.value = withRepeat(withTiming(10, {duration: 2000}), -1, true);
    }, [rValue]);

    useEffect(() => {
      skValue.current = rValue.value;
    }, [rValue]);

    return (
      <Canvas
        style={{
          width: width + canvasPadding / 2,
          height: height + canvasPadding,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <RoundedRect
          x={canvasPadding / 2.3}
          y={canvasPadding / 2.09}
          width={width}
          height={height}
          color={'white'}
          r={20}>
          <SweepGradient
            c={vec((width + canvasPadding) / 2, (height + canvasPadding) / 2)}
            colors={['#F9B092', '#D5D399', '#0AAFF6']}
          />
          <BlurMask blur={skValue} style={'solid'} />
        </RoundedRect>
      </Canvas>
    );
  },
);

export {BackgroundGradient};

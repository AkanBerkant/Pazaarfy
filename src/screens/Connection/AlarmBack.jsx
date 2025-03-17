import { View, useWindowDimensions } from 'react-native';

import {
  Canvas, rect, rrect, Box, BoxShadow,
} from '@shopify/react-native-skia';

export default function AlarmBack() {
  const { width, height } = useWindowDimensions();
  return (
    <View style={{ position: 'absolute' }}>
      <Canvas style={{ width, height: 100 }}>
        <Box
          box={rrect(rect(width / 2 - 160, 0, 320, 75), 20, 20)}
          color="#EEF0F5"
        />
      </Canvas>
    </View>
  );
}

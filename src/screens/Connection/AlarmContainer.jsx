import { useState } from 'react';
import {
  Switch, View, Text, Linking,
} from 'react-native';

import { fonts } from '../../constants/fonts';
import { sizes } from '../../theme';

import AlarmBack from './AlarmBack';

export default function AlarmContainer({ alarm }) {
  const [alarmOn, setAlarmOn] = useState(false);
  return (
    <View
      style={{
        marginTop: 20,
        width: sizes.width,
      }}
    >
      <AlarmBack />
      <View
        style={{
          flexDirection: 'row',

          justifyContent: 'space-around',
          alignItems: 'center',
          marginTop: 20,
        }}
      >
        <Text
          style={{ fontSize: 16, fontFamily: fonts.robotoMedium, color: 'gray' }}
        >
          Bağlantınızı Açın
        </Text>
        <Switch
          value={alarmOn}
          onValueChange={() => {
            setAlarmOn(!alarmOn);
            Linking.openSettings();
          }}
        />
      </View>
    </View>
  );
}

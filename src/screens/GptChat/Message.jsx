import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import ImageMessage from './ImageMessage';
import TextMessage from './TextMessage';

const Message = (props) => {
  const {
    type, isSender, sender, load, onLongPress, onPressIn, ...rest
  } = props;
  const [layoutHeight, setLayoutHeight] = useState(0);

  const onLayout = (e) => {
    const { height } = e.nativeEvent.layout;
    setLayoutHeight(height);
  };

  return (
    <View
      activeOpacity={0.9}
      onPressIn={() => { return onPressIn(isSender); }}
      onLayout={onLayout}
    >
      <View style={[styles.container, isSender && styles.sender]}>
        {!isSender && (
          <View style={styles.center}>
            <Image
              source={require('../../assets/bab.png')}
              style={styles.avatar}
              resizeMode="contain"
            />
          </View>
        )}
        {type === 'text' || true ? (
          <TextMessage {...rest} isSender={isSender} />
        ) : (
          <ImageMessage {...rest} />
        )}
      </View>
    </View>
  );
};

export default Message;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  sender: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 44,
    height: 44,
  },
  center: {
    alignItems: 'center',
  },
});

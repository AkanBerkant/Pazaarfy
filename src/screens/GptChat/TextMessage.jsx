import React from 'react';
import {
  Dimensions, StyleSheet, Text, View,
} from 'react-native';

import fonts from '../../theme/fonts';

const TextMessage = ({ text, isSender }) => {
  return (
    <View
      pointerEvents="none"
      style={[styles.container, isSender && styles.sender]}
    >
      <Text style={[styles.text, isSender && styles.senderText]}>{text}</Text>
    </View>
  );
};

export default TextMessage;

const styles = StyleSheet.create({
  container: {
    maxWidth: Dimensions.get('window').width * 0.8,
    alignItems: 'flex-start',
    backgroundColor: '#eee',
    padding: 10,
    marginHorizontal: 12,
    marginTop: 8,
    borderRadius: 16,
  },
  text: {
    fontSize: 15,
    fontFamily: fonts.avenir,
  },
  senderText: {
    color: 'white',
  },
  sender: {
    backgroundColor: '#000',
  },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Contents = () => {
  return (
    <View style={styles.container}>
      <Text>This is an empty React Native page.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Contents;

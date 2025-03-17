import React from 'react';
import {
  Image, StyleSheet, View,
} from 'react-native';

import { sizes } from '../../theme';

const ManualPhotoWidget = ({ url }) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Image
        source={{ uri: url }}
        resizeMode="contain"
        style={{
          flex: 1,
          width: sizes.width,
        }}
      />
    </View>
  );
};

export default ManualPhotoWidget;

const styles = StyleSheet.create({});

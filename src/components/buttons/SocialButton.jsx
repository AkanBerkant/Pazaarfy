import React from 'react';
import {
  Image, StyleSheet, Text, TouchableOpacity,
} from 'react-native';

import { sizes } from '../../theme';

const SocialButton = ({ title, icon, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        borderWidth: 1,
        borderColor: '#EDEDED',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 55,
        width: sizes.width / 1.1,
        alignSelf: 'center',
        marginTop: 10,
        borderRadius: 12,
      }}
    >
      {icon && (
        <Image
          source={icon}
          resizeMode="contain"
          style={{
            width: 22.56,
            height: 23.02,
          }}
        />
      )}
      <Text
        style={{
          fontFamily: 'Poppins',
          fontWeight: '600',
          fontSize: 14,
          marginLeft: 10,
          color: '#FFF',
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default SocialButton;

const styles = StyleSheet.create({});

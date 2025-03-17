import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { t } from 'i18next';

const TextWidget = ({ item }) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          fontSize: 17,
          color: '#FFF',
          paddingHorizontal: 14,
          fontWeight: '700',
        }}
      >
        {t('AIGENERATEDTEXT')}
      </Text>
      <View
        style={{
          height: 1,
          alignSelf: 'stretch',
          backgroundColor: '#FFF',
          marginVertical: 16,
        }}
      />
      <Text
        style={{
          fontSize: 17,
          color: '#FFF',
          paddingHorizontal: 20,
        }}
      >
        {item.url}
      </Text>
    </View>
  );
};

export default TextWidget;

const styles = StyleSheet.create({});

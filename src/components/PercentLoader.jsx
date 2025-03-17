import React from 'react';
import {
  ActivityIndicator, StyleSheet, Text, View,
} from 'react-native';

import { t } from 'i18next';

import fonts from '../theme/fonts';

const PercentLoader = ({ isLoading, loadingPercent, showPercent = true }) => {
  if (!isLoading) return null;

  return (
    <View
      style={[
        StyleSheet.absoluteFillObject,
        {
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          alignItems: 'center',
          justifyContent: 'center',
        },
      ]}
    >
      <ActivityIndicator size="large" color="white" />
      {showPercent && (
        <Text
          style={{
            marginTop: 12,
            fontFamily: fonts.roboto,
            color: 'white',
            fontSize: 20,
          }}
        >
          {t('Loading')}
          {Math.round(loadingPercent || 0)}
        </Text>
      )}
    </View>
  );
};

export default PercentLoader;

const styles = StyleSheet.create({});

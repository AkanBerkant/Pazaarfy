import React from 'react';
import { StyleSheet } from 'react-native';

import CustomGrid from '../CustomGrid';
import CustomRow from '../CustomRow';

import ColItem from './ColItem';

const Template2 = ({ items }) => {
  return (
    <CustomGrid style={styles.container}>
      <CustomRow style={styles.container} size={0.7}>
        <ColItem data={items[0]} />
      </CustomRow>
      <CustomRow size={0.35} />
      <CustomRow style={styles.container} size={0.5}>
        <ColItem data={items[1]} />

        <ColItem data={items[2]} />
      </CustomRow>
      <CustomRow style={styles.container} size={0.5}>
        <ColItem data={items[3]} />

        <ColItem data={items[4]} />

        <ColItem data={items[5]} />
      </CustomRow>
    </CustomGrid>
  );
};

export default Template2;

const styles = StyleSheet.create({
  container: { gap: 6 },
});

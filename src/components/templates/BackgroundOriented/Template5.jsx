import React from 'react';
import { StyleSheet } from 'react-native';

import CustomGrid from '../CustomGrid';
import CustomRow from '../CustomRow';

import ColItem from './ColItem';

const Template5 = ({ items }) => {
  return (
    <CustomGrid style={styles.container}>
      <CustomRow style={styles.container} size={1}>
        <ColItem data={items[0]} />
      </CustomRow>
      <CustomRow size={0.15} />
      <CustomRow style={styles.container} size={1}>
        <ColItem data={items[1]} />
      </CustomRow>
      <CustomRow style={styles.container} size={0.15} />
      <CustomRow style={styles.container} size={1}>
        <ColItem data={items[2]} />

        <ColItem data={items[3]} />

        <ColItem data={items[4]} />
      </CustomRow>
    </CustomGrid>
  );
};

export default Template5;

const styles = StyleSheet.create({
  container: { gap: 6 },
  item: { borderRadius: 12, borderWidth: 0, borderColor: '#282828' },
});

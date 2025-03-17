import React from 'react';
import { StyleSheet } from 'react-native';

import CustomGrid from '../CustomGrid';
import CustomRow from '../CustomRow';

import ColItem from './ColItem';

const Template3 = ({ items, isReverseOrder = false }) => {
  const content = [
    <CustomRow style={styles.container} size={0.5}>
      <ColItem data={items[0]} />
    </CustomRow>,
    <CustomRow size={0.15} />,
    <CustomRow style={styles.container} size={0.5}>
      <ColItem data={items[1]} />
    </CustomRow>,
    <CustomRow style={styles.container} size={0.25} />,
    <CustomRow style={styles.container} size={0.5}>
      <ColItem data={items[2]} />

      <ColItem data={items[3]} />
    </CustomRow>,
  ];

  return (
    <CustomGrid style={styles.container}>
      {isReverseOrder ? content.reverse() : content}
    </CustomGrid>
  );
};

export default Template3;

const styles = StyleSheet.create({
  container: { gap: 6 },
  item: { borderRadius: 12, borderWidth: 0, borderColor: '#282828' },
});

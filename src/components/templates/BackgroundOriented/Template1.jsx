import React from 'react';
import { StyleSheet } from 'react-native';

import CustomGrid from '../CustomGrid';
import CustomRow from '../CustomRow';

import ColItem from './ColItem';

const Template1 = ({ items, isReverseOrder }) => {
  const content = [
    <CustomRow style={styles.container} size={1}>
      <ColItem data={items[0]} />
    </CustomRow>,
    <CustomRow style={styles.container} size={0.5}>
      <ColItem data={items[1]} />

      <ColItem data={items[2]} />

      <ColItem data={items[3]} />
    </CustomRow>,
    <CustomRow style={styles.container} size={1}>
      <ColItem data={items[4]} />

      <ColItem data={items[5]} />
    </CustomRow>,
    <CustomRow style={styles.container} size={1}>
      <ColItem data={items[6]} />
    </CustomRow>,
  ];

  return (
    <CustomGrid style={{ gap: 48 }}>
      {isReverseOrder ? content.reverse() : content}
    </CustomGrid>
  );
};

export default Template1;

const styles = StyleSheet.create({
  container: { gap: 6 },
  item: { borderRadius: 12, borderWidth: 0, borderColor: '#282828' },
});

import React from 'react';
import { StyleSheet } from 'react-native';

import { Row } from 'react-native-easy-grid';

import ColItem from '../BackgroundOriented/ColItem';
import CustomGrid from '../CustomGrid';
import CustomRow from '../CustomRow';

const Template5 = ({ items, isReverseOrder = false }) => {
  const content = [
    <CustomRow style={styles.item} size={1}>
      <ColItem data={items[0]} />
    </CustomRow>,
    <CustomRow size={1} style={styles.container}>
      <ColItem data={items[1]} />
      {items[6] && <ColItem data={items[6]} />}
      {items[7] && <ColItem data={items[7]} />}

      <ColItem data={items[2]} />
      {items[8] && <ColItem data={items[8]} />}
      {items[9] && <ColItem data={items[9]} />}
    </CustomRow>,
    <CustomRow style={styles.item} size={0.5}>
      <ColItem data={items[3]} />
    </CustomRow>,
    <CustomRow size={1} style={styles.container}>
      <ColItem data={items[4]} />

      <ColItem data={items[5]} />
    </CustomRow>,
  ];

  return (
    <CustomGrid style={styles.container}>
      {isReverseOrder ? content.reverse() : content}
    </CustomGrid>
  );
};

export default Template5;

const styles = StyleSheet.create({
  container: { gap: 6 },
  item: {
    borderRadius: 12, borderWidth: 0, borderColor: '#282828', gap: 6,
  },
});

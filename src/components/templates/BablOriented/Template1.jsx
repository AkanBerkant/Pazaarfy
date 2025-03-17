import React from 'react';
import { StyleSheet } from 'react-native';

import ColItem from '../BackgroundOriented/ColItem';
import CustomGrid from '../CustomGrid';
import CustomRow from '../CustomRow';

const Template1 = ({ items, isReverseOrder = false }) => {
  const content = [
    <CustomRow style={styles.gap} size={1}>
      <ColItem data={items[0]} />
    </CustomRow>,
    <CustomRow size={1.5} style={styles.gap}>
      <ColItem data={items[1]} />

      <ColItem data={items[2]} />
    </CustomRow>,
    <CustomRow size={0.5} style={styles.gap}>
      <ColItem data={items[3]} />

      <ColItem data={items[4]} />
    </CustomRow>,
    <CustomRow style={styles.gap} size={1}>
      <ColItem data={items[5]} />
    </CustomRow>,
  ];

  return (
    <CustomGrid style={styles.container}>
      {isReverseOrder ? content.reverse() : content}
    </CustomGrid>
  );
};

export default Template1;

const styles = StyleSheet.create({
  container: { flex: 1, gap: 6 },
  gap: { gap: 6 },
});

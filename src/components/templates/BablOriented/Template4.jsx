import React from 'react';
import { StyleSheet } from 'react-native';

import ColItem from '../BackgroundOriented/ColItem';
import CustomGrid from '../CustomGrid';
import CustomRow from '../CustomRow';

const Template4 = ({ items }) => {
  return (
    <CustomGrid style={styles.container}>
      <CustomRow style={styles.item} size={1}>
        <ColItem data={items[0]} />
      </CustomRow>
      <CustomRow style={styles.item} size={2}>
        <ColItem data={items[1]} />
      </CustomRow>
      <CustomRow size={1.5} style={styles.item}>
        {items[2] && <ColItem data={items[2]} />}
        {items[3] && <ColItem data={items[3]} />}
        {items[4] && <ColItem data={items[4]} />}
        {items[5] && <ColItem data={items[5]} />}
      </CustomRow>
      <CustomRow style={styles.item} size={2}>
        <ColItem data={items[6]} />
      </CustomRow>
      <CustomRow size={1} style={styles.item}>
        {items[7] && <ColItem data={items[7]} />}
        {items[8] && <ColItem data={items[8]} />}
        {items[9] && <ColItem data={items[9]} />}
        {items[10] && <ColItem data={items[10]} />}
      </CustomRow>
    </CustomGrid>
  );
};

export default Template4;

const styles = StyleSheet.create({
  container: { gap: 6 },
  item: {
    borderRadius: 12,
    borderWidth: 0,
    borderColor: '#282828',
    gap: 6,
    alignSelf: 'center',
  },
});

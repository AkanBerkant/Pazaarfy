import React from 'react';
import { StyleSheet } from 'react-native';

import ColItem from '../BackgroundOriented/ColItem';
import CustomGrid from '../CustomGrid';
import CustomRow from '../CustomRow';

const Template7 = ({ items }) => {
  return (
    <CustomGrid style={styles.container}>
      <CustomRow style={styles.item} size={items.length < 3 ? 1 : 0.5}>
        <ColItem data={items[0]} />

        {items[1] && <ColItem data={items[1]} />}
      </CustomRow>
      {items.length >= 3 && (
        <CustomRow style={styles.item} size={0.5}>
          <ColItem data={items[2]} />

          <ColItem data={items[3]} />

          {items[4] && <ColItem data={items[4]} />}
        </CustomRow>
      )}
      <CustomRow style={styles.item} size={2 / 3}>
        <ColItem data={items[5]} />

        {items[6] && <ColItem data={items[6]} />}
      </CustomRow>
      <CustomRow style={styles.item} size={1}>
        <ColItem data={items[7]} />
      </CustomRow>
    </CustomGrid>
  );
};

export default Template7;

const styles = StyleSheet.create({
  container: { gap: 6 },
  item: {
    borderRadius: 12, borderWidth: 0, borderColor: '#282828', gap: 6,
  },
});

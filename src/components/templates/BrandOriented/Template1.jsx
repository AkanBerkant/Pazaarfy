import React from 'react';
import { StyleSheet } from 'react-native';

import ColItem from '../BackgroundOriented/ColItem';
import CustomGrid from '../CustomGrid';
import CustomRow from '../CustomRow';

const Template1 = ({ items }) => {
  return (
    <CustomGrid style={styles.container}>
      <CustomRow style={styles.container} size={1}>
        <ColItem data={items[0]} />
      </CustomRow>
      <CustomRow size={0.25} />

      <CustomRow style={styles.container} size={1}>
        <ColItem data={items[1]} />
        <ColItem data={items[2]} />
      </CustomRow>
      <CustomRow size={0.25} />

      <CustomRow style={styles.container} size={1}>
        <ColItem data={items[3]} />
        <ColItem data={items[4]} />
      </CustomRow>
      <CustomRow size={0.25} />

      <CustomRow style={styles.container} size={1}>
        <ColItem data={items[5]} />
        <ColItem data={items[6]} />
      </CustomRow>
    </CustomGrid>
  );
};

export default Template1;

const styles = StyleSheet.create({
  container: { gap: 6 },
  item: { borderRadius: 12, borderWidth: 0, borderColor: '#282828' },
});

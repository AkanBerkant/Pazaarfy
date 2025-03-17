import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { Row } from 'react-native-easy-grid';

import { splitArrayIntoChunks } from '../../../utils/split-array';
import BablContentSlide from '../BablOrientedScrollable/BablContentSlide';
import ColItem from '../BackgroundOriented/ColItem';
import CustomGrid from '../CustomGrid';
import CustomRow from '../CustomRow';

const Template4 = ({ items }) => {
  const firstChunks = splitArrayIntoChunks(items.slice(0, 4), 2);
  const secondChunks = splitArrayIntoChunks(items.slice(4, 8), 2);

  return (
    <CustomGrid style={styles.container}>
      <BablContentSlide
        groupList={firstChunks.map((chunk) => {
          return (
            <Row style={styles.container} size={1}>
              <ColItem data={chunk[0]} />
              <ColItem data={chunk[1]} />
            </Row>
          );
        })}
      />

      <BablContentSlide
        size={0.5}
        groupList={secondChunks.map((chunk) => {
          return (
            <Row style={styles.container} size={1}>
              <ColItem data={chunk[0]} />
              <ColItem data={chunk[1]} />
            </Row>
          );
        })}
      />

      <CustomRow size={0.15} />

      <CustomRow style={styles.container} size={1}>
        <ColItem data={items[8]} />
        <ColItem data={items[9]} />
      </CustomRow>
    </CustomGrid>
  );
};

export default Template4;

const styles = StyleSheet.create({
  container: { gap: 6 },
  item: { borderRadius: 12, borderWidth: 0, borderColor: '#282828' },
});

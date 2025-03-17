import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { Row } from 'react-native-easy-grid';

import { splitArrayIntoChunks } from '../../../utils/split-array';
import BablContentSlide from '../BablOrientedScrollable/BablContentSlide';
import ColItem from '../BackgroundOriented/ColItem';
import CustomGrid from '../CustomGrid';
import CustomRow from '../CustomRow';

const Template1 = ({ items }) => {
  const firstChunks = splitArrayIntoChunks(items.slice(8, 12), 2);
  const secondChunks = splitArrayIntoChunks(items.slice(12, 16), 2);

  return (
    <CustomGrid style={styles.container}>
      <CustomRow style={styles.container} size={0.5}>
        <ColItem data={items[0]} />
        <ColItem data={items[1]} />
      </CustomRow>
      <CustomRow style={styles.container} size={0.5}>
        <ColItem data={items[2]} />
        <ColItem data={items[3]} />
      </CustomRow>
      <CustomRow style={styles.container} size={0.5}>
        <ColItem data={items[4]} />
        <ColItem data={items[5]} />
      </CustomRow>
      <CustomRow style={styles.container} size={0.5}>
        <ColItem data={items[6]} />
        <ColItem data={items[7]} />
      </CustomRow>

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
        groupList={secondChunks.map((chunk) => {
          return (
            <Row style={styles.container} size={1}>
              <ColItem data={chunk[0]} />
              <ColItem data={chunk[1]} />
            </Row>
          );
        })}
      />
    </CustomGrid>
  );
};

export default Template1;

const styles = StyleSheet.create({
  container: { gap: 6 },
});

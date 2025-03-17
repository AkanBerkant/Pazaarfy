import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { Row } from 'react-native-easy-grid';

import { splitArrayIntoChunks } from '../../../utils/split-array';
import BablContentSlide from '../BablOrientedScrollable/BablContentSlide';
import ColItem from '../BackgroundOriented/ColItem';
import CustomGrid from '../CustomGrid';
import CustomRow from '../CustomRow';

const Template5 = ({ items }) => {
  const firstChunks = splitArrayIntoChunks(items.slice(0, 6), 3);
  const secondChunks = splitArrayIntoChunks(items.slice(6, 10), 2);
  const thirdChunks = splitArrayIntoChunks(items.slice(10, 14), 2);

  return (
    <CustomGrid style={styles.container}>
      <BablContentSlide
        size={0.5}
        groupList={firstChunks.map((chunk) => {
          return (
            <Row style={styles.container}>
              <ColItem data={chunk[0]} />

              <ColItem data={chunk[1]} />

              <ColItem data={chunk[2]} />
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

      <BablContentSlide
        groupList={thirdChunks.map((chunk) => {
          return (
            <Row style={styles.container} size={1}>
              <ColItem data={chunk[0]} />

              <ColItem data={chunk[1]} />
            </Row>
          );
        })}
      />

      <CustomRow style={styles.container} size={0.33}>
        <ColItem data={items[14]} />

        <ColItem data={items[15]} />

        <ColItem data={items[16]} />
      </CustomRow>
      <CustomRow style={styles.container} size={0.33}>
        <ColItem data={items[17]} />

        <ColItem data={items[18]} />

        <ColItem data={items[19]} />
      </CustomRow>
      <CustomRow style={styles.container} size={0.33}>
        <ColItem data={items[20]} />

        <ColItem data={items[21]} />

        <ColItem data={items[22]} />
      </CustomRow>
    </CustomGrid>
  );
};

export default Template5;

const styles = StyleSheet.create({
  container: { gap: 6 },
});

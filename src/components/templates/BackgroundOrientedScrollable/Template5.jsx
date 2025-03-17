import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { Row } from 'react-native-easy-grid';

import { splitArrayIntoChunks } from '../../../utils/split-array';
import BablContentSlide from '../BablOrientedScrollable/BablContentSlide';
import ColItem from '../BackgroundOriented/ColItem';
import CustomGrid from '../CustomGrid';
import CustomRow from '../CustomRow';

const Template5 = ({ items }) => {
  const firstChunks = splitArrayIntoChunks(items.slice(0, 2), 1);
  const secondChunks = splitArrayIntoChunks(items.slice(4, 10), 3);
  const thirdChunks = splitArrayIntoChunks(items.slice(10, 12), 1);

  return (
    <CustomGrid style={styles.container}>
      <BablContentSlide
        groupList={firstChunks.map((chunk) => {
          return (
            <Row style={styles.container} size={1}>
              <ColItem data={chunk[0]} />
            </Row>
          );
        })}
      />

      <CustomRow size={0.15} />

      <Row style={styles.container} size={1 / 2}>
        <ColItem data={items[2]} />
        {items[3] && <ColItem data={items[3]} />}
      </Row>

      <CustomRow size={0.15} />

      <BablContentSlide
        groupList={secondChunks.map((chunk) => {
          return (
            <Row style={styles.container} size={1}>
              <ColItem data={chunk[0]} />
              {chunk[1] && <ColItem data={chunk[1]} />}
              {chunk[2] && <ColItem data={chunk[2]} />}
            </Row>
          );
        })}
      />

      <CustomRow size={0.15} />

      <BablContentSlide
        groupList={thirdChunks.map((chunk) => {
          return (
            <Row style={styles.container} size={1}>
              <ColItem data={chunk[0]} />
            </Row>
          );
        })}
      />
    </CustomGrid>
  );
};

export default Template5;

const styles = StyleSheet.create({
  container: { gap: 6 },
});

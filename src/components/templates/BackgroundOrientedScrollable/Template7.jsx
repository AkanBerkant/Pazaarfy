import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { Row } from 'react-native-easy-grid';

import { splitArrayIntoChunks } from '../../../utils/split-array';
import BablContentSlide from '../BablOrientedScrollable/BablContentSlide';
import ColItem from '../BackgroundOriented/ColItem';
import CustomGrid from '../CustomGrid';
import CustomRow from '../CustomRow';

const Template7 = ({ items }) => {
  const firstChunks = splitArrayIntoChunks(items.slice(0, 4), 2);
  const secondChunks = splitArrayIntoChunks(items.slice(4, 8), 2);
  const thirdChunks = splitArrayIntoChunks(items.slice(8, 12), 2);
  const forthChunks = splitArrayIntoChunks(items.slice(12, 16), 2);

  return (
    <CustomGrid style={styles.container}>
      <Row>
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
      </Row>

      <CustomRow size={0.15} />

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

      <CustomRow size={0.15} />

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

      <CustomRow size={0.15} />
      <BablContentSlide
        groupList={forthChunks.map((chunk) => {
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

export default Template7;

const styles = StyleSheet.create({
  container: { gap: 6 },
});

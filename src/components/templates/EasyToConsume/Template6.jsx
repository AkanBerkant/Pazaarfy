import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { Row } from 'react-native-easy-grid';

import { splitArrayIntoChunks } from '../../../utils/split-array';
import BablContentSlide from '../BablOrientedScrollable/BablContentSlide';
import ColItem from '../BackgroundOriented/ColItem';
import CustomGrid from '../CustomGrid';
import CustomRow from '../CustomRow';

const Template6 = ({ items }) => {
  const firstChunks = splitArrayIntoChunks(items.slice(0, 4), 2);
  const secondChunks = splitArrayIntoChunks(items.slice(6, 10), 2);
  const forthChunks = splitArrayIntoChunks(items.slice(11, 15), 2);

  return (
    <CustomGrid style={styles.container}>
      <BablContentSlide
        marginRight={0}
        size={0.33}
        groupList={firstChunks.map((chunk) => {
          return (
            <Row style={styles.container}>
              <ColItem data={chunk[0]} />

              <ColItem data={chunk[1]} />
            </Row>
          );
        })}
      />

      <CustomRow style={styles.container} size={0.33}>
        <ColItem data={items[4]} />

        <ColItem data={items[5]} />
      </CustomRow>

      <BablContentSlide
        marginRight={0}
        size={0.33}
        groupList={secondChunks.map((chunk) => {
          return (
            <Row style={styles.container}>
              <ColItem data={chunk[0]} />

              <ColItem data={chunk[1]} />
            </Row>
          );
        })}
      />

      <CustomRow style={styles.container} size={1}>
        <ColItem data={items[10]} />
      </CustomRow>

      <BablContentSlide
        marginRight={0}
        size={0.5}
        groupList={forthChunks.map((chunk) => {
          return (
            <Row style={styles.container}>
              <ColItem data={chunk[0]} />

              <ColItem data={chunk[1]} />
            </Row>
          );
        })}
      />
    </CustomGrid>
  );
};

export default Template6;

const styles = StyleSheet.create({
  container: { gap: 6 },
});

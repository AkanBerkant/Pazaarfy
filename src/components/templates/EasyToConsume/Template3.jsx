import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { Row } from 'react-native-easy-grid';

import { splitArrayIntoChunks } from '../../../utils/split-array';
import BablContentSlide from '../BablOrientedScrollable/BablContentSlide';
import ColItem from '../BackgroundOriented/ColItem';
import CustomGrid from '../CustomGrid';
import CustomRow from '../CustomRow';

const Template3 = ({ items }) => {
  const firstChunks = splitArrayIntoChunks(items.slice(0, 6), 3);
  const secondChunks = splitArrayIntoChunks(items.slice(7, 13), 3);
  const thirdChunks = splitArrayIntoChunks(items.slice(19, 25), 3);

  return (
    <CustomGrid style={styles.container}>
      <BablContentSlide
        groupList={firstChunks.map((chunk) => {
          return (
            <Row style={styles.container} size={1}>
              <ColItem data={chunk[0]} />
              <ColItem data={chunk[1]} />
              <ColItem data={chunk[2]} />
            </Row>
          );
        })}
      />

      <CustomRow style={styles.container} size={1}>
        <ColItem data={items[6]} />
      </CustomRow>

      <BablContentSlide
        size={0.5}
        groupList={secondChunks.map((chunk) => {
          return (
            <Row style={styles.container} size={1}>
              <ColItem data={chunk[0]} />
              <ColItem data={chunk[1]} />
              <ColItem data={chunk[2]} />
            </Row>
          );
        })}
      />

      <CustomRow style={styles.container} size={0.5}>
        <ColItem data={items[13]} />

        <ColItem data={items[14]} />

        <ColItem data={items[15]} />
      </CustomRow>
      <CustomRow style={styles.container} size={0.5}>
        <ColItem data={items[16]} />

        <ColItem data={items[17]} />

        <ColItem data={items[18]} />
      </CustomRow>

      <BablContentSlide
        size={0.5}
        groupList={thirdChunks.map((chunk) => {
          return (
            <CustomRow style={styles.container} size={1}>
              <ColItem data={chunk[0]} />
              <ColItem data={chunk[1]} />
              <ColItem data={chunk[2]} />
            </CustomRow>
          );
        })}
      />
    </CustomGrid>
  );
};

export default Template3;

const styles = StyleSheet.create({
  container: { gap: 6 },
});

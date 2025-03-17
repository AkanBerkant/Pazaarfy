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
  const forthChunks = splitArrayIntoChunks(items.slice(13, 19), 3);
  const fifthChunks = splitArrayIntoChunks(items.slice(19, 25), 3);
  const sixthChunks = splitArrayIntoChunks(items.slice(25, 31), 3);

  return (
    <CustomGrid style={styles.container}>
      <CustomRow style={styles.container} size={0.5}>
        <ColItem data={items[0]} />
      </CustomRow>

      <BablContentSlide
        groupList={firstChunks.map((chunk) => {
          return (
            <CustomRow style={styles.container} size={1}>
              <ColItem data={chunk[0]} />

              <ColItem data={chunk[1]} />
            </CustomRow>
          );
        })}
      />

      <BablContentSlide
        marginRight={0}
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

      <BablContentSlide
        size={0.5}
        marginRight={0}
        groupList={thirdChunks.map((chunk) => {
          return (
            <Row style={styles.container} size={1}>
              <ColItem data={chunk[0]} />

              <ColItem data={chunk[1]} />
            </Row>
          );
        })}
      />

      <CustomRow style={styles.container} size={0.5}>
        <ColItem data={items[7]} />
      </CustomRow>

      <BablContentSlide
        marginRight={0}
        groupList={forthChunks.map((chunk) => {
          return (
            <Row style={styles.container} size={1}>
              <ColItem data={chunk[0]} />

              <ColItem data={chunk[1]} />

              <ColItem data={chunk[2]} />
            </Row>
          );
        })}
      />

      <BablContentSlide
        marginRight={0}
        size={0.5}
        groupList={fifthChunks.map((chunk) => {
          return (
            <Row style={styles.container} size={1}>
              <ColItem data={chunk[0]} />

              <ColItem data={chunk[1]} />

              <ColItem data={chunk[2]} />
            </Row>
          );
        })}
      />

      <BablContentSlide
        marginRight={0}
        size={0.5}
        groupList={sixthChunks.map((chunk) => {
          return (
            <Row style={styles.container} size={1}>
              <ColItem data={chunk[0]} />

              <ColItem data={chunk[1]} />

              <ColItem data={chunk[2]} />
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
  item: { borderRadius: 12, borderWidth: 0, borderColor: '#282828' },
});

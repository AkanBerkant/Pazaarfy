import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { Row } from 'react-native-easy-grid';

import { splitArrayIntoChunks } from '../../../utils/split-array';
import BablContentSlide from '../BablOrientedScrollable/BablContentSlide';
import ColItem from '../BackgroundOriented/ColItem';
import CustomGrid from '../CustomGrid';
import CustomRow from '../CustomRow';

const Template6 = ({ items }) => {
  const firstChunks = splitArrayIntoChunks(items.slice(0, 2), 1);
  const secondChunks = splitArrayIntoChunks(items.slice(2, 6), 2);
  const thirdChunks = splitArrayIntoChunks(items.slice(6, 10), 2);

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

      <BablContentSlide
        groupList={secondChunks.map((chunk) => {
          return (
            <Row style={styles.container} size={1}>
              <ColItem data={chunk[0]} />
              {chunk[1] && <ColItem data={chunk[1]} />}
            </Row>
          );
        })}
      />

      <CustomRow size={0.15} />

      <Row>
        <BablContentSlide
          groupList={thirdChunks.map((chunk) => {
            return (
              <Row style={styles.container} size={1}>
                <ColItem data={chunk[0]} />
                {chunk[1] && <ColItem data={chunk[1]} />}
              </Row>
            );
          })}
        />
      </Row>
    </CustomGrid>
  );
};

export default Template6;

const styles = StyleSheet.create({
  container: { gap: 6 },
});

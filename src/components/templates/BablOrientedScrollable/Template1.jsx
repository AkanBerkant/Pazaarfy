import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { Col, Row } from 'react-native-easy-grid';

import { splitArrayIntoChunks } from '../../../utils/split-array';
import ColItem from '../BackgroundOriented/ColItem';
import CustomGrid from '../CustomGrid';
import CustomRow from '../CustomRow';

import BablContentSlide from './BablContentSlide';

const Template1 = ({ items }) => {
  const firstChunks = splitArrayIntoChunks(items.slice(0, 2), 1);
  const secondChunks = splitArrayIntoChunks(items.slice(2, 6), 2);
  const thirdChunks = splitArrayIntoChunks(items.slice(6, 10), 2);
  const forthChunks = splitArrayIntoChunks(items.slice(10, 12), 2);

  return (
    <CustomGrid style={styles.container}>
      <Col style={styles.container} size={1}>
        <BablContentSlide
          size={1}
          groupList={firstChunks.map((chunk) => {
            return (
              <Row style={styles.item} size={1}>
                <ColItem data={chunk[0]} />
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

        <BablContentSlide
          size={0.5}
          groupList={thirdChunks.map((chunk) => {
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
          groupList={forthChunks.map((chunk) => {
            return (
              <Row style={styles.container} size={1}>
                <Row style={styles.item} size={1}>
                  <ColItem data={chunk[0]} />
                </Row>
                <Row style={styles.item} size={1}>
                  <ColItem data={chunk[1]} />
                </Row>
              </Row>
            );
          })}
        />
      </Col>
    </CustomGrid>
  );
};

export default Template1;

const styles = StyleSheet.create({
  container: { gap: 6 },
  item: { borderRadius: 12, borderWidth: 0, borderColor: '#282828' },
});

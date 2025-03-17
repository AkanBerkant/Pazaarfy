import React from 'react';
import { StyleSheet } from 'react-native';

import { Row } from 'react-native-easy-grid';

import { splitArrayIntoChunks } from '../../../utils/split-array';
import ColItem from '../BackgroundOriented/ColItem';
import CustomGrid from '../CustomGrid';
import CustomRow from '../CustomRow';

import BablContentSlide from './BablContentSlide';

const Template3 = ({ items }) => {
  const firstChunks = splitArrayIntoChunks(items.slice(0, 6), 3);
  const secondChunks = splitArrayIntoChunks(items.slice(7, 11), 2);
  const thirdChunks = splitArrayIntoChunks(items.slice(12, 14), 1);

  return (
    <CustomGrid style={styles.container}>
      <BablContentSlide
        groupList={firstChunks.map((chunk) => {
          return (
            <Row style={styles.container} size={1}>
              <Row style={styles.item} size={1}>
                <ColItem data={chunk[0]} />
              </Row>
              {chunk[1] && (
                <Row style={styles.item} size={1}>
                  <ColItem data={chunk[1]} />
                </Row>
              )}
              {chunk[2] && (
                <Row style={styles.item} size={1}>
                  <ColItem data={chunk[2]} />
                </Row>
              )}
            </Row>
          );
        })}
      />
      <CustomRow style={styles.container} size={2}>
        <ColItem data={items[6]} />
      </CustomRow>

      <BablContentSlide
        groupList={secondChunks.map((chunk) => {
          return (
            <Row style={styles.container} size={1.5}>
              <Row style={styles.item} size={1}>
                <ColItem data={chunk[0]} />
              </Row>
              {chunk[1] && (
                <Row style={styles.item} size={1}>
                  <ColItem data={chunk[1]} />
                </Row>
              )}
            </Row>
          );
        })}
      />
      <CustomRow style={styles.container} size={1.5}>
        <ColItem data={items[11]} />
      </CustomRow>
      <BablContentSlide
        groupList={thirdChunks.map((chunk) => {
          return (
            <Row style={styles.container} size={2}>
              <ColItem data={chunk[0]} />
            </Row>
          );
        })}
      />
      <CustomRow style={styles.container} size={1}>
        <ColItem data={items[14]} />
      </CustomRow>
    </CustomGrid>
  );
};

export default Template3;

const styles = StyleSheet.create({
  container: { gap: 6 },
  item: { borderRadius: 12, borderWidth: 0, borderColor: '#282828' },
});

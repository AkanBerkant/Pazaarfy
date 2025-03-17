import React from 'react';
import { StyleSheet } from 'react-native';

import { Row } from 'react-native-easy-grid';

import { splitArrayIntoChunks } from '../../../utils/split-array';
import ColItem from '../BackgroundOriented/ColItem';
import CustomGrid from '../CustomGrid';
import CustomRow from '../CustomRow';

import BablContentSlide from './BablContentSlide';

const Template5 = ({ items }) => {
  const firstChunks = splitArrayIntoChunks(items.slice(1, 7), 3);
  const secondChunks = splitArrayIntoChunks(items.slice(8, 14), 3);

  return (
    <CustomGrid style={styles.container}>
      <CustomRow style={styles.container} size={1}>
        <ColItem data={items[0]} />
      </CustomRow>

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

      <CustomRow style={styles.container} size={1}>
        <ColItem data={items[7]} />
      </CustomRow>

      <BablContentSlide
        size={0.5}
        groupList={secondChunks.map((chunk) => {
          return (
            <Row style={styles.container}>
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
    </CustomGrid>
  );
};

export default Template5;

const styles = StyleSheet.create({
  container: { gap: 6 },
  item: { borderRadius: 12, borderWidth: 0, borderColor: '#282828' },
});

import React from 'react';
import { StyleSheet } from 'react-native';

import { Row } from 'react-native-easy-grid';

import { splitArrayIntoChunks } from '../../../utils/split-array';
import BablContentSlide from '../BablOrientedScrollable/BablContentSlide';
import ColItem from '../BackgroundOriented/ColItem';
import CustomGrid from '../CustomGrid';
import CustomRow from '../CustomRow';

const Template2 = ({ items }) => {
  const firstChunks = splitArrayIntoChunks(items.slice(1, 5), 2);
  const secondChunks = splitArrayIntoChunks(items.slice(5, 9), 2);

  return (
    <CustomGrid style={styles.container}>
      <CustomRow style={styles.container} size={0.5}>
        <ColItem data={items[0]} />
      </CustomRow>
      <CustomRow size={0.15} />

      <BablContentSlide
        groupList={firstChunks.map((chunk) => {
          return (
            <Row style={styles.container} size={1}>
              <Row size={1}>
                <ColItem data={chunk[0]} />
              </Row>
              {chunk[1] && (
                <Row size={1}>
                  <ColItem data={chunk[1]} />
                </Row>
              )}
            </Row>
          );
        })}
      />

      <BablContentSlide
        groupList={secondChunks.map((chunk) => {
          return (
            <Row style={styles.container} size={1}>
              <Row size={1}>
                <ColItem data={chunk[0]} />
              </Row>
              {chunk[1] && (
                <Row size={1}>
                  <ColItem data={chunk[1]} />
                </Row>
              )}
            </Row>
          );
        })}
      />

      <CustomRow size={0.15} />
    </CustomGrid>
  );
};

export default Template2;

const styles = StyleSheet.create({
  container: { gap: 6 },
  item: { borderRadius: 12, borderWidth: 0, borderColor: '#282828' },
});

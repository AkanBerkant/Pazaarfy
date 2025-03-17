import React from 'react';
import { StyleSheet } from 'react-native';

import { Grid, Row, Col } from 'react-native-easy-grid';

import { splitArrayIntoChunks } from '../../../utils/split-array';
import BablContentSlide from '../BablOrientedScrollable/BablContentSlide';
import ColItem from '../BackgroundOriented/ColItem';
import CustomGrid from '../CustomGrid';

const Template6 = ({ items }) => {
  const firstChunks = splitArrayIntoChunks(items.slice(0, 2), 1);
  const secodChunks = splitArrayIntoChunks(items.slice(2, 4), 1);

  return (
    <CustomGrid style={{ gap: 36 }}>
      <BablContentSlide
        groupList={firstChunks.map((chunk) => {
          return (
            <Row style={styles.item} size={1}>
              <ColItem data={chunk[0]} />
            </Row>
          );
        })}
      />
      <BablContentSlide
        groupList={secodChunks.map((chunk) => {
          return (
            <Row style={styles.item} size={1}>
              <ColItem data={chunk[0]} />
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
  item: { borderRadius: 12, borderWidth: 0, borderColor: '#282828' },
});

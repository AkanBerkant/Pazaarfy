import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { Row } from 'react-native-easy-grid';

import { splitArrayIntoChunks } from '../../../utils/split-array';
import BablContentSlide from '../BablOrientedScrollable/BablContentSlide';
import ColItem from '../BackgroundOriented/ColItem';
import CustomGrid from '../CustomGrid';
import CustomRow from '../CustomRow';

const Template2 = ({ items }) => {
  const firstChunks = splitArrayIntoChunks(items.slice(6, 12), 3);

  return (
    <CustomGrid style={styles.container}>
      <CustomRow style={styles.container} size={1}>
        <ColItem data={items[0]} />
        <ColItem data={items[1]} />
        <ColItem data={items[2]} />
      </CustomRow>
      <CustomRow style={styles.container} size={1}>
        <ColItem data={items[3]} />
        <ColItem data={items[4]} />
      </CustomRow>

      <CustomRow style={styles.container} size={1}>
        <ColItem data={items[5]} />
      </CustomRow>

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
    </CustomGrid>
  );
};

export default Template2;

const styles = StyleSheet.create({
  container: { gap: 6 },
});

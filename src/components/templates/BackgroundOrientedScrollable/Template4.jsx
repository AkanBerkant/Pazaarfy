import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { Row } from 'react-native-easy-grid';

import { splitArrayIntoChunks } from '../../../utils/split-array';
import BablContentSlide from '../BablOrientedScrollable/BablContentSlide';
import ColItem from '../BackgroundOriented/ColItem';
import CustomGrid from '../CustomGrid';
import CustomRow from '../CustomRow';

const Template4 = ({ items }) => {
  const firstChunks = splitArrayIntoChunks(items.slice(0, 6), 3);
  const secondChunks = splitArrayIntoChunks(items.slice(7, 13), 3);

  return (
    <CustomGrid style={styles.container}>
      <BablContentSlide
        groupList={firstChunks.map((chunk) => {
          return (
            <Row style={styles.container} size={1}>
              <ColItem data={chunk[0]} />

              {chunk[1] && <ColItem data={chunk[1]} />}

              {chunk[2] && <ColItem data={chunk[2]} />}
            </Row>
          );
        })}
      />

      <CustomRow size={0.15} />
      <CustomRow style={styles.container} size={1}>
        <ColItem data={items[6]} />
      </CustomRow>
      <CustomRow size={0.15} />

      <BablContentSlide
        size={0.5}
        groupList={secondChunks.map((chunk) => {
          return (
            <Row style={styles.container}>
              <ColItem data={chunk[0]} />
              {chunk[1] && <ColItem data={chunk[1]} />}
              {chunk[2] && <ColItem data={chunk[2]} />}
            </Row>
          );
        })}
      />
    </CustomGrid>
  );
};

export default Template4;

const styles = StyleSheet.create({
  container: { gap: 6 },
  item: { borderRadius: 12, borderWidth: 0, borderColor: '#282828' },
});

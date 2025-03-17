import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';

import { Col, Row } from 'react-native-easy-grid';

import { splitArrayIntoChunks } from '../../../utils/split-array';
import ColItem from '../BackgroundOriented/ColItem';
import CustomGrid from '../CustomGrid';
import CustomRow from '../CustomRow';

import BablContentSlide from './BablContentSlide';

const Template7 = ({ items }) => {
  const firstChunks = splitArrayIntoChunks(items.slice(0, 6), 3);
  const secondChunks = splitArrayIntoChunks(items.slice(8, 10), 1);

  return (
    <CustomGrid style={styles.container}>
      <BablContentSlide
        pagingEnabled
        groupList={firstChunks.map((chunk) => {
          return (
            <Row style={styles.container} size={1}>
              <Row size={1}>
                <ColItem data={chunk[0]} />
              </Row>
              {chunk[1] && (
                <Col size={1} style={styles.container}>
                  <Row size={1}>
                    <ColItem data={chunk[1]} />
                  </Row>
                  {chunk[2] && (
                    <Row size={1}>
                      <ColItem data={chunk[2]} />
                    </Row>
                  )}
                </Col>
              )}
            </Row>
          );
        })}
      />
      <CustomRow style={styles.container} size={1}>
        <ColItem data={items[6]} />
        {items[7] && <ColItem data={items[7]} />}
      </CustomRow>
      <BablContentSlide
        groupList={secondChunks.map((chunk) => {
          return (
            <Row style={styles.container} size={1}>
              <ColItem data={chunk[0]} />
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
});

import React from 'react';
import { StyleSheet } from 'react-native';

import { Col, Row } from 'react-native-easy-grid';

import { splitArrayIntoChunks } from '../../../utils/split-array';
import ColItem from '../BackgroundOriented/ColItem';
import CustomGrid from '../CustomGrid';
import CustomRow from '../CustomRow';

import BablContentSlide from './BablContentSlide';

const Template4 = ({ items }) => {
  const firstChunks = splitArrayIntoChunks(items.slice(0, 12), 6);
  const secondChunks = splitArrayIntoChunks(items.slice(13, 25), 6);

  return (
    <CustomGrid style={styles.container}>
      <BablContentSlide
        groupList={firstChunks.map((chunk) => {
          return (
            <Col style={{ gap: 6 }}>
              <Row style={styles.container} size={0.33}>
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
              <Row style={styles.container} size={0.66}>
                <Row style={styles.item} size={1}>
                  <ColItem data={chunk[3]} />
                </Row>
                {chunk[4] && (
                  <Row style={styles.item} size={1}>
                    <ColItem data={chunk[4]} />
                  </Row>
                )}
                {chunk[5] && (
                  <Row style={styles.item} size={1}>
                    <ColItem data={chunk[5]} />
                  </Row>
                )}
              </Row>
            </Col>
          );
        })}
      />

      <CustomRow style={styles.item} size={1}>
        <ColItem data={items[12]} />
      </CustomRow>

      <BablContentSlide
        groupList={secondChunks.map((chunk) => {
          return (
            <Col style={{ gap: 6 }}>
              <Row style={styles.container} size={0.66}>
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

              <Row style={styles.container} size={0.33}>
                <Row style={styles.item} size={1}>
                  <ColItem data={chunk[3]} />
                </Row>
                {chunk[4] && (
                  <Row style={styles.item} size={1}>
                    <ColItem data={chunk[4]} />
                  </Row>
                )}
                {chunk[5] && (
                  <Row style={styles.item} size={1}>
                    <ColItem data={chunk[5]} />
                  </Row>
                )}
              </Row>
            </Col>
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

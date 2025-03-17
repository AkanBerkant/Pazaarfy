import React from 'react';
import { StyleSheet } from 'react-native';

import { Col, Row } from 'react-native-easy-grid';

import { splitArrayIntoChunks } from '../../../utils/split-array';
import BablContentSlide from '../BablOrientedScrollable/BablContentSlide';
import ColItem from '../BackgroundOriented/ColItem';
import CustomGrid from '../CustomGrid';
import CustomRow from '../CustomRow';

const Template4 = ({ items }) => {
  const firstChunks = splitArrayIntoChunks(items.slice(1, 9), 4);

  return (
    <CustomGrid style={styles.container}>
      <CustomRow style={styles.container} size={1}>
        <ColItem data={items[0]} />
      </CustomRow>
      <CustomRow size={0.25} />

      <BablContentSlide
        size={0.5}
        groupList={firstChunks.map((chunk) => {
          return (
            <Col size={1} style={{ gap: 6 }}>
              <Row style={styles.container}>
                <ColItem data={chunk[0]} />
                {chunk[1] && <ColItem data={chunk[1]} />}
              </Row>

              {chunk[2] && (
                <Row style={styles.container}>
                  <ColItem data={chunk[2]} />
                  {chunk[3] && <ColItem data={chunk[3]} />}
                </Row>
              )}
            </Col>
          );
        })}
      />
      <CustomRow size={0.25} />
    </CustomGrid>
  );
};

export default Template4;

const styles = StyleSheet.create({
  container: { gap: 6 },
  item: { borderRadius: 12, borderWidth: 0, borderColor: '#282828' },
});

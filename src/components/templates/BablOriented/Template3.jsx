import React from 'react';
import { StyleSheet } from 'react-native';

import { Col, Row } from 'react-native-easy-grid';

import ColItem from '../BackgroundOriented/ColItem';
import CustomGrid from '../CustomGrid';
import CustomRow from '../CustomRow';

const Template3 = ({ items }) => {
  return (
    <CustomGrid style={styles.container}>
      <CustomRow size={1.25}>
        <ColItem data={items[0]} />
      </CustomRow>
      <CustomRow size={1.25}>
        <ColItem data={items[1]} />
      </CustomRow>
      <CustomRow size={1} style={styles.gap}>
        <ColItem data={items[2]} />

        <ColItem data={items[3]} />
      </CustomRow>
      <CustomRow size={3} style={styles.gap}>
        <ColItem data={items[4]} />

        {items.length >= 6 && (
          <Col style={styles.gap}>
            <Row size={1}>
              <ColItem data={items[5]} />
            </Row>
            {items.length >= 7 && (
              <Row size={1}>
                <ColItem data={items[6]} />
              </Row>
            )}
          </Col>
        )}
      </CustomRow>
    </CustomGrid>
  );
};

export default Template3;

const styles = StyleSheet.create({
  container: { gap: 6 },
  gap: { gap: 6 },
});

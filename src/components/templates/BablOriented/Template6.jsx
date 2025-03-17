import React from 'react';
import { StyleSheet } from 'react-native';

import { Row, Col } from 'react-native-easy-grid';

import ColItem from '../BackgroundOriented/ColItem';
import CustomGrid from '../CustomGrid';
import CustomRow from '../CustomRow';

const Template6 = ({ items }) => {
  return (
    <CustomGrid style={styles.container}>
      <CustomRow style={styles.item} size={1}>
        <ColItem data={items[0]} />
      </CustomRow>
      <CustomRow size={1} style={styles.container}>
        <ColItem data={items[1]} />

        {items[2] && (
          <Col style={{
            gap: 6,
          }}
          >
            <Row style={styles.item}>
              <ColItem data={items[2]} />
            </Row>
            {
              items[3] && (
                <Row style={styles.item}>
                  <ColItem data={items[3]} />
                </Row>
              )
            }
          </Col>
        )}
      </CustomRow>
      <CustomRow style={styles.item} size={0.5}>
        <ColItem data={items[4]} />
      </CustomRow>
    </CustomGrid>
  );
};

export default Template6;

const styles = StyleSheet.create({
  container: { gap: 6 },
  item: { borderRadius: 12, borderWidth: 0, borderColor: '#282828' },
});

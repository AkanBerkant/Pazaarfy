import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Col, Grid, Row } from 'react-native-easy-grid';

import { sizes } from '../../../theme';

import { renderProfileChunkItem } from './ProfileShape3';

const ProfileShape2 = ({ chunk }) => {
  return (
    <View style={styles.gridContainer}>
      <Grid style={styles.grid}>
        <Col style={styles.col}>
          <Row style={styles.row}>
            {renderProfileChunkItem(chunk[0])}
          </Row>
          <Row style={styles.row} size={2}>
            {renderProfileChunkItem(chunk[3])}
          </Row>
        </Col>
        <Col style={styles.col}>
          <Row style={styles.row}>
            {renderProfileChunkItem(chunk[1])}
          </Row>
          <Row style={styles.row} size={2}>
            {renderProfileChunkItem(chunk[4])}
          </Row>
        </Col>
        <Col style={styles.col}>
          <Row style={styles.row}>
            {renderProfileChunkItem(chunk[2])}
          </Row>
          <Row style={styles.row}>
            {renderProfileChunkItem(chunk[5])}
          </Row>
        </Col>
      </Grid>
    </View>
  );
};

export default ProfileShape2;

const styles = StyleSheet.create({
  gridContainer: {
    height: 400,
    width: sizes.width,
    marginBottom: 6,
  },
  grid: { gap: 2 },
  col: { alignItems: 'center', justifyContent: 'center', gap: 2 },
  row: {
    alignSelf: 'stretch',
    borderRadius: 12,
    overflow: 'hidden',
  },
  item: {
    flex: 1,
    resizeMode: 'cover',
  },
});

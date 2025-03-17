import React from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Col, Grid, Row } from 'react-native-easy-grid';

import { sizes } from '../../../theme';
import fonts from '../../../theme/fonts';
import { bablCategoriesIcon } from '../../createbabl/CreateBabl';

export const renderProfileChunkItem = (item) => {
  if (!item) return null;

  return (
    <ImageBackground
      source={{ uri: item.coverCropped || item.cover }}
      style={styles.item}
    >
      <View style={[styles.footer, styles.top]}>
        <Text style={styles.title}>{item.title}</Text>
      </View>
      <View style={styles.footer}>
        <Image source={{ uri: item.user.photo }} style={styles.pp} />
        <Text style={styles.name}>{item.user.username}</Text>
        <View style={{ flex: 1 }} />
        <Image
          source={bablCategoriesIcon[item.category]}
          style={styles.categoryIcon}
        />
      </View>
    </ImageBackground>
  );
};

const ProfileShape3 = ({ chunk }) => {
  return (
    <View style={styles.gridContainer}>
      <Grid style={styles.grid}>
        <Row style={styles.row} size={2}>
          <Col style={styles.col}>
            {renderProfileChunkItem(chunk[0])}
          </Col>
          <Col style={styles.col}>
            {renderProfileChunkItem(chunk[1])}
          </Col>
          <Col style={styles.col}>
            {renderProfileChunkItem(chunk[2])}
          </Col>
        </Row>
        <Row style={styles.row}>
          <Col style={styles.col}>
            {renderProfileChunkItem(chunk[3])}
          </Col>
          <Col style={styles.col}>
            {renderProfileChunkItem(chunk[4])}
          </Col>
          <Col style={styles.col}>
            {renderProfileChunkItem(chunk[5])}
          </Col>
        </Row>
        <Row style={styles.row}>
          <Col style={styles.col}>
            {renderProfileChunkItem(chunk[6])}
          </Col>
          <Col style={styles.col}>
            {renderProfileChunkItem(chunk[7])}
          </Col>
        </Row>
      </Grid>
    </View>
  );
};

export default ProfileShape3;

const styles = StyleSheet.create({
  gridContainer: {
    height: 400,
    width: sizes.width,
    marginBottom: 6,
  },
  grid: { gap: 2 },
  col: { borderRadius: 12, overflow: 'hidden' },
  row: { gap: 2 },
  item: {
    flex: 1,
    resizeMode: 'cover',
  },
  name: {
    color: '#FFF',
    fontFamily: fonts.roboto,
    marginLeft: 5,
    fontSize: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOpacity: 3,
    shadowOffset: { width: 3, height: 2 },
    shadowColor: '#000',
    elevation: 5,
  },
  pp: {
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: '#CDCDCD',
  },
  categoryIcon: {
    width: 16,
    height: 16,
    tintColor: '#FFF',
  },
  footer: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  top: {
    bottom: null,
    top: 4,
  },
  title: {
    fontFamily: fonts.roboto,
    fontSize: 12,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOpacity: 3,
    shadowOffset: { width: 3, height: 2 },
    shadowColor: '#000',
    elevation: 5,
  },
});

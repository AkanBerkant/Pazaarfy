import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { Col } from 'react-native-easy-grid';

import TemplateItem from '../TemplateItem';

const ColItem = ({ data }) => {
  if (!data) {
    return null;
  }

  return (
    <Col style={styles.item}>
      <TemplateItem data={data} />
    </Col>
  );
};

export default ColItem;

const styles = StyleSheet.create({
  item: {
    borderRadius: 12, borderWidth: 0, borderColor: 'red', gap: 6, overflow: 'hidden',
  },
});

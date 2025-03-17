import React from 'react';
import { StyleSheet } from 'react-native';

import { Row, Col } from 'react-native-easy-grid';

import { splitArrayIntoChunks } from '../../../utils/split-array';
import ColItem from '../BackgroundOriented/ColItem';
import CustomGrid from '../CustomGrid';

const Template5 = ({ items }) => {
  const chunks = splitArrayIntoChunks(items, items.length >= 10 ? 2 : 1);

  return (
    <CustomGrid style={{ gap: 36 }}>
      {chunks.map((chunk) => {
        return (
          <Row style={[styles.item, { gap: 6, height: 300 }]} size={1}>
            <ColItem data={chunk[0]} />
            {!!chunk[1] && <ColItem data={chunk[1]} />}
          </Row>
        );
      })}
    </CustomGrid>
  );
};

export default Template5;

const styles = StyleSheet.create({
  container: { gap: 6 },
  item: { borderRadius: 12, borderWidth: 0, borderColor: '#282828' },
});

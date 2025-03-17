import React from 'react';
import { StyleSheet } from 'react-native';

import { splitArrayIntoChunks } from '../../../utils/split-array';
import ColItem from '../BackgroundOriented/ColItem';
import CustomGrid from '../CustomGrid';
import CustomRow from '../CustomRow';

const Template2 = ({ items }) => {
  const colCount = items.length <= 5 ? 1 : items.length <= 10 ? 2 : 3;

  const chunks = splitArrayIntoChunks(items, colCount);

  return (
    <CustomGrid style={styles.container}>
      {chunks.map((chunk) => {
        return (
          <CustomRow style={styles.item} size={1}>
            {chunk.map((item) => {
              return (
                <ColItem data={item} />
              );
            })}
          </CustomRow>
        );
      })}
    </CustomGrid>
  );
};

export default Template2;

const styles = StyleSheet.create({
  container: { gap: 6 },
  item: {
    borderRadius: 12, borderWidth: 0, borderColor: '#282828', gap: 6,
  },
});

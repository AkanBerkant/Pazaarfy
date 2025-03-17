import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';

import { Col, Row } from 'react-native-easy-grid';

import { BablUrlContext } from '../../../screens/BablContent/BablContent';
import ColItem from '../BackgroundOriented/ColItem';
import CustomGrid from '../CustomGrid';
import CustomRow from '../CustomRow';

const Template2 = ({ items, chunkIndex }) => {
  const { templateHeight } = useContext(BablUrlContext);

  const content = [
    <Col
      style={[
        styles.container,
        {
          height: items[2] ? templateHeight : templateHeight / 2,
        },
      ]}
      size={1}
    >
      <Row style={styles.item} size={1}>
        <ColItem data={items[0]} />
      </Row>
      {items[2] && (
        <>
          <Row size={0.25} />
          <Row style={styles.item} size={1}>
            <ColItem data={items[2]} />
          </Row>
        </>
      )}
    </Col>,
    <Col
      style={[styles.container, { height: items[1] ? templateHeight : 0 }]}
      size={1}
    >
      <Row size={0.625} />
      <Row style={styles.item} size={1}>
        <ColItem data={items[1]} />
      </Row>
      <Row size={0.625} />
    </Col>,
  ];

  return (
    <CustomGrid style={styles.container}>
      {chunkIndex % 2 === 0 ? content : content.reverse()}
    </CustomGrid>
  );
};

export default Template2;

const styles = StyleSheet.create({
  container: { gap: 6 },
  item: { borderRadius: 12, borderWidth: 0, borderColor: '#282828' },
});

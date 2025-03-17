import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';

import { Row } from 'react-native-easy-grid';

import { GridContext } from './CustomGrid';

const CustomRow = ({ children, ...props }) => {
  const partSize = useContext(GridContext);

  return (
    <Row style={[props.style, { height: partSize * props.size }]}>{children}</Row>
  );
};

export default CustomRow;

const styles = StyleSheet.create({});

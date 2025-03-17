import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Col, Grid } from 'react-native-easy-grid';

import { BablUrlContext } from '../../screens/BablContent/BablContent';

export const GridContext = React.createContext(0);

const CustomGrid = ({ children, ...props }) => {
  const { templateHeight } = useContext(BablUrlContext);

  const childrenArr = Array.isArray(children) ? children : [children];
  const totalParts = childrenArr.reduce((prev, cur) => {
    return prev + (cur.props?.size || 1);
  }, 0);
  const partSize = templateHeight / totalParts;

  return (
    <GridContext.Provider value={partSize}>
      <Grid {...props}>
        <Col style={styles.col}>
          {childrenArr.map((Item) => {
            if (!Item) return null;

            if (
              ['BablContentSlide', 'RowNB', 'ColumnNB'].includes(Item.type.name)
            ) return Item;

            const childrenArr = Array.isArray(Item.props.children)
              ? Item.props.children
              : [Item.props.children];
            if (!childrenArr[0]?.props.data) return null;

            return Item;
          })}
        </Col>
      </Grid>
    </GridContext.Provider>
  );
};

export default CustomGrid;

const styles = StyleSheet.create({
  col: {
    gap: 6,
  },
});

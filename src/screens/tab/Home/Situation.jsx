import React from "react";
import { StyleSheet, View } from "react-native";

import { Col, Grid, Row } from "react-native-easy-grid";

import { sizes } from "../../../theme";

import SituationItem from "./SituationItem";

const Situation = ({ chunk, getAllData, targetUserId }) => {
  return (
    <View style={styles.gridContainer}>
      <Grid style={styles.grid}>
        <Row style={styles.row}>
          <Col style={styles.col}>
            {chunk[0] && (
              <SituationItem
                item={chunk[0]}
                getAllData={getAllData}
                targetUserId={targetUserId}
              />
            )}
          </Col>
          <Col style={styles.col} size={1}>
            {chunk[1] && (
              <SituationItem
                item={chunk[1]}
                getAllData={getAllData}
                targetUserId={targetUserId}
              />
            )}
          </Col>
        </Row>
      </Grid>
    </View>
  );
};

export default Situation;

const styles = StyleSheet.create({
  gridContainer: {
    width: sizes.width,
    height: 180,
    borderRadius: 17,
    elevation: 5,
  },
  grid: { gap: 6 },
  col: {
    alignItems: "center",
    justifyContent: "center",

    overflow: "hidden",
  },
  row: {
    alignSelf: "stretch",
    gap: 2,
  },
});

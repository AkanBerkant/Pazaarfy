import React from "react";
import { StyleSheet, View } from "react-native";

import { Col, Grid, Row } from "react-native-easy-grid";

import { sizes } from "../../../theme";

import ProfileBablItem from "./ProfileBablItem";

const ProfileShape1 = ({ chunk, getAllData, targetUserId }) => {
  return (
    <View style={styles.gridContainer}>
      <Grid style={styles.grid}>
        <Row style={styles.row}>
          <Col style={styles.col}>
            {chunk[0] && (
              <ProfileBablItem
                item={chunk[0]}
                getAllData={getAllData}
                targetUserId={targetUserId}
              />
            )}
          </Col>
          <Col style={styles.col} size={1}>
            {chunk[1] && (
              <ProfileBablItem
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

export default ProfileShape1;

const styles = StyleSheet.create({
  gridContainer: {
    height: sizes.width / 1.99,
    width: sizes.width,
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

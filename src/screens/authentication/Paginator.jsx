import React from "react";
import { StyleSheet, View } from "react-native";

import LinearGradient from "react-native-linear-gradient";

const Paginator = ({ data, pageNum }) => {
  return (
    <View style={styles.container}>
      {data.map((_, i) => {
        return (
          <>
            {pageNum == i ? (
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                colors={["#B5A0FF", "#755CCC"]}
                style={styles.selectedDot}
              />
            ) : (
              <View
                style={pageNum === i ? styles.selectedDot : styles.dot}
                key={i.toString()}
              />
            )}
          </>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 64,
    flex: 0.25,
  },
  selectedDot: {
    height: 13,
    borderRadius: 20,
    backgroundColor: "#EE558F",
    marginHorizontal: 3,
    width: 17,
  },
  dot: {
    height: 13,
    borderRadius: 20,
    backgroundColor: "#313131",
    marginHorizontal: 3,
    width: 13,
  },
});

export default Paginator;

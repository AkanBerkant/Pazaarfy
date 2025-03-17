import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const CheckBox = ({ selected }) => {
  return (
    <View>
      {selected ? (
        <Image
          style={styles.selectedContainer}
          source={require("../assets/selected.png")}
          resizeMode="contain"
        />
      ) : (
        <Image
          style={styles.selectedContainer}
          source={require("../assets/unselected.png")}
          resizeMode="contain"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  selectedContainer: {
    width: 29,
    height: 29,
  },
});

export default CheckBox;

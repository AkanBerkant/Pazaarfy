import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useNavigation } from "@react-navigation/native";

import { sizes } from "../../theme";
import fonts from "../../theme/fonts";

const Header = ({ firstname, username, photo }) => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        backgroundColor: "#151515",
      }}
    >
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
        style={styles.container}
      >
        <TouchableOpacity
          style={styles.left}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Image
            source={require("../../assets/back.png")}
            style={styles.back}
          />
        </TouchableOpacity>
        <View style={styles.marginLeft} />
        {photo ? (
          <Image source={{ uri: photo }} style={styles.pp} />
        ) : (
          <Image
            source={require("../../assets/person.png")}
            style={styles.person}
          />
        )}
        <View style={styles.marginLeftB}>
          <Text style={styles.username}>{username}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 16,
    marginTop: sizes.width > 375 ? 40 : 20,
    paddingTop: 10,
    alignItems: "center",
    backgroundColor: "#151515",
    flexDirection: "row",
  },
  left: {
    width: 25,
  },
  back: {
    width: 12.43,
    height: 22,
    tintColor: "#fff",
  },
  pp: {
    width: 42,
    height: 42,
    borderRadius: 42,
    backgroundColor: "#CDCDCD",
  },
  person: {
    width: 42,
    height: 42,
    borderRadius: 42,
    tintColor: "#787878",
  },
  name: {
    color: "#FFF",
    fontSize: 14,
    fontFamily: fonts.roboto,
  },
  username: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: fonts.medium,
  },
  marginLeft: {
    marginLeft: 2,
  },
  marginLeftB: {
    marginLeft: 10,
  },
});

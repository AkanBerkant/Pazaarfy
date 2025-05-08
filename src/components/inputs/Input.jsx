import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { sizes } from "../../theme";
import fonts from "../../theme/fonts";

const Input = ({ multiline, title, big, width, ...props }) => {
  return (
    <>
      {title && <Text style={styles.title}>{title}</Text>}
      <View
        style={{
          backgroundColor: "#121212",
          width: width || sizes.width / 1.07,
          alignSelf: "center",
          borderRadius: 50,
          justifyContent: multiline ? "" : "center",
          height: big ? sizes.width / 2 : 55,
          padding: 10,
          margin: 5,
        }}
      >
        <TextInput
          placeholderTextColor="#595959"
          multiline={multiline}
          returnKeyType="done"
          style={styles.input}
          {...props}
        />
      </View>
    </>
  );
};

export default Input;

const styles = StyleSheet.create({
  title: {
    fontSize: 14,
    color: "#FFF",
    marginLeft: 20,
    marginTop: 0,
    fontFamily: fonts.regular,
  },
  input: {
    marginLeft: 10,
    color: "#595959",
    fontFamily: fonts.medium,
    fontSize: 14,
  },
});

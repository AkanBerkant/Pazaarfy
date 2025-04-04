import React from "react";
import { StyleSheet, View } from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";

import routes from "../../constants/routes";

import GuestDetailContent from "./GuestDetailContent";

const Details = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const item = route.params;

  const onPress = () => {
    navigation.navigate(routes.BablContent, {
      bablId: item._id,
      cover: item.cover,
      repostedBy: item.repostedBy,
    });
  };

  return (
    <View activeOpacity={1} style={styles.container}>
      <GuestDetailContent
        bablId={item._id}
        data={item}
        repostedBy={item.repostedBy}
        initialState
        onPress={onPress}
      />
    </View>
  );
};

export default Details;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#000",
  },
});

import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useAtom } from "jotai";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import routes from "../../constants/routes";
import fonts from "../../theme/fonts";
import { bablFormAtom } from "../../utils/atoms";
import Storage from "../../utils/storage";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const ListItem = React.memo(({ item, viewableItems }) => {
  const navigation = useNavigation();
  const [bablForm, setBablForm] = useAtom(bablFormAtom);

  const rStyle = useAnimatedStyle(() => {
    const isVisible = Boolean(
      viewableItems.value
        .filter((item) => {
          return item.isViewable;
        })
        .find((viewableItem) => {
          return viewableItem.item.id === item.id;
        }),
    );

    return {
      opacity: withTiming(isVisible ? 1 : 0),
      transform: [
        {
          scale: withTiming(isVisible ? 1 : 0.6),
        },
      ],
    };
  }, []);

  return (
    <AnimatedTouchableOpacity
      onPress={async () => {
        const nextForm = {
          ...bablForm,
          category: item._id,
        };
        await Storage.setItem("bablForm", nextForm);
        setBablForm(nextForm);
        navigation.navigate(routes.CreateBabl);
      }}
      style={[
        {
          height: 80,
          width: "90%",
          borderBottomWidth: 1,
          alignSelf: "center",
          borderRadius: 15,
          marginTop: 20,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottomColor: "#272727",
        },
        rStyle,
      ]}
    >
      <View style={styles.row}>
        <Image source={item.icon} resizeMode="contain" style={styles.icon} />
        <Text style={styles.label}>{item.label}</Text>
      </View>

      <Image
        resizeMode="contain"
        source={
          bablForm.category === item._id
            ? require("../../assets/checked.png")
            : require("../../assets/disablecheckkk.png")
        }
        style={styles.check}
      />
    </AnimatedTouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {},
  icon: {
    width: 20,
    height: 20,
    tintColor: "#FFF",
  },
  label: {
    color: "#fff",
    fontFamily: fonts.medium,
    marginLeft: 10,
  },
  check: {
    width: 31,
    height: 31,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export { ListItem };

import React from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

import { sizes } from "../../theme";
import fonts from "../../theme/fonts";
import ButtonLinear from "../buttons/Button";

const AgreementHeader = ({
  title,
  buttonPress,
  shadow,
  button,
  onPress,
  style,
}) => {
  const navigation = useNavigation();

  const handleGeriTusu = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <TouchableWithoutFeedback
      style={[styles.headerIn]}
      onPress={handleGeriTusu}
    >
      <View style={styles.row}>
        <Image
          source={require("../../assets/back.png")} // Geri ok resminin yolunu belirtin
          style={styles.back}
          resizeMode="contain"
        />
        <View style={styles.centeredText}>
          <Text style={[styles.title]}>{title}</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#000",

    width: sizes.width,
    alignItems: "center",
  },
  headerIn: {
    backgroundColor: "#101010",
    width: sizes.width,
    justifyContent: "center",
    height: sizes.width / 4,
  },
  left: {
    flexDirection: "row",
    width: 40,
    alignItems: "center",
  },
  centeredText: {
    alignItems: "center",
    color: "#FFF",
  },
  back: {
    width: 12, // Resim genişliği
    height: 21, // Resim yüksekliği
    marginRight: 8, // Resim ile metin arasındaki boşluk
  },
  title: {
    fontSize: 16,
    color: "#FFF",
    fontFamily: fonts.medium,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    width: sizes.width / 1.07,
    alignSelf: "center",
  },
});

export default AgreementHeader;

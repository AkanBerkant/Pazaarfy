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

const BackHeader = ({ title, buttonPress, bg, button, onPress, style }) => {
  const navigation = useNavigation();

  const handleGeriTusu = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View
      style={[
        styles.headerContainer,
        {
          height: sizes.width > 375 ? sizes.width / 4 : null,

          backgroundColor: bg ? bg : "#000",
        },
        style,
      ]}
    >
      <View
        style={[
          styles.headerIn,
          {
            marginTop: sizes.width > 375 ? 50 : 0,
            backgroundColor: bg ? bg : "#000",
          },
        ]}
      >
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
          onPress={handleGeriTusu}
        >
          <Image
            source={require("../../assets/back.png")} // Geri ok resminin yolunu belirtin
            style={styles.back}
            resizeMode="contain"
          />
          <Text
            style={{
              color: bg ? bg : "#000",
              width: button ? 30 : null,
            }}
          >
            asdasd
          </Text>
        </TouchableOpacity>
        <View style={styles.centeredText}>
          <Text style={[styles.title]}>{title}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {button ? (
            <ButtonLinear onPress={buttonPress} title={button} />
          ) : (
            <Text
              style={{
                color: bg ? bg : "#000",
              }}
            >
              asdasd
            </Text>
          )}
          {button ? null : (
            <View
              style={{
                width: 12, // Resim genişliği
                height: 21, // Resim yüksekliği
                marginLeft: 8, // Resim ile metin arasındaki boşluk
                tintColor: "#BBBBBB",
              }}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#000",
    padding: 10,

    width: sizes.width,
    alignItems: "center",
  },
  headerIn: {
    backgroundColor: "#000",
    marginTop: 30,
    flexDirection: "row",
    width: sizes.width / 1.07,
    alignItems: "center",
  },
  left: {
    flexDirection: "row",
    width: 40,
    alignItems: "center",
  },
  centeredText: {
    flex: 1, // Yazıyı ortalayabilmek için kullanılır
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
});

export default BackHeader;

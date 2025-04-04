import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";
import { useAtomValue } from "jotai";
import { useTranslation } from "react-i18next";

import { sizes } from "../../theme";
import fonts from "../../theme/fonts";
import { userAtom } from "../../utils/atoms";

const TextEditor = () => {
  const user = useAtomValue(userAtom);
  const navigation = useNavigation();
  const route = useRoute();
  const [text, setText] = useState(""); // Yazı durumu için state

  const { t, i18n } = useTranslation();

  const Header = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <View style={styles.row}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Image
                source={require("../../assets/cc.png")}
                resizeMode="contain"
                style={styles.cc}
              />
            </TouchableOpacity>
            <Image style={styles.profile} source={{ uri: user.photo }} />
            <Text style={styles.username}>{user.username}</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              route.params.onDone(text);
            }}
          >
            <Image
              source={
                text.length > 0
                  ? i18n.language == "en"
                    ? require("../../assets/postbutton.png")
                    : require("../../assets/postbuttontr.png") // Eğer text varsa postbutton.png göster
                  : i18n.language == "en"
                    ? require("../../assets/disablepostbutton.png")
                    : require("../../assets/disableposttr.png")
              }
              style={styles.button}
            />
          </TouchableOpacity>
        </View>

        <Image source={require("../../assets/linebordderline.png")} />
      </View>
    );
  };

  return (
    <ImageBackground
      source={require("../../assets/neon.png")}
      style={styles.container}
    >
      <SafeAreaView />
      <Header />
      <TextInput
        style={styles.input}
        placeholder={t("AddYourText")}
        placeholderTextColor="#A3A7AA"
        multiline
        value={text}
        onChangeText={setText} // TextInput değiştiğinde state güncellenir
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    justifyContent: "space-between",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  profile: {
    width: 53,
    height: 53,
    borderRadius: 53,
    marginLeft: 5,
  },
  username: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: fonts.roboto,
    marginLeft: 10,
  },
  cc: {
    width: 11,
    height: 11,
  },
  button: {
    width: 75,
    height: 37,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerContainer: {
    padding: 10,
  },
  input: {
    fontFamily: fonts.avenir,
    padding: 20,
    color: "#FFF",
  },
});

export default TextEditor;

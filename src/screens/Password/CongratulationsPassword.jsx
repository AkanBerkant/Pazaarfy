import React from "react";
import { View, Text, Image, StyleSheet, TextInput } from "react-native";

import { t } from "i18next";

import { BackHeader, ButtonLinear } from "../../components";
import routes from "../../constants/routes";
import { sizes } from "../../theme";
import fonts from "../../theme/fonts";
import { useTranslation } from "react-i18next";

const CongratulationsPassword = ({ navigation }) => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <BackHeader title={t("changePassword")} />
      <Image source={require("../../assets/b.png")} style={styles.logo} />
      <Text style={styles.title}>{t("CONGRATULATIONS")}</Text>
      <Text style={styles.text}>{t("YourNewPasswordSuccessfully")}</Text>

      <View style={{ marginTop: sizes.width / 2 }} />
      <ButtonLinear
        onPress={() => {
          navigation.navigate(routes.Home);
        }}
        title={t("OK")}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  logo: {
    width: 133,
    height: 133,
    alignSelf: "center",
    marginTop: sizes.width / 2,
  },
  text: {
    color: "#7A7A7A",
    fontSize: 16,
    fontFamily: fonts.regular,
    width: sizes.width / 1.2,
    alignSelf: "center",
    marginTop: 5,
    textAlign: "center",
  },
  title: {
    color: "#FFF",
    fontSize: 24,
    fontFamily: fonts.bold,
    width: sizes.width / 1.2,
    alignSelf: "center",
    marginTop: 20,
    textAlign: "center",
  },
  mailInput: {
    borderWidth: 1,
    borderColor: "#303030",
    width: sizes.width / 1.07,
    alignSelf: "center",
    marginTop: 30,
    height: 55,
    borderRadius: 12,
    padding: 10,
    fontFamily: fonts.regular,
    color: "#FFF",
  },
});

export default CongratulationsPassword;

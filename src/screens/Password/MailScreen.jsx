import React from "react";
import { View, Text, Image, StyleSheet, TextInput } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useTranslation } from "react-i18next";

import { BackHeader, ButtonLinear } from "../../components";
import routes from "../../constants/routes";
import { sizes } from "../../theme";
import fonts from "../../theme/fonts";
import { userAtom } from "../../utils/atoms";
import * as Queries from "../../utils/queries";

const MailScreen = () => {
  const user = useAtomValue(userAtom);
  const navigation = useNavigation();
  const { t } = useTranslation();

  const sendVerificationCodeMutation = useMutation(Queries.sendOtp, {
    onSuccess: () => {
      navigation.navigate(routes.PasswordCode, { email: user.email });
    },
    onError: (err) => {
      console.log("err", err);
    },
  });

  return (
    <View style={styles.container}>
      <BackHeader title={t("changePassword")} shadow={0} />
      <Image source={require("../../assets/key.png")} style={styles.key} />
      <Text style={styles.text}>{t("changePasswordDesc")}</Text>
      <TextInput
        placeholder={t("email")}
        style={styles.mailInput}
        editable={false}
        placeholderTextColor={"#595959"}
        value={user.email}
      />
      <View style={{ marginTop: sizes.width / 1.4 }} />
      <ButtonLinear
        onPress={() => {
          sendVerificationCodeMutation.mutate({ email: user.email });
        }}
        title={t("SendVerificationCode")}
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
  key: {
    width: 70,
    height: 70,
    alignSelf: "center",
    marginTop: sizes.width / 3,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: fonts.regular,
    width: sizes.width / 1.6,
    alignSelf: "center",
    marginTop: 10,
    textAlign: "center",
    marginTop: 30,
  },
  mailInput: {
    borderWidth: 1,
    backgroundColor: "#111111",
    width: sizes.width / 1.07,
    alignSelf: "center",
    marginTop: 30,
    height: 46,
    borderRadius: 50,
    padding: 10,
    fontFamily: fonts.regular,
    color: "#595959",
  },
});

export default MailScreen;

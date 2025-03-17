import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import { t } from "i18next";
import { Notifier } from "react-native-notifier";

import { ButtonLinear, Input } from "../../components";
import routes from "../../constants/routes";
import { sizes } from "../../theme";
import fonts from "../../theme/fonts";
import * as Queries from "../../utils/queries";

const ForgotPassword = () => {
  const [inputFocus, setInputFocus] = useState(null);
  const [email, setEmail] = useState("");
  const navigation = useNavigation();

  const modalizeRef = React.useRef();

  const sendOtpMutation = useMutation(Queries.sendOtp, {
    onSuccess: () => {
      navigation.navigate(routes.EnterYourNewPassword, { email });
    },
    onError: (err) => {
      Notifier.showNotification({
        title: t("AnErrorOccurredWhileSendingTheVerificationCode"),
      });
    },
  });

  React.useEffect(() => {
    modalizeRef.current?.open();
  }, [inputFocus]);

  return (
    <View style={[styles.bg]}>
      <TouchableOpacity style={styles.backIcon} onPress={navigation.goBack}>
        <Image
          style={styles.backIcon}
          resizeMode="contain"
          source={require("../../assets/back.png")}
        />
      </TouchableOpacity>
      <Image
        resizeMode="contain"
        source={require("../../assets/logo.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>{t("CanAddress")}</Text>

      <View style={styles.top} />
      <Input
        onFocus={() => {
          setInputFocus(true);
        }}
        onBlur={() => {
          setInputFocus(false);
        }}
        value={email}
        onChangeText={setEmail}
        placeholder={t("Email")}
      />

      <View style={styles.marginTop} />
      <ButtonLinear
        onPress={() => {
          sendOtpMutation.mutate({ email });
        }}
        loading={sendOtpMutation.isLoading}
        title={t("SendVerificationCode")}
      />
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: "#000",
  },
  container: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#000",
  },
  content: {
    paddingHorizontal: 19,
    backgroundColor: "#000",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: "hidden",
  },
  title: {
    alignSelf: "center",
    fontSize: 14,
    color: "#FFF",
    fontFamily: fonts.regular,
    width: sizes.width / 1.2,
    textAlign: "center",
    marginTop: 25,
  },
  backIcon: {
    zIndex: 99,
    position: "absolute",
    width: 12,
    height: 20,
    top: 30,
    left: 10,
  },
  we: {
    width: sizes.width,
    alignSelf: "center",
    height: 617,
  },
  overlayStyle: {
    opacity: 1,
  },
  handlStyle: {
    backgroundColor: "#080808",
  },
  modalStyle: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "#080808",
  },
  scrollview: {
    backgroundColor: "#080808",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  logo: {
    width: sizes.width / 1.5,
    alignSelf: "center",
    height: 34,
    marginTop: sizes.width / 1.5,
  },
  top: {
    marginTop: 15,
  },
  marginTop: {
    marginTop: 25,
  },
  topFour: { marginTop: 40 },
});

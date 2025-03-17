import React, { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

import {
  CommonActions,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import { t } from "i18next";
import { Notifier } from "react-native-notifier";

import { ButtonLinear, PasswordInput } from "../../components";
import routes from "../../constants/routes";
import { sizes } from "../../theme";
import * as Queries from "../../utils/queries";

const EnterYourPassword = () => {
  const [otpCode, setOtpCode] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [visible, setVisible] = useState(null);
  const [inputFocus, setInputFocus] = useState(null);

  const route = useRoute();
  const navigation = useNavigation();

  const modalizeRef = React.useRef();

  const resetPasswordMutation = useMutation(Queries.resetPassword, {
    onSuccess: () => {
      Notifier.showNotification({
        title: t("YourPasswordHasBeenReset"),
      });
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: routes.Login,
            },
          ],
        }),
      );
    },
    onError: (err) => {
      if (err.response.data.message === "OTP_IS_NOT_EXISTS") {
        return Notifier.showNotification({
          title: t("VerificationCodeNotFound"),
        });
      }
      if (err.response.data.message === "OTP_IS_NOT_CORRECT") {
        return Notifier.showNotification({
          title: t("VerificationCodeIsIncorrect"),
        });
      }

      Notifier.showNotification({
        title: t("AnErrorPassword"),
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

      <View style={styles.top} />
      <PasswordInput
        placeholder={t("VerificationCode")}
        forgotIcon
        onFocus={() => {
          setInputFocus(true);
        }}
        onBlur={() => {
          setInputFocus(false);
        }}
        value={otpCode}
        onChangeText={setOtpCode}
      />

      <PasswordInput
        placeholder={t("YourNewPassword")}
        forgotIcon
        onFocus={() => {
          setInputFocus(true);
        }}
        onBlur={() => {
          setInputFocus(false);
        }}
        value={password}
        onChangeText={setPassword}
      />

      <PasswordInput
        forgotIcon
        placeholder={t("YourNewPasswordAgain")}
        onFocus={() => {
          setInputFocus(true);
        }}
        onBlur={() => {
          setInputFocus(false);
        }}
        value={password2}
        onChangeText={setPassword2}
      />
      <View style={styles.normalTop} />
      <ButtonLinear
        onPress={() => {
          if (password !== password2) {
            return Notifier.showNotification({
              title: t("PasswordRepeat"),
            });
          }

          resetPasswordMutation.mutate({
            email: route.params.email,
            otpCode,
            password,
          });
        }}
        title={t("CreateMyNewPassword")}
      />
    </View>
  );
};

export default EnterYourPassword;

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
  handleStyle: {
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
    marginTop: sizes.width / 1.8,
  },
  top: {
    marginTop: 45,
  },
  normalTop: {
    marginTop: 25,
  },
  buttonLinear: {
    marginTop: 40,
  },
  topFour: {
    marginTop: 40,
  },
});

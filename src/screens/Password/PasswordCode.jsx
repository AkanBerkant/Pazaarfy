import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { useMutation } from "@tanstack/react-query";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { CodeField, Cursor } from "react-native-confirmation-code-field";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import LinearGradient from "react-native-linear-gradient";
import { Notifier } from "react-native-notifier";

import { BackHeader, ButtonLinear } from "../../components";
import routes from "../../constants/routes";
import { sizes } from "../../theme";
import fonts from "../../theme/fonts";
import * as Queries from "../../utils/queries";

const CELL_COUNT = 4;

const Code = ({ navigation, route }) => {
  const [value, setValue] = React.useState("");
  const [countdown, setCountdown] = React.useState(299);
  const sentDate = React.useRef(moment());
  const { t } = useTranslation();
  const { email } = route.params;

  React.useEffect(() => {
    const interval = setInterval(() => {
      const secondDiff = 299 - moment().diff(sentDate.current, "s");
      const nextVal = secondDiff > 0 ? secondDiff : 0;

      setCountdown(nextVal);
    }, 1000);

    return () => {
      return clearInterval(interval);
    };
  }, []);

  const verifyOtpMutation = useMutation(Queries.verifyOtp, {
    onSuccess: (_, data) => {
      navigation.navigate(routes.EnterYourNewPasswordProfile, {
        email,
        otpCode: data.otpCode,
      });
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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <BackHeader title={t("changePassword")} shadow={0} />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContainer}
        enableOnAndroid
        extraScrollHeight={100}
      >
        <Image source={require("../../assets/key.png")} style={styles.key} />
        <Text style={styles.text}>{t("ConfirmEmail")}</Text>
        <CodeField
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          autoFocus
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({ index, symbol, isFocused }) => {
            return (
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cellContainer}
                colors={["#B5A0FF", "#755CCC"]}
              >
                <View style={styles.cell}>
                  <View key={`cell_${index}`}>
                    <Text style={styles.cellText}>
                      {symbol || (isFocused ? <Cursor /> : null)}
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            );
          }}
        />
        <View style={styles.row}>
          <Image
            source={require("../../assets/time.png")}
            resizeMode="contain"
            style={styles.icon}
          />
          <Text style={styles.clock}>
            {`0${Math.floor(countdown / 60)}:${countdown % 60 < 10 ? "0" : ""}${countdown % 60}`}
          </Text>
        </View>
        <View style={{ marginTop: sizes.width / 2 }} />

        <ButtonLinear
          onPress={() => {
            verifyOtpMutation.mutate({
              email,
              otpCode: value,
            });
          }}
          title={t("Confirm")}
          style={styles.button}
        />
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 40,
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
    marginBottom: 30,
  },
  time: {
    fontSize: 22,
    color: "#FFF",
    fontFamily: fonts.roboto,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 40,
  },
  icon: {
    width: 21,
    height: 24.31,
  },
  clock: {
    color: "#FFF",
    fontSize: 16,
    marginLeft: 3,
    fontFamily: fonts.bold,
  },
  codeFieldRoot: {
    width: sizes.width / 1.2,
    alignSelf: "center",
  },
  cellContainer: {
    width: 74,
    height: 74,
    borderRadius: 74,
    alignItems: "center",
    justifyContent: "center",
  },
  cell: {
    width: 65,
    height: 66,
    backgroundColor: "#000",
    borderRadius: 65,
    alignItems: "center",
    justifyContent: "center",
  },
  cellText: {
    fontSize: 18,
    fontFamily: fonts.roboto,
    color: "#FFF",
  },

  newCodeDescription: {
    marginTop: 12,
    fontSize: 12,
    fontFamily: "Inter-Medium",
    color: "#131736",
  },
  remaningTime: {
    fontSize: 12,
    fontFamily: "Inter-ExtraBold",
    color: "#FFF",
  },
  button: {
    marginHorizontal: 20,
  },
});

export default Code;

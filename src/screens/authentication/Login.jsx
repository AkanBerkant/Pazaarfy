import React from "react";
import {
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
} from "react-native";
import TextGradient from "../../components/TextGradient";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import { t } from "i18next";
import { useSetAtom } from "jotai";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import fonts from "../../theme/fonts";
import * as yup from "yup";
import routes from "../../constants/routes";
import {
  ButtonBorder,
  ButtonLinear,
  Input,
  PasswordInput,
} from "../../components";
import { notify } from "../../helpers/notify";
import { sizes } from "../../theme";
import { userAtom } from "../../utils/atoms";
import * as Queries from "../../utils/queries";
import SharedStorage from "../../utils/shared-storage";
import Storage from "../../utils/storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const loginDto = yup.object({
  username: yup.string().required(),
  password: yup.string().min(8, t("YourPasswordLong")).required(),
});

const WINDOW_HEIGHT = Dimensions.get("window").height;

const Login = () => {
  const navigation = useNavigation();
  const { handleSubmit, control } = useForm({
    resolver: yupResolver(loginDto),
  });
  const setUser = useSetAtom(userAtom);
  const [inputFocus, setInputFocus] = React.useState(null);

  const loginMutation = useMutation(Queries.loginViaEmail, {
    onSuccess: async ({ accessToken, user }) => {
      await SharedStorage.setItem("accessToken", accessToken);
      await Storage.setItem("accessToken", accessToken);
      setUser(user);
    },
    onError: (err) => {
      notify({
        title: err?.response?.data?.message || t("AnUnexpectedErrorOccurred"),
      });
    },
  });

  const onValid = (data) => {
    loginMutation.mutate(data);
  };

  const onInvalid = (errors) => {
    notify({
      title: t("AnErrorLogging"),
    });
  };

  const onLoginPress = () => {
    handleSubmit(onValid, onInvalid)();
  };

  React.useEffect(() => {
    modalizeRef.current?.open();
  }, [inputFocus]);

  const modalizeRef = React.useRef();

  const { t } = useTranslation();

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ImageBackground
        style={styles.container}
        source={require("../../assets/pazaarfy/loginbg.png")}
      >
        <Image
          style={styles.logo}
          source={require("../../assets/pazaarfy/logo.png")}
        />
        <KeyboardAwareScrollView>
          <View style={styles.between}>
            <View>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, value } }) => {
                  return (
                    <Input
                      onFocus={() => {
                        setInputFocus(true);
                      }}
                      onBlur={() => {
                        setInputFocus(false);
                      }}
                      placeholder={t("Email")}
                      onChangeText={onChange}
                      keyboardType="email-address"
                      autoCorrect={false}
                      value={value}
                    />
                  );
                }}
                name="username"
              />

              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, value } }) => {
                  return (
                    <PasswordInput
                      title={t("Password")}
                      forgot
                      onFocus={() => {
                        setInputFocus(true);
                      }}
                      onBlur={() => {
                        setInputFocus(false);
                      }}
                      placeholder={t("Password")}
                      onChangeText={onChange}
                      value={value}
                      onSubmitEditing={onLoginPress}
                    />
                  );
                }}
                name="password"
              />
              <ButtonLinear onPress={onLoginPress} title={t("Login")} />
              <View
                style={{
                  marginTop: sizes.width / 2.2,
                }}
              >
                <View>
                  <ButtonBorder
                    onPress={() => {
                      navigation.navigate(routes.Register);
                    }}
                    title={t("SignUp")}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate(routes.GuestMode);
                    }}
                  >
                    <Text
                      style={{
                        color: "#FFF",
                        fontFamily: fonts.medium,
                        textAlign: "center",
                        marginTop: 15,
                      }}
                    >
                      {t("GuestMode")}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate(routes.ForgotPassword);
                    }}
                    style={styles.row}
                  >
                    <Image
                      style={styles.key}
                      source={require("../../assets/pazaarfy/key.png")}
                    />
                    <TextGradient
                      style={{
                        fontFamily: fonts.regular,
                        marginLeft: 5,
                        fontSize: 14,
                      }}
                      locations={[0, 1]}
                      text={t("ForgotPasswordF")}
                      colors={["#B5A0FF", "#755CCC"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  between: {
    marginTop: 30,
  },
  buttonLinearContainer: {
    zIndex: 99,
    top: -sizes.width / 4.5,
  },
  overlayStyle: {
    opacity: 1,
  },
  handleStyle: {
    backgroundColor: "#080808",
  },
  logo: {
    height: 28,
    width: 133,
    alignSelf: "center",
    marginTop: sizes.width / 1.5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 10,
  },
  key: {
    width: 15.71,
    height: 15.71,
  },
});

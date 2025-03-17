import React from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "@react-navigation/core";
import { useMutation } from "@tanstack/react-query";
import { t } from "i18next";
import { Controller, useForm } from "react-hook-form";
import { Notifier } from "react-native-notifier";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import * as yup from "yup";

import {
  ButtonBorder,
  ButtonLinear,
  Input,
  PasswordInput,
} from "../../components";
import TextGradient from "../../components/TextGradient";
import routes from "../../constants/routes";
import { notify } from "../../helpers/notify";
import { sizes } from "../../theme";
import fonts from "../../theme/fonts";
import * as Queries from "../../utils/queries";
import SharedStorage from "../../utils/shared-storage";
import Storage from "../../utils/storage";
import { useSetAtom } from "jotai";
import { userAtom } from "../../utils/atoms";

const loginDto = yup.object({
  username: yup.string().required(t("UsernameReq")),
  email: yup.string().email().required(t("EmailReq")),
  password: yup.string().min(8, t("YourPasswordLong")).required(),
  passwordConfirm: yup
    .string()
    .min(8, t("YourPasswordLong"))
    .oneOf([yup.ref("password"), null], t("ItMustBeTheSameRepeat"))
    .required(),
});

const WINDOW_HEIGHT = Dimensions.get("window").height;

const Register = () => {
  const navigation = useNavigation();
  const setUser = useSetAtom(userAtom);
  const { handleSubmit, control } = useForm({
    resolver: yupResolver(loginDto),
  });
  const [inputFocus, setInputFocus] = React.useState(null);
  const [hideForm, setHideForm] = React.useState(false);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(hideForm ? WINDOW_HEIGHT : 0, {
            duration: 300,
          }),
        },
      ],
    };
  });

  /*const sendOtpMutation = useMutation(Queries.sendOtp);*/
  const registerMutation = useMutation(Queries.registerViaEmail);

  const onValid = (data) => {
    registerMutation.mutate(
      {
        email: data.email,
        username: data.username,
        password: data.password /*type: "VERIFICATION"*/,
      },
      {
        onSuccess: async (response, res) => {
          /*navigation.navigate(routes.Code, {
            email: data.email,
            registerData: data,
          });*/
          await SharedStorage.setItem("accessToken", response?.accessToken);
          await Storage.setItem("accessToken", response?.accessToken);
          setUser(response?.user);
        },
        onError: (err) => {
          Notifier.showNotification({
            title:
              err?.response?.data?.message || t("AnUnexpectedErrorOccurred"),
          });
        },
      },
    );
  };

  const onInvalid = (errors) => {
    notify({
      title: Object.values(errors)[0].message,
    });
  };

  const onRegisterPress = () => {
    return handleSubmit(onValid, onInvalid)();
  };

  const onBackToLoginPress = () => {
    navigation.navigate(routes.Login);
  };

  React.useEffect(() => {
    modalizeRef.current?.open();
  }, [inputFocus]);

  const modalizeRef = React.useRef();

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <ImageBackground
        source={require("../../assets/pazaarfy/loginbg.png")}
        style={[styles.bg]}
      >
        <View style={styles.modalStyle}>
          <Image
            source={require("../../assets/pazaarfy/logo.png")}
            resizeMode="contain"
            style={{
              marginTop: 0,
              width: 133,
              alignSelf: "center",
              height: 28,
              marginBottom: 20,
            }}
          />
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
                  placeholder={t("Username")}
                  onChangeText={onChange}
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
                <Input
                  onFocus={() => {
                    setInputFocus(true);
                  }}
                  onBlur={() => {
                    setInputFocus(false);
                  }}
                  placeholder={t("Email")}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="email-address"
                  autoCorrect={false}
                  autoCapitalize="none"
                />
              );
            }}
            name="email"
          />
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, value } }) => {
              return (
                <PasswordInput
                  forgotIcon
                  onFocus={() => {
                    setInputFocus(true);
                  }}
                  onBlur={() => {
                    setInputFocus(false);
                  }}
                  placeholder={t("Password")}
                  onChangeText={onChange}
                  value={value}
                />
              );
            }}
            name="password"
          />
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, value } }) => {
              return (
                <PasswordInput
                  forgotIcon
                  onFocus={() => {
                    setInputFocus(true);
                  }}
                  onBlur={() => {
                    setInputFocus(false);
                  }}
                  placeholder={t("PasswordAgain")}
                  onChangeText={onChange}
                  value={value}
                  onSubmitEditing={onRegisterPress}
                />
              );
            }}
            name="passwordConfirm"
          />

          <ButtonBorder onPress={onRegisterPress} title={t("SignUp")} />
          <TouchableOpacity
            onPress={onBackToLoginPress}
            style={styles.backToLogin}
          >
            <Text style={styles.doYouHaveAnAccount}>
              {t("DoHaveAnAccount")}
            </Text>

            <TextGradient
              style={{
                fontFamily: fonts.roboto,
                marginRight: 10,
                fontSize: 15,
                marginLeft: 7,
              }}
              locations={[0, 1]}
              colors={["#B5A0FF", "#755CCC"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              text={t("Login")}
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  bg: {
    flex: 1,

    width: sizes.width,
    height: sizes.height,
  },
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },

  we: {
    width: sizes.width,
    alignSelf: "center",
    height: sizes.height,
    top: -sizes.width / 3.5,
  },
  buttonContainer: {
    zIndex: 99,
    top: -sizes.width / 4.5,
  },
  zIndex: {
    zIndex: 99,
  },
  overlayStyle: {
    opacity: 1,
  },
  handleStyle: {
    backgroundColor: "#000",
  },
  modalStyle: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "#000",
    height: sizes.width * 1.6,
    width: sizes.width,
    position: "absolute",
    zIndex: 99,
    bottom: 0,
  },
  logo: {
    width: sizes.width / 2,
    alignSelf: "center",
    height: 54,
    marginTop: 20,
  },
  backToLogin: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 20,
    alignSelf: "center",
  },
  doYouHaveAnAccount: {
    color: "#837F95",
    fontFamily: fonts.roboto,
    fontSize: 14,
    fontWeight: "500",
  },
  backIcon: {
    zIndex: 99,
    position: "absolute",
    tintColor: "red",
    width: 45,
    height: 45,
    top: 30,
    left: 5,
  },
});

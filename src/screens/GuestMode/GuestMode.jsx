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
  ActivityIndicator,
} from "react-native";

import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import { t } from "i18next";
import { useSetAtom } from "jotai";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import * as yup from "yup";
import routes from "../../constants/routes";

import { notify } from "../../helpers/notify";
import { sizes } from "../../theme";
import { userAtom } from "../../utils/atoms";
import * as Queries from "../../utils/queries";
import SharedStorage from "../../utils/shared-storage";
import Storage from "../../utils/storage";

const loginDto = yup.object({
  username: yup.string().required(),
  password: yup.string().min(8, t("YourPasswordLong")).required(),
});

const WINDOW_HEIGHT = Dimensions.get("window").height;

const GuestMode = () => {
  const navigation = useNavigation();
  const { handleSubmit, control } = useForm({
    resolver: yupResolver(loginDto),
  });
  const setUser = useSetAtom(userAtom);
  const [inputFocus, setInputFocus] = React.useState(null);
  const { t } = useTranslation();

  const loginMutation = useMutation(Queries.loginViaEmail, {
    onSuccess: async ({ accessToken, user }) => {
      await SharedStorage.setItem("accessToken", accessToken);
      await Storage.setItem("accessToken", accessToken);
      setUser(user);
      navigation.navigate(routes.Search);
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

  // ✅ Sayfa açıldığında otomatik login
  React.useEffect(() => {
    const autoLogin = async () => {
      try {
        const credentials = {
          username: "test@gmail.com",
          password: "1234567890",
        };
        const { accessToken, user } = await Queries.loginViaEmail(credentials);

        await SharedStorage.setItem("accessToken", accessToken);
        await Storage.setItem("accessToken", accessToken);
        setUser(user);

        navigation.navigate(routes.SearchGuest);
      } catch (err) {
        console.log("Auto login failed:", err?.response?.data?.message);
      }
    };

    autoLogin();
  }, []);

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ActivityIndicator size={"large"} />
    </KeyboardAvoidingView>
  );
};

export default GuestMode;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
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
    marginTop: 25,
  },
  key: {
    width: 15.71,
    height: 15.71,
  },
});

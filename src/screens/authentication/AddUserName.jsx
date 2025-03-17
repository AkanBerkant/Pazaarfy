import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation, useRoute } from "@react-navigation/native";
import { t } from "i18next";
import { Controller, useForm } from "react-hook-form";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import * as yup from "yup";

import { ButtonLinear, Input } from "../../components";
import routes from "../../constants/routes";
import { notify } from "../../helpers/notify";
import { sizes } from "../../theme";

import LoginBackground from "./LoginBackground";

const loginDto = yup.object({
  username: yup.string().required(),
});

const WINDOW_HEIGHT = Dimensions.get("window").height;

const AddUserName = () => {
  const navigation = useNavigation();
  const route = useRoute();
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

  const onValid = (data) => {
    route.params.cb(data.username);
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
      <LoginBackground
        toggleAnimation={() => {
          setHideForm((prev) => {
            return !prev;
          });
        }}
      />
      <Animated.View style={[styles.bg, animatedStyle]}>
        <TouchableOpacity style={styles.backIcon} onPress={navigation.goBack}>
          <Image
            style={styles.backIcon}
            source={require("../../assets/blueback.png")}
          />
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <ButtonLinear
            style={styles.zIndex}
            onPress={() => {
              modalizeRef.current.open();
            }}
            title={t("SignUp")}
          />
        </View>
        <TouchableOpacity style={styles.backIcon} onPress={navigation.goBack} />

        <View style={styles.modalStyle}>
          <Image
            resizeMode="contain"
            source={require("../../assets/logo.png")}
            style={styles.logo}
          />

          <View
            style={{
              marginTop: 40,
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

          <View
            style={{
              marginTop: sizes.width,
            }}
          />

          <ButtonLinear onPress={onRegisterPress} title={t("SignUp")} />
        </View>
      </Animated.View>
    </View>
  );
};

export default AddUserName;

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: "#000",
    position: "absolute",
    bottom: 0,
  },

  buttonContainer: {
    zIndex: 99,
    top: -sizes.width / 4.5,
  },
  zIndex: {
    zIndex: 99,
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

  backIcon: {
    zIndex: 99,
    position: "absolute",

    width: 45,
    height: 45,
    top: 20,
    left: 5,
  },
});

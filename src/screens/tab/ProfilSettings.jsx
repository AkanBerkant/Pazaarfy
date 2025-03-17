import React from "react";
import {
  Alert,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";
import { useAtom } from "jotai";
import { Controller, useForm } from "react-hook-form";
import ImageCropPicker from "react-native-image-crop-picker";
import LinearGradient from "react-native-linear-gradient";
import * as yup from "yup";

import { BackHeader, ButtonLinear, Container, Input } from "../../components";
import { notify } from "../../helpers/notify";
import fonts from "../../theme/fonts";
import { userAtom } from "../../utils/atoms";
import * as Queries from "../../utils/queries";
import { sizes } from "../../theme";

const updateProfileDto = yup.object({
  firstname: yup.string().required(),
  email: yup.string().email().optional().nullable(),
  username: yup.string().required(),
  about: yup.string().optional().nullable(),
  facebook: yup.string().url().optional().nullable(),
  twitter: yup.string().url().optional().nullable(),
  instagram: yup.string().url().optional().nullable(),
});

const ProfilSettings = () => {
  const navigation = useNavigation();
  const [user, setUser] = useAtom(userAtom);
  const queryClient = useQueryClient();
  const { handleSubmit, control } = useForm({
    resolver: yupResolver(updateProfileDto),
    defaultValues: {
      firstname: user.firstname,
      email: user.email,
      username: user.username,
      about: user.about,
      photo: user.photo,
      facebook: user.socialMediaLinks?.facebook,
      twitter: user.socialMediaLinks?.twitter,
      instagram: user.socialMediaLinks?.instagram,
    },
  });

  const uploadMediaMutation = useMutation(Queries.uploadMedia, {
    onError: (err) => {
      console.log("err", err);
    },
  });

  const updateProfileMutation = useMutation(Queries.updateProfile, {
    onSuccess: (res) => {
      navigation.goBack();
      setUser(res);
      queryClient.invalidateQueries(["PROFILE_X"]);
      notify({
        title: t("ProfileInformationUpdated"),
      });
    },
    onError: (err) => {
      console.log("err", err.response.data);
    },
  });

  const onValid = (data) => {
    const {
      firstname,
      email,
      username,
      about,
      facebook,
      twitter,
      instagram,
      photo,
    } = data;

    const dto = {
      firstname,
      email,
      username,
      about,
      photo,
      socialMediaLinks: {
        facebook,
        twitter,
        instagram,
      },
    };

    if (typeof photo === "object") {
      return uploadMediaMutation.mutate(photo, {
        onSuccess: (res) => {
          updateProfileMutation.mutate({
            ...dto,
            photo: res.url,
          });
        },
      });
    }

    updateProfileMutation.mutate(dto);
  };

  const onInvalid = (errors) => {
    notify({
      title: Object.values(errors)[0].message,
    });
  };

  const onSavePress = () => {
    return handleSubmit(onValid, onInvalid)();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <Container
        header={<BackHeader shadow={0} title={t("ProfileSettings")} />}
      >
        <View style={styles.profileArea}>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, value } }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    ImageCropPicker.openPicker({
                      width: 512,
                      height: 512,
                      cropping: true,
                    })
                      .then(onChange)
                      .catch((err) => {
                        Alert.alert(
                          t("AccessPermissionGranted"),
                          t("DoYouWantAccess"),
                          [
                            {
                              text: t("no"),
                              onPress: () => {},
                            },
                            {
                              text: t("yes"),
                              onPress: () => {
                                Linking.openSettings();
                              },
                            },
                          ],
                        );
                      });
                  }}
                >
                  <Image
                    style={styles.pp}
                    source={
                      value
                        ? typeof value === "string"
                          ? { uri: value }
                          : { uri: value.path }
                        : null
                    }
                  />

                  <Image
                    style={styles.settingsLinear}
                    resizeMode="contain"
                    source={require("../../assets/addButton.png")}
                  />
                </TouchableOpacity>
              );
            }}
            name="photo"
          />
        </View>

        <View style={styles.title} />

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, value } }) => {
            return (
              <Input
                placeholder={t("name")}
                onChangeText={onChange}
                value={value}
              />
            );
          }}
          name="firstname"
        />

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, value } }) => {
            return (
              <View
                style={{
                  backgroundColor: "#121212",
                  width: sizes.width / 1.07,
                  alignSelf: "center",
                  borderRadius: 50,
                  justifyContent: "center",
                  height: 55,
                  padding: 10,
                  margin: 5,
                }}
              >
                <Text
                  style={{
                    marginLeft: 10,
                    color: "#595959",
                    fontFamily: fonts.medium,
                    fontSize: 14,
                  }}
                >
                  {value}
                </Text>
              </View>
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
              <Input
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
                placeholder={t("About")}
                multiline
                onChangeText={onChange}
                value={value}
              />
            );
          }}
          name="about"
        />
      </Container>

      <ButtonLinear
        title={t("editInformation")}
        onPress={onSavePress}
        loading={updateProfileMutation.isLoading}
      />

      <View
        style={{
          marginBottom: 20,
        }}
      />
    </View>
  );
};

export default ProfilSettings;

const styles = StyleSheet.create({
  profileArea: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  title: {
    color: "#626262",
    fontSize: 18,
    fontFamily: fonts.roboto,
    marginLeft: 20,
    marginTop: 15,
  },
  pp: {
    width: 124,
    height: 124,
    borderRadius: 124,
    backgroundColor: "#CDCDCD",
  },
  settings: {
    width: 31,
    height: 31,
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  settingsLinear: {
    width: 32,
    height: 32,
    position: "absolute",
    bottom: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 31,

    zIndex: 99,
  },
  settings: {
    width: 28,
    height: 28,
    position: "absolute",

    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    borderRadius: 31,
  },
  settingsIcon: {
    width: 13,
    height: 13,
  },
});

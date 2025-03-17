import React from "react";
import {
  Alert,
  Image,
  ImageBackground,
  Linking,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import Video from "react-native-video";
import { t } from "i18next";
import { useAtom } from "jotai";
import { useTranslation } from "react-i18next";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import LinearGradient from "react-native-linear-gradient";

import { BackHeader, ButtonLinear } from "../../components";
import PercentLoader from "../../components/PercentLoader";
import routes from "../../constants/routes";
import { notify } from "../../helpers/notify";
import { sizes } from "../../theme";
import fonts from "../../theme/fonts";
import { bablFormAtom } from "../../utils/atoms";
import * as Queries from "../../utils/queries";

const EditCover = () => {
  const navigation = useNavigation();
  const [bablForm, setBablForm] = useAtom(bablFormAtom);
  const [title, setTitle] = React.useState(bablForm.title);
  const [loadingPercent, setLoadingPercent] = React.useState();
  const { t } = useTranslation();
  const [isSliderMode, setIsSliderMode] = React.useState(
    bablForm.settings?.isSliderMode || false,
  );
  const [isText, setIsText] = React.useState(
    bablForm.settings?.isText || false,
  );
  const [isInteraction, setIsInteraction] = React.useState(
    bablForm.settings?.isInteraction || false,
  );
  const [isPrivate, setIsPrivate] = React.useState(
    bablForm.settings?.isPrivate || false,
  );
  const [price, setPrice] = React.useState(bablForm.settings?.price || "");
  const [allowEmbed, setAllowEmbed] = React.useState(
    typeof bablForm.settings?.allowEmbed === "boolean"
      ? bablForm.settings?.allowEmbed
      : true,
  );
  const [selectedCover, setSelectedCover] = React.useState(
    bablForm.settings?.selectedCover || false,
  );
  const [selectedCoverCrop, setSelectedCoverCrop] = React.useState(
    bablForm.selectedCoverCrop || false,
  );
  const [text, setText] = React.useState(bablForm.settings?.text || "");
  const [allowedInteractionTypes, setAllowedInteractionTypes] = React.useState(
    bablForm.settings?.allowedInteractionTypes || [
      "PHOTO",
      "TEXT",
      "VIDEO",
      "MUSIC",
      "SHOP",
      "SHORT_VIDEO",
      "STREAM",
      "INTERNET",
      "AI",
      "BABL",
    ],
  );

  const onUploadProgress = (event) => {
    setLoadingPercent((event.loaded / event.total) * 100);
  };

  const uploadVideoMutation = useMutation(
    (v) => {
      return Queries.uploadVideo(v, onUploadProgress);
    },
    {
      onSuccess: (res) => {
        setSelectedCoverCrop(res.url);
      },
      onError: (err) => {
        console.log("err", err);
      },
    },
  );

  const uploadMediaMutation = useMutation(
    (v) => {
      return Queries.uploadMedia(v, onUploadProgress);
    },
    {
      onSuccess: (res) => {
        setSelectedCoverCrop(res.url);
      },
      onError: (err) => {
        console.log("err", err);
      },
    },
  );

  const bablsettings = [
    {
      label: t("interaction"),
      value: isInteraction,
      onPress: () => {
        setIsInteraction((prev) => {
          return !prev;
        });
      },
    },
    {
      label: t("Private"),
      value: isPrivate,
      onPress: () => {
        setIsPrivate((prev) => {
          return !prev;
        });
      },
    },
    {
      value: allowEmbed,
      label: t("allowOthersToAdd"),
      onPress: () => {
        setAllowEmbed((prev) => {
          return !prev;
        });
      },
    },
  ];

  const switchButtons = [
    /* {
      label: 'Slider Modunu Etkinleştir',
      value: isSliderMode,
      onPress: () => {
        setIsSliderMode(!isSliderMode);
      },
    }, */
    {
      label: t("Info"),
      value: isText,

      onPress: () => {
        setIsText(!isText);
      },
    },
  ];

  const interactionData = [
    {
      id: "PHOTO",
      label: t("photo"),
      icon: require("../../assets/videomm.png"),
    },
    {
      id: "TEXT",
      label: t("text"),
      icon: require("../../assets/videomm.png"),
    },
    {
      id: "VIDEO",
      label: t("video"),
      icon: require("../../assets/videomm.png"),
    },
    {
      id: "MUSIC",
      label: t("music"),
      icon: require("../../assets/musicpp.png"),
    },
    {
      id: "SHOP",
      label: t("shop"),
      icon: require("../../assets/shop.png"),
    },
    {
      id: "SHORT_VIDEO",
      label: t("shortVideo"),
      icon: require("../../assets/plays.png"),
    },
    {
      id: "STREAM",
      label: t("stream"),
      icon: require("../../assets/plays.png"),
    },
    {
      id: "INTERNET",
      label: "Internet",
      icon: require("../../assets/plays.png"),
    },
    {
      id: "AI",
      label: "AI",
      icon: require("../../assets/plays.png"),
    },
    {
      id: "BABL",
      label: "Babl",
      icon: require("../../assets/plays.png"),
    },
  ];

  const onSavePress = () => {
    if (isPrivate && (isNaN(+price) || +price < 1)) {
      return notify({
        title: t("pleaseEnterValidPrice"),
      });
    }

    setBablForm((prev) => {
      return {
        ...prev,
        title,
        selectedCoverCrop,
        settings: {
          isSliderMode,
          isText,
          isInteraction,
          isPrivate,
          price,
          allowEmbed,
          selectedCover,
          text,
          allowedInteractionTypes,
        },
      };
    });
    navigation.goBack();
  };

  const onPermissionErr = (err) => {
    if (err.code === "E_NO_LIBRARY_PERMISSION") {
      return Alert.alert(t("noGalleryAccess"), t("wouldYouLikeToGoSettins"), [
        {
          text: t("no"),
        },
        {
          text: t("yes"),
          onPress: () => {
            Linking.openSettings();
          },
        },
      ]);
    }
  };

  const [selected, setSelected] = React.useState(null);

  return (
    <>
      <KeyboardAwareScrollView safearea={false} backgroundColor="#000">
        <BackHeader title={t("bablSettings")} />
        {selectedCover ? (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(routes.SelectCover, { setSelectedCover });
            }}
          >
            {selectedCover.coverSource.endsWith("mp4") ||
            selectedCover.coverSource.endsWith("m3u8") ? (
              <Video
                style={styles.selectCover}
                source={{ uri: selectedCover.coverSource }}
                resizeMode="cover"
                isMuted={false}
                shouldPlay
                isLooping
              />
            ) : (
              <Image
                style={styles.selectCover}
                source={{ uri: selectedCover.coverSource }}
              />
            )}
          </TouchableOpacity>
        ) : (
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={["#F9B092", "#D5D399", "#0AAFF6"]}
            style={[styles.selectCoverLinear]}
          >
            <TouchableOpacity
              style={[styles.selectCover, {}]}
              onPress={() => {
                navigation.navigate(routes.SelectCover, { setSelectedCover });
              }}
            >
              <View style={styles.row}>
                <Image
                  style={styles.addIcon}
                  resizeMode="contain"
                  source={require("../../assets/ada.png")}
                />
                <Text style={styles.boxTitle}>{t("selectCover")}</Text>
              </View>

              <View>
                <Text
                  style={{
                    color: "#FFF",
                    fontSize: 9,
                    marginTop: 7,
                    textAlign: "center",
                    fontFamily: "Roboto-Italic",
                  }}
                >
                  {t("ChooseShortTopic")}
                </Text>
              </View>
            </TouchableOpacity>
          </LinearGradient>
        )}

        {/* {selectedCoverCrop ? (
          <TouchableOpacity onPress={onSelectCoverCropPress}>
            {selectedCoverCrop.endsWith('mp4') ? (
              <Video
                style={[styles.selectCover, styles.selectCoverCrop]}
                source={{ uri: selectedCoverCrop }}
                resizeMode="cover"
              />
            ) : (
              <Image
                style={[styles.selectCover, styles.selectCoverCrop]}
                source={{ uri: selectedCoverCrop }}
              />
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={onSelectCoverCropPress}
            style={[styles.selectCover, styles.selectCoverCrop]}
          >
            <View>
              <Image
                style={styles.addIcon}
                resizeMode="contain"
                source={require('../../assets/ada.png')}
              />
            </View>

            <Text style={styles.boxTitle}>Intro</Text>
          </TouchableOpacity>
        )} */}

        <View style={styles.top}>
          <TextInput
            style={[styles.input, { height: 50 }]}
            placeholder={t("title")}
            value={title}
            onChangeText={setTitle}
          />

          {selected ? (
            <ImageBackground
              resizeMode="contain"
              style={styles.infoPop}
              source={require("../../assets/pope.png")}
            >
              <Text style={styles.infoPopText}>{t("YouCanTopic")}</Text>
            </ImageBackground>
          ) : null}

          {switchButtons.map((item, index) => {
            return (
              <>
                <View style={styles.switch}>
                  <View style={styles.switchRow}>
                    <Text style={styles.label}>{item.label}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setSelected(!selected);
                      }}
                    >
                      {item.value == isSliderMode && index == 0 ? (
                        <Image
                          source={require("../../assets/info.png")}
                          style={styles.info}
                        />
                      ) : null}
                    </TouchableOpacity>
                  </View>
                  {item.value ? (
                    <LinearGradient
                      style={styles.linearGradient}
                      colors={["#F9B092", "#D5D399", "#0AAFF6"]}
                    >
                      <Switch
                        trackColor={{ false: "#D9D9D9", true: "#111111" }}
                        thumbColor={item.value ? "#FFF" : "#5B5B5B"}
                        onValueChange={item.onPress}
                        value={item.value}
                      />
                    </LinearGradient>
                  ) : (
                    <Switch
                      trackColor={{ false: "#D9D9D9", true: "#111111" }}
                      thumbColor={item.value ? "#FFF" : "#5B5B5B"}
                      onValueChange={item.onPress}
                      value={item.value}
                    />
                  )}
                </View>
                {isText && index == 0 ? (
                  <TextInput
                    multiline
                    style={styles.input}
                    placeholder={t("enterInfo")}
                    value={text}
                    onChangeText={setText}
                  />
                ) : null}
              </>
            );
          })}
        </View>

        <Text style={styles.title}>{t("bablSettings")}</Text>

        <View style={styles.borderBottom} />

        {bablsettings.map((item, index) => {
          return (
            <>
              <View style={styles.switch}>
                <Text style={styles.label}>{item.label}</Text>

                {item.value ? (
                  <LinearGradient
                    style={styles.linearGradient}
                    colors={["#F9B092", "#D5D399", "#0AAFF6"]}
                  >
                    <Switch
                      trackColor={{ false: "#D9D9D9", true: "#111111" }}
                      thumbColor={item.value ? "#FFF" : "#5B5B5B"}
                      onValueChange={item.onPress}
                      value={item.value}
                    />
                  </LinearGradient>
                ) : (
                  <Switch
                    trackColor={{ false: "#D9D9D9", true: "#111111" }}
                    thumbColor={item.value ? "#FFF" : "#5B5B5B"}
                    onValueChange={item.onPress}
                    value={item.value}
                  />
                )}
              </View>
              {index == 0 && isInteraction ? (
                <ScrollView
                  showsHorizontalScrollIndicator={false}
                  horizontal
                  contentContainerStyle={styles.row}
                >
                  {interactionData.map((item) => {
                    return (
                      <View style={styles.box} key={item.id}>
                        <View style={styles.iconBox}>
                          <Image
                            resizeMode="contain"
                            source={item.icon}
                            style={styles.icon}
                          />
                        </View>
                        <Text style={styles.interactionLabel}>
                          {item.label}
                        </Text>
                        <Switch
                          trackColor={{ false: "#D9D9D9", true: "gray" }}
                          thumbColor={
                            allowedInteractionTypes.includes(item.id)
                              ? "#0F0"
                              : "#FFF"
                          }
                          onValueChange={() => {
                            setAllowedInteractionTypes((prev) => {
                              if (prev.includes(item.id)) {
                                return prev.filter((pi) => {
                                  return pi !== item.id;
                                });
                              }

                              return [...prev, item.id];
                            });
                          }}
                          value={allowedInteractionTypes.includes(item.id)}
                          style={{
                            alignSelf: "flex-end",
                            margin: 5,
                          }}
                        />
                      </View>
                    );
                  })}
                </ScrollView>
              ) : null}
              {index == 1 && isPrivate ? (
                <View style={styles.privateContainer}>
                  <TextInput
                    style={styles.inputPrivate}
                    placeholder={t("Price")}
                    value={price}
                    onChangeText={(nextVal) => {
                      return !isNaN(+nextVal) ? setPrice(nextVal) : null;
                    }}
                    keyboardType="number-pad"
                  />
                  <Image
                    source={require("../../assets/set.png")}
                    style={styles.set}
                    resizeMode="contain"
                  />
                </View>
              ) : null}
            </>
          );
        })}
        <View
          style={{
            marginBottom: 110,
          }}
        />
      </KeyboardAwareScrollView>
      <View style={styles.bottom}>
        <ButtonLinear title={t("Save")} bottom={20} onPress={onSavePress} />
      </View>

      <PercentLoader
        isLoading={uploadVideoMutation.isLoading}
        loadingPercent={loadingPercent}
      />
    </>
  );
};

export default EditCover;

const styles = StyleSheet.create({
  selectCover: {
    backgroundColor: "#131313",
    width: sizes.width / 1.62,
    height: sizes.width / 1.11,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
  },
  selectCoverLinear: {
    backgroundColor: "#131313",
    width: sizes.width / 1.6,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    height: sizes.width / 1.1,
    borderRadius: 14,
    marginTop: 20,
  },

  addIcon: {
    width: 23,
    height: 23,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    width: sizes.width / 1.4,
  },
  boxTitle: {
    fontSize: 18,
    color: "#FFF",
    marginLeft: 5,
    fontFamily: fonts.regular,
  },
  switch: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#111111",
    margin: 5,
    width: sizes.width / 1.06,
    padding: 15,
    borderRadius: 10,
    alignSelf: "center",
  },
  top: {
    marginTop: 20,
  },
  label: {
    width: sizes.width / 1.6,
    color: "#FFF",
    fontSize: 16,
    fontFamily: fonts.regular,
  },
  bottom: {
    width: sizes.width,
    position: "absolute",
    bottom: 0,
  },
  input: {
    backgroundColor: "#141414",
    width: sizes.width / 1.07,
    alignSelf: "center",
    height: 94,
    borderRadius: 15,
    padding: 10,
    fontFamily: fonts.roboto,
    marginTop: 10,
    marginBottom: 10,
    color: "#FFF",
  },
  info: {
    width: 24,
    height: 24,
    tintColor: "#444444",
  },
  icon: {
    width: 20,
    tintColor: "#FFF",
    height: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  box: {
    width: 108,
    height: 108,
    backgroundColor: "#101010",
    shadowColor: "#C5C5C5",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    borderRadius: 15,
    shadowRadius: 3.84,
    margin: 10,
  },
  iconBox: {
    backgroundColor: "#101010",
    borderWidth: 1,
    borderColor: "#2F2F2F",
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 13,
    margin: 7,
  },
  interactionLabel: {
    color: "#FFF",
    fontFamily: fonts.roboto,
    marginLeft: 7,
  },
  privateContainer: {
    backgroundColor: "#141414",
    borderRadius: 33.5,
    width: sizes.width / 1.07,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "center",
    padding: 10,
    marginTop: 7,
    marginBottom: 7,
  },
  inputPrivate: {
    width: sizes.width / 1.6,
    backgroundColor: "#141414",
    color: "#FFF",
  },
  set: {
    width: 74,
    height: 33,
  },
  title: {
    color: "#7B7B7B",
    fontFamily: fonts.regular,
    fontSize: 16,
    width: sizes.width / 1.07,
    alignSelf: "center",
    marginTop: 30,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "#202020",
    marginTop: 10,
    marginBottom: 30,
    width: sizes.width / 1.07,
    alignSelf: "center",
  },
  linearGradient: {
    borderRadius: 20,
    width: 55,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  infoPop: {
    width: sizes.width / 1.1,
    height: 280,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    bottom: -0,
    left: 25,
  },
  infoPopText: {
    color: "#fff",
    fontFamily: fonts.regular,
    fontSize: 15,

    textAlign: "center",
  },
});

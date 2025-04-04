import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
} from "react-native";
import ImagePicker from "react-native-image-crop-picker";

import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";

import { t as trx } from "i18next";
import { useAtom, useSetAtom } from "jotai";
import { useTranslation } from "react-i18next";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ButtonLinear } from "../../components";
import routes from "../../constants/routes";
import { notify } from "../../helpers/notify";
import { sizes } from "../../theme";
import fonts from "../../theme/fonts";
import { autoBablAtom, bablFormAtom, helpAtom } from "../../utils/atoms";
import * as Queries from "../../utils/queries";
import Storage from "../../utils/storage";

import CreateBablHeaderNeon from "./CreateBablHeaderNeon";

export const getBablCategories = (translate) => {
  return [
    {
      label: translate("all"),
      icon: require("../../assets/device.png"),
      _id: "ALL",
      id: 1,
    },
    {
      label: translate("Sport"),
      icon: require("../../assets/spor.png"),
      _id: "SPOR",
      id: 2,
    },
    {
      label: translate("Health"),
      icon: require("../../assets/health.png"),
      _id: "HEALTH",
      id: 3,
    },
    {
      label: translate("Economy"),
      icon: require("../../assets/economy.png"),
      _id: "ECONOMY",
      id: 4,
    },
    {
      label: translate("Beauty"),
      icon: require("../../assets/beatuy.png"),
      _id: "BEAUTY",
      id: 5,
    },
    {
      label: translate("Shopping"),
      icon: require("../../assets/bask.png"),
      _id: "COMMERCE",
      id: 6,
    },
    {
      label: translate("Other"),
      icon: require("../../assets/other.png"),
      _id: "TECH",
      id: 7,
    },
    {
      label: translate("TravelExplore"),
      icon: require("../../assets/val.png"),
      _id: "TRAVEL",
      id: 8,
    },
    {
      label: translate("Politics"),
      icon: require("../../assets/siy.png"),
      _id: "POLITICS",
      id: 9,
    },
    {
      label: translate("FoodaDrink"),
      icon: require("../../assets/food.png"),
      _id: "EATING",
      id: 10,
    },
    {
      label: translate("Entertainment"),
      icon: require("../../assets/enternaiment.png"),
      _id: "ENTERTAINMENT",
      id: 11,
    },
    {
      label: translate("WorldNews"),
      icon: require("../../assets/wor.png"),
      _id: "JOURNAL",
      id: 12,
    },
    {
      label: translate("MagazineEvents"),
      icon: require("../../assets/daily.png"),
      _id: "DAILY",
      id: 13,
    },
    {
      label: translate("Fashion"),
      icon: require("../../assets/celeb.png"),
      _id: "CELEBRITIES",
      id: 14,
    },

    {
      label: translate("MusicLiteratureCinema"),
      icon: require("../../assets/musics.png"),
      _id: "MUSIC",
      id: 15,
    },
    {
      label: translate("CreativeArtDesign"),
      icon: require("../../assets/creative.png"),
      _id: "ART",
      id: 16,
    },
    {
      label: translate("CultureEducation"),
      icon: require("../../assets/culture_education.png"),
      _id: "CULTURE",
      id: 17,
    },
    {
      label: translate("NatureBios"),
      icon: require("../../assets/natural.png"),
      _id: "NATURE",
      id: 18,
    },
    {
      label: translate("Motivation"),
      icon: require("../../assets/buisness.png"),
      _id: "BUSINESS",
      id: 19,
    },
    {
      label: translate("PersonalGrowth"),
      icon: require("../../assets/lamb.png"),
      _id: "INSPIRATION",
      id: 20,
    },
    {
      label: translate("MentalHealth"),
      icon: require("../../assets/mental_health.png"),
      _id: "MENTAL_HEALTH",
      id: 21,
    },
  ];
};

export const bablCategoriesIcon = getBablCategories(trx).reduce((prev, cur) => {
  return {
    ...prev,
    [cur._id]: cur.icon,
  };
}, {});

const CreateBabl = () => {
  const [isEnabled, setIsEnabled] = React.useState(null);
  const [bablForm, setBablForm] = useAtom(bablFormAtom);
  const [helpState, setHelpState] = useAtom(helpAtom);
  const [selectedImage, setSelectedImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);

  const [prompt, setPrompt] = useState("");
  const navigation = useNavigation();
  const route = useRoute();
  const setAutoBablState = useSetAtom(autoBablAtom);
  const { t } = useTranslation();
  const bablCategories = getBablCategories(t);
  const isFocused = useIsFocused();

  const { isSubBabl, edit, editData } = route.params || {};

  const requestGalleryPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: "Galeri Erişimi Gerekli",
            message:
              "Uygulamanın galerinizdeki resimlere erişmesine izin verin.",
            buttonNeutral: "Daha Sonra Sor",
            buttonNegative: "İptal",
            buttonPositive: "Tamam",
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const openGallery = async () => {
    const permissionGranted = await requestGalleryPermission();
    if (!permissionGranted) return;

    ImagePicker.openPicker({
      multiple: true,
      mediaType: "photo",
    })
      .then((images) => {
        if (images.length > 0) {
          setSelectedImage(images[0].path);
          setGalleryImages(images.map((img) => img.path));
        }
      })
      .catch((error) => {
        console.warn("Image picker error:", error);
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      if (!isSubBabl) {
        Storage.getItem("bablForm").then((draft) => {
          if (draft) {
            setBablForm(draft);
          }
        });
      }
    }, [isSubBabl]),
  );

  const toggleSwitch = () => {
    setIsEnabled((previousState) => {
      // Switch'in durumunu günceller
      const newState = !previousState;

      // Eğer ilk kez tıklanıyorsa, bir uyarı gösterir

      return newState;
    });
  };

  const prompts = [
    {
      label: "Background Gray",
    },
    {
      label: "Silver Cloud",
    },
    {
      label: "Silver Cloud",
    },
    {
      label: "Silver Cloud",
    },
    {
      label: "Silver Cloud",
    },
  ];

  const renderItem = ({ item }) => {
    return (
      <View style={styles.itemBackground}>
        <Text style={styles.item}>{item.label}</Text>
      </View>
    );
  };

  const onContinuePress = async () => {
    if (!bablForm.title) {
      return notify({
        title: t("pleaseEnterBablTitle"),
      });
    }

    if (!bablForm.category) {
      return notify({
        title: t("pleaseSelectBablCategory"),
      });
    }

    if (isEnabled && !prompt) {
      return notify({
        title: t("pleaseEnterPrompt"),
      });
    }

    navigation.navigate(routes.CreateBablCategories, {
      title: bablForm?.title,
      photo: selectedImage?.uri,
      edit: edit,
      editData: editData,
    });
  };

  return (
    <View
      style={{ flex: 1, backgroundColor: "#000" }}
      source={require("../../assets/neon.png")}
    >
      <CreateBablHeaderNeon onPress={onContinuePress} firstScreen />

      <KeyboardAvoidingView>
        <KeyboardAwareScrollView>
          <>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder={t("enterBablTitle")}
                value={bablForm?.title}
                style={styles.input}
                textAlignVertical="top" // 👈 Bu satırı ekle
                multiline
                placeholderTextColor="#454545"
                onSubmitEditing={() => Keyboard.dismiss()} // <-- klavyeyi kapatır
                onChangeText={(text) => {
                  setBablForm((prev) => ({ ...prev, title: text }));
                }}
              />
            </View>
            <Text style={styles.selectCategory}>{t("selectCategory")}</Text>
            <ScrollView
              contentContainerStyle={{
                marginTop: 20,
              }}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {bablCategories.slice(0, 7).map((item, index) => {
                return (
                  <View style={styles.row}>
                    {item._id === bablForm.category ? (
                      <TouchableOpacity
                        style={{
                          marginTop: 0,
                          marginBottom: 40,
                          marginLeft: 14.5,
                          alignItems: "center",
                          height: 33,
                          justifyContent: "center",
                          width: 97,
                        }}
                        onPress={() => {
                          setBablForm((prev) => {
                            return {
                              ...prev,
                              category: item._id,
                            };
                          });
                        }}
                      >
                        <View
                          style={[
                            {
                              width: 97,
                              height: 33,
                              borderRadius: 51,
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "#755CCC",
                              flexDirection: "row",
                            },
                          ]}
                        >
                          <Image
                            source={item.icon}
                            style={{
                              width: 16,
                              height: 18,
                              tintColor: "#FFF",
                              resizeMode: "contain",
                            }}
                          />
                          <Text
                            numberOfLines={1}
                            style={{
                              fontSize: 14,
                              marginLeft: 5,
                              fontFamily: fonts.medium,
                              color: "#FFF",
                            }}
                          >
                            {item.label}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={{
                          marginBottom: 40,
                          marginLeft: 14.5,
                          alignItems: "center",
                          height: 33,
                          justifyContent: "center",
                          width: 97,
                        }}
                        onPress={() => {
                          setBablForm((prev) => {
                            return {
                              ...prev,
                              category: item._id,
                            };
                          });
                        }}
                      >
                        <View
                          style={[
                            {
                              width: 97,
                              height: 33,
                              borderRadius: 51,
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "#212121",
                              flexDirection: "row",
                            },
                            item._id === bablForm.category && {
                              width: 97,
                              height: 33,
                              borderRadius: 51,
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "#212121",
                              flexDirection: "row",
                            },
                          ]}
                        >
                          <Image
                            source={item.icon}
                            style={{
                              width: 16,
                              height: 18,
                              tintColor: "#755CCC",
                              resizeMode: "contain",
                            }}
                          />
                          <Text
                            numberOfLines={1}
                            style={{
                              fontSize: 14,
                              marginLeft: 5,
                              fontFamily: fonts.medium,
                              color: "#FFF",
                            }}
                          >
                            {item.label}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}

              <View style={{ width: 20 }} />
            </ScrollView>
          </>
        </KeyboardAwareScrollView>
        <View style={[styles.marginBottom]}>
          <ButtonLinear onPress={onContinuePress} title={t("continue")} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default CreateBabl;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  headerTop: {
    marginTop: 50,
  },
  light: {
    color: "#fff",
    fontSize: 18,
    fontFamily: fonts.light,
    textAlign: "center",
  },
  title: {
    color: "#fff",
    fontSize: 17,
    fontFamily: fonts.roboto,
    marginLeft: 5,
  },
  top: {
    marginTop: sizes.width / 1.1,
  },
  linear: {
    width: sizes.width / 1.07,
    alignSelf: "center",
    height: 72,
    padding: 25,

    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bbal: {
    width: 37,
    height: 37,
  },
  white: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: fonts.roboto,
    fontWeight: "500",
  },

  bottom: {
    backgroundColor: "#FFF",
    shadowColor: "#C5C5C5",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 5,
    shadowRadius: 3.84,
    height: sizes.width,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    position: "absolute",
    bottom: 50,
    width: sizes.width,
  },
  containerBackground: {
    backgroundColor: "#000",
    flex: 1,
  },
  bottomButton: {
    backgroundColor: "#FFF",
    shadowColor: "#C5C5C5",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 5,
    shadowRadius: 3.84,
    bottom: 0,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    height: sizes.width / 3,
    justifyContent: "center",
  },
  buttonBottom: {
    marginBottom: sizes.width / 4,
  },
  bottomText: {
    color: "#868686",
    fontSize: 16,
    fontFamily: fonts.regular,
    margin: 20,
  },
  itemBackground: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderRadius: 18.5,
    margin: 5,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#E2E2E2",
  },
  item: {
    color: "#868686",
    fontSize: 16,
    fontFamily: fonts.avenir,
  },
  bottomDetailBackground: {
    backgroundColor: "#141414",
    width: sizes.width / 1.1,
    borderRadius: 18.5,
    margin: 5,
    padding: 10,
    alignSelf: "center",
  },
  prompt: {
    color: "#FFF",
    fontSize: 16,
    marginLeft: 10,
    marginBottom: 10,
    paddingVertical: 0,
    textAlignVertical: "top",
    flex: 1,
    minHeight: 50,
  },
  topHeader: {
    marginTop: sizes.width / 4,
  },
  marginBottom: {
    alignSelf: "center",
    marginTop: 50,
  },
  marginThirdTop: {
    marginTop: 30,
  },
  linearGradient: {
    width: sizes.width / 1.07,
    height: 54,
    borderRadius: 14,
    alignSelf: "center",
    color: "#FFF",
    fontFamily: fonts.roboto,
    marginTop: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    backgroundColor: "#161616",
    width: sizes.width / 1.1,
    height: sizes.width,
    borderRadius: 20,
    alignSelf: "center",
    marginTop: 20,
    padding: 10,
  },
  input: {
    fontFamily: fonts.regular,
    color: "#FFF",
    width: sizes.width / 1.1,
    height: sizes.width,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    width: sizes.width / 1.07,
  },
  other: {
    fontSize: 15,
    marginTop: 10,
    fontFamily: fonts.regular,
    color: "#AEAEAE",
  },
  selectCategory: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: fonts.medium,
    width: sizes.width / 1.1,
    alignSelf: "center",
    marginTop: 10,
  },
});

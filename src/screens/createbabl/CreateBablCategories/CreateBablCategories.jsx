import React from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
  ImageBackground,
} from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import { useAtom, useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";
import moment from "moment";
import { useTranslation } from "react-i18next";
import ImageCropPicker from "react-native-image-crop-picker";
import { Notifier } from "react-native-notifier";
import HeicConverter from "react-native-heic-converter"; // başa ekle

import { ButtonLinear } from "../../../components";
import PercentLoader from "../../../components/PercentLoader";
import routes from "../../../constants/routes";
import { notify } from "../../../helpers/notify";
import { sizes } from "../../../theme";
import fonts from "../../../theme/fonts";
import { bablFormAtom, userAtom } from "../../../utils/atoms";
import * as Queries from "../../../utils/queries";
import CreateBablHeader from "../CreateBablHeader";
import CreateItYourself from "../CreateItYourself";

import { categoryOptionsData } from "./category-options-data";
import CategoryOptions from "./CategoryOptions";

const CreateBablCategories = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const user = useAtomValue(userAtom);
  const { allowedCategories, newItemSession = false } = route.params || {};
  const [bablForm, setBablForm] = useAtom(bablFormAtom);
  const resetBablForm = useResetAtom(bablFormAtom);
  const [loadingPercent, setLoadingPercent] = React.useState();
  const [activeIndex, setActiveIndex] = React.useState(0);

  const [cover, setCover] = React.useState(null);
  const { t } = useTranslation();

  const uploadMediaMutation = useMutation(Queries.uploadMedia, {
    onSuccess: (res, body) => {
      setLoadingPercent(false); // loading % sıfırla
      setCover(res);
      const type = "PHOTO_MANUAL";

      setBablForm((prev) => {
        return {
          ...prev,
          items: {
            ...prev.items,
            [type]: {
              ...(prev.items[type] || {}),
              [res.id]: {
                ...res,
                title: body.txt,
                addedAt: moment().toDate(),
                type,
              },
            },
          },
        };
      });
    },
    onError: (err) => {},
  });

  const onUploadProgress = (event) => {
    setLoadingPercent((event.loaded / event.total) * 100);
  };

  const uploadVideoMutation = useMutation(
    (v) => {
      return Queries.uploadVideo(v, onUploadProgress);
    },
    {
      onSuccess: (res, body) => {
        setBablForm((prev) => {
          const type = "VIDEO_MANUAL";

          return {
            ...prev,
            items: {
              ...prev.items,
              [type]: {
                ...(prev.items[type] || {}),
                [res.id]: {
                  ...res,
                  coverVideo: res.url,
                  title: body.txt,
                  addedAt: moment().toDate(),
                  cover: body.cover,
                  type,
                },
              },
            },
          };
        });
      },
      onError: (err) => {
        console.log("err", err);
      },
    },
  );

  const setSelectedPhoto = async (selectedPhoto) => {
    try {
      const currentCount = Object.keys(
        bablForm.items.PHOTO_MANUAL || {},
      ).length;
      if (currentCount >= 5) {
        Alert.alert(t("Warnings"), t("PhotoFive"));
        return;
      }

      let filePath = selectedPhoto.sourceURL || selectedPhoto.path;

      if (filePath?.toLowerCase().endsWith(".heic")) {
        const converted = await HeicConverter.convert({
          path: filePath,
          quality: 1,
        });

        if (converted?.success) {
          filePath = converted.path;
        } else {
          throw new Error("HEIC conversion failed");
        }
      }

      uploadMediaMutation.mutate({
        mime: selectedPhoto.mime,
        path: filePath,
        txt: "akana",
      });
    } catch (error) {
      console.log("Photo conversion/upload error:", error);
      Notifier.showNotification({
        title: "An error occurred while processing the image",
      });
    }
  };

  const bablEmbedCallback = (item, cb) => {
    return setBablForm((prev) => {
      if (prev.items[item.type]?.[item._id]) {
        const { [item._id]: extractedItem, ...rest } = prev.items[item.type];

        cb(false);
        return {
          ...prev,
          items: {
            ...prev.items,
            [item.type]: rest,
          },
        };
      }
      cb(true);
      return {
        ...prev,
        items: {
          ...prev.items,
          [item.type]: {
            ...(prev.items[item.type] || {}),
            [item._id]: {
              ...item,
              id: item._id,
              addedAt: moment().toDate(),
            },
          },
        },
      };
    });
  };

  const isChecked = (type, id) => {
    return !!bablForm?.items?.[type]?.[id];
  };

  const counts = Object.entries(bablForm.items).reduce((prev, [k, v]) => {
    return {
      ...prev,
      [k]: Object.keys(v).length,
    };
  }, {});

  const tabs = [
    {
      id: "VIDEO",
      label: t("Video"),
      item: (
        <CategoryOptions
          data={categoryOptionsData.VIDEO()}
          counts={counts}
          newItemSession={newItemSession}
        />
      ),
    },

    {
      id: "SHORT_VIDEO",
      label: t("ShortVideo"),
      item: (
        <CategoryOptions
          data={categoryOptionsData.SHORT_VIDEO()}
          counts={counts}
          newItemSession={newItemSession}
        />
      ),
    },
    {
      id: "PHOTO",
      label: t("Photo"),
      item: (
        <CategoryOptions
          data={categoryOptionsData.PHOTO()}
          counts={counts}
          newItemSession={newItemSession}
        />
      ),
    },
    {
      id: "TEXT",
      label: t("Text"),
      item: (
        <CategoryOptions
          data={categoryOptionsData.TEXT()}
          counts={counts}
          newItemSession={newItemSession}
        />
      ),
    },

    {
      id: "MUSIC",
      label: t("Music"),
      item: (
        <CategoryOptions
          data={categoryOptionsData.MUSIC()}
          counts={counts}
          newItemSession={newItemSession}
        />
      ),
    },
    {
      id: "STREAM",
      label: t("Stream"),
      item: (
        <CategoryOptions
          data={categoryOptionsData.STREAM()}
          counts={counts}
          newItemSession={newItemSession}
        />
      ),
    },
    {
      id: "SHOP",
      label: t("Shop"),
      item: (
        <CategoryOptions
          data={categoryOptionsData.SHOP()}
          counts={counts}
          newItemSession={newItemSession}
        />
      ),
    },
    {
      id: "INTERNET",
      label: t("Internet"),
      item: (
        <CategoryOptions
          data={categoryOptionsData.INTERNET()}
          counts={counts}
          newItemSession={newItemSession}
        />
      ),
    },
    {
      id: "AI",
      label: t("ai"),
      item: <CategoryOptions data={categoryOptionsData.AI()} counts={counts} />,
    },
    {
      id: "BABL",
      label: t("Babl"),
      item: (
        <CategoryOptions
          data={categoryOptionsData.BABL(
            navigation,
            bablEmbedCallback,
            user._id,
            isChecked,
          )}
          counts={counts}
        />
      ),
    },
  ].filter((item) => {
    return allowedCategories ? allowedCategories.includes(item.id) : true;
  });

  const [customFilter, setCustomFilter] = React.useState(tabs[0].id);
  const [visible, setVisible] = React.useState(null);
  const pagerRef = React.useRef();

  const { title } = route.params || {};

  const buttons = [
    {
      label: t("createYourself"),
      icon: require("../../../assets/pencil.png"),
      onPress: () => {
        setVisible(true);
      },
      count: newItemSession
        ? 0
        : Object.keys(bablForm.items.VIDEO_MANUAL || {}).length +
          Object.keys(bablForm.items.PHOTO_MANUAL || {}).length +
          Object.keys(bablForm.items.TEXT_MANUAL || {}).length,
    },
  ];

  const onPermissionErr = (err) => {
    if (err.code === "E_NO_LIBRARY_PERMISSION") {
      return Alert.alert(t("noGalleryAccess"), t("wouldYouLikeToGoSettins"), [
        {
          text: t("no"),
          onPress: () => {
            setVisible(false);
          },
        },
        {
          text: t("yes"),
          onPress: () => {
            Linking.openSettings();
          },
        },
      ]);
    }
    setVisible(false);
  };

  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: "#000",
        }}
      >
        <CreateItYourself
          visible={visible}
          onClose={() => {
            setVisible(false);
          }}
          onPhotoPress={() => {
            ImageCropPicker.openPicker({
              cropping: true,
            })
              .then((res) => {
                setSelectedPhoto(res).finally(() => {
                  return setVisible(false);
                });
              })
              .catch((err) => {
                onPermissionErr(err);
              });
          }}
          onVideoPress={() => {
            ImageCropPicker.openCamera({
              cropping: true,
              mediaType: "photo",
            })
              .then((res) => {
                setSelectedPhoto(res).finally(() => {
                  return setVisible(false);
                });
              })
              .catch((err) => {
                onPermissionErr(err);
              });
          }}
          onTextPress={() => {
            setVisible(false);
            navigation.navigate(routes.TextEditor, {
              onDone: (createdText) => {
                setBablForm((prev) => {
                  const type = "TEXT_MANUAL";
                  const randomId = Math.random().toString(36).slice(2, 7);

                  return {
                    ...prev,
                    items: {
                      ...prev.items,
                      [type]: {
                        ...(prev.items[type] || {}),
                        [randomId]: {
                          id: randomId,
                          cover: null,
                          url: createdText,
                          title: null,
                          description: null,
                          type,
                          addedAt: moment().toDate(),
                        },
                      },
                    },
                  };
                });
                navigation.goBack();
              },
            });
          }}
        />
        <View style={{ flex: 1 }} backgroundColor="#000" scrollview={false}>
          <CreateBablHeader title={title} dark iconwhite />
          <ImageBackground
            style={{
              width: sizes.width,
              height: sizes.width,
              alignItems: "center",
              justifyContent: "center",
            }}
            source={require("../../../assets/screenbg.png")}
          >
            {uploadMediaMutation.isLoading || loadingPercent > 0 ? (
              <>
                <ActivityIndicator size="large" color="#fff" />
                {loadingPercent && (
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 16,
                      marginTop: 10,
                      fontFamily: fonts.medium,
                    }}
                  >
                    %{Math.round(loadingPercent)} Yükleniyor...
                  </Text>
                )}
              </>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                onScroll={(e) => {
                  const index = Math.round(
                    e.nativeEvent.contentOffset.x / sizes.width,
                  );
                  setActiveIndex(index);
                }}
                scrollEventThrottle={16}
                style={{ width: sizes.width }}
              >
                {Object.values(bablForm.items.PHOTO_MANUAL || {}).map(
                  (item) => (
                    <View
                      key={item.id}
                      style={{
                        width: sizes.width,
                        height: sizes.width,
                        position: "relative",
                      }}
                    >
                      <Image
                        style={{ width: "100%", height: "100%" }}
                        resizeMode="contain"
                        source={{ uri: item.cover }}
                      />

                      <TouchableOpacity
                        onPress={() => {
                          setBablForm((prev) => {
                            const { [item.id]: removed, ...remaining } =
                              prev.items.PHOTO_MANUAL || {};
                            return {
                              ...prev,
                              items: {
                                ...prev.items,
                                PHOTO_MANUAL: remaining,
                              },
                            };
                          });
                        }}
                        style={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          backgroundColor: "rgba(0,0,0,0.6)",
                          borderRadius: 20,
                          padding: 6,
                          zIndex: 10,
                        }}
                      >
                        {/* Eğer PNG ikon kullanıyorsan */}
                        <Image
                          source={require("../../../assets/bin.png")}
                          style={{ width: 20, height: 20, tintColor: "#fff" }}
                        />

                        {/* Eğer vector icon kullanıyorsan: */}
                        {/* <Icon name="trash-can-outline" size={20} color="#fff" /> */}
                      </TouchableOpacity>
                    </View>
                  ),
                )}
              </ScrollView>
            )}
          </ImageBackground>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            {Object.values(bablForm.items.PHOTO_MANUAL || {}).map(
              (_, index) => (
                <View
                  key={index}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    marginHorizontal: 4,
                    backgroundColor: activeIndex === index ? "#fff" : "#888",
                  }}
                />
              ),
            )}
          </View>

          <Text
            style={{
              color: "#fff",
              fontSize: 16,
              fontFamily: fonts.bold,
              width: sizes.width / 1.07,
              alignSelf: "center",
              marginTop: 10,
            }}
          >
            {t("PleaseSelectPhotoOrVideo")}
          </Text>
        </View>

        <View style={styles.row}>
          {buttons.map((item, index) => {
            if (!item) return null;

            return (
              <View style={styles.margin}>
                <ButtonLinear
                  icon={item.icon}
                  width={sizes.width / 2.1}
                  linearWidth={sizes.width / 2.12}
                  title={item.label}
                  radius={26}
                  onPress={item.onPress}
                />
                {!!item.count && (
                  <View
                    style={{
                      position: "absolute",
                      right: -70,
                      width: 20,
                      height: 20,
                      top: 7,
                      borderRadius: 20,
                      backgroundColor: "#FFF",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "#000",
                        fontFamily: fonts.medium,
                      }}
                    >
                      {item.count}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <ButtonLinear
          width={sizes.width / 1.07}
          title={t("continue")}
          onPress={() => {
            const photoCount = Object.keys(
              bablForm.items.PHOTO_MANUAL || {},
            ).length;

            if (photoCount === 0) {
              Alert.alert(t("Warnings"), t("PhotoWarning"));
              return;
            }

            if (photoCount > 5) {
              Alert.alert(t("Warnings"), t("PhotoFive"));
              return;
            }

            navigation.navigate(routes.EditBabl, {
              cover: cover ? cover : bablForm.items.PHOTO_MANUAL,
            });
          }}
        />

        <View
          style={{
            marginTop: 40,
          }}
        />
      </View>

      <PercentLoader
        isLoading={uploadVideoMutation.isLoading}
        loadingPercent={loadingPercent}
      />
    </>
  );
};

export default CreateBablCategories;

const styles = StyleSheet.create({
  itemMenu: {
    fontSize: 15,
    fontWeight: "bold",
    margin: 12,
    fontFamily: fonts.roboto,
  },
  itemContainer: {
    shadowColor: "#313131",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 3.84,
    height: sizes.width / 7,
    width: sizes.width,
    backgroundColor: "#000",
    elevation: 5,
  },
  center: {
    alignItems: "center",
  },
  borderBottom: {
    backgroundColor: "#fff",
    borderRadius: 2,
    width: 17,
    height: 4,
  },
  bottom: {
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    height: sizes.width / 5,
    justifyContent: "center",
    width: sizes.width,
  },
  modalStyle: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    justifyContent: "space-between",
  },
  handleStyle: {
    backgroundColor: "#FFF",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  margin: {
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});

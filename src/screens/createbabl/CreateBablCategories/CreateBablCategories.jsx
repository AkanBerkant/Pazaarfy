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
import { createThumbnail } from "react-native-create-thumbnail";
import ImageCropPicker from "react-native-image-crop-picker";
import { Notifier } from "react-native-notifier";

import { VESDK } from "react-native-videoeditorsdk";

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

  const [cover, setCover] = React.useState(null);
  const { t } = useTranslation();

  const uploadMediaMutation = useMutation(Queries.uploadMedia, {
    onSuccess: (res, body) => {
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
    onError: (err) => {
      console.log("TESTTESTETS", err);
    },
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

  console.log("test", cover);

  const setSelectedVideo = async (selectedVideo) => {
    try {
      const editedVideo = await VESDK.openEditor({
        uri: selectedVideo.path,
      });

      const thumbnail = await createThumbnail({
        url: editedVideo.video,
      });

      const { cover } = await Queries.uploadMedia(thumbnail);

      if (!editedVideo) {
        return;
      }

      navigation.navigate(routes.VideoEditor, {
        src: editedVideo.video,
        onDone: (txt) => {
          uploadVideoMutation.mutate({
            mime: selectedVideo.mime,
            path: editedVideo.video,
            cover,
            txt,
          });
          navigation.goBack();
        },
      });
    } catch (error) {
      console.log("err", error);
      Notifier.showNotification({
        title: t("AnUnexpectedErrorOccurred"),
      });
    }
  };

  const setSelectedPhoto = async (selectedPhoto) => {
    uploadMediaMutation.mutate({
      mime: selectedPhoto.mime,
      path: selectedPhoto.sourceURL,
      txt: "akana",
    });
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
              cropping: false,
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
            ImageCropPicker.openPicker({
              mediaType: "video",
              compressVideoPreset: "HighestQuality",
            })
              .then((res) => {
                setSelectedVideo(res).finally(() => {
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
            {cover && (
              <Image
                style={{
                  width: sizes.width / 1.1,
                  height: sizes.width / 1.1,
                }}
                resizeMode="contain"
                source={{
                  uri: cover?.cover,
                }}
              />
            )}
          </ImageBackground>

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

        {cover?.cover ? null : (
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
                </View>
              );
            })}
          </View>
        )}

        <ButtonLinear
          width={sizes.width / 1.07}
          title={t("continue")}
          onPress={() => {
            if (cover == undefined) {
              notify({ title: t("PleaseSelectPhotoOrVideo") });
            } else {
              navigation.navigate(routes.EditBabl, {
                title,
                cover,
              });
            }
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

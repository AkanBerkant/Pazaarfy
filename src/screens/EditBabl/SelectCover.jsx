import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Alert,
} from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import ImageCropPicker from "react-native-image-crop-picker";
import LinearGradient from "react-native-linear-gradient";
import { Notifier } from "react-native-notifier";

import { ButtonLinear, BackHeader } from "../../components";
import PercentLoader from "../../components/PercentLoader";
import routes from "../../constants/routes";
import { sizes } from "../../theme";
import * as Queries from "../../utils/queries";
import CreateItYourself from "../createbabl/CreateItYourself";

const SelectCover = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [loadingPercent, setLoadingPercent] = React.useState();
  const { t } = useTranslation();

  const uploadMediaMutation = useMutation(Queries.uploadMedia, {
    onSuccess: (res, body) => {
      route.params.setSelectedCover({
        coverSource: res.url,
        coverUrl: body.coverUrl,
        sourcePath: body.path,
        sourceMime: body.mime,
      });
      navigation.goBack();
    },
    onError: (err) => {
      console.log("err", err.response.data);
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
        route.params.setSelectedCover({
          coverSource: res.url,
          coverUrl: body.coverUrl,
          coverItem: body.coverItem,
          sourcePath: body.path,
          sourceMime: body.mime,
        });
        navigation.goBack();
      },
      onError: (err) => {
        console.log("err", err.response.data);
      },
    },
  );

  const data = [
    {
      icon: require("../../assets/tiktok.png"),
      title: "Tiktok",
      description: t("TapToGoToSiteForShareContentToSharedSavings"),
      queryFn: Queries.searchTiktok,
      type: "SHORT_TIKTOK",
      onPress: () => {
        navigation.navigate(routes.YoutubeLists, {
          item: {
            title: "Tiktok",
            queryFn: Queries.searchTiktok,
            type: "SHORT_TIKTOK",
          },
          isCover: true,
          cb: (cbRes) => {
            if (cbRes.coverVideo) {
              uploadVideoMutation.mutate({
                mime: "video/mp4",
                path: cbRes.coverVideo,
                coverUrl: cbRes.url,
              });
              navigation.goBack();
            }
          },
        });
      },
    },
    {
      icon: require("../../assets/reels.png"),
      title: "Reels",
      description: t("TapToGoToSiteForShareContentToSharedSavings"),
      onPress: () => {
        return Linking.openURL("https://www.instagram.com/");
      },
    },
    {
      icon: require("../../assets/pinterest.png"),
      title: "Pinterest",
      description: t("TapToGoToSiteForShareContentToSharedSavings"),
      onPress: () => {
        return Linking.openURL("https://pinterest.com/");
      },
    },
    {
      icon: require("../../assets/bing.png"),
      title: "Bing",
      description: t("TapToGoToSiteForShareContentToSharedSavings"),
      queryFn: Queries.searchBing,
      type: "PHOTO_BING",
    },
  ];

  const [visible, setVisible] = React.useState(null);
  const buttons = [
    {
      label: t("ShareLibrary"),
      icon: require("../../assets/sharelib.png"),
      onPress: () => {
        navigation.navigate(routes.SharedLibrary, {
          isCover: true,
          cb: (cbRes) => {
            if (cbRes.coverVideoCopy) {
              uploadVideoMutation.mutate({
                mime: "video/mp4",
                path: cbRes.coverVideoCopy,
                coverUrl: cbRes.url,
                coverItem: cbRes,
              });
              navigation.goBack();
            } else if (cbRes.coverCopy) {
              uploadMediaMutation.mutate({
                mime: "image/jpeg",
                path: cbRes.coverCopy,
                coverUrl: cbRes.url,
              });
              navigation.goBack();
            }
          },
        });
      },
    },
    {
      label: t("createYourself"),
      icon: require("../../assets/pencil.png"),
      onPress: () => {
        setVisible(true);
      },
    },
  ];

  const renderItem = ({ item }) => {
    return (
      <LinearGradient
        colors={["#F9B092", "#D5D399", "#0AAFF6"]}
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 0.0, y: 1.0 }}
        style={styles.grediant}
      >
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => {
            if (item.onPress) {
              return item.onPress();
            }

            navigation.navigate(routes.YoutubeLists, {
              item,
              isCover: true,
              cb: (cbRes) => {
                if (cbRes.coverVideoCopy || cbRes.coverCopy) {
                  route.params.setSelectedCover({
                    coverSource: cbRes.coverVideoCopy || cbRes.coverCopy,
                  });
                  navigation.goBack();
                  navigation.goBack();
                }
              },
            });
          }}
        >
          <LinearGradient
            colors={["#F9B092", "#D5D399", "#0AAFF6"]}
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 0.0, y: 1.0 }}
            style={[styles.numberBox, { opacity: 0 }]}
          >
            <Text style={styles.number}>{item.number}</Text>
          </LinearGradient>

          <Image resizeMode="contain" source={item.icon} style={styles.icon} />
          <View>
            <Text style={styles.label}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
          <View style={styles.plus} />
        </TouchableOpacity>
      </LinearGradient>
    );
  };

  const onPermissionErr = (err) => {
    if (err.code === "E_NO_LIBRARY_PERMISSION") {
      return Alert.alert(t("AccessPermissionGranted"), t("DoYouWantAccess"), [
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
      <View style={styles.container}>
        <BackHeader title={t("selectCover")} />

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
        />

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

        <FlatList
          contentContainerStyle={styles.top}
          data={data}
          renderItem={renderItem}
          numColumns={2}
        />
      </View>

      <PercentLoader
        isLoading={uploadVideoMutation.isLoading}
        loadingPercent={loadingPercent}
      />
    </>
  );
};

export default SelectCover;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  title: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 24,
    textAlign: "center",
    marginTop: 50,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "#202020",
    marginTop: 30,
  },
  box: {
    borderWidth: 1,
    borderColor: "#F8A98F",
  },
  grediant: {
    height: sizes.width / 2.04,
    width: sizes.width / 2.04,
    justifyContent: "center",
    alignSelf: "center",
    margin: 2,

    borderRadius: 16,
  },
  buttonContainer: {
    flex: 1,
    alignSelf: "center",

    backgroundColor: "#000",
    width: sizes.width / 2.09,
    margin: 3,
    justifyContent: "space-between",
    borderRadius: 14,
  },
  icon: {
    width: 34,
    height: 33,
    alignSelf: "center",
  },
  numberBox: {
    alignSelf: "flex-end",
    width: 42,
    height: 42,
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
  number: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#FFF",
  },
  label: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
    textAlign: "center",
  },
  description: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 9,
    margin: 4,
  },
  plus: {
    alignSelf: "flex-end",
    width: 29,
    height: 29,
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
  top: {
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  margin: {
    margin: 5,
  },
});

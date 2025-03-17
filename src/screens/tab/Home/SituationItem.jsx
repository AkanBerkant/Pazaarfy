import React from "react";
import {
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Asset } from "expo-asset";
import { useAtomValue } from "jotai";
import { useTranslation } from "react-i18next";
import { Notifier } from "react-native-notifier";
import { BoxShadow } from "react-native-shadow";

import CustomVideo from "../../../components/CustomVideo";
import routes from "../../../constants/routes";
import { sizes } from "../../../theme";
import fonts from "../../../theme/fonts";
import { userAtom } from "../../../utils/atoms";
import * as Queries from "../../../utils/queries";
import { bablCategoriesIcon } from "../../createbabl/CreateBabl";

const SituationItem = ({
  item,
  shouldPlay,
  onFinish,
  getAllData,
  targetUserId,
}) => {
  const navigation = useNavigation();
  const [localAsset, setLocalAsset] = React.useState();
  const queryClient = useQueryClient();
  const user = useAtomValue(userAtom);

  const pinBablMutation = useMutation(Queries.pinBabl, {
    onSuccess: (res) => {
      Notifier.showNotification({
        title: t("Success"),
      });
      queryClient.invalidateQueries(["BABLS_PAGINATION", targetUserId]);
    },
  });

  const deletePinMutation = useMutation(Queries.deletePin, {
    onSuccess: (res) => {
      Notifier.showNotification({
        title: t("Success"),
      });
      queryClient.invalidateQueries(["BABLS_PAGINATION", targetUserId]);
    },
  });

  const { t, i18n } = useTranslation();

  React.useEffect(() => {
    if (item.coverVideoCropped && shouldPlay) {
      Asset.loadAsync([item.coverVideoCropped]).then((res) => {
        setLocalAsset(res[0].localUri);
      });
    }
  }, [shouldPlay]);

  const onPlaybackStatusUpdate = (st) => {
    if (st.didJustFinish) {
      onFinish?.();
    }
  };

  const onLongPress = () => {
    const isRemove = !!item.pinDate;

    Alert.alert(
      isRemove ? t("WouldYouLikeToRemovePin") : t("WouldYouLikeToPinThisBabl"),
      null,
      [
        {
          text: t("no"),
        },
        {
          text: t("yes"),
          onPress: () => {
            if (isRemove) {
              deletePinMutation.mutate(item.repostId || item._id);
            } else {
              pinBablMutation.mutate(item.repostId || item._id);
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.item}>
      <TouchableOpacity
        onLongPress={targetUserId === user._id ? onLongPress : undefined}
        onPress={() => {
          const allData = getAllData();
          const itemIndex = allData.findIndex((y) => {
            return y._id === item._id;
          });

          return navigation.navigate(routes.DetailList, {
            item,
            allData: [allData],
            categoryIndex: 0,
            itemIndex,
          });
        }}
      >
        {localAsset && shouldPlay ? (
          <CustomVideo
            style={[styles.image]}
            resizeMode={Platform.OS === "ios" ? null : "contain"}
            source={{ uri: localAsset }}
            shouldPlay={shouldPlay}
            onPlaybackStatusUpdate={onPlaybackStatusUpdate}
            isMuted
            isLooping
          />
        ) : (
          <Image
            style={[styles.image]}
            source={{ uri: item.coverCropped || item.cover }}
          />
        )}
      </TouchableOpacity>

      {Platform.OS == "ios" ? (
        <View style={styles.blurIcon}>
          <Image
            resizeMode="contain"
            source={bablCategoriesIcon[item.category]}
            style={styles.categoryIcon}
          />
        </View>
      ) : (
        <View style={styles.blurIcon}>
          <BoxShadow
            setting={{
              width: 20,
              height: 20,
              color: "#E5E5E5",
              border: 10,
              radius: 10,
              opacity: 0.5,
              x: 0,
              y: 2,
              style: {
                top: 7,
                left: 7,
              },
            }}
          >
            <Image
              resizeMode="contain"
              source={bablCategoriesIcon[item.category]}
              style={styles.categoryIcon}
            />
          </BoxShadow>
        </View>
      )}
    </View>
  );
};

export default SituationItem;

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#000",

    justifyContent: "center",
    alignItems: "center",
    width: sizes.width / 2,
    height: sizes.width / 2.03,
    borderRadius: 17,
  },
  image: {
    width: sizes.width / 2.02,
    height: sizes.width / 2.3,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 17,
  },
  pp: {
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: "#CDCDCD",
  },
  position: {
    position: "absolute",
    zIndex: 99,
    bottom: 10,
    flexDirection: "row",
    alignItems: "center",
    left: 10,
  },
  blurIcon: {
    position: "absolute",
    top: 14,
    zIndex: 99,
    textShadowColor: "#000",
    shadowOpacity: 3,
    shadowOffset: { width: 3, height: 2 },
    shadowColor: "#000",
    elevation: 5,
    right: 14,
  },
  categoryIcon: {
    width: 16,
    height: 16,
    tintColor: "#FFF",
  },
  name: {
    color: "#FFF",
    fontFamily: fonts.roboto,
    marginLeft: 5,
    fontSize: 10,
    textShadowColor: "#000",
    shadowOpacity: 3,
    shadowOffset: { width: 3, height: 2 },
    shadowColor: "#000",
    elevation: 5,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 3, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
      },
      android: {
        textShadowColor: "rgba(0, 0, 0, 0.8)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        elevation: 5, // Android'de gölge için
      },
    }),
  },
  text: {
    fontFamily: fonts.roboto,
    top: 7,
    position: "absolute",
    zIndex: 99,
    left: 10,
    fontSize: 12,
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    shadowOpacity: 3,
    shadowOffset: { width: 3, height: 2 },
    shadowColor: "#000",
    elevation: 5,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 3, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
      },
      android: {
        textShadowColor: "rgba(0, 0, 0, 0.8)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        elevation: 5, // Android'de gölge için
      },
    }),
  },
  lottie: {
    fontFamily: fonts.roboto,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0.2, height: 0.2 },
    shadowColor: "rgba(0, 0, 0, 0.5)",
    elevation: 5,
    position: "absolute",
    zIndex: 99,
    right: 7,
    top: 7,
    width: 15,
    height: 15,
    tintColor: "white",
  },
});

import React from "react";
import {
  Animated,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ImageBackground,
} from "react-native";

import {
  CommonActions,
  StackActions,
  useNavigation,
} from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BlurView } from "expo-blur";
import { useAtomValue, useSetAtom } from "jotai";
import { useTranslation } from "react-i18next";
import { Notifier } from "react-native-notifier";

import routes from "../../constants/routes";
import { notify } from "../../helpers/notify";
import { colors, sizes } from "../../theme";
import fonts from "../../theme/fonts";
import { bablFormAtom, userAtom } from "../../utils/atoms";
import * as Queries from "../../utils/queries";
import CreatingBablModal from "../TemplateSelection/CreatingBablModal";

import BablWarnModal from "./BablWarnModal";

const BablContentModal = ({
  bablId,
  bablContent,
  isRebabl,
  user: creatorUser,
  visible,
  onClose,
  onCollectionPress,
}) => {
  const [showModal, setShowModal] = React.useState(visible);
  const [showLoading, setShowLoading] = React.useState(false);
  const scaleValue = React.useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const user = useAtomValue(userAtom);
  const setBablForm = useSetAtom(bablFormAtom);
  const { t } = useTranslation();

  const { data } = useQuery(["BOOKMARKS"], Queries.listBookmarkedBabls, {
    placeholderData: [],
  });
  const bookmarkIds = data.map((item) => {
    return item._id;
  });

  const [visibleWarnModal, setVisibleWarnModal] = React.useState(null);

  React.useEffect(() => {
    toggleModal();
  }, [visible]);

  const toggleModal = () => {
    if (visible) {
      setShowModal(true);
      Animated.spring(scaleValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      setTimeout(() => {
        return setShowModal(false);
      }, 200);
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const bookmarkMutation = useMutation(Queries.bookmarkBabl, {
    onSuccess: (res) => {
      queryClient.invalidateQueries(["BOOKMARKS"]);
      notify({
        title: t("BablSaved"),
      });
    },
    onError: (err) => {
      console.log("err", err);
    },
  });

  const deleteBookmarkMutation = useMutation(Queries.deleteBookmarkBabl, {
    onSuccess: (res) => {
      queryClient.invalidateQueries(["BOOKMARKS"]);
      notify({
        title: t("BookmarkHasBeenDeleted"),
      });
    },
    onError: (err) => {
      console.log("err", err);
    },
  });

  const blockUserMutation = useMutation(Queries.blockUser, {
    onSuccess: async () => {
      notify({
        title: t("UserBlocked"),
      });

      navigation.dispatch(StackActions.pop(2));
      await queryClient.resetQueries();
    },
    onError: (err) => {
      console.log("err", err);
    },
  });

  const deleteBablMutation = useMutation(Queries.deleteBabl, {
    onSuccess: async (res) => {
      notify({
        title: t("BablHasBeenDeleted"),
      });

      navigation.dispatch(StackActions.pop(2));
      await queryClient.resetQueries();
    },
    onError: (err) => {
      console.log("err", err);
    },
  });

  const menu = [
    {
      label: bookmarkIds.includes(bablId) ? t("Savedd") : t("Save"),
      icon: bookmarkIds.includes(bablId)
        ? require("../../assets/bookmark.png")
        : require("../../assets/saved.png"),
      style: {
        tintColor: bookmarkIds.includes(bablId) ? "#A5A4A3" : "#FFF",
      },
      onPress: () => {
        if (bookmarkIds.includes(bablId)) {
          deleteBookmarkMutation.mutate(bablId);
        } else {
          bookmarkMutation.mutate(bablId);
        }
      },
    },
    {
      label: t("AddCollections"),
    },
    user._id !== creatorUser?._id && {
      label: t("GoToProfile"),
      onPress: () => {
        navigation.dispatch(
          StackActions.push(routes.UserProfile, {
            userId: bablContent.user._id,
          }),
        );
      },
    },

    user._id !== creatorUser?._id && {
      label: t("Report"),
      onPress: async () => {},
    },

    /* {
      label: 'Manage Suggested Content',
    }, */

    user._id === creatorUser?._id && {
      delete: true,
      label: isRebabl ? t("GetOutRebabs") : t("Delete"),
      onPress: () => {
        Alert.alert(t("areYouSure"), t("youAreDeletingBabl"), [
          {
            text: t("Yes"),
            onPress: () => {
              deleteBablMutation.mutate(bablId);
            },
            style: "destructive",
          },
          {
            text: t("no"),
            onPress: () => {
              onClose();
            },
            isPreferred: true,
          },
        ]);
      },
    },
    user._id === creatorUser?._id && {
      label: t("Edit"),
      onPress: async () => {
        setShowLoading(true);
        const sharedSavings = await queryClient.fetchQuery(
          ["SHARED_SAVINGS"],
          Queries.searchResources,
        );
        const sharedSavingsUrls = sharedSavings.map((item) => {
          return item.url;
        });

        const editData = {
          editId: bablContent._id,
          hashtags: bablContent.hashtags,
          title: bablContent.title,
          category: bablContent.category,
          templateCategory: bablContent.templateCategory,
          template: bablContent.template,
          cover: bablContent.cover,
          coverVideo: bablContent.coverVideo,
          isInteractionEnabled: bablContent.isInteraction,
          allowedInteractionTypes: bablContent.allowedInteractionTypes,
          selectedCoverCrop:
            bablContent.coverVideoCropped || bablContent.coverCropped,
          settings: {
            selectedCover: {
              coverSource: bablContent.coverVideo || bablContent.cover,
              coverUrl: bablContent.coverUrl,
              coverItem: bablContent.coverItem,
            },
          },
          items: bablContent.items.reduce((prev, cur) => {
            const itemType = sharedSavingsUrls.includes(cur.url)
              ? "SHARED_SAVINGS"
              : cur.type;

            return {
              ...prev,
              [itemType]: {
                ...(prev[itemType] || {}),
                [cur.id || cur._id]: {
                  ...cur,
                  id: cur.id || cur._id,
                  resourceType: cur.type,
                  type: itemType,
                  coverCopy: cur.cover,
                },
              },
            };
          }, {}),
        };

        setBablForm(editData);

        setTimeout(() => {
          navigation.navigate(routes.EditBabl, { edit: true });
          setShowLoading(false);
        }, 500);
      },
    },
  ];

  if (showLoading) {
    return (
      <Modal visible={showLoading}>
        <CreatingBablModal />
      </Modal>
    );
  }

  return (
    <Modal transparent visible={showModal}>
      <TouchableOpacity style={styles.modalBackGround} onPress={onClose}>
        <BlurView
          intensity={50}
          tint="systemUltraThinMaterialDark"
          style={{
            width: "90%",
            overflow: "hidden",
            alignSelf: "center",
            borderRadius: 26,
            elevation: 20,
            justifyContent: "center",
          }}
        >
          <Animated.View
            style={[
              styles.modalContainer,
              { transform: [{ scale: scaleValue }] },
            ]}
          >
            <TouchableOpacity onPress={onClose}>
              <View
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                  alignSelf: "flex-end",

                  marginTop: 10,
                }}
              />
            </TouchableOpacity>
            {menu.map((item, index) => {
              if (!item) return null;

              return (
                <TouchableOpacity
                  onPress={() => {
                    if (index == 1) {
                      onClose();
                      onCollectionPress();
                    } else if (index === 4) {
                      setVisibleWarnModal(true);
                    } else if (!item.delete) {
                      item.onPress?.();
                      onClose();
                    } else {
                      item.onPress?.();
                    }
                  }}
                  style={[
                    styles.item,
                    {
                      // borderBottomWidth:
                      //   user._id !== creatorUser?._id
                      //     ? index === 6
                      //       ? 0
                      //       : 0.5
                      //     : item.label === 'Edit'
                      //       ? 0
                      //       : 1,
                    },
                  ]}
                >
                  {item.icon && (
                    <Image
                      resizeMode="contain"
                      source={item.icon}
                      style={[styles.icon, item.style]}
                    />
                  )}
                  <Text
                    style={[
                      styles.label,
                      {
                        // color: item.delete ? colors.red : colors.white,
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </Animated.View>
        </BlurView>
      </TouchableOpacity>
      <BablWarnModal
        visible={visibleWarnModal}
        bablId={bablId}
        onClose={() => {
          setVisibleWarnModal(false);
          onClose();
        }}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackGround: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",

    alignSelf: "center",
    borderRadius: 26,
    elevation: 20,
    justifyContent: "center",
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    justifyContent: "center",
    borderBottomColor: "#242228",
  },
  icon: {
    width: 20,
    height: 20,

    tintColor: "#494949",
  },
  label: {
    color: "#FFF",
    fontFamily: fonts.bold,
    marginLeft: 5,
    fontSize: 16,
  },
});

export default BablContentModal;

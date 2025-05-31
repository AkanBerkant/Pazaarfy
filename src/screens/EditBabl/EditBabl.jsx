/* eslint-disable react/jsx-no-useless-fragment */
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Switch,
  Keyboard,
  TextInput,
} from "react-native";

import { StackActions, useNavigation } from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useTranslation } from "react-i18next";
import { Notifier } from "react-native-notifier";
import { useAnimatedRef } from "react-native-reanimated";

import { ButtonLinear, Input } from "../../components";
import routes from "../../constants/routes";
import { notify } from "../../helpers/notify";
import { colors, sizes } from "../../theme";
import fonts from "../../theme/fonts";
import { bablFormAtom, draftAtom, helpAtom } from "../../utils/atoms";
import * as Queries from "../../utils/queries";
import Storage from "../../utils/storage";

import EditBablHeader from "./EditBablHeader";
import EditBablTemplate from "./EditBablTemplate";
import { templateCategories } from "./template-categories";

const EditBabl = ({ route }) => {
  const queryClient = useQueryClient();
  const [bablForm, setBablForm] = useAtom(bablFormAtom);
  const resetBablForm = useResetAtom(bablFormAtom);
  const [draft, setDraft] = useAtom(draftAtom);
  const navigation = useNavigation();
  const [showTrash, setShowTrash] = React.useState(false);
  const { t } = useTranslation();
  const [helpState, setHelpState] = useAtom(helpAtom);

  const [check, setCheck] = React.useState(null);

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true),
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false),
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const previewPositions = [
    { top: 100, left: 30, rotate: "-15deg" },
    { top: 200, left: 100, rotate: "10deg" },
    { top: 300, left: 200, rotate: "-10deg" },
    { top: 400, left: 50, rotate: "5deg" },
    { top: 500, left: 150, rotate: "-5deg" },
    { top: 600, left: 50, rotate: "-5deg" },
    { top: 700, left: 200, rotate: "-5deg" },
  ];

  React.useEffect(() => {
    const itemIds = Object.values(bablForm.items)
      .reduce((prev, cur) => {
        return [...prev, ...Object.values(cur)];
      }, [])
      .map((item) => {
        return item.id;
      });

    if (bablForm.itemOrder && bablForm.itemOrder.length !== itemIds.length) {
      setBablForm((prev) => {
        return {
          ...prev,
          itemOrder: [
            ...prev.itemOrder,
            ...itemIds.filter((iId) => {
              return !prev.itemOrder.includes(iId);
            }),
          ],
        };
      });
    }
  }, [bablForm.items]);

  const { cover } = route.params || {};

  const allItems = Object.values(
    bablForm.items.PHOTO_MANUAL || bablForm.items.VIDEO_MANUAL,
  );
  const lastItem = allItems[allItems.length - 1];

  const [isEnabled, setIsEnabled] = useState(false);

  const [address, setAddress] = React.useState("");

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const onSharePress = async () => {
    if (!check) {
      return Notifier.showNotification({
        title: t("errorKVKK"),
      });
    }

    const dto = {
      editId: bablForm.editId,
      hashtags: bablForm.hashtags,
      title: bablForm.title,
      category: bablForm.category,
      templateCategory: 0,
      template: randomTemplate,
      isStory: isEnabled,
      coverSource: lastItem.coverVideo ? lastItem.coverVideo : lastItem?.cover,
      coverUrl: "MANUAL",
      coverItem: lastItem.coverVideo ? lastItem.coverVideo : lastItem?.cover,
      text: address,
      coverVideoCropped: bablForm?.selectedCoverCrop?.endsWith?.("mp4")
        ? bablForm?.selectedCoverCrop
        : null,
      coverCropped: bablForm?.selectedCoverCrop?.endsWith?.("jpeg")
        ? bablForm?.selectedCoverCrop
        : null,
      isInteractionEnabled: bablForm.settings?.isInteraction || false,
      isPrivate: bablForm.settings?.isPrivate || false,
      price: bablForm.settings?.price || 0,
      allowedInteractionTypes: bablForm.settings?.allowedInteractionTypes || [],
      items: items.map(
        ({
          id,
          title,
          cover,
          coverVideo,
          url,
          type,
          resourceType,
          metadata,
        }) => {
          return {
            id: id || (Math.random() + 1).toString(36).substring(7),
            title,
            cover: cover || "NONE",
            coverVideo,
            url: url || "NONE",
            type: resourceType || type,
            metadata,
          };
        },
      ),
    };

    const draft = await Storage.getItem("draft");

    createBablMutation.mutate({
      ...dto,
      isHidden: !!draft,
    });
  };

  const templateOptions = templateCategories[bablForm.templateCategory];

  const randomOrder = React.useRef(
    Array.from({ length: templateOptions.length })
      .map((_, i) => {
        return i;
      })
      .sort(() => {
        return Math.random() > 0.5 ? 1 : -1;
      }),
  ).current;
  const randomStep = React.useRef(0);

  const [randomTemplate, setRandomTemplate] = React.useState(
    bablForm.template || randomOrder[randomStep.current],
  );

  const [edited, setEdited] = React.useState(true);

  const refs = React.useRef(
    Array.from({ length: 300 }).map(() => {
      return useAnimatedRef();
    }),
  ).current;

  const items = Object.values(bablForm.items)
    .reduce((prev, cur) => {
      return [...prev, ...Object.values(cur)];
    }, [])
    .map((item, itemIdx) => {
      return {
        ...item,
        ref: refs[itemIdx],
      };
    })
    .sort((a, b) => {
      return bablForm.itemOrder
        ? bablForm.itemOrder.indexOf(a.id) > bablForm.itemOrder.indexOf(b.id)
          ? 1
          : -1
        : 0;
    });

  const createBablMutation = useMutation(Queries.createBabl, {
    onSuccess: async (res) => {
      if (res.isHidden) {
        notify({
          title: t("congratsSubBablAdded"),
        });
        setBablForm({
          ...draft,
          items: {
            ...draft.items,
            BABL_EMBED: {
              ...draft.items.BABL_EMBED,
              [res._id]: {
                id: res._id,
                cover: res.cover,
                coverCopy: res.coverCropped,
                title: res.title,
                type: "BABL_EMBED",
                url: res._id,
              },
            },
          },
        });

        await setDraft(null);
        await Storage.removeItem("draft");
      } else {
        await Storage.removeItem("bablForm");
        notify({
          title: t("congratsBablShared"),
        });
        navigation.navigate(routes.Home);
        queryClient.invalidateQueries(["BABLS"]);
        queryClient.invalidateQueries(["BABLS_PAGINATION"]);
        queryClient.invalidateQueries(["FEED"]);
        resetBablForm();
      }
    },
    onError: (err) => {
      if (err?.response?.data?.message === "PRICE_SHOULD_POSITIVE") {
        return notify({
          title: t("bablPriceCantNegative"),
        });
      }

      notify({
        title: t("AnUnexpectedErrorOccurred"),
      });
    },
  });

  const editMenu = [
    {
      icon: require("../../assets/ade.png"),
      label: t("add"),
      width: 16,
      height: 27.46,
    },
    {
      icon: require("../../assets/create.png"),
      label: t("createNewBabl"),
      width: 27.46,
      height: 27.46,
      onPress: async () => {
        await setDraft(bablForm);
        navigation.navigate(routes.CreateBabl, { isSubBabl: true });
        resetBablForm();
      },
    },
    {
      icon: require("../../assets/mev.png"),
      label: t("addExistingBabl"),
      width: 27.44,
      height: 27.46,
      onPress: () => {
        navigation.dispatch(
          StackActions.push(routes.CreateBablCategories, {
            allowedCategories: ["BABL"],
            dontReset: true,
            onDone: () => {
              navigation.goBack();
            },
          }),
        );
      },
    },
    {
      icon: require("../../assets/rew.png"),
      label: t("changeTemplate"),
      width: 24.34,
      height: 27.46,
      onPress: () => {
        navigation.navigate(routes.TemplateSelection, { change: true });
      },
    },
    {
      icon: require("../../assets/regenerate.png"),
      label: t("regenerate"),
      width: 29.31,
      height: 27.46,
      onPress: () => {
        randomStep.current += 1;
        setRandomTemplate(
          randomOrder[randomStep.current % templateOptions.length],
        );
      },
    },
  ];

  const { title } = bablForm;
  const rightSections = [
    {
      label: t("AddHeaderWithinBabl"),
      icon: require("../../assets/addheader.png"),
    },
    {
      label: t("AddBackground"),
      icon: require("../../assets/backga.png"),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.previewContainer}>
        {previewPositions.map((pos, index) => (
          <Text
            key={index}
            style={[
              styles.previewText,
              {
                top: pos.top,
                left: pos.left,
                transform: [{ rotate: pos.rotate }],
                opacity: 0.3,
              },
            ]}
          >
            {t("preview")}
          </Text>
        ))}
      </View>

      <Image
        style={{
          width: sizes.width,
          height: sizes.height,
        }}
        source={{
          uri: cover?.cover ? cover?.cover : lastItem?.cover,
        }}
      />

      <View
        style={{
          position: "absolute",
          zIndex: 99,
          bottom: keyboardVisible ? sizes.width / 2 : 40,
          alignSelf: "center",
          backgroundColor: colors.black,
          borderRadius: 10,
        }}
      >
        <View
          style={{
            marginTop: 10,
          }}
        />
        <Input
          width={sizes.width / 1.2}
          placeholder={t("Adress")}
          onChangeText={(a) => {
            setAddress(a);
          }}
          value={address}
        />
        <>
          <TouchableOpacity
            onPress={() => setCheck(!check)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 15,
              marginBottom: 10,

              width: sizes.width / 1.1,
              alignSelf: "center",

              paddingHorizontal: 10,
            }}
          >
            <View
              style={{
                width: 18,
                height: 18,
                borderWidth: 1,
                borderColor: "#ccc",
                marginRight: 8,
                backgroundColor: check ? "#755CCC" : "transparent",
              }}
            />
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(routes.TermsScreen);
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontFamily: fonts.bold,
                  fontSize: 13,
                  flex: 1,
                }}
              >
                {t("TermsText")}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>

          <View
            style={{
              flexDirection: "row",
              width: sizes.width / 1.1,
              alignSelf: "center",
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,

              paddingHorizontal: 10,
            }}
          >
            <Text style={{ fontFamily: fonts.bold, color: "#755CCC" }}>
              {t("ShareStatus")}
            </Text>

            <View
              style={{
                marginLeft: 5,
              }}
            >
              <Switch
                trackColor={{ false: "#55CCC", true: "#755CCC" }}
                thumbColor={isEnabled ? "#fff" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
            </View>
          </View>
        </>
        <ButtonLinear
          title={t("share")}
          onPress={onSharePress}
          loading={createBablMutation.isLoading}
        />
      </View>
    </View>
  );
};

export default EditBabl;

const styles = StyleSheet.create({
  center: {
    marginTop: 10,
    alignSelf: "stretch",
    paddingHorizontal: 12,
    height: Dimensions.get("window").height,
  },
  title: {
    color: "#676767",
    fontSize: 18,
    marginLeft: 10,
    fontFamily: fonts.roboto,
  },
  miniTitle: {
    color: "#FFF",
    fontSize: 10,
    marginLeft: 10,
    fontFamily: fonts.avenir,
  },
  babl: {
    width: sizes.width / 2.03,
    height: sizes.width / 3.4,
    borderRadius: 10,
    marginTop: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  items: {
    alignSelf: "center",
  },
  input: {
    color: "#FFF",
    backgroundColor: "#232323",
    width: sizes.width / 1.1,
    alignSelf: "center",
    borderRadius: 14,
    height: 67,
    marginTop: 20,
    padding: 10,
    fontSize: 16,
    fontFamily: fonts.robotoRegular,
  },
  headerBackground: {
    justifyContent: "center",
    backgroundColor: "#1B1B1B",
    padding: 5,
  },
  edited: {
    width: 23,
    position: "absolute",
    right: 5,
    top: 5,
    zIndex: 99,
    height: 23,
  },
  editInput: {
    position: "absolute",
    width: 99,
    height: 33,
    borderRadius: 10,
    padding: 10,
  },
  container: {
    backgroundColor: "#101010",
    flex: 1,
  },
  item: {
    justifyContent: "center",
    alignItems: "center",
  },
  absolute: {
    position: "absolute",
    width: 99,
    height: 33,
    borderRadius: 10,
  },
  itemTickets: {
    borderWidth: 1,
    borderColor: "#181818",
    borderRadius: 99,
    height: 43,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 5,
    padding: 5,
  },
  closes: {
    width: 29,
    height: 29,
    margin: 0,
    borderRadius: 29,
  },
  label: {
    margin: 5,
    fontSize: 16,
  },
  top: {
    marginTop: 20,
  },
  linearButton: {
    marginBottom: 30,
  },
  bottom: {
    backgroundColor: "#111111",
    flexDirection: "row",
    shadowOffset: {
      width: 0,

      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    borderTopWidth: 0.3,
    borderWidth: 0.3,
    borderColor: "#848484",
    elevation: 5,
    padding: 10,
    position: "absolute",
    height: 110,
    bottom: -5,
    width: sizes.width,
    borderTopRightRadius: 30,
    justifyContent: "space-between",
    borderTopLeftRadius: 30,
  },
  editIcon: {
    width: 27.46,
    height: 27.46,
  },
  editLabel: {
    fontSize: 11,
    width: 61,
    textAlign: "center",
    fontFamily: fonts.roboto,
    marginTop: 5,
    color: "#848484",
  },
  box: {
    backgroundColor: "#1B1B1B",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 0.6,
    elevation: 5,
    borderRadius: 10,
    width: sizes.width / 2.7,
    position: "absolute",
    bottom: sizes.width / 4.2,
    left: 10,
  },
  editPhotoItems: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#242424",
    padding: 7,
  },
  addEditIcon: {
    width: 18,
    height: 18,
    marginLeft: 3,
    tintColor: "#FFF",
  },
  addEditText: {
    fontSize: 16,
    color: "#FFF",
    fontFamily: fonts.regular,
    marginLeft: 5,
  },
  alignCenter: {
    alignItems: "center",
  },
  me: {
    width: 33,
    height: 33,
    position: "absolute",
    zIndex: 99,
    right: 0,
  },
  previewContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 99, // En üstte görünmesini sağlar
  },
  previewText: {
    position: "absolute",
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
    textTransform: "uppercase",
  },
});

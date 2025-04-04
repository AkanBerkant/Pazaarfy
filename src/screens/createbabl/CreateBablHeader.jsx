import React from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { CommonActions, useNavigation } from "@react-navigation/native";
import { useAtomValue, useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useTranslation } from "react-i18next";

import routes from "../../constants/routes";
import { sizes } from "../../theme";
import fonts from "../../theme/fonts";
import { bablFormAtom, draftAtom } from "../../utils/atoms";
import i18n from "../../utils/i18n-setup";
import Storage from "../../utils/storage";

const CreateBablHeader = ({
  title = i18n.t("createBabl"),
  iconwhite,
  dark,
  firstScreen = false,
  bg,
}) => {
  const navigation = useNavigation();
  const resetBablForm = useResetAtom(bablFormAtom);
  const setBablForm = useSetAtom(bablFormAtom);
  const draft = useAtomValue(draftAtom);
  const { t } = useTranslation();

  return (
    <View
      style={[
        styles.header,
        {
          height: sizes.width > 375 ? sizes.width / 4.2 : sizes.width / 6.2,
          backgroundColor: bg || "#000",
        },
      ]}
    >
      <View
        style={{
          marginTop: sizes.width > 375 ? 30 : 20,
        }}
      />
      <View style={styles.between}>
        <TouchableOpacity
          style={styles.left}
          onPress={() => {
            if (firstScreen) {
              return Alert.alert(t("areYouSureToCancelBabl"), null, [
                {
                  text: t("yes"),
                  style: "destructive",
                  onPress: async () => {
                    const draft = await Storage.getItem("draft");

                    if (!draft) {
                      resetBablForm();
                      navigation.goBack();
                      await Storage.removeItem("draft");
                    } else {
                      setBablForm(JSON.parse(draft));
                      const totalRoutes = [
                        {
                          name: routes.Tab,
                        },
                        {
                          name: routes.CreateBablCategories,
                        },
                        {
                          name: routes.TemplateSelection,
                        },
                        {
                          name: routes.EditBabl,
                        },
                      ];

                      navigation.dispatch(
                        CommonActions.reset({
                          index: totalRoutes.length - 1,
                          routes: totalRoutes,
                        }),
                      );
                      await Storage.removeItem("draft");
                    }
                  },
                },
                {
                  text: t("no"),
                  isPreferred: true,
                },
              ]);
            }

            navigation.goBack();
          }}
        >
          <Image
            resizeMode="contain"
            source={require("../../assets/back.png")}
            style={styles.back}
            tintColor="#FFF"
          />

          <Text
            style={{
              color: bg || "#000",
            }}
          ></Text>
        </TouchableOpacity>
        <Text style={[styles.title]}>{draft?.title || title}</Text>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              color: bg || "#000",
            }}
          ></Text>
          <View
            resizeMode="contain"
            source={require("../../assets/bab.png")}
            style={styles.babl}
          />
        </View>
      </View>
    </View>
  );
};

export default CreateBablHeader;

const styles = StyleSheet.create({
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  back: {
    width: 44,
    height: 22,
  },
  title: {
    fontWeight: "500",
    fontSize: 18,
    fontFamily: fonts.roboto,
    color: "#FFF",
    textAlign: "center",
    width: sizes.width / 2.2,
  },
  header: {
    width: sizes.width,
    height: sizes.width / 4.2,
    alignSelf: "center",
    shadowColor: "#FFF",
    backgroundColor: "#000",
    marginTop: 15,
    alignItems: "center",
  },
  babl: {
    width: 44,
    height: 32,
  },
  between: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: sizes.width * 1.04,
    padding: 10,
  },
});

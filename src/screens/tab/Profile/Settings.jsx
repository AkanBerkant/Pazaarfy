import React from "react";
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Linking,
} from "react-native";

import { CommonActions } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { useTranslation } from "react-i18next";
import { Modalize } from "react-native-modalize";

import { BackHeader, ButtonBorder, ButtonLinear } from "../../../components";
import routes from "../../../constants/routes";
import { sizes } from "../../../theme";
import fonts from "../../../theme/fonts";
import { userAtom } from "../../../utils/atoms";
import * as Queries from "../../../utils/queries";
import SharedStorage from "../../../utils/shared-storage";
import Storage from "../../../utils/storage";
import HelpModal from "../../Help/HelpModal";

import DeletePopup from "./DeletePopup";

const Settings = ({ navigation }) => {
  const setUser = useSetAtom(userAtom);
  const { t } = useTranslation();
  const [visible, setVisible] = React.useState(false);
  const modalizeRef = React.useRef();

  const [showChat, setShowChat] = React.useState(false);

  const [visibleDelete, setVisibleDelete] = React.useState(null);

  const unseenRequestCountQuery = useQuery(
    ["UNSEEN_REQUEST_COUNT"],
    Queries.getUnseenRequestCount,
    {
      placeholderData: 0,
    },
  );

  const sections = [
    {
      label: t("Saveddd"),
      icon: require("../../../assets/saved.png"),
      onPress: () => {
        navigation.navigate(routes.Bookmarks);
      },
      unseen: unseenRequestCountQuery.data > 0,
    },
    // {
    //   label: t("PazaarfyPremium"),
    //   icon: require("../../../assets/star.png"),
    //   onPress: () => {
    //     navigation.navigate(routes.Account);
    //   },
    // },

    {
      label: t("ProfileInformation"),
      icon: require("../../../assets/profiled.png"),
      onPress: () => {
        navigation.navigate(routes.ProfilSettings);
      },
    },

    {
      label: t("ChangeLanguage"),
      icon: require("../../../assets/changelang.png"),
      onPress: () => {
        navigation.navigate(routes.ChangeLanguage);
      },
    },
    {
      label: t("ChangePassword"),
      icon: require("../../../assets/changepass.png"),
      onPress: () => {
        navigation.navigate(routes.MailScreen);
      },
    },
    {
      label: t("LiveSupport"),
      icon: require("../../../assets/lived.png"),
      onPress: () => {
        Linking.openURL("mailto:pazaarfy@gmail.com");
      },
    },
    {
      label: t("PrivacyAgreement"),
      icon: require("../../../assets/agrement.png"),
      onPress: () => {
        navigation.navigate(routes.PrivacyAgreement);
      },
    },
    {
      label: t("deleteMyAccount"),
      icon: require("../../../assets/deletekk.png"),
      onPress: () => {
        setVisibleDelete(!visibleDelete);
      },
    },
  ];

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={item.onPress} style={styles.items}>
        <View style={styles.row}>
          <Image source={item.icon} resizeMode="contain" style={styles.icon} />
          <Text style={styles.label}>{item.label}</Text>
        </View>
        <Image
          source={require("../../../assets/arrowr.png")}
          style={styles.arrowR}
        />

        {item.unseen && <View style={styles.badge} />}
      </TouchableOpacity>
    );
  };

  const onExitPress = () => {
    Alert.alert(t("sureToLogout"), null, [
      {
        text: t("cancel"),
      },
      {
        text: t("yes"),
        onPress: async () => {
          await Storage.clear();
          await SharedStorage.removeItem("accessToken");

          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: routes.ProfilSettingsMenu,
                },
              ],
            }),
          );
          setUser(null);
        },
      },
    ]);
  };

  const onDeletePress = async () => {
    await Storage.clear();
    await SharedStorage.removeItem("accessToken");

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: routes.ProfilSettingsMenu,
          },
        ],
      }),
    );
    setUser(null);
    setVisibleDelete(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{t("settings")}</Text>
      <View style={styles.top} />
      <FlatList
        data={sections}
        renderItem={renderItem}
        ListFooterComponent={() => {
          return <ButtonBorder onPress={onExitPress} title={t("Logout")} />;
        }}
      />

      <DeletePopup
        onExitPress={onDeletePress}
        onClose={() => {
          setVisibleDelete(!visibleDelete);
        }}
        visible={visibleDelete}
      />

      <View style={styles.button} />

      <Modalize
        snapPoint={sizes.width * 1.8}
        overlayStyle={{
          opacity: 1,
        }}
        handlePosition="inside"
        handleStyle={{
          backgroundColor: "#FFF",
          marginTop: 5,
        }}
        modalStyle={{
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          backgroundColor: "#0E0E0E",
        }}
        ref={modalizeRef}
        contentContainerStyle={styles.container}
      >
        <Text style={styles.title}>Support</Text>

        <TextInput placeholder="Fatura Adresi" style={styles.input} />

        <TextInput placeholder="İsim" style={styles.input} />

        <TextInput placeholder="Telefon" style={styles.input} />

        <TextInput placeholder="Mail" style={styles.input} />
        <View style={styles.inputContainer}>
          <TextInput placeholder="Message" multiline style={styles.bigInput} />
        </View>
        <View
          style={{
            marginTop: 90,
          }}
        />
        <ButtonLinear
          title={t("send")}
          onPress={() => {
            setVisible(true);
          }}
        />
      </Modalize>

      <HelpModal
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
      />
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  arrowR: {
    width: 10,
    height: 16,
    tintColor: "#FFF",
  },
  items: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: sizes.width / 1.07,
    height: 77,
    alignSelf: "center",
    padding: 15,
    borderRadius: 14,
    backgroundColor: "#101010",
    marginTop: 7,
  },
  label: {
    fontFamily: fonts.regular,
    color: "#FFF",
    fontSize: 16,
    marginLeft: 7,
  },
  top: {
    marginTop: 20,
  },
  button: {
    marginTop: 52,
  },
  badge: {
    position: "absolute",
    width: 16,
    height: 16,
    borderRadius: 16,
    backgroundColor: "red",
    top: 0,
    right: 0,
  },
  title: {
    color: "#FFFFFF",
    fontFamily: fonts.medium,
    fontSize: 32,
    width: sizes.width / 1.1,
    alignSelf: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 19,
    height: 22,
  },
});

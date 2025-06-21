import React from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  SafeAreaView,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import fonts from "../../theme/fonts";
import routes from "../../constants/routes";
import { sizes } from "../../theme";
import { chatsAtom } from "../../utils/atoms";
import * as Queries from "../../utils/queries";

import HomeMenu2 from "./HomeMenu2";

const logoIcon = require("../../assets/bab.png");
const messageIcon = require("../../assets/em.png");
const logo = require("../../assets/logo.png");
const notifIcon = require("../../assets/notification.png");

const HomeMenu = ({ backgroundColor, style, tabsRef }) => {
  const navigation = useNavigation();
  const safeAreaInsets = useSafeAreaInsets();
  const [selected, setSelected] = React.useState(0);

  const chats = useAtomValue(chatsAtom);

  const unseenMessageExists = !!Object.values(chats).find((item) => {
    return item.unreadMessageCount > 0;
  });

  const unseenNotificationCountQuery = useQuery(
    ["UNSEEN_NOTIFICATION_COUNT"],
    Queries.unseenNotificationCount,
    {
      placeholderData: 0,
      refetchInterval: 15 * 1000,
    },
  );

  React.useEffect(() => {
    tabsRef.current?.setIndex(selected);
  }, [selected]);

  const onNotifPress = () => {
    navigation.navigate(routes.Notification);
  };

  const onMessagePress = () => {
    navigation.navigate(routes.Messages);
  };

  return (
    <SafeAreaView
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
        width: sizes.width / 1.1,
        alignSelf: "center",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(routes.PeopleSearch);
          }}
        >
          <Image
            resizeMode="contain"
            style={{
              width: 30,
              height: 30,
              tintColor: "#8858EA",
            }}
            source={require("../../assets/loved.png")}
          />
        </TouchableOpacity>
        <View>
          <View
            resizeMode="contain"
            style={{
              width: 36,
              height: 35,
              tintColor: "#8858EA",
            }}
            source={require("../../assets/loved.png")}
          />
        </View>
      </View>
      <Image
        style={styles.logo}
        resizeMode="contain"
        source={require("../../assets/pazaarfy/logo.png")}
      />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={onNotifPress}>
          <Image
            source={notifIcon}
            style={styles.notification}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate(routes.Messages);
          }}
        >
          <Image
            source={require("../../assets/mes.png")}
            style={styles.message}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeMenu;

const styles = StyleSheet.create({
  notification: {
    width: 30,
    height: 30,
    tintColor: "#755CCC",
    marginRight: 10,
  },
  message: {
    width: 30,
    height: 30,
    tintColor: "#755CCC",
  },
  badge: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: "#755CCC",
    position: "absolute",
    top: 8,
    right: 4,
  },
  ai: {
    width: 34,
    height: 28,
  },

  logo: {
    width: 133,
    height: 30,
  },
  between: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  proButton: {
    width: 56,
    height: 31,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  proButtonText: {
    color: "#FFF",
    fontFamily: fonts.medium,
    marginLeft: 3,
  },
  proStar: {
    tintColor: "#FFF",
    width: 10,
    height: 10,
  },
});

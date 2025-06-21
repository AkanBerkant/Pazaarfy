/* eslint-disable react/no-unstable-nested-components */
import * as React from "react";

import TabBar from "../components/tabbar/Tabbar";
import routes from "../constants/routes";
import Favorites from "../screens/tab/Favorites";
import Home from "../screens/tab/Home/Home";

import Settings from "../screens/tab/Profile/Settings";
import { BottomTab } from "./stacks";
import Messages from "../screens/tab/Messages";
import Search from "../screens/tab/Search/Search";
import Profile from "../screens/tab/Profile/Profile";
import CustomNavBar from "../components/CustomNavBar";
import Reels from "../screens/tab/Reels/Reels";
import { useTranslation } from "react-i18next";
import HotBabls from "../screens/tab/HotBabls/HotBabls";
const BottomTabs = () => {
  const { t } = useTranslation();
  return (
    <BottomTab.Navigator
      screenOptions={{
        headerShown: false,
        lazy: true,
      }}
      detachInactiveScreens
      initialRouteName={t("Home")}
      tabBar={(props) => {
        return <CustomNavBar {...props} />;
      }}
    >
      <BottomTab.Screen name={t("Home")} component={Home} />
      <BottomTab.Screen name={t("Reels")} component={Reels} />

      <BottomTab.Screen name={t("Search")} component={Search} />
      <BottomTab.Screen name={t("Profile")} component={Profile} />
      <BottomTab.Screen name={t("settings")} component={Settings} />
    </BottomTab.Navigator>
  );
};

export default BottomTabs;

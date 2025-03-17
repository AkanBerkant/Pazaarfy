/* eslint-disable react/no-unstable-nested-components */
import * as React from "react";

import TabBar from "../components/tabbar/Tabbar";
import routes from "../constants/routes";
import CreateBabl from "../screens/createbabl/CreateBabl";
import Favorites from "../screens/tab/Favorites";
import Home from "../screens/tab/Home/Home";

import Settings from "../screens/tab/Profile/Settings";
import { BottomTab } from "./stacks";
import Messages from "../screens/tab/Messages";
import Search from "../screens/tab/Search/Search";
import Profile from "../screens/tab/Profile/Profile";
const BottomTabs = () => {
  return (
    <BottomTab.Navigator
      screenOptions={{
        headerShown: false,
        lazy: true,
      }}
      detachInactiveScreens
      initialRouteName={routes.Home}
      tabBar={() => {
        return <TabBar />;
      }}
    >
      <BottomTab.Screen name={routes.Home} component={Home} />
      <BottomTab.Screen name={routes.Messages} component={Messages} />
      <BottomTab.Screen name={routes.Profile} component={Profile} />
      <BottomTab.Screen name={routes.Search} component={Search} />
      <BottomTab.Screen name={routes.Favorites} component={Favorites} />
      <BottomTab.Screen name={routes.UserProfile} component={Profile} />
      <BottomTab.Screen name={routes.Settings} component={Settings} />
    </BottomTab.Navigator>
  );
};

export default BottomTabs;

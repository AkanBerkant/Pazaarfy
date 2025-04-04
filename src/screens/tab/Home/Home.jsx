import React from "react";
import {
  DeviceEventEmitter,
  Platform,
  Text,
  StyleSheet,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator, // <-- loading için eklendi
} from "react-native";

import dynamicLinks from "@react-native-firebase/dynamic-links";
import messaging from "@react-native-firebase/messaging";
import { useNavigation } from "@react-navigation/native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtom, useSetAtom } from "jotai";
import { Tabs } from "react-native-collapsible-tab-view";

import HomeMenu from "../../../components/menu/HomeMenu";
import routes from "../../../constants/routes";
import { sizes } from "../../../theme";
import { helpAtom, tabBarVisibleAtom } from "../../../utils/atoms";
import * as Queries from "../../../utils/queries";
import Babls from "../Profile/Babls";
import HomeTab from "./HomeTab";
import Snap from "./Snap";
import fonts from "../../../theme/fonts";
import { useTranslation } from "react-i18next";

const Home = () => {
  const navigation = useNavigation();
  const currentPlayingRowRef = React.useRef(null);
  const currentPosRef = React.useRef(0);
  const setTabBarVisible = useSetAtom(tabBarVisibleAtom);
  const queryClient = useQueryClient();
  const tabsRef = React.useRef();
  const [helpState, setHelpState] = useAtom(helpAtom);

  const [searchTerm, setSearchTerm] = React.useState("");

  const searchBablsQuery = useQuery(
    ["SEARCH_BABLS", searchTerm],
    () => {
      return Queries.searchBabls(`search=${searchTerm}`);
    },
    {
      placeholderData: {
        babls: [],
        forYou: [],
        hashtag: [],
        people: [],
      },
    },
  );

  const {
    data: { forYouFeed, followingFeed },
    isFetching,
    isSuccess,
  } = useQuery(
    ["FEED"],
    async () => {
      const [f1, f2] = await Promise.all([
        Queries.getForYouFeed(),
        Queries.getFollowingFeed(),
      ]);

      return {
        forYouFeed: f1,
        followingFeed: f2,
      };
    },
    {
      placeholderData: {
        forYouFeed: [],
        followingFeed: [],
      },
      onError: (err) => {
        console.log("err", err);
      },
    },
  );

  React.useEffect(() => {
    if (isSuccess) {
      console.log("AKO", followingFeed);
    }
  }, [isSuccess, followingFeed]);

  const onLink = async (link) => {
    if (link?.url?.includes("?bablId=")) {
      const [_, bablId] = link.url.split("?bablId=");

      navigation.navigate(routes.HotBablDetail, { _id: bablId });
    }
  };

  const onNotificationOpen = (remoteMessage) => {
    if (!remoteMessage) {
      return;
    }

    const { type, bablId } = remoteMessage.data;

    const navigateMap = {
      CHAT: () =>
        navigation.navigate(routes.MessageScreen, {
          item: { user: remoteMessage.data },
        }),
      COMMENT: () =>
        navigation.navigate(routes.Comments, {
          bablId,
        }),
      SHARED_SAVING: () => navigation.navigate(routes.SharedSavings),
      GIFT: () =>
        navigation.navigate(routes.Giff, {
          initialTab: "mygiff",
        }),
      COIN_GIFT: () =>
        navigation.navigate(routes.BablContent, {
          bablId,
        }),
      INTERACTION_REQUEST: () => navigation.navigate(routes.ControlPanel),
      BABL_PUBLISHED: () =>
        navigation.navigate(routes.BablContent, {
          bablId,
        }),
    };

    if (navigateMap[type]) {
      return navigateMap[type]();
    }

    navigation.navigate(routes.Notification);
  };

  React.useEffect(() => {
    messaging().onNotificationOpenedApp(onNotificationOpen);
    messaging().getInitialNotification().then(onNotificationOpen);
  }, []);

  React.useEffect(() => {
    dynamicLinks().getInitialLink().then(onLink);
    dynamicLinks().onLink(onLink);
  }, []);

  const handleShare = React.useCallback((item) => {
    if (!item) return;
    navigation.navigate(routes.CollectionShareAndroid, { item });
  }, []);

  const onScroll = async (currentOffset) => {
    const dif = currentOffset - currentPosRef.current;
    const playingRow = Math.floor(currentOffset / (sizes.width / 2.42));
    const inScreenRows = [
      playingRow,
      playingRow + 1,
      playingRow + 2,
      playingRow + 3,
    ];

    if (currentPlayingRowRef.current === null) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    if (!inScreenRows.includes(currentPlayingRowRef.current)) {
      currentPlayingRowRef.current = playingRow;
      DeviceEventEmitter.emit("PLAYING_ROW", playingRow);
    }

    setTabBarVisible(currentOffset <= 0 || dif < 0);
    currentPosRef.current = currentOffset;
  };

  const onRefresh = () => {
    queryClient.invalidateQueries(["FEED"]);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate(routes.HotBablDetail, item)}
    >
      <Image
        source={{ uri: item.cover }}
        style={{
          width: sizes.width / 1.3,
          height: 180,
          borderRadius: 17,
          margin: 5,
        }}
      />
    </TouchableOpacity>
  );

  const { t } = useTranslation();

  const renderHeader = React.useCallback(() => {
    return (
      <View
        style={{ backgroundColor: Platform.OS == "ios" ? "#000" : "#121212" }}
      >
        {Platform.OS == "android" && (
          <View
            style={{
              marginTop: 20,
            }}
          />
        )}
        <HomeMenu style={styles.homeMenu} tabsRef={tabsRef} />
        <View style={{ marginTop: 10 }} />

        <Snap
          tabName="Following"
          isFetching={isFetching}
          onRefresh={onRefresh}
          onScroll={onScroll}
          data={followingFeed}
        />
        <Text
          style={{
            color: "#FFF",
            fontSize: 16,
            fontFamily: fonts.bold,
            width: sizes.width / 1.07,
            alignSelf: "center",
            marginTop: 20,
          }}
        >
          {t("PreHome")}
        </Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={searchBablsQuery.data.babls}
          renderItem={renderItem}
        />
      </View>
    );
  }, [followingFeed, isFetching, searchBablsQuery.data.babls]);

  const renderTabBar = React.useCallback(() => null, []);

  // 🔥 Loading ekranı
  if (isFetching || !isSuccess) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Tabs.Container
        ref={tabsRef}
        revealHeaderOnScroll
        lazy
        renderHeader={renderHeader}
        renderTabBar={renderTabBar}
        pagerProps={{ scrollEnabled: false }}
      >
        <Tabs.Tab name="ForYou">
          <HomeTab
            tabName="ForYou"
            isFetching={isFetching}
            onRefresh={onRefresh}
            onScroll={onScroll}
            data={forYouFeed}
          />
        </Tabs.Tab>
        <Tabs.Tab name="Following">
          <HomeTab
            tabName="Following"
            isFetching={isFetching}
            onRefresh={onRefresh}
            onScroll={onScroll}
            data={followingFeed}
          />
        </Tabs.Tab>
      </Tabs.Container>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E0E0E",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#0E0E0E",
    justifyContent: "center",
    alignItems: "center",
  },
  homeMenu: {
    position: "flex",
  },
});

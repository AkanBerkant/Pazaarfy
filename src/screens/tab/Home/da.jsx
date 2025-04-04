import React from "react";
import {
  DeviceEventEmitter,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
} from "react-native";

import dynamicLinks from "@react-native-firebase/dynamic-links";
import messaging from "@react-native-firebase/messaging";
import { useNavigation } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom, useSetAtom } from "jotai";
import { Tabs } from "react-native-collapsible-tab-view";
import { useQuery } from "@tanstack/react-query";
import HomeMenu from "../../../components/menu/HomeMenu";
import routes from "../../../constants/routes";
import { sizes } from "../../../theme";
import { helpAtom, tabBarVisibleAtom } from "../../../utils/atoms";
import * as Queries from "../../../utils/queries";
import Babls from "../Profile/Babls";
import HomeTab from "./HomeTab";
import fonts from "../../../theme/fonts";

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

    if (remoteMessage.data.type === "CHAT") {
      return navigation.navigate(routes.MessageScreen, {
        item: {
          user: remoteMessage.data,
        },
      });
    }

    if (remoteMessage.data.type === "COMMENT") {
      return navigation.navigate(routes.Comments, {
        bablId: remoteMessage.data.bablId,
      });
    }

    if (remoteMessage.data.type === "SHARED_SAVING") {
      return navigation.navigate(routes.SharedSavings);
    }

    if (remoteMessage.data.type === "GIFT") {
      return navigation.navigate(routes.Giff, {
        initialTab: "mygiff",
      });
    }

    if (remoteMessage.data.type === "COIN_GIFT") {
      return navigation.navigate(routes.BablContent, {
        bablId: remoteMessage.data.bablId,
      });
    }

    if (remoteMessage.data.type === "INTERACTION_REQUEST") {
      return navigation.navigate(routes.ControlPanel);
    }

    if (remoteMessage.data.type === "BABL_PUBLISHED") {
      return navigation.navigate(routes.BablContent, {
        bablId: remoteMessage.data.bablId,
      });
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
    if (!item) {
      return;
    }

    navigation.navigate(routes.CollectionShareAndroid, { item });
  }, []);

  const onScroll = async (currentOffset) => {
    // const currentOffset = event.nativeEvent.contentOffset.y;
    const dif = currentOffset - currentPosRef.current;

    /*
    if (
      currentOffset < 0 ||
      event.nativeEvent.layoutMeasurement.height + currentOffset >
        event.nativeEvent.contentSize.height
    ) {
      return false;
    } */

    const playingRow = Math.floor(currentOffset / (sizes.width / 2.42));
    const inScreenRows = [
      playingRow,
      playingRow + 1,
      playingRow + 2,
      playingRow + 3,
    ];

    if (currentPlayingRowRef.current === null) {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 2000);
      });
    }

    if (!inScreenRows.includes(currentPlayingRowRef.current)) {
      currentPlayingRowRef.current = playingRow;
      DeviceEventEmitter.emit("PLAYING_ROW", playingRow);
    }

    if (currentOffset === 0) {
      setTabBarVisible(true);
    }
    if (Math.abs(dif) < 3) {
      // do nothing
    } else if (dif < 0) {
      setTabBarVisible(true);
    } else {
      setTabBarVisible(false);
    }

    currentPosRef.current = currentOffset;
  };

  const onRefresh = () => {
    queryClient.invalidateQueries(["FEED"]);
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(routes.HotBablDetail, item);
        }}
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
  };

  const renderHeader = React.useCallback(() => {
    return (
      <View
        style={{
          backgroundColor: "#000",
        }}
      >
        <HomeMenu style={styles.homeMenu} tabsRef={tabsRef} />
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
          Öne Çıkan Ürünler
        </Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={searchBablsQuery.data.babls}
          renderItem={renderItem}
        />
      </View>
    );
  }, []);

  const renderTabBar = React.useCallback(() => {
    return null;
  }, []);

  if (isFetching || !isSuccess) return <View style={styles.container} />;

  return (
    <View style={styles.container}>
      <Tabs.Container
        ref={tabsRef}
        revealHeaderOnScroll
        lazy
        renderHeader={renderHeader}
        renderTabBar={renderTabBar}
        pagerProps={{
          scrollEnabled: false,
        }}
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
  homeMenu: {
    position: "flex",
  },
});

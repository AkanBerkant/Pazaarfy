import React from "react";
import {
  DeviceEventEmitter,
  Platform,
  Text,
  StyleSheet,
  View,
  FlatList,
  Image,
  Pressable,
  TouchableOpacity,
  ActivityIndicator, // <-- loading için eklendi
} from "react-native";
import InstagramStories, {
  InstagramStoriesPublicMethods,
} from "@birdwingo/react-native-instagram-stories";

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

  const ref = React.useRef(null); // if using typescript - useRef<InstagramStoriesPublicMethods>( null )

  const stories = [
    {
      id: "user1",
      name: "User 1",
      avatarSource: {
        uri: "data:image/webp;base64,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",
      },
      stories: [
        {
          id: "story1",
          source: {
            uri: "https://static9.depositphotos.com/1371851/1141/i/450/depositphotos_11412590-stock-photo-handsome-young-man.jpg",
          },
        },
        {
          id: "story2",
          source: { uri: "https://your-domain.com/videos/story2.mp4" },
          mediaType: "video",
        },
      ],
    },
    {
      id: "user2",
      name: "User 2",
      avatarSource: {
        uri: "https://static9.depositphotos.com/1371851/1141/i/450/depositphotos_11412590-stock-photo-handsome-young-man.jpg",
      },
      stories: [
        {
          id: "story3",
          source: {
            uri: "https://cdn.dsmcdn.com/ty1597/prod/QC/20241105/07/9f4855d6-466d-3b4e-8229-66a86420feab/1_org_zoom.jpg",
          },
        },
      ],
    },
  ];

  // Public method örneği
  const setStories = () => {
    if (ref.current) {
      ref.current.setStories(stories);
    }
  };
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

        <View>
          <InstagramStories
            ref={ref}
            stories={stories}
            avatarSize={60}
            storyCircleSize={68}
            showUsername
            onStart={(story) => console.log("Started story:", story.id)}
            onClose={(story) => console.log("Closed story:", story.id)}
          />
        </View>
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

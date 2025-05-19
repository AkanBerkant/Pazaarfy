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
  ActivityIndicator,
  ImageBackground, // <-- loading için eklendi
} from "react-native";
import InstagramStories, {
  InstagramStoriesPublicMethods,
} from "@birdwingo/react-native-instagram-stories";
import TextGradient from "../../../components/TextGradient";
import dynamicLinks from "@react-native-firebase/dynamic-links";
import messaging from "@react-native-firebase/messaging";
import { useNavigation } from "@react-navigation/native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtom, useSetAtom } from "jotai";
import { Tabs } from "react-native-collapsible-tab-view";

import HomeMenu from "../../../components/menu/HomeMenu";
import routes from "../../../constants/routes";
import { sizes } from "../../../theme";
import { helpAtom, tabBarVisibleAtom, userAtom } from "../../../utils/atoms";
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
        uri: "https://static9.depositphotos.com/1371851/1141/i/450/depositphotos_11412590-stock-photo-handsome-young-man.jpg",
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
      <View
        style={{
          marginLeft: 10,
          marginTop: 10,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontFamily: fonts.medium,
          }}
        >
          {item?.user?.username}
        </Text>
      </View>
      <View>
        <Image
          source={{ uri: item?.cover }}
          style={{
            width: sizes.width / 1.3,
            height: 180,
            borderRadius: 17,
            margin: 5,
            marginLeft: 10,
            marginTop: 10,
          }}
        />
        <Text
          style={{
            color: "#FFF",
            fontFamily: fonts.medium,
            position: "absolute",
            bottom: 10,
            left: 20,
          }}
        >
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const { t } = useTranslation();

  const [user, setUser] = useAtom(userAtom);

  const { data: data, isLoading } = useQuery(
    [
      "getFollowingStories",
      {
        user: user?._id,
        page: 1,
        limit: 10,
      },
    ],
    () => {
      return Queries.getFollowingStories(
        new URLSearchParams({
          user: user?._id,
          page: 1,
          limit: 10,
        }),
      );
    },
    {
      placeholderData: {
        datas: [],
        totalCount: 0,
        totalPage: 0,
      },
    },
  );

  const mapStoriesFromBackend = (datas) => {
    if (!Array.isArray(datas)) return [];

    return datas.map((story) => {
      const user = story.user;
      const items = story.stories || [];

      console.log("adadada", user.username);

      return {
        id: user._id,
        name: user.username,
        avatarSource: { uri: user.photo },
        stories: items.map((item, index) => ({
          id: item._id || `story-${index}`,
          source: { uri: item.items[0].url }, // hangi alan varsa
          mediaType: item.video ? "video" : "image",
        })),
      };
    });
  };

  const formattedStories = React.useMemo(
    () => mapStoriesFromBackend(data?.datas),
    [data],
  );

  const { data: followingData } = useQuery(
    ["getPaginationFollowings", user?._id],
    () => {
      return Queries.getPaginationFollowings(user?._id);
    },
    {
      placeholderData: {
        datas: [],
        totalCount: 0,
        totalPage: 0,
      },
    },
  );

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
          <View
            style={{
              marginTop: 10,
            }}
          />
          <InstagramStories
            ref={ref}
            stories={formattedStories}
            avatarSize={70}
            storyCircleSize={68}
            showUsername
          />
        </View>

        <TextGradient
          style={{
            color: "#FFF",
            fontSize: 16,
            fontFamily: fonts.bold,
            marginLeft: 10,
            marginTop: 10,
          }}
          locations={[0, 1]}
          text={t("PreHome")}
          colors={["#B5A0FF", "#755CCC"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

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
    <ImageBackground
      source={require("../../../assets/la.png")}
      style={styles.container}
    >
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
            data={followingData.datas}
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
    </ImageBackground>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

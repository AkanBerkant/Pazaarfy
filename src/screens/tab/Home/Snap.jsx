import React, { useFocusEffect } from "react";
import {
  Platform,
  FlatList,
  StyleSheet,
  Image,
  Text,
  View,
  ScrollView,
} from "react-native";

import {
  Tabs,
  useCurrentTabScrollY,
  useFocusedTab,
} from "react-native-collapsible-tab-view";
import ProfileShape1 from "../Profile/ProfileShape1";
import { RefreshControl } from "react-native-gesture-handler";
import { runOnJS, useDerivedValue } from "react-native-reanimated";
import { useAtom } from "jotai";
import { userAtom } from "../../../utils/atoms";
import { sizes } from "../../../theme";
import { useInfiniteQuery } from "@tanstack/react-query";
import HomeList from "./HomeList";
import fonts from "../../../theme/fonts";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import * as Queries from "../../../utils/queries";
import { splitArrayIntoChunks } from "../../../utils/split-array";
import HomeItem from "./HomeItem";
import Situation from "./Situation";
import SnapList from "./SnapList";
const HomeTab = ({ tabName, isFetching, onRefresh, data, onScroll }) => {
  const getAllData = () => {
    return data;
  };

  const refreshControl = React.useMemo(() => {
    return (
      <RefreshControl
        refreshing={isFetching}
        onRefresh={onRefresh}
        tintColor={"#918E8D"}
        colors={["#FFF"]}
      />
    );
  }, [isFetching, onRefresh]);

  // if (focusedTab !== tabName) return null;

  const queryClient = useQueryClient();

  const { t } = useTranslation();

  const [user, setUser] = useAtom(userAtom);

  const bablsPaginationQuery = useInfiniteQuery(
    ["BABLS_PAGINATION", user._id],
    ({ pageParam = 0 }) => {
      return Queries.getBablsPagination({
        user: user._id,
        page: pageParam,
      });
    },
    {
      placeholderData: {
        pages: [
          {
            nextPageCursor: 1,
            page: [],
          },
        ],
      },
      getNextPageParam: (lastPage) => {
        return lastPage.nextPageCursor;
      },
      cacheTime: 0,
    },
  );

  React.useEffect(
    React.useCallback(() => {
      queryClient.invalidateQueries(["BABLS_PAGINATION"]);
    }, []),
  );

  const profileShapes = [
    {
      size: 2,
    },
    {
      size: 6,
    },
    {
      size: 8,
    },
  ];

  const selectedShapeId = 0; // profile.profileShape || 0;
  const selectedShape = profileShapes[selectedShapeId];

  const dataList = bablsPaginationQuery.data.pages.reduce((prev, cur) => {
    return [...prev, ...cur.page];
  }, []);

  const dataBabl = splitArrayIntoChunks(dataList, selectedShape.size);

  const renderItem = ({ item }) => {
    if (selectedShapeId === 1) {
      return <ProfileShape2 chunk={item} />;
    }

    if (selectedShapeId === 2) {
      return <ProfileShape3 chunk={item} />;
    }

    return (
      <ProfileShape1
        chunk={item}
        getAllData={() => {
          return dataList;
        }}
        targetUserId={user._id}
      />
    );
  };

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false} scrollEventThrottle={16}>
        {data.map((categoryList, categoryIndex) => {
          if (!categoryList.length) return null;

          return (
            <View key={`list_${categoryIndex}`} style={styles.listContainer}>
              <SnapList
                getAllData={getAllData}
                data={categoryList}
                categoryIndex={categoryIndex}
                isReverse={categoryIndex % 2 === 0}
              />
            </View>
          );
        })}
      </ScrollView>
    </>
  );
};

export default React.memo(HomeTab);

const styles = StyleSheet.create({
  listContainer: {},
});

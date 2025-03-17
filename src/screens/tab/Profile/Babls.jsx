import React from "react";
import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";

import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { Tabs } from "react-native-collapsible-tab-view";

import { sizes, colors } from "../../../theme";
import * as Queries from "../../../utils/queries";
import { splitArrayIntoChunks } from "../../../utils/split-array";

import ProfileShape1 from "./ProfileShape1";
import ProfileShape2 from "./ProfileShape2";
import ProfileShape3 from "./ProfileShape3";

const Babls = ({ targetUserId, profile }) => {
  const queryClient = useQueryClient();
  const isFocused = useIsFocused();
  const [playingIndex, setPlayingIndex] = React.useState(0);

  useFocusEffect(
    React.useCallback(() => {
      setPlayingIndex(0);
    }, []),
  );

  const bablsPaginationQuery = useInfiniteQuery(
    ["BABLS_PAGINATION", targetUserId],
    ({ pageParam = 0 }) => {
      return Queries.getBablsPagination({
        user: targetUserId,
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

  useFocusEffect(
    React.useCallback(() => {
      setTimeout(() => {
        queryClient.invalidateQueries(["BABLS_PAGINATION", targetUserId]);
      }, 500);
    }, []),
  );

  const dataList = bablsPaginationQuery.data.pages.reduce((prev, cur) => {
    return [...prev, ...cur.page];
  }, []);

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
  const data = splitArrayIntoChunks(dataList, selectedShape.size);

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
        targetUserId={targetUserId}
      />
    );
  };

  return (
    <Tabs.FlatList
      data={data}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      onEndReached={() => {
        if (bablsPaginationQuery.hasNextPage) {
          bablsPaginationQuery.fetchNextPage();
        }
      }}
      refreshControl={
        <RefreshControl
          tintColor={"#918E8D"}
          colors={[colors.purple]}
          refreshing={bablsPaginationQuery.isFetching}
          onRefresh={() => {
            queryClient.invalidateQueries(["BABLS", targetUserId]);
          }}
        />
      }
      ListFooterComponent={
        <>
          {bablsPaginationQuery.isFetchingNextPage && (
            <ActivityIndicator
              size="large"
              color="#FFF"
              style={{
                marginVertical: 16,
              }}
            />
          )}
          <View style={styles.footer} />
        </>
      }
      keyExtractor={(item) => {
        return item._id;
      }}
      renderItem={renderItem}
      contentContainerStyle={styles.contentContainer}
    />
  );
};

export default Babls;

const styles = StyleSheet.create({
  footer: {
    height: 143,
  },
  contentContainer: {
    marginTop: 15,
    alignItems: "center",
  },
});

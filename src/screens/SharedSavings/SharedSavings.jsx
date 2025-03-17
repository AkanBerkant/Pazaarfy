import React from "react";
import {
  FlatList,
  View,
  StyleSheet,
  RefreshControl,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { t } from "i18next";

import { BackHeader } from "../../components";
import TrashIcon from "../../components/TrashIcon";
import routes from "../../constants/routes";
import { notify } from "../../helpers/notify";
import { colors } from "../../theme";
import fonts from "../../theme/fonts";
import * as Queries from "../../utils/queries";
import WeeklyItem from "../tab/HotBabls/WeeklyItem";

const SharedSavings = () => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const [showTrash, setShowTrash] = React.useState(false);

  const deleteSharedItemMutation = useMutation(Queries.deleteResource, {
    onSuccess: () => {
      notify({
        title: "Success",
      });
      queryClient.invalidateQueries(["SHARED_SAVINGS"]);
      queryClient.invalidateQueries(["SHARED_SAVINGS_PAGINATION"]);
    },
  });

  const {
    data,
    isRefetching,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    ["SHARED_SAVINGS_PAGINATION"],
    ({ pageParam = 0 }) => {
      return Queries.searchResourcesPagination({ page: pageParam });
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

  const dataList = data.pages.reduce((prev, cur) => {
    return [...prev, ...cur.page];
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      queryClient.invalidateQueries(["SHARED_SAVINGS"]);
      queryClient.invalidateQueries(["SHARED_SAVINGS_PAGINATION"]);
    }, []),
  );

  return (
    <View style={styles.container}>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <BackHeader title={t("ShareLibrary")} />
        <TouchableOpacity
          onPress={() => {
            setShowTrash((prev) => {
              return !prev;
            });
          }}
          style={{
            position: "absolute",
            right: 0,
            transform: [
              {
                translateY: Platform.OS == "ios" ? 17 : 5,
              },
            ],
          }}
        >
          <TrashIcon color={showTrash ? "#5F5" : "#F55"} />
        </TouchableOpacity>
      </View>

      {dataList.length === 0 && !isFetching ? (
        <View
          style={{
            alignItems: "center",
            marginTop: 100,
          }}
        >
          <Image
            resizeMode="contain"
            style={{
              width: 140,
              height: 140,
              tintColor: "white",
            }}
            source={require("../../assets/folder.png")}
          />
          <Text
            style={{
              fontSize: 14,
              color: "#9C9C9C",
              fontFamily: fonts.regular,
              marginTop: 10,
            }}
          >
            {t("YouYet")}
          </Text>
        </View>
      ) : (
        <FlatList
          data={dataList}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => {
            return item.id;
          }}
          onEndReached={() => {
            if (hasNextPage) {
              fetchNextPage();
            }
          }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              tintColor={"#918E8D"}
              onRefresh={() => {
                queryClient.invalidateQueries(["SHARED_SAVINGS"]);
              }}
            />
          }
          ListFooterComponent={
            isFetchingNextPage && (
              <ActivityIndicator
                size="large"
                color="#FFF"
                style={{
                  marginVertical: 16,
                }}
              />
            )
          }
          renderItem={({ item, index }) => {
            return (
              <View>
                <WeeklyItem
                  index={index}
                  item={{
                    ...item,
                    title: item.title || item.url,
                    cover: item.coverCopy,
                    type: item.resourceType,
                  }}
                  onPress={() => {
                    navigation.navigate(routes.BablContentList, {
                      items: [
                        {
                          ...item,
                          type: item.resourceType,
                        },
                      ],
                      itemIndex: 0,
                      showNext: false,
                    });
                  }}
                />

                {showTrash && (
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert(t("AreYouDelete"), null, [
                        {
                          text: t("no"),
                        },
                        {
                          text: t("yes"),
                          onPress: () => {
                            deleteSharedItemMutation.mutate({ id: item.id });
                          },
                        },
                      ]);
                    }}
                    style={{
                      position: "absolute",
                      right: 7,
                      top: 7,
                    }}
                  >
                    <TrashIcon color="#F55" width={16} />
                  </TouchableOpacity>
                )}
              </View>
            );
          }}
          columnWrapperStyle={{
            marginTop: 3,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        />
      )}
    </View>
  );
};

export default SharedSavings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});

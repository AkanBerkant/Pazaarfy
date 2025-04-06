import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import * as Queries from "../../utils/queries";
import { splitArrayIntoChunks } from "../../utils/split-array";
import { userAtom } from "../../utils/atoms";
import { useAtom } from "jotai";
import { sizes } from "../../theme";
import fonts from "../../theme/fonts";
import routes from "../../constants/routes";

export default function PazaarfyPro({ navigation }) {
  const queryClient = useQueryClient();
  const isFocused = useIsFocused();
  const [playingIndex, setPlayingIndex] = React.useState(0);

  useFocusEffect(
    React.useCallback(() => {
      setPlayingIndex(0);
    }, []),
  );

  const bablsPaginationQuery = useInfiniteQuery(
    ["BABLS_PAGINATION", user?._id],
    ({ pageParam = 0 }) => {
      return Queries.getBablsPagination({
        user: user?._id,
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
        queryClient.invalidateQueries(["BABLS_PAGINATION", user?._id]);
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

  const selectedShapeId = 0;
  const selectedShape = profileShapes[selectedShapeId];
  const data = splitArrayIntoChunks(dataList, selectedShape.size);

  const [user, setUser] = useAtom(userAtom);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(routes.Price, { item });
        }}
        style={styles.itemContainer}
      >
        <Image
          source={{
            uri: item[0].cover,
          }}
          style={styles.image}
        />

        <View style={styles.textContainer}>
          <Text style={styles.title}>{item[0].title}</Text>
          <View style={styles.timeContainer}>
            <Image
              style={{
                width: 15,
                height: 15,
                tintColor:
                  item.status == "expired"
                    ? "#FF9191"
                    : item.status == "urgent"
                      ? "#E3F546"
                      : item.status == "notlong"
                        ? "#8881A1"
                        : "#8881A1",
              }}
              source={require("../../assets/clock.png")}
            />
            <Text
              style={[
                styles.timeText,
                item.status === "expired" && styles.expired,
                item.status === "urgent" && styles.urgent,
                item.status === "notlong" && styles.notlong,
              ]}
            >
              {"1 saat kaldı"}
            </Text>
          </View>
        </View>
        {item.status == "expired" ? (
          <View style={styles.highlightButton}>
            <Text style={styles.highlightButtonText}>★ Yenile</Text>
          </View>
        ) : item.status == "urgent" ? null : item.status == "notlong" ? null : (
          <View style={styles.highlightButton}>
            <Text style={styles.highlightButtonText}>★ Öne Çıkar</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground
      source={require("../../assets/promode.png")}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.headerWidth}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={styles.row}
          >
            <Image
              style={styles.back}
              source={require("../../assets/back.png")}
            />
            <Text style={styles.titleHeader}>Pazaarfy Pro</Text>
          </TouchableOpacity>
          <View style={styles.highlightButton}>
            <Text style={styles.highlightButtonText}>★Ürün Öne Çıkart</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#201146",
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: "#111112",
    width: sizes.width,
    height: sizes.width / 3.5,
  },
  headerWidth: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 5,
    width: sizes.width / 1.07,
    alignSelf: "center",
    marginTop: 30,
  },
  titleHeader: {
    color: "#fff",
    fontSize: 20,
    fontFamily: fonts.bold,
    marginLeft: 10,
  },
  highlightButton: {
    backgroundColor: "#B19CFF",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  highlightButtonText: {
    color: "#fff",
    fontWeight: "500",
    fontFamily: fonts.medium,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    width: sizes.width / 1.1,
    alignSelf: "center",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  timeText: {
    color: "#8881A1",
    fontSize: 12,
    fontFamily: fonts.medium,
    marginLeft: 4,
  },
  expired: {
    color: "#FF9191",
    fontSize: 12,
    fontFamily: fonts.medium,
    marginLeft: 4,
  },
  urgent: {
    color: "#E3F546",
    fontSize: 12,
    fontFamily: fonts.medium,
    marginLeft: 4,
  },
  notlong: {
    color: "#8881A1",
    fontSize: 12,
    fontFamily: fonts.medium,
    marginLeft: 4,
  },
  renewButton: {
    backgroundColor: "#B19CFF",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  renewText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  back: {
    width: 12,
    height: 22,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});

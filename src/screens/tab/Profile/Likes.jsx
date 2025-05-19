import React from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  RefreshControl,
  Platform,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Tabs } from "react-native-collapsible-tab-view";
import { BoxShadow } from "react-native-shadow";

import routes from "../../../constants/routes";
import { colors, sizes } from "../../../theme";
import fonts from "../../../theme/fonts";
import * as Queries from "../../../utils/queries";
import { bablCategoriesIcon } from "../../createbabl/CreateBabl";

const Likes = ({ targetUserId, header }) => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const likedBablsQuery = useQuery(
    ["LIKED_BABLS", targetUserId],
    () => {
      return Queries.getLikedBabls(targetUserId);
    },
    {
      placeholderData: [],
    },
  );

  const { t, i18n } = useTranslation();

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.item}>
        <TouchableOpacity
          onPress={() => {
            return navigation.navigate(routes.DetailListProfile, {
              item,
              allData: [likedBablsQuery.data],
              categoryIndex: 0,
              itemIndex: index,
            });
          }}
        >
          <Image style={[styles.image]} source={{ uri: item.cover }} />
        </TouchableOpacity>

        {Platform.OS == "ios" ? (
          <View style={styles.blurIcon}>
            <Image
              resizeMode="contain"
              source={bablCategoriesIcon[item.category]}
              style={styles.categoryIcon}
            />
          </View>
        ) : (
          <View style={styles.blurIcon}>
            <BoxShadow
              setting={{
                width: 20,
                height: 20,
                color: "#E5E5E5",
                border: 10,
                radius: 10,
                opacity: 0.5,
                x: 0,
                y: 2,
                style: {
                  top: 7,
                  left: 7,
                },
              }}
            >
              <Image
                resizeMode="contain"
                source={bablCategoriesIcon[item.category]}
                style={styles.categoryIcon}
              />
            </BoxShadow>
          </View>
        )}
      </View>
    );
  };

  return (
    <Tabs.FlatList
      numColumns={2}
      data={likedBablsQuery.data}
      renderItem={renderItem}
      refreshControl={
        <RefreshControl
          tintColor={"#918E8D"}
          colors={[colors.purple]}
          refreshing={likedBablsQuery.isFetching}
          onRefresh={() => {
            queryClient.invalidateQueries(["LIKED_BABLS"]);
          }}
        />
      }
      ListFooterComponent={<View style={styles.footer} />}
      ListHeaderComponent={header}
      contentContainerStyle={styles.top}
      keyExtractor={(item) => {
        return item._id;
      }}
    />
  );
};

export default Likes;

const styles = StyleSheet.create({
  item: {
    shadowColor: "#FFF",
    shadowOffset: { width: 0, height: 0 }, // Negatif değer kullanarak üstten başlatma
    shadowOpacity: 0.3,
    elevation: 5,
    backgroundColor: "#000",
    shadowRadius: 1,
    justifyContent: "center",
    alignItems: "center",
    width: sizes.width / 2.03,
    height: sizes.width / 2.03,
    margin: 1,
  },
  image: {
    width: sizes.width / 2.04,
    height: sizes.width / 2.04,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#FFF",
    fontFamily: fonts.roboto,
    top: 7,
    position: "absolute",
    zIndex: 99,
    left: 10,
    fontSize: 12,
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    shadowOpacity: 3,
    shadowOffset: { width: 3, height: 2 },
    shadowColor: "rgba(0, 0, 0, 0.5)",
    elevation: 5,
    ...Platform.select({
      ios: {
        shadowColor: "rgba(0, 0, 0, 0.5)",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
      },
      android: {
        textShadowColor: "rgba(0, 0, 0, 0.8)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        elevation: 5, // Android'de gölge için
      },
    }),
  },
  blurIcon: {
    position: "absolute",
    top: 14,
    zIndex: 99,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    shadowOpacity: 3,
    shadowOffset: { width: 3, height: 2 },
    shadowColor: "rgba(0, 0, 0, 0.5)",
    elevation: 5,
    right: 14,
  },
  categoryIcon: {
    width: 16,
    height: 16,
    tintColor: "#FFF",
  },
  name: {
    color: "#FFF",
    fontFamily: fonts.roboto,
    marginLeft: 5,
    fontSize: 10,
    ...Platform.select({
      ios: {
        shadowColor: "rgba(0, 0, 0, 0.5)",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
      },
      android: {
        textShadowColor: "rgba(0, 0, 0, 0.8)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        elevation: 5, // Android'de gölge için
      },
    }),
  },
  position: {
    position: "absolute",
    zIndex: 99,
    bottom: 10,
    flexDirection: "row",
    alignItems: "center",
    left: 10,
  },
  pp: {
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: "#CDCDCD",
  },
  top: {
    marginTop: 15,
    alignItems: "center",
  },
  footer: {
    height: 143,
  },
});

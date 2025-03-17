import React from "react";
import {
  Alert,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";
import { Tabs } from "react-native-collapsible-tab-view";

import routes from "../../../constants/routes";
import { notify } from "../../../helpers/notify";
import { colors, sizes } from "../../../theme";
import fonts from "../../../theme/fonts";
import * as Queries from "../../../utils/queries";

const Collections = ({ header, onPress }) => {
  const queryClient = useQueryClient();

  const deleteCollectionMutation = useMutation(Queries.deleteCollection, {
    onSuccess: (res) => {
      notify({
        title: t("DeleteCollection"),
      });

      queryClient.invalidateQueries(["COLLECTIONS"]);
    },
  });

  const collectionsQuery = useQuery(["COLLECTIONS"], Queries.getCollections, {
    placeholderData: [],
  });

  const navigation = useNavigation();

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(routes.CollectionDetail, item);
        }}
        style={styles.item}
      >
        <View style={styles.row}>
          <Image
            source={
              // item.type === 'CONSTANT'
              require("../../../assets/collections.png")
              // : {
              //     uri: item.cover,
              //   }
            }
            style={styles.itemImage}
          />
          <View style={styles.left}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemType}>
              {item.isPrivate ? t("Private") : t("Public")}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            return Alert.alert(
              t("AreYouSureYouWantToDeleteTheCollection"),
              null,
              [
                {
                  text: t("yes"),
                  style: "destructive",
                  onPress: () => {
                    deleteCollectionMutation.mutate(item._id);
                  },
                },
                {
                  text: t("no"),
                  isPreferred: true,
                },
              ],
            );
          }}
        >
          <Image
            source={require("../../../assets/del.png")}
            style={{
              width: 20,
              height: 25,
              tintColor: colors.red,
            }}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const keyExtractor = (item) => {
    return item._id;
  };

  return (
    <Tabs.FlatList
      data={collectionsQuery.data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListHeaderComponent={() => {
        return (
          <View style={styles.between}>
            <Text style={styles.titleNewCollection}>{t("Collections")}</Text>
            <TouchableOpacity onPress={onPress} style={styles.row}>
              <Image
                source={require("../../../assets/pluss.png")}
                style={styles.add}
              />
              <Text style={styles.pinkNewCollection}>
                {t("NewCollections")}
              </Text>
            </TouchableOpacity>
          </View>
        );
      }}
      refreshControl={
        <RefreshControl
          tintColor={"#918E8D"}
          colors={[colors.purple]}
          refreshing={collectionsQuery.isFetching}
          onRefresh={() => {
            queryClient.invalidateQueries(["COLLECTIONS"]);
          }}
        />
      }
    />
  );
};

export default Collections;

const styles = StyleSheet.create({
  between: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  title: {
    fontWeight: "bold",
    color: "#FFF",
    fontSize: 18,
    fontFamily: fonts.avenir,
  },
  pink: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#EE558F",
    fontFamily: fonts.avenir,
  },
  left: {
    marginLeft: 7,
  },
  itemTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#FFF",
  },
  itemType: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: fonts.avenir,
  },
  plus: {
    width: 22,
    height: 22,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 5,
    width: sizes.width / 1.1,
    alignSelf: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  add: {
    width: 12,
    height: 12,
    marginRight: 5,
    tintColor: "#7A7A7A",
  },
  itemImage: {
    width: 52,
    height: 52,
    borderRadius: 14,
  },
  titleNewCollection: {
    fontWeight: "bold",
    color: "#FFF",
    fontSize: 18,
    fontFamily: fonts.roboto,
  },
  pinkNewCollection: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#7A7A7A",
    fontFamily: fonts.roboto,
  },
});

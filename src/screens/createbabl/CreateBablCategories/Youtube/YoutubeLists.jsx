import React from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  View,
  TextInput,
  RefreshControl,
} from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";
import { useAtomValue } from "jotai";
import { useTranslation } from "react-i18next";

import { BackHeader, ButtonLinear } from "../../../../components";
import { notify } from "../../../../helpers/notify";
import { colors, sizes } from "../../../../theme";
import fonts from "../../../../theme/fonts";
import { bablFormAtom } from "../../../../utils/atoms";

import BablSearchListItem from "./BablSearchListItem";
import BablSearchSelectedItem from "./BablSearchSelectedItem";

const YoutubeLists = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const searchTextRef = React.useRef("");
  const queryClient = useQueryClient();
  const bablForm = useAtomValue(bablFormAtom);
  const { t } = useTranslation();

  const { isCover = false, bablId = false, newItemSession } = route.params;
  const { title, queryFn, type } = route.params.item;

  const searchQuery = useQuery(
    ["SEARCH_BABL_API", title, type],
    () => {
      if (searchTextRef.current.length < 2 && type !== "SHARED_SAVINGS") {
        return [];
      }

      return queryFn(searchTextRef.current);
    },
    {
      placeholderData: [],
      onError: (err) => {
        notify({
          title: t("AnUnexpectedErrorOccurred"),
        });
      },
    },
  );

  const renderDeleteImage = ({ item }) => {
    return <BablSearchSelectedItem item={item} />;
  };

  const renderItem = ({ item }) => {
    return <BablSearchListItem item={item} newItemSession={newItemSession} />;
  };

  return (
    <View style={styles.container}>
      <BackHeader bold title={title} />

      <TextInput
        placeholder={t("Search")}
        style={styles.input}
        returnKeyType="search"
        onChangeText={(text) => {
          return (searchTextRef.current = text);
        }}
        onSubmitEditing={() => {
          return queryClient.invalidateQueries(["SEARCH_BABL_API"]);
        }}
        placeholderTextColor="#AEAEAE"
      />
      {/*
      {searchQuery.isFetching ? (
        <ActivityIndicator size={'large'} />
      ) : ( */}
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={searchQuery.isRefetching}
            tintColor={"#918E8D"}
            onRefresh={() => {
              queryClient.invalidateQueries(["SEARCH_BABL_API"]);
            }}
          />
        }
        data={searchQuery.data}
        renderItem={renderItem}
      />
      {/* )} */}

      <View style={styles.bottom}>
        {!(isCover || bablId || newItemSession) && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal
              data={
                bablForm.items[type]
                  ? Object.values(bablForm.items[type]).sort((a, b) => {
                      return +a.addedAt - b.addedAt;
                    })
                  : []
              }
              renderItem={renderDeleteImage}
            />
          </ScrollView>
        )}

        {!bablId && (
          <View style={styles.marginBottom}>
            <ButtonLinear
              title={t("continue")}
              style={styles.button}
              onPress={() => {
                navigation.goBack();
              }}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default YoutubeLists;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  title: {
    fontSize: 24,
    color: "#FFF",
    marginTop: 20,
    textAlign: "center",
    fontFamily: fonts.roboto,
  },
  description: {
    color: "#6A6A6A",
    textAlign: "center",
    marginTop: 12,
    fontSize: 12,
    width: sizes.width / 1.2,
    alignSelf: "center",
  },
  input: {
    backgroundColor: "#181818",
    height: 47,
    alignSelf: "center",
    color: "#FFF",
    borderRadius: 14,
    width: sizes.width / 1.07,
    marginTop: 10,
    padding: 10,
  },
  bottom: {
    backgroundColor: "#141414",
    padding: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 2,
    shadowRadius: 3.84,
    width: sizes.width,
  },
  marginBottom: {
    marginBottom: 5,
  },
});

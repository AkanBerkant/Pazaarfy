import React from "react";
import {
  FlatList,
  View,
  StyleSheet,
  RefreshControl,
  TextInput,
} from "react-native";

import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BackHeader, ButtonLinear } from "../../components";
import { colors, sizes } from "../../theme";
import SharedLibraryListItem from "../createbabl/CreateBablCategories/Youtube/SharedLibraryListItem";

const CustomLibrary = () => {
  const route = useRoute();
  const queryClient = useQueryClient();
  const [searchText, setSearchText] = React.useState("");
  const { t } = useTranslation();
  const navigation = useNavigation();
  const safeAreaInsets = useSafeAreaInsets();

  const { title, queryFn, queryKey, cb, type, isChecked } = route.params;

  const { data, isRefetching } = useQuery(
    [queryKey, searchText],
    () => {
      return queryFn(searchText);
    },
    {
      placeholderData: [],
    },
  );

  useFocusEffect(
    React.useCallback(() => {
      queryClient.invalidateQueries([queryKey]);
    }, []),
  );

  return (
    <View style={styles.container}>
      <BackHeader title={title} />
      {type === "BABLS_SEARCH" && (
        <TextInput
          placeholder={t("sSearch")}
          style={styles.input}
          returnKeyType="search"
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#AEAEAE"
        />
      )}

      <FlatList
        data={data}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => {
          return item._id;
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            tintColor={"#918E8D"}
            onRefresh={() => {
              queryClient.invalidateQueries([queryKey]);
            }}
          />
        }
        renderItem={({ item, index }) => {
          return (
            <SharedLibraryListItem
              item={{
                ...item,
                id: item._id,
                type,
              }}
              customCb={(cb2) => {
                cb(
                  {
                    _id: item._id,
                    cover: item.cover,
                    title: item.title,
                    type,
                    resourceType: "BABL_EMBED",
                    url: item._id,
                  },
                  cb2,
                );
              }}
              initialCheck={isChecked(type, item._id)}
            />
          );
        }}
        columnWrapperStyle={{
          marginTop: 3,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      />

      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          bottom: safeAreaInsets.bottom || 32,
        }}
      >
        <ButtonLinear title={t("Done")} onPress={navigation.goBack} />
      </View>
    </View>
  );
};

export default CustomLibrary;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  input: {
    backgroundColor: "#181818",
    height: 47,
    alignSelf: "center",
    color: "#FFF",
    borderRadius: 14,
    width: sizes.width / 1.07,
    marginTop: 10,
    marginBottom: 20,
    padding: 10,
  },
});

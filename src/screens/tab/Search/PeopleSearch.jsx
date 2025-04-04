/* eslint-disable no-nested-ternary */
import React from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import PagerView from "react-native-pager-view";
import { sizes } from "../../../theme";
import fonts from "../../../theme/fonts";
import * as Queries from "../../../utils/queries";

import ForYou from "./ForYou";
import Hastag from "./Hastag";
import People from "./People";
import SearchBabl from "./SearchBabl";

const PeopleSearch = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selected, setSelected] = React.useState(false);
  const { t } = useTranslation();

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

  const tabs = [
    {
      time: t("People"),
      _id: "people",
    },
  ];

  const pagerRef = React.useRef();
  const [customFilter, setCustomFilter] = React.useState(tabs[0]._id);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#000",
      }}
    >
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
        style={[
          styles.header,
          {
            justifyContent: "space-between",
          },
        ]}
      >
        <View
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.proButton}
        >
          <Image
            style={styles.proButton}
            source={require("../../../assets/back.png")}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>{t("People")}</Text>
        <View
          style={styles.notification}
          resizeMode="contain"
          source={require("../../../assets/notification.png")}
        />
      </TouchableOpacity>

      <View style={styles.between}>
        <View style={styles.row}>
          <View style={styles.input}>
            <Image
              resizeMode="contain"
              source={require("../../../assets/search.png")}
              style={styles.searchIcon}
            />
            <TextInput
              value={searchTerm}
              onChangeText={setSearchTerm}
              style={styles.inInput}
              placeholder={t("SearchUser")}
              // autoFocus
            />

            <View
              source={require("../../../assets/searched.png")}
              style={styles.cancelIcon}
            />
          </View>
        </View>
      </View>

      <View style={styles.borderBottom} />
      {/* <Text style={styles.title}>{'You may like'}</Text> */}
      <PagerView
        style={{ flex: 1 }}
        initialPage={0}
        ref={pagerRef}
        onPageScroll={(e) => {
          setCustomFilter(tabs[e.nativeEvent.position]._id);
        }}
      >
        {tabs.map((item) => {
          return (
            <View key={item.id}>
              {customFilter === "babls" ? (
                <SearchBabl data={searchBablsQuery.data.babls} />
              ) : customFilter === "forYou" ? (
                <ForYou data={searchBablsQuery.data.forYou} />
              ) : customFilter === "hashtag" ? (
                <Hastag
                  data={searchBablsQuery.data.hashtag}
                  setCustomFilter={setCustomFilter}
                  setSearchTerm={setSearchTerm}
                />
              ) : customFilter === "people" ? (
                <People data={searchBablsQuery.data.people} />
              ) : null}
            </View>
          );
        })}
      </PagerView>
    </SafeAreaView>
  );
};

export default PeopleSearch;

const styles = StyleSheet.create({
  between: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  backIcon: {
    width: 12.43,
    height: 22,
    tintColor: "#BBBBBB",
  },
  input: {
    backgroundColor: "#171717",
    width: sizes.width / 1.1,
    borderRadius: 19,
    justifyContent: "space-around",
    flexDirection: "row",
    alignItems: "center",
    height: 38,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  items: {
    marginTop: 15,
  },
  searchIcon: {
    tintColor: "#454545",
    width: 15,
    height: 15,
    marginLeft: 5,
  },
  inInput: {
    width: sizes.width / 1.4,
    marginLeft: 0,
    color: "#FFF",
    fontFamily: fonts.roboto,
  },
  activeItem: {
    width: sizes.width / 1.1,
    height: 35,
    margin: 5,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },
  disableItem: {
    height: 33,
    width: sizes.width / 1.1,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    margin: 5,
  },
  icon: {
    width: 7,
    height: 7,
    marginLeft: 12,
    tintColor: "#FFFFFF",
  },
  disableLabel: {
    marginLeft: 10,
    color: "#FFFFFF",
    fontFamily: fonts.roboto,
    fontWeight: "bold",
    fontSize: 16,
  },
  borderBottom: {
    backgroundColor: "#181818",
    width: sizes.width,
    height: 1,
  },
  left: {
    width: 22,
  },
  cancelIcon: {
    tintColor: "#B5B5B5",
    width: 18,
    height: 18,
    marginRight: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    zIndex: 99,
    width: sizes.width / 1.01,
    alignSelf: "center",
    justifyContent: "space-between",
  },
  bottomIcon: {
    width: 17,
    position: "absolute",
    top: 35,
    zIndex: 99,
    height: 4,
  },
  menu: {
    alignItems: "center",
    marginBottom: 20,
  },

  proButton: {
    width: 56,
    height: 21,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  proButtonText: {
    color: "#FFF",
    fontFamily: fonts.medium,
    marginLeft: 3,
  },
  proStar: {
    tintColor: "#FFF",
    width: 10,
    height: 10,
  },
  notification: {
    width: 56,
    height: 29,
  },
  title: {
    color: "#FFF",
    fontFamily: fonts.bold,
    fontSize: 25,
  },
});

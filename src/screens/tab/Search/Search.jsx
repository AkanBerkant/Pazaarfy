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
import LinearGradient from "react-native-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import PagerView from "react-native-pager-view";

import routes from "../../../constants/routes";
import { sizes } from "../../../theme";
import fonts from "../../../theme/fonts";
import * as Queries from "../../../utils/queries";

import ForYou from "./ForYou";
import Hastag from "./Hastag";
import People from "./People";
import SearchBabl from "./SearchBabl";

const Search = () => {
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
      time: t("Product"),
      _id: "babls",
    },
    {
      time: t("ForYou"),
      _id: "forYou",
    },

    {
      time: t("People"),
      _id: "people",
    },
  ];

  const pagerRef = React.useRef();
  const [customFilter, setCustomFilter] = React.useState(tabs[0]._id);

  const renderItem = ({ item, index }) => {
    const isSelected = selected === index;

    return (
      <TouchableOpacity
        onPress={() => {
          if (route.params?.onDone) {
            navigation.goBack();
            return route.params?.onDone({
              id: item._id,
              type: "BABL_EMBED",
              title: item.title,
              cover: item.cover,
              url: item._id,
              metadata: {
                user: item.user,
              },
            });
          }
          setSelected(index);
          navigation.navigate(routes.HotBablDetail, item);
        }}
      >
        {isSelected ? (
          <ImageBackground
            style={styles.activeItem}
            source={require("../../../assets/styledbg.png")}
          >
            <Image
              source={require("../../../assets/active.png")}
              style={styles.icon}
            />
            <Text style={styles.disableLabel}>{item.title}</Text>
          </ImageBackground>
        ) : (
          <View style={styles.disableItem}>
            <Image
              source={require("../../../assets/inactive.png")}
              style={styles.icon}
            />
            <Text style={styles.disableLabel}>{item.title}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#000",
      }}
    >
      <View
        style={[
          styles.header,
          {
            justifyContent: "space-between",
          },
        ]}
      >
        <TouchableOpacity
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.proButton}
        >
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            colors={["#B5A0FF", "#755CCC"]}
            style={styles.proButton}
          >
            <Image
              style={styles.proStar}
              source={require("../../../assets/prostar.png")}
            />
            <Text style={[styles.proButtonText]}>{"Pro"}</Text>
          </LinearGradient>
        </TouchableOpacity>
        <Text style={styles.title}>{t("Pazar")}</Text>
        <Image
          style={styles.notification}
          resizeMode="contain"
          source={require("../../../assets/notification.png")}
        />
      </View>

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
              placeholder={t("SearchProduct")}
              // autoFocus
            />

            <TouchableOpacity
              onPress={() => {
                navigation.navigate(routes.VisionApi, {
                  data: searchBablsQuery.data.forYou,
                });
              }}
            >
              <Image
                resizeMode="contain"
                source={require("../../../assets/searched.png")}
                style={styles.cancelIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.header}>
        {tabs.map((item) => {
          const isSelected = customFilter === item._id;
          return (
            <TouchableOpacity
              onPress={() => {
                setCustomFilter(item._id);
              }}
              style={styles.menu}
            >
              <Text
                style={[
                  styles.time,
                  {
                    color: isSelected ? "#FFFFFF" : "#6A6A6A",
                    fontFamily: fonts.bold,
                  },
                ]}
              >
                {item.time}
              </Text>
            </TouchableOpacity>
          );
        })}
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

export default Search;

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
    width: sizes.width / 1.1,
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
    height: 31,
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

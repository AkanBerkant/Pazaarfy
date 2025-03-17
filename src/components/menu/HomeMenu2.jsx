import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import routes from "../../constants/routes";
import { sizes } from "../../theme";
import fonts from "../../theme/fonts";

const bottomIcon = require("../../assets/bottom.png");
const searchIcon = require("../../assets/search.png");

const HomeMenu2 = ({ selected, setSelected }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const sections = [
    {
      label: t("ForYou"),
    },
    {
      label: t("Following"),
    },
  ];

  const onSearchPress = () => {
    navigation.navigate(routes.Search);
  };

  return (
    <View style={[styles.between]}>
      <View style={styles.headerView} />

      <View style={styles.row}>
        {sections.map((item, index) => {
          const isSelected = selected === index;
          return (
            <TouchableOpacity
              style={styles.sectionBtn}
              onPress={() => {
                setSelected(index);
              }}
            >
              <Text
                style={{
                  color: isSelected ? "#FFF" : "#6A6A6A",
                  fontWeight: isSelected ? "bold" : "400",
                  fontSize: 18,
                  margin: 7,
                  fontFamily: isSelected ? fonts.roboto : fonts.regular,
                }}
              >
                {item.label}
              </Text>
              {isSelected && (
                <Image
                  tintColor="#FFFFFF"
                  style={styles.bottomIcon}
                  source={bottomIcon}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View
        resizeMode="contain"
        source={searchIcon}
        style={styles.searchIcon}
      />
    </View>
  );
};

export default HomeMenu2;

const styles = StyleSheet.create({
  searchIcon: {
    width: 19,
    height: 19,
    tintColor: "#6A6A6A",
  },
  bottomIcon: {
    width: 17,
    position: "absolute",
    top: 30,
    height: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  itemImage: {
    width: sizes.width / 2.5,
    height: sizes.width / 2.5,
    margin: 2,
    borderRadius: 13.2,
  },
  between: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: sizes.width / 1.07,
    alignSelf: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#0E0E0E",
  },
  handleStyle: {
    backgroundColor: "#D9D9D9",
  },
  headerView: {
    width: 17.67,
    height: 14,
  },
  footerView: {
    height: 80,
  },
  sectionBtn: {
    alignItems: "center",
  },
});

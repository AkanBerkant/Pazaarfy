import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";

import { useMutation } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { useTranslation } from "react-i18next";

import { BackHeader } from "../../components";
import CheckBox from "../../components/CheckBox";
import { colors, sizes } from "../../theme";
import fonts from "../../theme/fonts";
import { userAtom } from "../../utils/atoms";
import * as Queries from "../../utils/queries";

const ChangeLanguge = () => {
  const setUser = useSetAtom(userAtom);
  const { i18n, t } = useTranslation();
  const [selected, setSelected] = useState(i18n.language);

  const updateProfileMutation = useMutation(Queries.updateProfile, {
    onMutate: (vars) => {
      i18n.changeLanguage(vars.lang);
    },
    onSuccess: (res) => {
      setUser(res);
    },
  });

  const lang = [
    {
      id: "en",
      label: "English",
      icon: require("../../assets/en.png"),
      onPress: () => {
        updateProfileMutation.mutate({
          lang: "en",
        });
      },
    },
    // {
    //   label: 'German',
    //   icon: require('../../assets/german.png'),
    //   onPress: () => {
    //     i18n.changeLanguage('ge');
    //   },
    // },
    // {
    //   label: 'Swedish',
    //   icon: require('../../assets/sw.png'),
    //   onPress: () => {
    //     i18n.changeLanguage('sw');
    //   },
    // },
    {
      id: "tr",
      label: "Türkçe",
      icon: require("../../assets/turkish.png"),
      onPress: () => {
        updateProfileMutation.mutate({
          lang: "tr",
        });
      },
    },
    {
      id: "ar",
      label: "Arabic",
      icon: require("../../assets/arabic.png"),
      onPress: () => {
        updateProfileMutation.mutate({
          lang: "ar",
        });
      },
    },
  ];

  const renderItem = ({ item }) => {
    const isSelected = selected === item.id;
    return (
      <TouchableOpacity
        onPress={() => {
          setSelected(item.id);
          item.onPress();
        }}
        style={[
          styles.item,
          {
            borderWidth: isSelected ? 0 : 1,
            backgroundColor: isSelected ? "#1D1D1D" : "#000",
          },
        ]}
      >
        <View style={styles.row}>
          <CheckBox selected={isSelected} />
          <Text style={styles.label}>{item.label}</Text>
        </View>

        <Image source={item.icon} style={styles.icon} />
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <BackHeader shadow={0} title={t("languageSelection")} />
      <FlatList data={lang} renderItem={renderItem} />

      {/*
        <View
        style={{
          position: 'absolute',
          bottom: safeAreaInsets.bottom || 32,
          left: 0,
          right: 0,
        }}
      >
        <ButtonLinear onPress={onSavePress} title={t('Save')} />
      </View>
        */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  item: {
    width: sizes.width / 1.1,
    alignSelf: "center",
    justifyContent: "space-between",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#424242",
    borderRadius: 16,
    height: 73,
    marginTop: 10,
  },
  label: {
    color: colors.white,
    fontFamily: fonts.bold,
    fontSize: 14,
    marginLeft: 10,
  },
  icon: {
    width: 40,
    height: 40,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default ChangeLanguge;

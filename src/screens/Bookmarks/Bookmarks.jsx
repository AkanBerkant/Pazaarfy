import React from "react";
import {
  View,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import MasonryList from "@react-native-seoul/masonry-list";
import { useQuery } from "@tanstack/react-query";
import { t } from "i18next";
import { BackHeader } from "../../components";
import * as Queries from "../../utils/queries";
import routes from "../../constants/routes";
const Bookmarks = ({ navigation }) => {
  const { data } = useQuery(["BOOKMARKS"], Queries.listBookmarkedBabls, {
    placeholderData: [],
  });

  const numColumns = 3;
  const screenWidth = Dimensions.get("window").width;
  const columnWidth = screenWidth / numColumns - 4;

  // Farklı yükseklik değerleri belirleyelim
  const heights = [130, 130, 265, 130, 130, 130];

  // Her görsele sırayla yükseklik atayalım
  const updatedData = data?.map((item, index) => ({
    ...item,
    height: heights[index % heights.length], // Döngüsel olarak yükseklikleri ata
  }));

  return (
    <View style={styles.container}>
      <BackHeader title={t("Saveddd")} />

      <MasonryList
        data={updatedData}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(routes.HotBablDetail, item);
            }}
          >
            <Image
              source={{ uri: item.cover }}
              style={{
                width: columnWidth,
                height: item.height, // Yüksekliği dinamik olarak ekledik
                margin: 2,
                borderRadius: 1,
              }}
              resizeMode={"cover"}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Bookmarks;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});

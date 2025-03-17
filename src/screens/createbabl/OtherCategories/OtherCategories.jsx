import { FlatList, StyleSheet, View } from "react-native";

import { useTranslation } from "react-i18next";
import { useSharedValue } from "react-native-reanimated";

import { BackHeader, ButtonLinear } from "../../../components";
import { ListItem } from "../../../components/other/ListItem";
import { getBablCategories } from "../CreateBabl";

const OtherCategories = ({ navigation }) => {
  const { t } = useTranslation();
  const viewableItems = useSharedValue([]);
  const bablCategories = getBablCategories(t);

  return (
    <View style={styles.container}>
      <BackHeader title={t("BablCategories")} />
      <FlatList
        data={bablCategories}
        contentContainerStyle={{ paddingTop: 40 }}
        onViewableItemsChanged={({ viewableItems: vItems }) => {
          viewableItems.value = vItems;
        }}
        renderItem={({ item }) => {
          return <ListItem item={item} viewableItems={viewableItems} />;
        }}
      />

      <View
        style={{
          marginBottom: 20,
        }}
      />
    </View>
  );
};

export default OtherCategories;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});

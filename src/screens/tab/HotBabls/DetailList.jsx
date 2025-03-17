import React from 'react';
import {
  Dimensions,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';

import routes from '../../../constants/routes';
import Emitter from '../../../utils/emitter';

import HotBablDetailContent from './HotBablDetailContent';

const dim = Dimensions.get('window');
const ITEM_HEIGHT = dim.height + (Platform.OS === 'android' ? StatusBar.currentHeight : 0);

const DetailItem = ({
  item,
  index,
  itemIndex,
  categoryIndex,
  initialCategoryIndex,
  showIndex,
}) => {
  const navigation = useNavigation();

  const onPress = () => {
    navigation.navigate(routes.BablContent, {
      bablId: item._id,
      cover: item.cover,
      repostedBy: item.repostedBy,
    });
  };

  return (
    <View style={styles.contentContainer}>
      <HotBablDetailContent
        bablId={item._id}
        data={item}
        repostedBy={item.repostedBy}
        listenId={`DETAIL_${categoryIndex}_${index}`}
        initialState={
          initialCategoryIndex === categoryIndex && itemIndex === index
        }
        onPress={onPress}
        showIndex={showIndex}
        index={index}
      />
    </View>
  );
};

const ListItem = ({
  item: categoryList,
  index: categoryIndex,
  initialCategoryIndex,
  itemIndex,
  selectedItemRef,
  selectedCategoryRef,
  showIndex,
}) => {
  const keyExtractor2 = (item) => {
    return `HOME_ITEMX_${item._id}`;
  };

  const onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems[0]?.index !== undefined) {
      selectedItemRef.current[selectedCategoryRef.current] = Math.round(
        viewableItems[0]?.index,
      );

      Emitter.emit(
        'RUN_DETAIL',
        `DETAIL_${selectedCategoryRef.current}_${
          selectedItemRef.current[selectedCategoryRef.current]
        }`,
      );
    }
  };

  const viewabilityConfigCallbackPairs = React.useRef([
    {
      viewabilityConfig: {
        minimumViewTime: 150,
        itemVisiblePercentThreshold: 30,
      },
      onViewableItemsChanged,
    },
  ]);

  const renderItem2 = ({ item, index }) => {
    return (
      <DetailItem
        item={item}
        index={index}
        itemIndex={itemIndex}
        categoryIndex={categoryIndex}
        initialCategoryIndex={initialCategoryIndex}
        showIndex={showIndex}
      />
    );
  };

  return (
    <FlatList
      data={categoryList}
      showsVerticalScrollIndicator={false}
      keyExtractor={keyExtractor2}
      initialScrollIndex={
        categoryIndex === initialCategoryIndex ? itemIndex : 0
      }
      viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      pagingEnabled
      getItemLayout={(data, index) => {
        return {
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        };
      }}
      estimatedItemSize={ITEM_HEIGHT}
      renderItem={renderItem2}
    />
  );
};

const DetailList = () => {
  const route = useRoute();
  const {
    item,
    allData,
    categoryIndex: initialCategoryIndex,
    itemIndex,
    showIndex,
  } = route.params;
  const selectedCategoryRef = React.useRef(initialCategoryIndex);
  const selectedItemRef = React.useRef({
    [initialCategoryIndex]: itemIndex,
  });

  return (
    <View style={styles.container}>
      {Platform.OS === 'android' && (
        <StatusBar translucent backgroundColor="transparent" />
      )}
      <ListItem
        item={allData[initialCategoryIndex]}
        index={initialCategoryIndex}
        itemIndex={itemIndex}
        initialCategoryIndex={initialCategoryIndex}
        selectedItemRef={selectedItemRef}
        selectedCategoryRef={selectedCategoryRef}
        showIndex={showIndex}
      />
    </View>
  );
};

export default DetailList;

const styles = StyleSheet.create({
  container: {
    height: ITEM_HEIGHT,
    width: dim.width,
    justifyContent: 'space-between',
    backgroundColor: '#000',
  },
  contentContainer: {
    height: ITEM_HEIGHT,
    width: dim.width,
  },
});

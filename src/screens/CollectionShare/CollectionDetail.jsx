import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';

import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { BackHeader } from '../../components';
import routes from '../../constants/routes';
import { sizes } from '../../theme';
import * as Queries from '../../utils/queries';
import WeeklyItem from '../tab/HotBabls/WeeklyItem';

const CollectionDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const queryClient = useQueryClient();

  const { _id } = route.params;

  const collectionDetailQuery = useQuery(
    ['COLLECTION_DETAIL', _id],
    () => {
      return Queries.getCollectionDetail(_id);
    },
    {
      placeholderData: {
        babls: [],
        types: {},
      },
    },
  );

  if (!collectionDetailQuery.isSuccess) return null;

  const { babls, types } = collectionDetailQuery.data;

  return (
    <View style={styles.container}>
      <BackHeader
        buttonPress={() => {
          navigation.navigate(routes.BablOptions, { _id, babls, types });
        }}
        title="Collections"
        button="Manage Babls"
      />

      <FlatList
        data={[...babls, ...Array.from({ length: babls.length % 3 }).fill({ fill: true })]}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => {
          return item._id;
        }}
        renderItem={({ item, index }) => {
          if (item.fill) {
            return (
              <View
                style={{
                  borderRadius: 14,
                  width: sizes.width / 3.07,
                  height: sizes.width / 3.07,

                  margin: 2,
                  backgroundColor: '#000',

                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              />
            );
          }

          return (
            <WeeklyItem
              index={index}
              item={item}
              onPress={() => {
                navigation.navigate(routes.HotBablDetail, {
                  _id: item._id,
                });
              }}
            />
          );
        }}
        bounces={false}
        columnWrapperStyle={{
          marginTop: 3,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      />
    </View>
  );
};

export default CollectionDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});

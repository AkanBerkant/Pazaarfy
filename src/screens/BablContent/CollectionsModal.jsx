import React from 'react';
import {
  Alert,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { t } from 'i18next';

import { notify } from '../../helpers/notify';
import { colors, sizes } from '../../theme';
import fonts from '../../theme/fonts';
import * as Queries from '../../utils/queries';
import CreateCollectionModal from '../tab/Profile/CreateCollectionModal';

const CollectionsModal = ({ bablId, onClose }) => {
  const queryClient = useQueryClient();
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const addItemIntoCollectionMutation = useMutation(
    Queries.addItemIntoCollection,
    {
      onSuccess: (res) => {
        onClose();
        notify({
          title: t('itemAddedToCollection'),
        });

        queryClient.invalidateQueries(['COLLECTIONS']);
      },
    },
  );

  const collectionsQuery = useQuery(['COLLECTIONS'], Queries.getCollections, {
    placeholderData: [],
  });

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          Alert.alert(t('areYouSureToAddItem'), null, [
            {
              text: t('no'),
              style: 'cancel',
            },
            {
              text: t('yes'),
              isPreferred: true,
              onPress: () => {
                addItemIntoCollectionMutation.mutate({
                  collectionId: item._id,
                  item: bablId,
                });
              },
            },
          ]);
        }}
        style={styles.item}
      >
        <View style={styles.row}>
          <Image
            source={require('../../assets/collections.png')}
            style={styles.itemImage}
          />
          <View style={styles.left}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemType}>
              {item.isPrivate ? t('Private') : t('Public')}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const keyExtractor = (item) => {
    return item._id;
  };

  return (
    <>
      <FlatList
        data={collectionsQuery.data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={() => {
          return (
            <View style={styles.between}>
              <Text style={styles.title}>{t('Collections')}</Text>
              <TouchableOpacity
                style={styles.row}
                onPress={() => {
                  setIsModalVisible(true);
                }}
              >
                <Image
                  source={require('../../assets/pluss.png')}
                  style={styles.add}
                />
                <Text style={styles.pink}>{t('NewCollection')}</Text>
              </TouchableOpacity>
            </View>
          );
        }}
        refreshControl={(
          <RefreshControl
            tintColor={colors.purple}
            colors={[colors.purple]}
            refreshing={collectionsQuery.isFetching}
            onRefresh={() => {
              queryClient.invalidateQueries(['COLLECTIONS']);
            }}
          />
        )}
      />

      {isModalVisible && (
        <CreateCollectionModal
          onClose={() => {
            setIsModalVisible(false);

            setTimeout(() => {
              queryClient.invalidateQueries(['COLLECTIONS']);
            }, 500);
          }}
        />
      )}
    </>
  );
};

export default CollectionsModal;

const styles = StyleSheet.create({
  between: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  title: {
    fontWeight: 'bold',
    color: '#FFF',
    fontSize: 18,
    fontFamily: fonts.avenir,
  },
  pink: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#7A7A7A',
    fontFamily: fonts.roboto,
  },
  left: {
    marginLeft: 7,
  },
  itemTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FFF',
  },
  itemType: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: fonts.avenir,
  },
  plus: {
    width: 22,
    height: 22,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
    width: sizes.width / 1.1,
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  add: {
    width: 12,
    height: 12,
    marginRight: 5,
    tintColor: '#7A7A7A',
  },
  itemImage: {
    width: 52,
    height: 52,
    borderRadius: 14,
  },
  titleNewCollection: {
    fontWeight: 'bold',
    color: '#FFF',
    fontSize: 18,
    fontFamily: fonts.roboto,
  },
  pinkNewCollection: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#7A7A7A',
    fontFamily: fonts.roboto,
  },
});

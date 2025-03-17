import React from 'react';
import {
  View, Text, Image, StyleSheet, FlatList, TouchableOpacity,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { t } from 'i18next';
import LinearGradient from 'react-native-linear-gradient';

import ItemTypeIcon from '../../components/ItemTypeIcon';
import routes from '../../constants/routes';
import { sizes } from '../../theme';
import fonts from '../../theme/fonts';
import * as Queries from '../../utils/queries';

const SentRequests = () => {
  const navigation = useNavigation();

  const listSendedRequestsQuery = useQuery(
    ['LIST_SENDED_REQUESTS'],
    Queries.listSendedBablRequests,
    {
      placeholderData: [],
      cacheTime: 0,
    },
  );

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(routes.BablContentList, {
            items: [item.item],
            itemIndex: 0,
            showNext: false,
          });
        }}
      >
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          colors={['#FF5406', '#D5D399', '#0AAFF6']}
          style={[styles.imageContainer]}
        >
          <Text pointerEvents="none" style={styles.itemTitle}>
            {item.item.title?.length > 30 ? `${item.item.title?.slice(0, 30)}...` : item.item.title}
          </Text>
          <Image
            source={{
              uri: item.item.cover,
            }}
            style={styles.image}
          />

          <View style={styles.position}>
            <Text style={styles.addedTo} numberOfLines={1}>
              {`${t('AddedTo')} ${item.babl?.title} Babl`}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Image source={{ uri: item.user?.photo }} style={styles.pp} />
              <View>
                <Text numberOfLines={2} style={styles.name}>
                  {item.user.username}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.blurIcon}>
            <ItemTypeIcon iconType={item.type ? item.type.split('_')[0] : 'MIXED'} />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };
  return (
    <FlatList
      numColumns={2}
      contentContainerStyle={styles.contentContainerStyle}
      data={listSendedRequestsQuery.data}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    alignItems: 'center',
  },
  imageContainer: {
    borderRadius: 22,
    width: sizes.width / 2.02,
    height: sizes.width / 2.02,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
  },
  image: {
    borderRadius: 22,
    width: sizes.width / 2.07,
    height: sizes.width / 2.07,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addedTo: {
    flex: 1,
    marginBottom: 5,
    color: '#FFF',
    fontFamily: fonts.roboto,
    marginLeft: 5,
    fontSize: 11,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2, // Sadece Android için gerekliadowColor: 'rgba(0, 0, 0, 0.5)',
  },
  name: {
    color: '#FFF',
    fontFamily: fonts.roboto,
    marginLeft: 5,
    fontSize: 11,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2, // Sadece Android için gerekliadowColor: 'rgba(0, 0, 0, 0.5)',
  },

  pp: {
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: '#CDCDCD',
  },
  position: {
    position: 'absolute',
    zIndex: 99,
    bottom: 10,
    left: 7,
  },
  blur: {
    width: 28,
    height: 28,
    borderRadius: 99,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurIcon: {
    position: 'absolute',
    bottom: 18,
    zIndex: 99,
    height: 10,
    right: 10,
  },
  itemTitle: {
    color: '#FFF',
    fontFamily: fonts.roboto,
    top: 5,
    position: 'absolute',
    zIndex: 99,
    left: 10,
    fontSize: 12,
    shadowOpacity: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowColor: '#000',
    textShadowRadius: 1,
    shadowRadius: 13,
    elevation: 5,
  },
});

export default SentRequests;

import React from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import FastImage from 'react-native-fast-image';
import Animated from 'react-native-reanimated';
import { BoxShadow } from 'react-native-shadow';

import SkeletonImage from '../../components/SkeletonImage';
import routes from '../../constants/routes';
import { sizes, colors } from '../../theme';
import fonts from '../../theme/fonts';
import i18n from '../../utils/i18n-setup';
import * as Queries from '../../utils/queries';
import { bablCategoriesIcon } from '../createbabl/CreateBabl';

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);

const FavoriteItem = ({ item: followItem, index, getAllData }) => {
  const [seen, setSeen] = React.useState(false);

  const navigation = useNavigation();

  if (followItem.skip) return <View swapShadows style={styles.items} />;

  const unknownItemCount = followItem.activeItems?.filter((activeId) => {
    return !followItem.knownItems.includes(activeId);
  }).length;
  const item = followItem.followingBabl;

  return (
    <View swapShadows style={styles.items}>
      <TouchableOpacity
        onPress={() => {
          Queries.updateKnownItems(item._id).then(() => {
            return setSeen(true);
          });

          const allData = getAllData().map((item) => {
            return item.followingBabl;
          });

          return navigation.navigate(routes.DetailList, {
            item,
            allData: [allData],
            categoryIndex: 0,
            itemIndex: index,
          });
        }}
      >
        <Animated.View sharedTransitionTag={item._id}>
          <Text style={styles.text}>
            {item.title?.length > 20 ? `${item?.title?.slice(0, 30)}...` : item?.title}
          </Text>
          <SkeletonImage
            ImageComponent={AnimatedFastImage}
            uri={item.cover}
            style={styles.weeklyPost}
            sharedTransitionTag={item._id}
          />
          <View style={styles.position}>
            <Image source={{ uri: item.user.photo }} style={styles.pp} />
            <View>
              <Text style={styles.name}>{item.user.username}</Text>

              {false && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: 5,
                  }}
                >
                  <Image
                    source={require('../../assets/reload.png')}
                    style={{
                      width: 5,
                      height: 5,
                      shadowOpacity: 10,
                      shadowColor: 'rgba(0, 0, 0, 0.5)',
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },

                      shadowRadius: 13,
                      elevation: 5,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 7,
                      color: '#FFF',
                      marginLeft: 2,
                      fontFamily: 'Roboto-Italic',
                      shadowOpacity: 10,
                      textShadowColor: 'rgba(0, 0, 0, 0.5)',
                      shadowColor: 'rgba(0, 0, 0, 0.5)',
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      textShadowColor: 'rgba(0, 0, 0, 0.5)',
                      textShadowRadius: 1,
                      shadowRadius: 13,
                      elevation: 5,
                    }}
                  >
                    {i18n.language == 'en' ? (
                      <>
                        {t('rebabledby')}
                        {' '}
                        {item.repostedBy.username}
                      </>
                    ) : (
                      <>
                        {item.repostedBy.username}
                        {' '}
                        {t('rebabledby')}
                      </>
                    )}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {Platform.OS == 'ios' ? (
            <View style={styles.blurIcon}>
              <Image
                resizeMode="contain"
                source={bablCategoriesIcon[item.category]}
                style={styles.categoryIcon}
              />
            </View>
          ) : (
            <View style={styles.blurIcon}>
              <BoxShadow
                setting={{
                  width: 20,
                  height: 20,
                  color: '#E5E5E5',
                  border: 10,
                  radius: 10,
                  opacity: 0.5,
                  x: 0,
                  y: 2,
                  style: {
                    justifyContent: 'center',
                    left: 9,
                    top: 2,
                    alignItems: 'center',
                  },
                }}
              >
                <Image
                  resizeMode="contain"
                  source={bablCategoriesIcon[item.category]}
                  style={styles.categoryIcon}
                />
              </BoxShadow>
            </View>
          )}
        </Animated.View>
      </TouchableOpacity>

      {unknownItemCount > 0 && !seen && <View style={styles.notifBadge} />}
    </View>
  );
};

const Favorites = () => {
  const queryClient = useQueryClient();

  const followingBablsQuery = useQuery(['FOLLOWING_BABLS'], Queries.getFollowingBabls, {
    placeholderData: [],
  });

  useFocusEffect(
    React.useCallback(() => {
      queryClient.invalidateQueries(['FOLLOWING_BABLS']);
    }, []),
  );

  const flattenedData = [
    ...followingBablsQuery.data,
    ...Array.from({
      length: followingBablsQuery.data.length % 3,
    }).fill({ skip: true }),
  ];

  const renderItem = ({ item, index }) => {
    return (
      <FavoriteItem
        item={item}
        index={index}
        getAllData={() => {
          return followingBablsQuery.data;
        }}
      />
    );
  };

  const { t, i18n } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <View style={styles.container}>
          <SafeAreaView />

          <View style={styles.header}>
            <Text style={styles.title}>{t('FollowedBabls')}</Text>
          </View>

          {flattenedData?.length === 0 && !followingBablsQuery.isFetching ? (
            <View
              style={{
                alignItems: 'center',
                marginTop: 100,
              }}
            >
              <Image
                resizeMode="contain"
                style={{
                  width: 140,
                  height: 140,
                  tintColor: 'white',
                }}
                source={require('../../assets/folder.png')}
              />
              <Text
                style={{
                  fontSize: 14,
                  color: '#9C9C9C',
                  fontFamily: fonts.regular,
                  marginTop: 10,
                }}
              >
                {t('YouDontYet')}
              </Text>
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.contentContainerStyle}>
              <FlatList
                data={flattenedData}
                numColumns={3}
                columnWrapperStyle={styles.columnWrapperStyle}
                renderItem={renderItem}
              />
            </ScrollView>
          )}
        </View>
      </View>
    </View>
  );
};

export default Favorites;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0E0E',

    zIndex: 99,
  },
  items: {
    borderRadius: 14,
    width: sizes.width / 3.07,
    height: sizes.width / 3.07,
    elevation: 5,
    shadowColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifBadge: {
    width: 16,
    height: 16,
    borderRadius: 16,
    position: 'absolute',
    right: 5,
    top: 5,
    backgroundColor: 'red',
  },
  weeklyPost: {
    borderRadius: 14,
    width: sizes.width / 3.07,
    height: sizes.width / 3.07,

    justifyContent: 'center',
    alignItems: 'center',
  },

  contentContainerStyle: {
    flex: 1,
    marginTop: 5,
  },
  header: {
    alignItems: 'center',
    padding: 10,
    width: sizes.width,
    borderBottomColor: '#323232',
    borderBottomWidth: 1,
    alignSelf: 'center',
    height: sizes.width / 8,
  },

  title: {
    color: colors.white,
    fontSize: 18,
    fontFamily: fonts.roboto,
  },

  columnWrapperStyle: {
    marginTop: 3,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: sizes.width / 1,
    alignSelf: 'center',
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
    bottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
    left: 5,
  },
  blurIcon: {
    position: 'absolute',
    bottom: 8,
    zIndex: 99,
    right: 8,
  },
  name: {
    color: '#FFF',
    fontFamily: fonts.roboto,
    marginLeft: 5,
    fontSize: 10,
    shadowRadius: 10,
    elevation: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOpacity: 3,
    zIndex: 99,
    shadowOffset: { width: 3, height: 2 },
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowOffset: { width: 3, height: 2 },
        shadowOpacity: 3,
        shadowRadius: 2,
      },
      android: {
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        elevation: 5, // Android'de gölge için
      },
    }),
  },
  text: {
    color: '#FFF',
    fontFamily: fonts.roboto,
    top: 5,
    position: 'absolute',
    zIndex: 99,
    left: 5,
    fontSize: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOpacity: 3,
    shadowOffset: { width: 3, height: 2 },
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    elevation: 5,
    width: sizes.width / 4,

    textShadowRadius: 1,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowOffset: { width: 3, height: 2 },
        shadowOpacity: 3,
        shadowRadius: 2,
      },
      android: {
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        elevation: 5, // Android'de gölge için
      },
    }),
  },
  categoryIcon: {
    width: 14,
    height: 14,
    tintColor: '#FFF',
  },
});

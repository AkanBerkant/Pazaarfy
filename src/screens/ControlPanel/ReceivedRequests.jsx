import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';

import ItemTypeIcon from '../../components/ItemTypeIcon';
import routes from '../../constants/routes';
import { sizes } from '../../theme';
import fonts from '../../theme/fonts';
import * as Queries from '../../utils/queries';

const ReceivedRequests = () => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();

  const listReceivedRequestsQuery = useQuery(
    ['LIST_RECEIVED_REQUESTS'],
    Queries.listReceivedBablRequests,
    {
      placeholderData: [],
      cacheTime: 0,
    },
  );

  const approveRequestMutation = useMutation(Queries.approveRequest, {
    onSuccess: (res) => {
      Alert.alert(t('requestAccepted'));
      queryClient.invalidateQueries(['LIST_RECEIVED_REQUESTS']);
    },
  });

  const denyRequestMutation = useMutation(Queries.denyRequest, {
    onSuccess: (res) => {
      Alert.alert(t('requestDenied'));
      queryClient.invalidateQueries(['LIST_RECEIVED_REQUESTS']);
    },
  });

  const renderItemRight = ({ item }) => {
    return (
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        colors={['#FF5406', '#D5D399', '#0AAFF6']}
        style={{
          width: sizes.width / 4.3,
          height: sizes.width / 4.2,
          borderRadius: 13,
          margin: 2,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text pointerEvents="none" style={styles.itemTitle}>
          {item.title?.length > 30 ? `${item.title?.slice(0, 30)}...` : item.title}
        </Text>

        <Image
          style={{
            width: sizes.width / 4.6,
            height: sizes.width / 4.6,
            borderRadius: 13,
          }}
          source={{
            uri: 'http://themestarz.net/html/housing/assets/img/image-05.jpg',
          }}
        />

        <View style={styles.position}>
          <Image source={{ uri: item.user?.photo }} style={styles.pp} />
          <View>
            <Text numberOfLines={2} style={styles.name}>
              {item.name}
            </Text>
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
                    shadowColor: '#000',
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
                    textShadowRadius: 2,
                    shadowOpacity: 10,
                    textShadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },

                    shadowRadius: 13,
                    elevation: 5,
                  }}
                >
                  {i18n.language === 'en' ? (
                    <>
                      {t('rebabledby')}

                      {item.repostedBy.username}
                    </>
                  ) : (
                    <>
                      {item.repostedBy.username}

                      {t('rebabledby')}
                    </>
                  )}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.blurIcon}>
          <ItemTypeIcon iconType={item.type ? item.type.split('_')[0] : 'MIXED'} />
        </View>
      </LinearGradient>
    );
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.row}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          colors={['#FF5406', '#D5D399', '#0AAFF6']}
          style={[styles.imageContainer]}
        >
          <Text pointerEvents="none" style={styles.itemTitle}>
            {item.title?.length > 30 ? `${item.title?.slice(0, 30)}...` : item.title}
          </Text>

          <Image
            style={styles.image}
            source={{
              uri: item.cover,
            }}
          />

          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            colors={['#FF5406', '#D5D399', '#0AAFF6']}
            style={{
              position: 'absolute',
              right: 10,
              width: 25,
              height: 25,
              top: 10,
              borderRadius: 20,
              backgroundColor: '#FFF',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                width: 20,
                height: 20,

                borderRadius: 20,
                backgroundColor: '#000',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  color: '#FFF',
                  fontFamily: fonts.roboto,
                }}
              >
                {item.requestsAcc.length}
              </Text>
            </View>
          </LinearGradient>

          <View style={styles.position}>
            <Image source={{ uri: item.user?.photo }} style={styles.pp} />
            <View>
              <Text numberOfLines={2} style={styles.name}>
                {item.user?.username}
              </Text>
            </View>
          </View>

          <View style={styles.blurIcon}>
            <ItemTypeIcon iconType={item.type ? item.type.split('_')[0] : 'MIXED'} />
          </View>
        </LinearGradient>

        <ScrollView showsHorizontalScrollIndicator={false} horizontal>
          {item.requestsAcc.map((requestItem, index) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(routes.BablContentList, {
                    items: [requestItem.item],
                    itemIndex: 0,
                    showNext: false,
                  });
                }}
              >
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  colors={['#FF5406', '#D5D399', '#0AAFF6']}
                  style={{
                    width: sizes.width / 3.6,
                    height: sizes.width / 3.6,
                    borderRadius: 13,
                    margin: 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text pointerEvents="none" style={styles.itemTitle}>
                    {requestItem.title?.length > 30
                      ? `${requestItem.title?.slice(0, 30)}...`
                      : requestItem.title}
                  </Text>

                  <Image
                    style={{
                      width: sizes.width / 3.8,
                      height: sizes.width / 3.8,
                      borderRadius: 13,
                    }}
                    source={{
                      uri: requestItem.item.cover,
                    }}
                  />
                  <View
                    style={{
                      position: 'absolute',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        Alert.alert(t('areYouSureToAcceptInteraction'), null, [
                          {
                            text: t('no'),
                          },
                          {
                            text: t('yes'),
                            onPress: () => {
                              approveRequestMutation.mutate({
                                interactionId: requestItem._id,
                              });
                            },
                          },
                        ]);
                      }}
                    >
                      <Image style={styles.icon} source={require('../../assets/ch.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        Alert.alert(t('areYouSureToDenyInteraction'), null, [
                          {
                            text: t('no'),
                          },
                          {
                            text: t('yes'),
                            onPress: () => {
                              denyRequestMutation.mutate({
                                interactionId: requestItem._id,
                              });
                            },
                          },
                        ]);
                      }}
                    >
                      <Image style={styles.icon} source={require('../../assets/ds.png')} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.position}>
                    <Image source={{ uri: requestItem.user.photo }} style={styles.pp} />
                    <View>
                      <Text numberOfLines={2} style={styles.name}>
                        {requestItem.user.username}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.blurIcon}>
                    <ItemTypeIcon iconType={item.type ? item.type.split('_')[0] : 'MIXED'} />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };
  return <FlatList data={listReceivedRequestsQuery.data} renderItem={renderItem} />;
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    alignItems: 'center',
  },
  imageContainer: {
    borderRadius: 22,
    width: sizes.width / 2.3,
    height: sizes.width / 2.3,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
  },
  image: {
    borderRadius: 22,
    width: sizes.width / 2.4,
    height: sizes.width / 2.4,
    justifyContent: 'center',
    alignItems: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
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
    top: 10,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    width: 34,
    height: 22,
  },
});

export default ReceivedRequests;

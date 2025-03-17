import React from 'react';
import {
  Image, Platform, StyleSheet, Text, View, ImageBackground,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { Asset } from 'expo-asset';
import { useTranslation } from 'react-i18next';
import FastImage from 'react-native-fast-image';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { BoxShadow } from 'react-native-shadow';

import CustomVideo from '../../../components/CustomVideo';
import SkeletonImage from '../../../components/SkeletonImage';
import routes from '../../../constants/routes';
import { sizes } from '../../../theme';
import fonts from '../../../theme/fonts';
import { bablCategoriesIcon } from '../../createbabl/CreateBabl';

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);

const DailyItem = ({
  item, index, isPlaying, isFocused, shouldPlay, onFinish, getAllData,
}) => {
  const [localAsset, setLocalAsset] = React.useState();

  React.useEffect(() => {
    if (isPlaying && !item.coverVideoCropped) {
      onFinish?.();
    }
  }, [isPlaying]);

  React.useEffect(() => {
    if (item.coverVideoCropped && !localAsset && isPlaying) {
      Asset.loadAsync([item.coverVideoCropped]).then((res) => {
        setLocalAsset(res[0].localUri);
      });
    }
  }, [localAsset, isPlaying]);

  const navigation = useNavigation();

  const onPlaybackStatusUpdate = (st) => {
    if (st.didJustFinish) {
      onFinish?.();
    }
  };

  const { t, i18n } = useTranslation();

  const videoItem = (
    <CustomVideo
      source={{ uri: localAsset }}
      style={styles.dailyPost}
      resizeMode={Platform.OS === 'ios' ? null : 'contain'}
      shouldPlay={shouldPlay}
      onPlaybackStatusUpdate={onPlaybackStatusUpdate}
    />
  );

  const imgItem = (
    <SkeletonImage ImageComponent={AnimatedFastImage} uri={item.cover} style={styles.dailyPost} />
  );

  return (
    <View>
      <View swapShadows style={styles.items}>
        <Text style={styles.text} pointerEvents="none">
          {item.title?.length > 30 ? `${item.title?.slice(0, 30)}...` : item.title}
        </Text>

        {index == 0 ? (
          <ImageBackground
            style={[
              styles.rankContainer,
              {
                backgroundColor: null,
              },
            ]}
            source={require('../../../assets/gold.png')}
          >
            <Text style={styles.rank}>{index + 1}</Text>
          </ImageBackground>
        ) : index == 1 ? (
          <ImageBackground
            style={[
              styles.rankContainer,
              {
                backgroundColor: null,
              },
            ]}
            source={require('../../../assets/silver.png')}
          >
            <Text style={styles.rank}>{index + 1}</Text>
          </ImageBackground>
        ) : index == 2 ? (
          <ImageBackground
            style={[
              styles.rankContainer,
              {
                backgroundColor: null,
              },
            ]}
            source={require('../../../assets/bronze.png')}
          >
            <Text style={styles.rank}>{index + 1}</Text>
          </ImageBackground>
        ) : (
          <View style={styles.rankContainer}>
            <Text style={styles.rank}>{index + 1}</Text>
          </View>
        )}

        <TouchableOpacity
          key={item._id}
          onPress={() => {
            onFinish?.();
            navigation.navigate(routes.DetailList, {
              item,
              allData: getAllData(),
              categoryIndex: 0,
              itemIndex: index,
              showIndex: true,
            });
          }}
        >
          <Animated.View>
            {localAsset && isPlaying && isFocused ? videoItem : imgItem}
            {item.user && (
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
                        source={require('../../../assets/reload.png')}
                        style={{
                          width: 5,
                          height: 5,
                          shadowOpacity: 10,
                          shadowColor: 'rgba(0, 0, 0, 0.8)',
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
                          shadowColor: 'rgba(0, 0, 0, 0.8)',
                          shadowOffset: {
                            width: 0,
                            height: 2,
                          },
                          textShadowColor: 'rgba(0, 0, 0, 0.8)',
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
                            {' '}
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
            )}

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
                      left: 10,
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
      </View>
    </View>
  );
};

export default React.memo(DailyItem);

const styles = StyleSheet.create({
  items: {
    borderRadius: 13.18,
    shadowRadius: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.2,
    backgroundColor: '#000',
    margin: 2,
    elevation: 5,
  },
  dailyPost: {
    borderRadius: 13.18,
    width: sizes.width / 2.04,
    height: sizes.width / 2.04,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
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
  blur: {
    width: 28,
    height: 28,
    borderRadius: 99,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurIcon: {
    position: 'absolute',
    bottom: 12,
    zIndex: 99,
    right: 12,
  },
  name: {
    color: '#FFF',
    fontFamily: fonts.roboto,
    marginLeft: 5,
    fontSize: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOpacity: 3,
    zIndex: 99,
    shadowOffset: { width: 3, height: 2 },
    shadowColor: 'rgba(0, 0, 0, 0.8)',
    elevation: 5,

    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.8)',
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
    left: 8,
    fontSize: 11,
    shadowOpacity: 10,
    shadowColor: 'rgba(0, 0, 0, 0.8)',

    width: sizes.width / 4,
    shadowRadius: 13,
    elevation: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowRadius: 1,

    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.8)',
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
  rankContainer: {
    top: 5,
    position: 'absolute',
    zIndex: 99,
    right: 5,
    backgroundColor: '#343535',
    justifyContent: 'center',
    alignItems: 'center',
    width: 15,
    height: 15,
    borderRadius: 14,
  },
  rank: {
    fontFamily: fonts.roboto,
    fontSize: 8,
    color: '#FFF',
    textAlign: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.8)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,

    elevation: 2, // Sadece Android için gerekliadowColor: 'rgba(0, 0, 0, 0.5)',

    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.8)',
        shadowOffset: { width: 0, height: 2 },
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
    width: 21,
    height: 21,
    tintColor: '#FFF',
    shadowColor: 'rgba(0, 0, 0, 0.8)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 3,
    shadowRadius: 2,
  },
});

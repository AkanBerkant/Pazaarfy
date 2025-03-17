import React, { useContext } from 'react';
import {
  StyleSheet, View, TouchableOpacity, ImageBackground, Text, Image,
} from 'react-native';

import { StackActions, useNavigation } from '@react-navigation/native';
import { Asset } from 'expo-asset';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { useAnimatedStyle, withRepeat } from 'react-native-reanimated';
import Video from 'react-native-video';

import routes from '../../constants/routes';
import { BablUrlContext } from '../../screens/BablContent/BablContent';
import { sizes } from '../../theme';
import fonts from '../../theme/fonts';
import { getPlatformFromUrl, platformColors, platformLogos } from '../../utils/platform-colors';
import ItemTypeIcon from '../ItemTypeIcon';
import TrashIcon from '../TrashIcon';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);
const AnimatedVideo = Animated.createAnimatedComponent(Video);

export const bgPhotos = [
  require('../../assets/bg_photos/1.png'),
  require('../../assets/bg_photos/2.png'),
  require('../../assets/bg_photos/3.png'),
  require('../../assets/bg_photos/4.png'),
  require('../../assets/bg_photos/5.png'),
  require('../../assets/bg_photos/6.png'),
  require('../../assets/bg_photos/7.png'),
  require('../../assets/bg_photos/8.png'),
  require('../../assets/bg_photos/9.png'),
  require('../../assets/bg_photos/10.png'),
  require('../../assets/bg_photos/11.png'),
  require('../../assets/bg_photos/12.png'),
  require('../../assets/bg_photos/13.png'),
  require('../../assets/bg_photos/14.png'),
  require('../../assets/bg_photos/15.png'),
  require('../../assets/bg_photos/16.png'),
];

const CoverImage = ({
  style, selectedStylesCover, onLoadEnd, uri, coverVideo,
}) => {
  const [imgRatio, setImgRatio] = React.useState(0);
  const [layoutRatio, setLayoutRatio] = React.useState(0);
  const [localAsset, setLocalAsset] = React.useState();

  React.useEffect(() => {
    if (!localAsset) {
      if (coverVideo) {
        Asset.loadAsync([coverVideo]).then((res) => {
          setLocalAsset(res[0].localUri);
        });
      } else if (uri.endsWith('mp4') || uri.endsWith('m3u8')) {
        Asset.loadAsync([uri]).then((res) => {
          setLocalAsset(res[0].localUri);
        });
      }
    }
  }, [localAsset]);

  React.useEffect(() => {
    Image.getSize(uri, (width, height) => {
      setImgRatio(width / height);
    });
  }, [uri]);

  const onLayout = (e) => {
    setLayoutRatio(e.nativeEvent.layout.width / e.nativeEvent.layout.height);
  };

  return (
    <ImageBackground
      onLayout={onLayout}
      source={{
        uri,
      }}
      style={styles.bg}
    >
      <BlurView tint="dark" intensity={10} style={styles.assetContainerParent}>
        <View style={styles.assetContainer}>
          {((imgRatio > 0 && layoutRatio > 0) || uri.endsWith('mp4') || uri.endsWith('m3u8')) && (
            <>
              {localAsset && false ? (
                <AnimatedVideo
                  style={[styles.asset, style, selectedStylesCover]}
                  resizeMode={
                    (imgRatio > 1 && layoutRatio > 1)
                    || (imgRatio < 1 && layoutRatio < 1)
                    || uri.endsWith('mp4')
                    || uri.endsWith('m3u8')
                      ? 'cover'
                      : 'contain'
                  }
                  source={{
                    uri: localAsset,
                  }}
                  shouldPlay
                  isLooping
                  onLoad={onLoadEnd}
                  isMuted
                />
              ) : (
                <AnimatedFastImage
                  style={[styles.asset, style, selectedStylesCover]}
                  resizeMode={
                    (imgRatio > 1 && layoutRatio > 1) || (imgRatio < 1 && layoutRatio < 1)
                      ? 'cover'
                      : 'contain'
                  }
                  source={{
                    uri,
                  }}
                  onLoadEnd={onLoadEnd}
                />
              )}
            </>
          )}
        </View>
      </BlurView>
    </ImageBackground>
  );
};

const TemplateItem = ({ data }) => {
  const navigation = useNavigation();
  const [layout, setLayout] = React.useState();
  const [loaded, setLoaded] = React.useState(!!data.cover);
  const randomBgRef = React.useRef(Math.floor(Math.random() * 16));
  const context = useContext(BablUrlContext);
  const {
    bablId,
    title,
    user,
    items,
    chunkFlattened,
    onNextPress,
    selectedBox,
    hoveredBox,
    removeItem,
  } = context || {};
  const { i18n } = useTranslation();

  const selectedStyles = useAnimatedStyle(() => {
    if (!selectedBox) return {};

    return {
      opacity: selectedBox.value === data.id ? 0.5 : 1,
      borderWidth: selectedBox.value === data.id ? 2 : 0,
      borderStyle: selectedBox.value === data.id ? 'dashed' : 'solid',
    };
  }, [data.id]);

  const hoveredStyles = useAnimatedStyle(() => {
    if (!hoveredBox) return {};

    return {
      borderWidth: hoveredBox.value === data.id ? 2 : 0,
      borderColor: hoveredBox.value === data.id ? 'red' : 'transparent',
    };
  }, [data.id]);

  const selectedStylesCover = useAnimatedStyle(() => {
    if (!selectedBox) return {};

    return {
      opacity: selectedBox.value === data.id ? 0.2 : 1,
    };
  });

  const iconType = data.type.split('_')[0];

  const onLoadEnd = () => {
    setLoaded(true);
  };

  const Cover = React.useMemo(() => {
    return (
      <CoverImage
        style={{ borderRadius: 12, opacity: loaded ? 1 : 0 }}
        selectedStylesCover={selectedStylesCover}
        iconType={iconType}
        uri={data?.cover}
        coverVideo={data?.coverVideo}
        data={data}
        onLoadEnd={onLoadEnd}
      />
    );
  }, [data?.cover, loaded]);

  if (!loaded && !!data.cover) {
    return (
      <View
        style={{ flex: 1 }}
        onLayout={(event) => {
          setLayout(event.nativeEvent.layout);
        }}
      >
        {layout && <>{!!data.cover && <>{Cover}</>}</>}
      </View>
    );
  }

  const getNextContent = (itemIndex) => {
    navigation.goBack();
    navigation.navigate(routes.BablContent, {
      bablId: items[itemIndex].url,
      cover: items[itemIndex].cover,
      onNextPress:
        items[itemIndex + 1]?.type === 'BABL_EMBED'
          ? () => {
            getNextContent(itemIndex + 1);
          }
          : null,
    });
  };

  const onPress = () => {
    if (data) {
      const itemIndex = items?.findIndex((item) => {
        return item.url === data.url;
      });

      /* if (data.type === 'BABL_EMBED' && items) {
        navigation.dispatch(
          StackActions.push(routes.BablContent, {
            bablId: items[itemIndex].url,
            cover: items[itemIndex].cover,
            onNextPress:
              items[itemIndex + 1]?.type === 'BABL_EMBED'
                ? () => {
                  getNextContent(itemIndex + 1);
                }
                : null,
          }),
        );
      } else */ if (items) {
        navigation.navigate(routes.BablContentList, {
          items: chunkFlattened,
          itemIndex: chunkFlattened?.findIndex((item) => {
            return item.url === data.url;
          }),
          onNextPress,
          title,
          bablId,
          bablUser: user,
        });
      } else {
        navigation.navigate(routes.BablContentList, {
          items: [data],
          itemIndex: 0,
          title,
          bablUser: user,
        });
      }
    }
  };

  const onProfilePress = () => {
    navigation.dispatch(
      StackActions.push(routes.UserProfile, {
        userId: data.metadata.user._id,
      }),
    );
  };

  const onRemovePress = () => {
    removeItem(data);
  };

  if (!data) {
    return null;
  }

  return (
    <>
      <AnimatedTouchableOpacity
        ref={data.ref}
        delayPressIn={50}
        style={[styles.item, selectedStyles, hoveredStyles]}
        onPress={onPress}
      >
        {!!data?.cover && data.type !== 'OTHER' ? (
          <>
            <Text numberOfLines={2} style={styles.title}>
              {data.title}
            </Text>

            {Cover}
            {data.type === 'BABL_EMBED' && data.metadata && (
              <TouchableOpacity onPress={onProfilePress} style={styles.userBtn}>
                <Image style={styles.userPhoto} source={{ uri: data.metadata.user.photo }} />
                <Text style={styles.username}>{data.metadata.user.username}</Text>
              </TouchableOpacity>
            )}

            <LinearGradient
              colors={[
                'rgba(0, 0, 0, 0.5)',
                'rgba(0, 0, 0, 0)',
                'rgba(0, 0, 0, 0)',
                'rgba(0, 0, 0, 0)',
                'rgba(0, 0, 0, 0)',
              ]}
              style={styles.darkGradient}
            />
          </>
        ) : (
          <ImageBackground
            resizeMode="cover"
            style={styles.blurBg}
            source={bgPhotos[randomBgRef.current]}
          >
            <BlurView
              tint="dark"
              intensity={10}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                padding: 10,
                backgroundColor: platformColors[getPlatformFromUrl(data.url)],
              }}
            >
              {platformLogos[getPlatformFromUrl(data.url)] && (
                <Image
                  source={platformLogos[getPlatformFromUrl(data.url)]}
                  resizeMode="contain"
                  style={{
                    height: 36,
                    tintColor: 'white',
                  }}
                />
              )}

              <Text numberOfLines={1} style={styles.title}>
                {data.title || data.url}
              </Text>
            </BlurView>
          </ImageBackground>
        )}

        {!!data.metadata?.addedBy && (
          <View style={styles.typeIconContainer}>
            <View
              style={{
                position: 'absolute',
                bottom: 10,
                left: 10,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}
            >
              <Image
                resizeMode="contain"
                style={{
                  width: 7,
                  height: 7,
                }}
                source={require('../../assets/plused.png')}
              />
              <Text
                style={{
                  color: '#fff',
                  fontFamily: 'Roboto-Italic',
                  fontSize: 8,
                  textShadowColor: 'rgba(0, 0, 0, 0.5)',
                  shadowOpacity: 3,
                  marginLeft: 3,
                  shadowOffset: { width: 3, height: 2 },
                  shadowColor: '#000',
                  elevation: 5,
                  width: sizes.width / 6,
                }}
              >
                {i18n.language === 'tr'
                  ? `${data.metadata.addedBy.username} tarafından eklendi`
                  : `added by ${data.metadata.addedBy.username}`}
              </Text>
            </View>
          </View>
        )}
        <View style={styles.typeIconContainer}>
          <View style={styles.typeIcon}>
            <ItemTypeIcon iconType={iconType} />
          </View>
        </View>
      </AnimatedTouchableOpacity>

      {removeItem && (
        <TouchableOpacity onPress={onRemovePress} style={styles.trashIcon}>
          <TrashIcon />
        </TouchableOpacity>
      )}
    </>
  );
};

export default TemplateItem;

const styles = StyleSheet.create({
  userBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userPhoto: {
    width: 20,
    height: 20,
    borderRadius: 20,
    marginLeft: 5,
    backgroundColor: '#CDCDCD',
  },
  username: {
    color: 'white',
    fontFamily: fonts.roboto,
    marginLeft: 5,
    fontSize: 11,
  },
  assetContainerParent: {
    flex: 1,
    justifyContent: 'center',
  },
  assetContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  asset: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 12,
    opacity: 1,
  },
  item: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: '#101010',
    overflow: 'hidden',
  },
  bg: {
    flex: 1,
  },
  trashIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2,
    width: 36,
    height: 36,
    borderRadius: 36,
    backgroundColor: '#0E0E0E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginTop: 15,
    fontSize: 15,
    color: '#FFF',
    fontFamily: fonts.roboto,
    paddingHorizontal: 20,
  },
  typeIcon: {
    position: 'absolute',
    bottom: 10,
    right: 2,
    backgroundColor: 'rgb(79, 79, 79, 0.2)',
    width: 24,
    height: 24,
    borderRadius: 24,

    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#FFF',
    fontFamily: fonts.roboto,
    color: '#FFF',
    top: 7,
    position: 'absolute',
    zIndex: 99,
    left: 10,
    fontSize: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOpacity: 3,
    shadowOffset: { width: 3, height: 2 },
    shadowColor: '#000',
    elevation: 5,
    marginRight: 12,
  },
  darkGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  blurBg: {
    flex: 1,
  },
});

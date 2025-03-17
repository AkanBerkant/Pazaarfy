import React from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { useAtom } from 'jotai';
import moment from 'moment';
import FastImage from 'react-native-fast-image';

import { bgPhotos } from '../../../../components/templates/TemplateItem';
import routes from '../../../../constants/routes';
import { sizes } from '../../../../theme';
import fonts from '../../../../theme/fonts';
import { bablFormAtom } from '../../../../utils/atoms';
import {
  getPlatformFromUrl,
  platformLogos,
} from '../../../../utils/platform-colors';

const checkdIcon = require('../../../../assets/checkd.png');
const checkredIcon = require('../../../../assets/checkred.png');

const SharedLibraryListItem = ({
  item,
  customCb,
  initialCheck = false,
  newItemSession = false,
}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [bablForm, setBablForm] = useAtom(bablFormAtom);
  const [checked, setChecked] = React.useState(initialCheck);
  const randomBgRef = React.useRef(Math.floor(Math.random() * 16));

  const { isCover, cb, bablId } = route.params;

  const onPress = () => {
    if (customCb) return customCb(setChecked);

    if (isCover) {
      return cb?.(item);
    }

    if (bablForm.items[item.type]?.[item.id]) {
      if (newItemSession) {
        navigation.goBack();
        navigation.goBack();
      }

      setBablForm((prev) => {
        const { [item.id]: extractedItem, ...rest } = prev.items[item.type];
        setChecked(false);

        return {
          ...prev,
          items: {
            ...prev.items,
            [item.type]: rest,
          },
        };
      });

      return;
    }

    setChecked(true);
    setBablForm((prev) => {
      return {
        ...prev,
        items: {
          ...prev.items,
          [item.type]: {
            ...(prev.items[item.type] || {}),
            [item.id]: {
              ...item,
              addedAt: moment().toDate(),
            },
          },
        },
      };
    });
    if (newItemSession) {
      navigation.goBack();
      navigation.goBack();
    }
  };

  const onLongPress = () => {
    navigation.navigate(routes.BablContentList, {
      items: [
        {
          ...item,
          type: item.resourceType,
        },
      ],
      itemIndex: 0,
      showNext: false,
    });
  };

  const title = React.useMemo(() => {
    const t = item.title || item.url;

    return t?.length > 30
      ? `${t?.slice(0, 30)}...`
      : t;
  }, [item.title, item.url]);

  return (
    <View
      swapShadows // <- change zIndex of each shadow color
      style={styles.item}
    >
      <TouchableOpacity onPress={onPress} onLongPress={onLongPress}>
        <View style={styles.row}>
          <View style={styles.left}>
            <View style={styles.row}>
              <View style={styles.justifyCenter}>
                <Text pointerEvents="none" style={styles.itemTitle}>
                  {title}
                </Text>

                {item.coverCopy || item.cover ? (
                  <FastImage
                    source={{ uri: item.coverCopy || item.cover }}
                    style={styles.itemImage}
                  />
                ) : (
                  <ImageBackground
                    source={bgPhotos[randomBgRef.current]}
                    style={[styles.itemImage, { overflow: 'hidden' }]}
                  >
                    <BlurView
                      style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                      }}
                      tint="dark"
                      intensity={10}
                    >
                      {platformLogos[getPlatformFromUrl(item.url)] && (
                        <Image
                          source={platformLogos[getPlatformFromUrl(item.url)]}
                          resizeMode="contain"
                          style={{
                            height: 36,
                            tintColor: 'white',
                          }}
                        />
                      )}
                    </BlurView>
                  </ImageBackground>
                )}
              </View>
              {!newItemSession && (
                <View
                  style={[
                    styles.checkBoxPosition,
                    { opacity: isCover || bablId ? 0 : 1 },
                  ]}
                >
                  {checked ? (
                    <Image style={styles.check} source={checkredIcon} />
                  ) : (
                    <Image style={styles.checkDisable} source={checkdIcon} />
                  )}
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SharedLibraryListItem;

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    color: '#000',
    marginTop: 20,
    textAlign: 'center',
  },

  image: {
    width: 120,
    height: 120,
    borderRadius: 6,
  },
  bottom: {
    shadowColor: '#EF5889',

    backgroundColor: '#FFF',

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 2,
    shadowRadius: 3.84,
    width: sizes.width,
  },
  deleteImage: {
    width: 75,
    height: 75,
    margin: 5,
  },
  marginBottom: {
    marginBottom: 5,
  },
  zIndex: {
    zIndex: 99,
  },
  descriptionItem: {
    marginLeft: 5,
    fontFamily: fonts.regular,
    width: sizes.width / 2,
    fontSize: 12,
    color: '#737373',
    marginTop: 5,
  },
  left: {
    marginLeft: 5,
  },
  deleteIcon: {
    width: 32,
    height: 32,
    position: 'absolute',
    right: -5,
  },
  item: {
    borderRadius: 13.18,
    width: sizes.width / 3.09,
    height: sizes.width / 3.09,
    elevation: 5,
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 }, // Negatif değer kullanarak üstten başlatma
    shadowOpacity: 0.3,
    backgroundColor: '#000',
    shadowRadius: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemImage: {
    margin: 0,
    borderRadius: 13.18,
    width: sizes.width / 3.1,
    height: sizes.width / 3.1,
    elevation: 5,
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 }, // Negatif değer kullanarak üstten başlatma
    shadowOpacity: 0.3,
    backgroundColor: '#000',
    shadowRadius: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
  },
  imageIn: {
    height: 50,
    width: 50,
    borderRadius: 12,
    position: 'absolute',
    zIndex: 99,
  },
  itemTitle: {
    color: '#FFF',
    fontFamily: fonts.roboto,
    top: 5,
    position: 'absolute',
    zIndex: 99,
    left: 5,
    fontSize: 11,
    shadowOpacity: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    width: sizes.width / 4,
    shadowRadius: 13,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkBoxPosition: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  checkDisable: {
    width: 26,
    height: 26,
  },
  check: {
    width: 26,
    height: 26,
  },
  playContainer: {
    width: 30,
    height: 30,
    borderRadius: 30,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',

    position: 'absolute',
    top: -5,
    right: -32,
  },
  play: {
    width: 15,
    height: 15,
  },
  justifyCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

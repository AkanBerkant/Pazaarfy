import React from 'react';
import {
  Alert, Image, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import { useAtom } from 'jotai';
import moment from 'moment';

import routes from '../../../../constants/routes';
import { sizes } from '../../../../theme';
import fonts from '../../../../theme/fonts';
import { bablFormAtom } from '../../../../utils/atoms';

const BablSearchListItem = ({ item, newItemSession }) => {
  const route = useRoute();
  const navigation = useNavigation();
  const [bablForm, setBablForm] = useAtom(bablFormAtom);

  const { isCover, cb, bablId } = route.params;

  return (
    <TouchableOpacity
      onPress={() => {
        if (isCover) {
          return cb?.(item);
        }

        if (bablForm.items[item.type]?.[item.id]) {
          setBablForm((prev) => {
            const { [item.id]: extractedItem, ...rest } = prev.items[item.type];

            return {
              ...prev,
              items: {
                ...prev.items,
                [item.type]: rest,
              },
            };
          });

          if (newItemSession) {
            navigation.goBack();
            navigation.goBack();
          }

          return;
        }

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
      }}
      key={item.id}
      style={styles.item}
    >
      <View style={styles.row}>
        <View style={styles.left}>
          <View style={styles.row}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(routes.BablContentList, {
                  items: [item],
                  itemIndex: 0,
                  showNext: false,
                });
              }}
            >
              <Text pointerEvents="none" style={styles.itemTitle} numberOfLines={2}>
                {item.title}
              </Text>
            </TouchableOpacity>

            <View style={styles.justifyCenter}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(routes.BablContentList, {
                    items: [item],
                    itemIndex: 0,
                    title: item.title,
                  });
                }}
              >
                <Image source={{ uri: item.cover }} style={styles.itemImage} />
              </TouchableOpacity>
            </View>
            <View style={[styles.checkBoxPosition, { opacity: isCover || bablId ? 0 : 1 }]}>
              {bablForm.items[item.type]?.[item.id] ? (
                <Image style={styles.check} source={require('../../../../assets/checkred.png')} />
              ) : (
                <Image
                  style={styles.checkDisable}
                  source={require('../../../../assets/checkd.png')}
                />
              )}
            </View>
          </View>

          <Text style={styles.descriptionItem} numberOfLines={3}>
            {item.description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default BablSearchListItem;

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    color: '#000',
    marginTop: 20,
    textAlign: 'center',
  },
  description: {
    color: '#6A6A6A',
    textAlign: 'center',
    marginTop: 7,
    fontSize: 12,
    width: sizes.width / 1.2,
    alignSelf: 'center',
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
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    width: sizes.width / 1.07,
    alignSelf: 'center',
    padding: 5,
  },
  itemImage: {
    height: sizes.width / 5,
    width: sizes.width / 2.9,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    marginLeft: 5,
    marginTop: 5,
  },
  imageIn: {
    height: 50,
    width: 50,
    borderRadius: 12,
    position: 'absolute',
    zIndex: 99,
  },
  itemTitle: {
    marginLeft: 5,
    fontFamily: fonts.roboto,
    width: sizes.width / 2,
    fontSize: 14,
    color: '#FFF',
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
    width: 31,
    height: 31,
  },
  check: {
    width: 31,
    height: 31,
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

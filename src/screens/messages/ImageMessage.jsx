import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import dynamicLinks from '@react-native-firebase/dynamic-links';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { t } from 'i18next';

import routes from '../../constants/routes';
import { sizes } from '../../theme';
import fonts from '../../theme/fonts';
import * as Queries from '../../utils/queries';
import HomeItem from '../tab/Home/HomeItem';

import TextMessage from './TextMessage';

const ImageMessage = ({
  content, text, isSender, date, ...rest
}) => {
  const navigation = useNavigation();

  const getCoverQuery = useQuery(['GET_BABL_COVER', content.text], async () => {
    const res = await dynamicLinks().resolveLink(content.text);
    const url = new URL(res.url);
    const bablId = url.searchParams.get('bablId');
    const itemId = url.searchParams.get('itemId');

    const data = await Queries.getBablById(bablId);

    return { bablId, itemId, babl: data.babl };
  });

  if (!getCoverQuery.isSuccess) {
    return (
      <View
        style={{
          width: sizes.width / 2.42,
          height: sizes.width / 2.42,
          borderRadius: 13.18,
          elevation: 5,
        }}
      />
    );
  }

  if (!getCoverQuery.data.babl) {
    return (
      <TextMessage
        {...rest}
        text={t('ThisByUser')}
        isSender={isSender}
        textStyle={{
          fontStyle: 'italic',
        }}
      />
    );
  }

  const { bablId, itemId, babl } = getCoverQuery.data;

  const onMessagePress = () => {
    if (itemId) {
      const nextRoutes = [
        ...navigation.getState().routes,
        {
          name: routes.BablContent,
          params: {
            bablId,
            cover: babl.cover,
          },
        },
        {
          name: routes.BablContentList,
          params: {
            items: babl.items,
            itemIndex: babl.items.findIndex((item) => {
              return item.id === itemId;
            }),
            title: babl.title,
          },
        },
      ];

      navigation.dispatch(
        CommonActions.reset({
          routes: nextRoutes,
          index: nextRoutes.length - 1,
        }),
      );
    } else {
      navigation.navigate(routes.HotBablDetail, {
        _id: bablId,
      });
    }
  };

  return (
    <View
      style={{
        alignItems: 'flex-end',
        marginLeft: 10,
      }}
    >
      <HomeItem
        item={babl}
        index="CUSTOM_MESSAGE"
        onPress={onMessagePress}
        categoryIndex="CUSTOM_MESSAGE"
      />
      {/* <Text style={styles.date}>{date}</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  date: { color: '#76777B', fontFamily: fonts.avenir },
});

export default ImageMessage;

import React from 'react';
import {
  ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, View,
} from 'react-native';

import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { useTranslation } from 'react-i18next';
import { TextInput } from 'react-native-gesture-handler';

import { BackHeader, ButtonLinear, Container } from '../../../../components';
import { notify } from '../../../../helpers/notify';
import { sizes } from '../../../../theme';
import fonts from '../../../../theme/fonts';
import { bablFormAtom } from '../../../../utils/atoms';
import * as Queries from '../../../../utils/queries';

import BablSearchSelectedItem from './BablSearchSelectedItem';
import SharedLibraryListItem from './SharedLibraryListItem';

const SharedLibrary = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const searchTextRef = React.useRef('');
  const queryClient = useQueryClient();
  const bablForm = useAtomValue(bablFormAtom);
  const { t } = useTranslation();

  const { isCover = false, bablId = false, newItemSession = false } = route.params;
  const title = 'Share Library';
  const type = 'SHARED_SAVINGS';

  const {
    data, isRefetching, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage,
  } = useInfiniteQuery(
    ['SHARED_SAVINGS_PAGINATION', isCover],
    ({ pageParam = 0 }) => {
      return Queries.searchResourcesPagination({ page: pageParam, isCover });
    },
    {
      placeholderData: {
        pages: [
          {
            nextPageCursor: 1,
            page: [],
          },
        ],
      },
      getNextPageParam: (lastPage) => {
        return lastPage.nextPageCursor;
      },
      cacheTime: 0,
    },
  );

  const dataList = data.pages.reduce((prev, cur) => {
    return [...prev, ...cur.page];
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      queryClient.invalidateQueries(['SEARCH_BABL_API']);
    }, []),
  );

  const renderDeleteImage = ({ item }) => {
    return <BablSearchSelectedItem item={{ ...item, cover: item.coverCopy }} />;
  };

  const renderItem = ({ item }) => {
    return (
      <SharedLibraryListItem
        item={{ ...item, cover: item.coverCopy }}
        newItemSession={newItemSession}
      />
    );
  };

  const onSubmitEditing = () => {
    queryClient.invalidateQueries(['SEARCH_BABL_API']);
  };

  const onContinuePress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Container header={<BackHeader bold title={title} />}>
        {/* <Text style={styles.description}>{description}</Text> */}
        <View style={styles.top} />
        <TextInput
          placeholder={t('Search')}
          style={styles.input}
          returnKeyType="search"
          onChangeText={(text) => {
            return (searchTextRef.current = text);
          }}
          onSubmitEditing={onSubmitEditing}
          placeholderTextColor="#AEAEAE"
        />

        <View style={styles.top} />

        {dataList.length === 0 && !isFetching ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            data={dataList}
            numColumns={3}
            keyExtractor={(item) => {
              return item.id;
            }}
            renderItem={renderItem}
            onEndReached={() => {
              if (hasNextPage) {
                fetchNextPage();
              }
            }}
            ListHeaderComponent={() => {
              return (
                <Text style={{
                  color: '#FFF',
                  alignSelf: 'center',
                  fontSize: 17,
                  paddingTop: 5,
                  paddingBottom: 20,
                  fontFamily: fonts.roboto,
                }}
                >
                  {t('longPressToSee')}
                </Text>
              );
            }}
            ListFooterComponent={
              isFetchingNextPage && (
                <ActivityIndicator
                  size="large"
                  color="#FFF"
                  style={{
                    marginVertical: 16,
                  }}
                />
              )
            }
          />
        )}
      </Container>
      <View style={styles.bottom}>
        {!(isCover || bablId || newItemSession) && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal
              data={
                bablForm.items[type]
                  ? Object.values(bablForm.items[type]).sort((a, b) => {
                    return +a.addedAt - b.addedAt;
                  })
                  : []
              }
              keyExtractor={(item) => {
                return item.id;
              }}
              renderItem={renderDeleteImage}
            />
          </ScrollView>
        )}

        {!bablId && (
          <View style={styles.marginBottom}>
            <ButtonLinear title={t('continue')} style={styles.button} onPress={onContinuePress} />
          </View>
        )}
      </View>
    </View>
  );
};

export default SharedLibrary;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 24,
    color: '#FFF',
    marginTop: 20,
    textAlign: 'center',
    fontFamily: fonts.roboto,
  },
  description: {
    color: '#6A6A6A',
    textAlign: 'center',
    marginTop: 12,
    fontSize: 12,
    width: sizes.width / 1.2,
    alignSelf: 'center',
  },
  input: {
    backgroundColor: '#181818',
    height: 47,
    alignSelf: 'center',
    color: '#FFF',
    borderRadius: 14,
    width: sizes.width / 1.07,
    marginTop: 10,
    padding: 10,
  },
  bottom: {
    backgroundColor: '#141414',
    padding: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 2,
    shadowRadius: 3.84,
    width: sizes.width,
  },
  marginBottom: {
    marginBottom: 5,
  },
  top: {
    marginTop: 20,
  },
});

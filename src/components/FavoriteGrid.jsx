import React from 'react';
import {
  Image, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

import routes from '../constants/routes';
import CustomGrid from '../CustomGrid';
import CustomRow from '../CustomRow';
import fonts from '../theme/fonts';

const GridItem = ({ item }) => {
  const navigation = useNavigation();

  if (!item) {
    return null;
  }

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(routes.HotBablDetail, item);
      }}
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
    >
      <Text
        numberOfLines={2}
        style={{
          fontSize: 15,
          fontFamily: fonts.avenir,
          fontWeight: '700',
          zIndex: 1,
          color: '#FFF',
          shadowOpacity: 1,

          elevation: 5,
          shadowColor: 'gray',
        }}
      >
        {item.title}
      </Text>

      <FastImage
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
        source={{
          uri: item.cover,
        }}
      />

      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: 9,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Image
          source={{ uri: item.user.photo }}
          style={{
            width: 20,
            height: 20,
            borderRadius: 20,
          }}
        />

        <Text
          numberOfLines={1}
          style={{
            flex: 1,
            fontFamily: fonts.avenir,
            marginLeft: 6,
            fontWeight: '700',
            color: '#FFF',
          }}
        >
          by
          {' '}
          {item.user.username}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const FavoriteGrid = ({ items }) => {
  return (
    <CustomGrid style={{ flex: 1, gap: 3, padding: 2 }}>
      <CustomRow size={40} style={styles.item}>
        <CustomGridItem item={items[0]} />
      </CustomRow>
      <CustomRow size={9} style={{ gap: 3 }}>
        <CustomRow size={1.5} style={styles.item}>
          <CustomGridItem item={items[1]} />
        </CustomRow>
        <CustomRow size={2.2} style={styles.item}>
          <CustomGridItem item={items[2]} />
        </CustomRow>
      </CustomRow>
      <CustomRow size={9} style={{ gap: 3 }}>
        <CustomRow size={1.5} style={styles.item}>
          <CustomGridItem item={items[3]} />
        </CustomRow>
        <CustomRow size={2.2} style={styles.item}>
          <CustomGridItem item={items[4]} />
        </CustomRow>
      </CustomRow>
      <CustomRow size={9} style={{ gap: 3 }}>
        <CustomRow size={1.5} style={styles.item}>
          <CustomGridItem item={items[5]} />
        </CustomRow>
        <CustomRow size={2.2} style={styles.item}>
          <CustomGridItem item={items[6]} />
        </CustomRow>
      </CustomRow>
    </CustomGrid>
  );
};

export default FavoriteGrid;

const styles = StyleSheet.create({
  item: { borderRadius: 7, overflow: 'hidden' },
});

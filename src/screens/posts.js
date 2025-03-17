import React from 'react';
import {
  Dimensions, FlatList, StyleSheet, View,
} from 'react-native';

import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import { sampleImages } from '../data/images';

const { width } = Dimensions.get('screen');

function Posts({ navigation }) {
  return (
    <View style={styles.container}>
      <FlatList
        data={sampleImages}
        numColumns={3}
        keyExtractor={(item) => {
          return item.id.toString();
        }}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => {
                return navigation.navigate('Detail', item);
              }}
            >
              <Animated.View sharedTransitionTag={item.id.toString()}>
                <Animated.Image
                  source={{ uri: item.uri }}
                  style={styles.post}
                  sharedTransitionTag={`${item.id.toString()}1`}
                />
              </Animated.View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

export default Posts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  post: {
    width: width / 3,
    height: width / 3,
  },
  row: { flexDirection: 'row', flexWrap: 'wrap' },
});

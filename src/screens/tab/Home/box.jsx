import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import Animated from 'react-native-reanimated';

import routes from '../../../constants/routes';
import { sizes } from '../../../theme';

import { MARGIN, SIZE } from './utils';

const Box = ({ count, key }) => {
  const backgroundColor = count % 2 === 0 ? '#6e48eb' : '#c0a946';

  const navigation = useNavigation();

  return (
    <TouchableOpacity
      key={count}
      onPress={() => { return navigation.navigate(routes.HotBablDetail, count); }}
    >
      {count == 0 ? (
        <Animated.View sharedTransitionTag={count?.toString()}>
          <Animated.Image
            source={{
              uri: 'https://plus.unsplash.com/premium_photo-1676667573119-40081df5d920?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2370&q=80',
            }}
            style={styles.weeklyPost}
            sharedTransitionTag={`${count?.toString()}1`}
          />
        </Animated.View>
      ) : count % 2 === 0 ? (
        <Animated.View sharedTransitionTag={count?.toString()}>
          <Animated.Image
            source={{
              uri: 'https://images.unsplash.com/photo-1682587177517-80523418eef7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2371&q=80',
            }}
            style={styles.weeklyPost}
            sharedTransitionTag={`${count?.toString()}1`}
          />
        </Animated.View>
      ) : (
        <Animated.View sharedTransitionTag={count?.toString()}>
          <Animated.Image
            source={{
              uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGVvcGxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
            }}
            style={styles.weeklyPost}
            sharedTransitionTag={`${count?.toString()}1`}
          />
        </Animated.View>
      )}
    </TouchableOpacity>
  );
};

export default Box;

const styles = StyleSheet.create({
  weeklyPost: {
    width: sizes.width / 2.1,
    height: sizes.width / 2.1,
    margin: 2,
    borderRadius: 13.18,
  },
});

import React from 'react';
import {
  FlatList, StyleSheet, View,
} from 'react-native';

import Emitter from '../../../utils/emitter';

import WeeklyItem from './WeeklyItem';

const WeeklyList = ({
  hotBablsOfWeek,
  loading,
  onScroll,
  isFocused,
  shouldPause = false,
}) => {
  const [playingIndex, setPlayingIndex] = React.useState(0);

  React.useEffect(() => {
    const listener = Emitter.on('RESET_HOT_BABLS', () => {
      setPlayingIndex(0);
    });

    return () => { return listener.remove(); };
  }, []);

  const onScrollX = (event) => {
    onScroll(event);
  };

  const onFinish = () => { return setPlayingIndex((prev) => { return prev + 1; }); };

  return (
    <FlatList
      data={hotBablsOfWeek}
      numColumns={3}
      showsVerticalScrollIndicator={false}
      bounces={false}
      keyExtractor={(item) => { return `week_${item._id}`; }}
      renderItem={({ item, index }) => {
        return (
          <WeeklyItem
            loading={loading}
            index={index}
            item={item}
            getAllData={() => { return [hotBablsOfWeek]; }}
            showRank
            isPlaying={index === playingIndex}
            shouldPlay={index === playingIndex && !shouldPause}
            isFocused={isFocused}
            onFinish={onFinish}
          />
        );
      }}
      ListFooterComponent={<View style={styles.footer} />}
      scrollEventThrottle={16}
      onScroll={onScrollX}
    />
  );
};

export default WeeklyList;

const styles = StyleSheet.create({
  footer: { height: 100 },
});

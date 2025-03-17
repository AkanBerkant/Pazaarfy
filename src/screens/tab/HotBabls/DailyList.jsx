import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { FlatList } from 'react-native-gesture-handler';

import { sizes } from '../../../theme';
import Emitter from '../../../utils/emitter';

import DailyItem from './DailyItem';

const DailyList = ({
  hotBablsOfDay,
  onScroll,
  loading,
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
      data={hotBablsOfDay}
      numColumns={2}
      showsVerticalScrollIndicator={false}
      renderItem={({ item, index }) => {
        return (
          <DailyItem
            loading={loading}
            index={index}
            item={item}
            getAllData={() => { return [hotBablsOfDay]; }}
            isPlaying={index === playingIndex}
            shouldPlay={index === playingIndex && !shouldPause}
            isFocused={isFocused}
            onFinish={onFinish}
          />
        );
      }}
      onScroll={onScrollX}
      keyExtractor={(item) => { return `DAILY_${item._id}`; }}
    />
  );
};

export default DailyList;

const styles = StyleSheet.create({});

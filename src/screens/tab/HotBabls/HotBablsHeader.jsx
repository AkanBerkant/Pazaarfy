import React from 'react';
import {
  Image, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';

import { useAtomValue } from 'jotai';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';

import { sizes } from '../../../theme';
import fonts from '../../../theme/fonts';
import { tabBarVisibleAtom } from '../../../utils/atoms';

const menu = [
  {
    time: 'Günlük',
  },
  {
    time: 'Haftalık',
  },
  {
    time: 'Aylık',
  },
];

const HotBablsHeader = ({ selected, toggleModal, setSelected }) => {
  const tabBarVisible = useAtomValue(tabBarVisibleAtom);
  const height = useSharedValue(0);

  React.useEffect(() => {
    if (tabBarVisible) {
      height.value = withTiming(0, { duration: 500 });
    } else {
      height.value = withTiming(-sizes.width / 4, { duration: 500 });
    }
  }, [tabBarVisible]);

  return (
    <Animated.View
      style={[
        styles.header,
        {
          transform: [
            {
              translateY: height,
            },
          ],
        },
      ]}
    >
      <TouchableOpacity onPress={toggleModal}>
        <Image
          source={require('../../../assets/drawer.png')}
          style={styles.drawer}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <View style={styles.left}>
        {menu.map((item, index) => {
          const isSelected = selected === index;
          return (
            <TouchableOpacity
              onPress={() => {
                setSelected(index);
              }}
              style={styles.menu}
            >
              <Text
                style={[
                  styles.time,

                  {
                    color: isSelected ? '#EE558F' : '#BBBBBB',
                    fontFamily: fonts.roboto,
                  },
                ]}
              >
                {item.time}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );
};

export default HotBablsHeader;

const styles = StyleSheet.create({
  drawer: {
    width: 31,
    height: 32,
    tintColor: '#6A6A6A',
    marginLeft: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: sizes.width,
    marginTop: 30,
    backgroundColor: '#000',
    fontFamily: fonts.avenir,

    elevation: 5,
  },
  time: {
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 25,
  },
  left: {
    marginLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

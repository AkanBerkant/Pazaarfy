import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';

import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSetAtom, useAtomValue, useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { Tabs } from 'react-native-collapsible-tab-view';
import { useSharedValue, withTiming } from 'react-native-reanimated';

import { Container } from '../../../components';
import { sizes } from '../../../theme';
import fonts from '../../../theme/fonts';
import { drawerAtom, tabBarVisibleAtom } from '../../../utils/atoms';
import * as Queries from '../../../utils/queries';
import { getBablCategories } from '../../createbabl/CreateBabl';
import Drawer from '../../drawer/Drawer';

import DailyList from './DailyList';
import MonthlyList from './MonthlyList';
import WeeklyList from './WeeklyList';

const { width } = Dimensions.get('screen');

const HotBablsHeader = ({
  setModalVisible, tabsRef, customFilter, tabs,
}) => {
  return (
    <View
      style={[
        styles.header,
        {
          marginTop: Platform.OS == 'ios' ? (sizes.width > 375 ? 0 : 0) : -10,
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => {
          return setModalVisible((prev) => {
            return !prev;
          });
        }}
      >
        <Image
          source={require('../../../assets/drawer.png')}
          style={styles.drawer}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <View style={styles.left}>
        {tabs.map((item, index) => {
          const isSelected = customFilter === item.id;
          return (
            <TouchableOpacity
              onPress={() => {
                tabsRef.current.setIndex(index);
              }}
              style={styles.menu}
            >
              <Text
                style={[
                  styles.time,
                  {
                    color: isSelected ? '#FFFFFF' : '#6A6A6A',
                    fontFamily: isSelected ? fonts.roboto : fonts.regular,
                    margin: 20.5,
                  },
                ]}
              >
                {item.time}
              </Text>
              {isSelected && (
                <Image
                  tintColor="#FFFFFF"
                  style={styles.bottomIcon}
                  source={require('../../../assets/bottom.png')}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.drawer} />
    </View>
  );
};

const HotBabls = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const bablCategories = getBablCategories(t);
  const [categories, setCategories] = React.useState(
    bablCategories.map((item) => {
      return item._id;
    }),
  );
  const [region, setRegion] = React.useState('GLOBAL');
  const [isModalVisible, setModalVisible] = useAtom(drawerAtom);
  const [loading, setLoading] = React.useState(false);
  const tabBarVisible = useAtomValue(tabBarVisibleAtom);
  const height = useSharedValue(0);
  const queryClient = useQueryClient();
  const isFocused = useIsFocused();

  React.useEffect(() => {
    if (tabBarVisible) {
      height.value = withTiming(0, { duration: 500 });
    } else {
      height.value = withTiming(-sizes.width / 4, { duration: 500 });
    }
  }, [tabBarVisible]);

  const [filter, setFilter] = React.useState(null);

  const onClose = ({ filterStatus, selectedRegion, selectedCategories }) => {
    setRegion(selectedRegion);
    setCategories(selectedCategories);
    setModalVisible(!isModalVisible);

    setFilter(filterStatus);
  };

  const setTabBarVisible = useSetAtom(tabBarVisibleAtom);
  const currentPosRef = React.useRef(0);

  const tabs = [
    {
      time: t('Daily'),
      id: 'day',
    },
    {
      time: t('Weekly'),
      id: 'week',
    },
    {
      time: t('Monthly'),
      id: 'month',
    },
  ];

  const tabsRef = React.useRef();
  const [customFilter, setCustomFilter] = React.useState(tabs[0].id);

  const {
    data: { hotBablsOfDay, hotBablsOfWeek, hotBablsOfMonth },
  } = useQuery(
    ['HOT_BABLS', region, categories],
    async () => {
      const [hotBablsOfDay, hotBablsOfWeek, hotBablsOfMonth] = await Promise.all([
        Queries.getHotBablsOfDay(region, categories),
        Queries.getHotBablsOfWeek(region, categories),
        Queries.getHotBablsOfMonth(region, categories),
      ]);

      return {
        hotBablsOfDay,
        hotBablsOfWeek,
        hotBablsOfMonth,
      };
    },
    {
      placeholderData: {
        hotBablsOfDay: [],
        hotBablsOfWeek: [],
        hotBablsOfMonth: [],
      },
    },
  );

  useFocusEffect(
    React.useCallback(() => {
      queryClient.invalidateQueries(['HOT_BABLS']);
    }, []),
  );

  const onScroll = (event) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const dif = currentOffset - currentPosRef.current;

    if (currentOffset == 0) {
      setTabBarVisible(true);
    }
    if (Math.abs(dif) < 3) {
    } else if (dif < 0) {
      setTabBarVisible(true);
    } else {
      setTabBarVisible(false);
    }

    currentPosRef.current = currentOffset;
  };

  React.useEffect(() => {
    if (tabBarVisible) {
      height.value = withTiming(0, { duration: 500 });
    } else {
      height.value = withTiming(-sizes.width / 4, { duration: 500 });
    }
  }, [tabBarVisible]);

  const toggleModal = () => {
    return setModalVisible((prev) => {
      return !prev;
    });
  };

  return (
    <>
      <Container
        backgroundColor="#0E0E0E"
        scrollview={false}
        style={{ flex: 1 }}
        onScroll={onScroll}
      >
        <View
          style={{
            alignItems: 'center',
            padding: 10,
            width: sizes.width,
            borderBottomColor: '#323232',
            borderBottomWidth: 1,
            alignSelf: 'center',
            height: sizes.width / 8,
          }}
        >
          <Text style={styles.title}>{t('HotBabls')}</Text>
        </View>
        <HotBablsHeader
          setModalVisible={setModalVisible}
          tabsRef={tabsRef}
          customFilter={customFilter}
          tabs={tabs}
        />

        <Tabs.Container
          ref={tabsRef}
          onTabChange={(x) => {
            setCustomFilter(x.tabName);
          }}
          renderHeader={() => {
            return null;
          }}
          renderTabBar={() => {
            return null;
          }}
        >
          {tabs.map((item) => {
            return (
              <Tabs.Tab name={item.id}>
                {item.id == 'day' ? (
                  <DailyList
                    hotBablsOfDay={hotBablsOfDay}
                    loading={loading}
                    onScroll={onScroll}
                    isFocused={isFocused && customFilter === item.id}
                    shouldPause={isModalVisible}
                  />
                ) : item.id == 'week' ? (
                  <WeeklyList
                    hotBablsOfWeek={hotBablsOfWeek}
                    loading={loading}
                    onScroll={onScroll}
                    isFocused={isFocused && customFilter === item.id}
                    shouldPause={isModalVisible}
                  />
                ) : item.id == 'month' ? (
                  <MonthlyList
                    hotBablsOfMonth={hotBablsOfMonth}
                    loading={loading}
                    onScroll={onScroll}
                    isFocused={isFocused && customFilter === item.id}
                    shouldPause={isModalVisible}
                  />
                ) : null}
              </Tabs.Tab>
            );
          })}
        </Tabs.Container>
      </Container>

      {isModalVisible && (
        <Drawer
          onClose={onClose}
          initialRegion={region}
          initialCategories={categories}
        />
      )}
    </>
  );
};

export default HotBabls;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#0E0E0E',
  },
  dailyPost: {
    width: width / 2.02,
    height: width / 2.02,

    borderRadius: 13.18,
  },
  weeklyPost: {
    width: width / 3.02,
    height: width / 3.02,

    borderRadius: 13.18,
  },
  postBig: {
    width,
    height: width,
    marginTop: 2,
    borderRadius: 13.18,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  top: {
    marginTop: 0,
  },
  center: {
    alignItems: 'center',
  },
  drawer: {
    width: 31,
    height: 32,
    marginTop: 15,
    marginLeft: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: sizes.width,
    justifyContent: 'space-between',
    marginTop: sizes.width > 375 ? 35 : 0,
    elevation: 5,
  },
  time: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  left: {
    marginLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomIcon: {
    width: 17,
    position: 'absolute',
    top: 52,
    height: 4,
  },
  menu: {
    alignItems: 'center',
    marginTop: 10,
  },

  title: {
    color: '#FFF',
    fontSize: 18,
    textAlign: 'center',
    fontFamily: fonts.roboto,
  },
});

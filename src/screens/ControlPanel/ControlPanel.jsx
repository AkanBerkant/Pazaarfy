import React from 'react';
import {
  Image, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import PagerView from 'react-native-pager-view';

import { BackHeader } from '../../components';
import { sizes } from '../../theme';
import fonts from '../../theme/fonts';

import ReceivedRequests from './ReceivedRequests';
import SendRequest from './SentRequests';

const ControlPanel = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const tabs = [
    {
      time: t('requestsIGet'),
      _id: 'ReceivedRequests',
      component: <ReceivedRequests />,
    },
    {
      time: t('requestsISent'),
      _id: 'SentRequests',
      component: <SendRequest />,
    },
  ];

  React.useEffect(() => {
    queryClient.setQueryData(['UNSEEN_REQUEST_COUNT'], 0);
  }, []);

  const pagerRef = React.useRef();
  const [customFilter, setCustomFilter] = React.useState(tabs[0]._id);

  return (
    <View style={styles.container}>
      <BackHeader shadow={false} title={t('controlPanel')} />
      <View style={styles.header}>
        {tabs.map((item, index) => {
          const isSelected = customFilter === item._id;
          return (
            <TouchableOpacity
              onPress={() => {
                setCustomFilter(item._id);
                pagerRef.current.setPageWithoutAnimation(index);
              }}
              style={styles.menu}
            >
              <Text
                style={[
                  styles.time,
                  {
                    color: isSelected ? '#FFFFFF' : '#6A6A6A',
                    fontFamily: fonts.roboto,
                    margin: 10,
                  },
                ]}
              >
                {item.time}
              </Text>
              {isSelected && (
                <Image
                  tintColor="#FFFFFF"
                  style={[
                    styles.bottomIcon,
                    {
                      width: sizes.width / 4,
                    },
                  ]}
                  source={require('../../assets/bottom.png')}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.borderBottom} />

      <PagerView
        style={{ flex: 1 }}
        initialPage={0}
        ref={pagerRef}
        onPageScroll={(e) => {
          setCustomFilter(tabs[e.nativeEvent.position]._id);
        }}
      >
        {tabs.map((item) => {
          return <View key={item.id}>{item.component}</View>;
        })}
      </PagerView>
    </View>
  );
};

export default ControlPanel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  between: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  backIcon: {
    width: 12.43,
    height: 22,
    tintColor: '#BBBBBB',
  },
  input: {
    backgroundColor: '#252525',
    width: sizes.width / 1.2,
    borderRadius: 10,
    marginLeft: 12,
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  search: {
    fontSize: 16,
    color: '#BBBBBB',
    fontWeight: 'bold',
    fontFamily: fonts.roboto,
  },
  items: {
    marginTop: 15,
  },
  searchIcon: {
    tintColor: '#A5A5A5',
    width: 15,
    height: 15,
    marginLeft: 5,
  },
  inInput: {
    width: sizes.width / 1.4,
    marginLeft: 3,
    color: '#FFF',
    fontFamily: fonts.roboto,
  },
  activeItem: {
    width: sizes.width / 1.1,
    height: 35,
    margin: 5,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  disableItem: {
    height: 33,
    width: sizes.width / 1.1,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
  },
  icon: {
    width: 7,
    height: 7,
    marginLeft: 12,
    tintColor: '#FFFFFF',
  },
  disableLabel: {
    marginLeft: 10,
    color: '#FFFFFF',
    fontFamily: fonts.roboto,
    fontWeight: 'bold',
    fontSize: 16,
  },

  activeLabel: {
    marginLeft: 15,
    color: '#000000',
    fontWeight: '500',
    fontFamily: fonts.roboto,
    fontSize: 16,
  },
  borderBottom: {
    backgroundColor: '#000',
    padding: 4,

    width: sizes.width,
    alignItems: 'center',
    shadowColor: '#FFF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    borderRadius: 99,
    elevation: 5,
  },
  title: {
    color: '#FFF',
    fontSize: 18,
    width: sizes.width / 1.1,
    alignSelf: 'center',
    fontFamily: fonts.roboto,
    marginTop: 10,
  },
  left: {
    width: 22,
  },
  cancelIcon: {
    tintColor: '#A5A5A5',
    width: 18,
    height: 18,
    marginRight: 5,
  },
  header: {
    marginLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 99,
    justifyContent: 'center',
  },
  bottomIcon: {
    position: 'absolute',
    top: 35,
    zIndex: 99,
    height: 4,
  },
  menu: {
    alignItems: 'center',
  },
});

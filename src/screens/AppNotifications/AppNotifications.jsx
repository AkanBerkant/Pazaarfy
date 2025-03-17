import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Switch, ScrollView, Platform,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import { t } from 'i18next';
import { useAtom } from 'jotai';
import LinearGradient from 'react-native-linear-gradient';

import { BackHeader } from '../../components';
import { sizes } from '../../theme';
import fonts from '../../theme/fonts';
import { userAtom } from '../../utils/atoms';
import * as Queries from '../../utils/queries';

Queries.updateNotificationSettings;

const AppNotifications = () => {
  const navigation = useNavigation();
  const [user, setUser] = useAtom(userAtom);

  const data = [
    {
      label: t('Likes'),
      _id: 'likes',
    },
    {
      label: t('Rebabls'),
      _id: 'rebabls',
    },
    {
      label: t('Saved'),
      _id: 'saved',
    },
    {
      label: t('Sends'),
      _id: 'sends',
    },
    {
      label: t('Comments'),
      _id: 'comments',
    },
    {
      label: t('Followers'),
      _id: 'followers',
    },
    {
      label: t('Messages'),
      _id: 'messages',
    },
    {
      label: t('Live'),
      _id: 'live',
    },
    {
      label: t('NewPost'),
      _id: 'newPost',
    },
    {
      label: t('interactionRequestNotif'),
      _id: 'interactionRequest',
    },
    {
      label: t('giftNotif'),
      _id: 'gift',
    },
  ];

  const [selectedItems, setSelectedItems] = useState({
    likes: user.notificationSettings?.likes,
    rebabls: user.notificationSettings?.rebabls,
    saved: user.notificationSettings?.saved,
    sends: user.notificationSettings?.sends,
    comments: user.notificationSettings?.comments,
    followers: user.notificationSettings?.followers,
    messages: user.notificationSettings?.messages,
    live: user.notificationSettings?.live,
    newPost: user.notificationSettings?.newPost,
    interactionRequest: user.notificationSettings?.interactionRequest,
    gift: user.notificationSettings?.gift,
  });

  const updateNotificationSettingsMutation = useMutation(Queries.updateNotificationSettings, {
    onSuccess: (res) => {
      navigation.goBack();
      setUser(res);
    },
  });

  return (
    <View style={styles.container}>
      <BackHeader
        title={t('AppNotifications')}
        onPress={() => {
          updateNotificationSettingsMutation.mutate(selectedItems);
        }}
      />
      <ScrollView>
        {data.map((item, index) => {
          const toggleSwitch = () => {
            if (selectedItems[item._id]) {
              return setSelectedItems({ ...selectedItems, [item._id]: false });
            }

            setSelectedItems({ ...selectedItems, [item._id]: true });
          };
          return (
            <View style={styles.item}>
              <Text style={styles.label}>{item.label}</Text>

              {selectedItems[item._id] ? (
                <LinearGradient
                  style={styles.linearGradient}
                  colors={['#F9B092', '#D5D399', '#0AAFF6']}
                >
                  <Switch
                    trackColor={{ false: '#D9D9D9', true: '#000' }}
                    thumbColor="#FFF"
                    onValueChange={toggleSwitch}
                    value
                  />
                </LinearGradient>
              ) : (
                <Switch
                  trackColor={{ false: '#D9D9D9', true: '#111111' }}
                  thumbColor="#5B5B5B"
                  onValueChange={toggleSwitch}
                  value={false}
                />
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  label: {
    fontFamily: fonts.roboto,
    color: '#FFF',
  },
  item: {
    borderWidth: 1,
    borderColor: '#1D1D1D',
    borderRadius: 16,
    width: sizes.width / 1.1,
    height: 73,
    padding: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },
  linearGradient: {
    borderRadius: 20,
    width: Platform.OS == 'ios' ? 55 : 27,

    height: Platform.OS == 'ios' ? 35 : 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppNotifications;

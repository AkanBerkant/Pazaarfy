import React from 'react';
import {
  Alert,
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import Clipboard from '@react-native-clipboard/clipboard';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { useQuery } from '@tanstack/react-query';
import { t } from 'i18next';
import { useAtomValue } from 'jotai';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Share from 'react-native-share';

import { ButtonLinear, SearcRebablInp } from '../../../components';
import { notify } from '../../../helpers/notify';
import { sizes } from '../../../theme';
import fonts from '../../../theme/fonts';
import { userAtom } from '../../../utils/atoms';
import * as FirestoreQueries from '../../../utils/firestore-queries';
import * as Queries from '../../../utils/queries';

const Rebabls = ({
  title, bablId, itemId, onClose,
}) => {
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [isKeyboardVisible, setKeyboardVisible] = React.useState(false);
  const [filteredData, setFilteredData] = React.useState([]);
  const safeAreaInsets = useSafeAreaInsets();
  const user = useAtomValue(userAtom);
  const [searchText, setSearchText] = React.useState('');
  const [messageContent, setMessageContent] = React.useState('');

  const getFollowingsQuery = useQuery(
    ['USER_FOLLOWINGS', user._id],
    () => {
      return Queries.getFollowings(user._id);
    },
    {
      placeholderData: [],
      onSuccess: (data) => {
        // Set initial filteredData
        setFilteredData(data);
      },
    },
  );

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  React.useEffect(() => {
    if (searchText === '') {
      setFilteredData(getFollowingsQuery.data);
    } else {
      setFilteredData(
        getFollowingsQuery.data.filter((item) => {
          return (
            new RegExp(searchText, 'i').test(item.following.firstname)
            || new RegExp(searchText, 'i').test(item.following.username)
          );
        }),
      );
    }
  }, [searchText, getFollowingsQuery.data]);

  React.useEffect(() => {
    if (isKeyboardVisible) {
      setFilteredData((prevData) => {
        return prevData.slice(0, 3);
      });
    } else {
      setFilteredData(getFollowingsQuery.data);
    }
  }, [isKeyboardVisible, getFollowingsQuery.data]);

  const getShortLink = async () => {
    const shortLink = await dynamicLinks().buildShortLink({
      link: itemId
        ? `https://bablworld.com?bablId=${bablId}&itemId=${itemId}`
        : `https://bablworld.com?bablId=${bablId}`,
      domainUriPrefix: 'https://bablworld.page.link',
    });

    return shortLink;
  };

  const shareBabl = () => {
    Queries.shareBabl(bablId);
  };

  const bottoms = [
    {
      label: t('ShareTo'),
      icon: require('../../../assets/shred.png'),
      onPress: async () => {
        Share.open({
          message: title,
          url: await getShortLink(),
        }).then(shareBabl);
      },
    },
    {
      label: t('CopyLink'),
      icon: require('../../../assets/copy.png'),
      onPress: async () => {
        Clipboard.setString(await getShortLink());
        Alert.alert(t('BablLinkCopied'));
      },
    },
    {
      label: 'WhatsApp',
      icon: require('../../../assets/wp.png'),
      onPress: async () => {
        Share.shareSingle({
          message: title,
          url: await getShortLink(),
          social: Share.Social.WHATSAPP,
        }).then(shareBabl);
      },
    },
    {
      label: 'Instagram',
      icon: require('../../../assets/instagramm.png'),
      onPress: async () => {
        const sl = await getShortLink();
        const imgUrl = await Queries.createBablStory(bablId);

        Share.shareSingle({
          message: title,
          attributionURL: sl,
          attributionLink: sl,
          appId: '1162175321499046',
          backgroundVideo: imgUrl,
          social: Share.Social.INSTAGRAM_STORIES,
        }).then(shareBabl);
      },
    },
    {
      label: 'Facebook',
      icon: require('../../../assets/facebokk.png'),
      onPress: async () => {
        Share.shareSingle({
          message: title,
          url: await getShortLink(),
          social: Share.Social.FACEBOOK,
        }).then(shareBabl);
      },
    },
  ];

  const onSendMessagePress = (friendId, text) => {
    return FirestoreQueries.sendMessage({
      message: {
        id: Math.random().toString(16).slice(2),
        sender: user._id,
        text,
        date: new Date(),
      },
      currentUser: user._id,
      otherUser: friendId,
    }).finally(() => {
      Queries.shareBabl(bablId);
      return Queries.sendMessage({
        message: text,
        user: friendId,
      });
    });
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={styles.items}
        onPress={() => {
          if (selectedItems.includes(item.following._id)) {
            return setSelectedItems(
              selectedItems.filter((e) => {
                return e !== item.following._id;
              }),
            );
          }

          setSelectedItems([...selectedItems, item.following._id]);
        }}
      >
        <View style={styles.row}>
          <Image source={{ uri: item.following.photo }} style={styles.image} />
          <View style={styles.left}>
            <Text style={styles.name}>{item.following.firstname}</Text>
            <Text style={styles.username}>{item.following.username}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            if (selectedItems.includes(item.following._id)) {
              return setSelectedItems(
                selectedItems.filter((e) => {
                  return e !== item.following._id;
                }),
              );
            }

            setSelectedItems([...selectedItems, item.following._id]);
          }}
        >
          {selectedItems.includes(item.following._id) ? (
            <Image style={styles.icon} source={require('../../../assets/check.png')} />
          ) : (
            <Image style={styles.icon} source={require('../../../assets/disableCheck.png')} />
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const sendInApp = async () => {
    const textLink = await getShortLink();
    await Promise.all(
      selectedItems.map(async (fId) => {
        await onSendMessagePress(fId, textLink);

        if (messageContent.trim()) {
          await onSendMessagePress(fId, messageContent.trim());
        }
      }),
    );
    notify({
      title: t('BablSent'),
    });
    onClose();
  };

  return (
    <View>
      <SearcRebablInp value={searchText} onChangeText={setSearchText} />
      <ScrollView
        style={{
          maxHeight: sizes.height / 2,
        }}
      >
        {filteredData.map((item, index) => {
          return <View key={item._id}>{renderItem({ item, index })}</View>;
        })}
      </ScrollView>
      <View
        style={{
          backgroundColor: '#1B1B1B',
          borderTopRightRadius: 13,
          borderTopLeftRadius: 13,
          paddingBottom: safeAreaInsets.bottom,
        }}
      >
        {selectedItems.length ? (
          <View
            style={{
              paddingTop: 10,
              gap: 10,
            }}
          >
            <TextInput
              placeholder={t('WriteAMessage')}
              style={{
                paddingVertical: 20,
                paddingHorizontal: 20,
                color: '#FFF',
                fontFamily: fonts.roboto,
                fontSize: 15,
              }}
              value={messageContent}
              onChangeText={setMessageContent}
            />
            <ButtonLinear title={t('Send')} onPress={sendInApp} />
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ flexGrow: 0 }}
            bounces={false}
            horizontal
          >
            {bottoms.map((item, index) => {
              return (
                <TouchableOpacity onPress={item.onPress} key={index}>
                  {index == 0 || index == 1 ? (
                    <View
                      style={{
                        alignItems: 'center',
                        margin: 5,
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: '#272727',
                          width: 57,
                          height: 57,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 57,
                          margin: 10,
                        }}
                      >
                        <Image
                          source={item.icon}
                          style={{
                            width: 22,
                            height: 22,
                          }}
                        />
                      </View>
                      <Text
                        style={{
                          color: '#9E9E9E',
                          fontFamily: fonts.regular,
                        }}
                      >
                        {item.label}
                      </Text>
                    </View>
                  ) : (
                    <View
                      style={{
                        alignItems: 'center',
                        margin: 5,
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: '#272727',
                          width: 57,
                          height: 57,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 57,
                          margin: 10,
                        }}
                      >
                        <Image
                          source={item.icon}
                          style={{
                            width: 57,
                            height: 57,
                          }}
                        />
                      </View>
                      <Text
                        style={{
                          color: '#9E9E9E',
                          fontFamily: fonts.regular,
                        }}
                      >
                        {item.label}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export default Rebabls;

const styles = StyleSheet.create({
  image: {
    width: 52,
    height: 52,
    borderRadius: 52,
  },
  items: {
    width: sizes.width / 1.06,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 7,
    marginTop: 7,
  },
  left: {
    marginLeft: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontFamily: fonts.roboto,
    color: '#FFF',
  },
  username: {
    color: '#434343',
    fontSize: 14,
    fontFamily: fonts.regular,
  },
  icon: {
    width: 31,
    height: 31,
  },
  marginBottom: {
    marginBottom: 10,
  },
  bottom: {
    backgroundColor: '#F1F1F1',
    height: 132,

    borderTopRightRadius: 13,
    width: sizes.width,
    borderTopLeftRadius: 13,
  },
});

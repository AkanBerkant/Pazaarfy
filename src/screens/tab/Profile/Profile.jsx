import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import routes from "../../../constants/routes";
import { useAtom, useAtomValue } from "jotai";
import { useTranslation } from "react-i18next";
import { Tabs } from "react-native-collapsible-tab-view";
import { InAppBrowser } from "react-native-inappbrowser-reborn";
import LinearGradient from "react-native-linear-gradient";
import { Modalize } from "react-native-modalize";
import ProfileHeader from "../../../components/header/ProfileHeader";

import { useActionStatus } from "../../../hooks/useActionStatus";
import { sizes } from "../../../theme";
import fonts from "../../../theme/fonts";
import { helpAtom, userAtom } from "../../../utils/atoms";
import * as Queries from "../../../utils/queries";

import Babls from "./Babls";
import Collections from "./Collections";
import CreateCollectionModal from "./CreateCollectionModal";
import Likes from "./Likes";
import ProfilePhotoModal from "./ProfilePhotoModal";
import SharedModal from "./SharedModal";

const profileviews = [
  {
    image: require("../../../assets/profileview1.png"),
  },
  {
    image: require("../../../assets/profileview2.png"),
  },
  {
    image: require("../../../assets/profileview3.png"),
  },
];

const ListHeader = ({
  followerCount,
  profile,
  targetUserId,
  user,
  followInfo,
  sharedModal,
  icons,
  onFollowPress,
  followLoading,
  followStatus,
  onMessagePress,
  modalizeProfileViewRef,
  onOpenModal,
  backMenu,
}) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const unseenRequestCountQuery = useQuery(
    ["UNSEEN_REQUEST_COUNT"],
    Queries.getUnseenRequestCount,
    {
      placeholderData: 0,
    },
  );

  return (
    <View
      style={{
        backgroundColor: "#000",
      }}
    >
      <View style={[styles.card]}>
        <View>
          <TouchableOpacity onPress={onOpenModal}>
            <Image
              resizeMode="contain"
              style={styles.pp}
              source={{ uri: profile.photo }}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            marginLeft: 12,
          }}
        >
          <Text style={styles.name}>{profile.username}</Text>
          <View style={[styles.row, styles.top]}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(routes.Follower, {
                  userId: targetUserId,
                });
              }}
              style={styles.followerContainer}
            >
              <Text style={styles.follower}>{t("Followers")}</Text>
              <Text style={styles.number}>{followerCount}</Text>
            </TouchableOpacity>
            <View>
              {unseenRequestCountQuery.data > 0 && (
                <View style={styles.badge} />
              )}
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(routes.Follows, {
                  userId: targetUserId,
                });
              }}
              style={[styles.followsContainer]}
            >
              <Text style={styles.follows}>{t("following")}</Text>
              <Text style={styles.number}>{followInfo.followingCount}</Text>
            </TouchableOpacity>

            {targetUserId == user._id && (
              <TouchableOpacity
                style={[
                  {
                    width: 111,
                    justifyContent: "center",
                    alignItems: "center",
                    height: 26,
                    marginLeft: 20,
                  },
                ]}
                onPress={onFollowPress}
              >
                <LinearGradient
                  style={styles.linearAddProduct}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  colors={["#B5A0FF", "#755CCC"]}
                >
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate(routes.CreateBabl);
                    }}
                    style={styles.addProduct}
                  >
                    <Image
                      style={styles.addPr}
                      source={require("../../../assets/adprr.png")}
                    />
                    <Text style={styles.addProductText}>{t("AddProduct")}</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View>
          <View style={{ alignItems: "center" }}>
            <View style={styles.marginRow}>
              {icons.map((item) => {
                if (!item.link) {
                  return null;
                }

                return (
                  <TouchableOpacity
                    onPress={() => {
                      InAppBrowser.open(item.link);
                    }}
                  >
                    <Image
                      tintColor="#252526"
                      resizeMode="contain"
                      source={item.icon}
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
            {targetUserId !== user._id && (
              <View style={styles.followBtnContainer}>
                <TouchableOpacity
                  style={[styles.followBtn, styles.messageBtn]}
                  onPress={onFollowPress}
                >
                  <LinearGradient
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={[styles.followBtn, styles.messageBtn]}
                    colors={["#B5A0FF", "#755CCC"]}
                  >
                    <TouchableOpacity
                      onPress={onFollowPress}
                      disabled={followLoading}
                    >
                      {followLoading ? (
                        <ActivityIndicator color="#FFF" />
                      ) : (
                        <Text style={styles.followBtnText}>
                          {followStatus ? t("following") : t("Follow")}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.followBtn,
                    { marginLeft: 90 },
                    styles.messageBtn,
                  ]}
                  onPress={onMessagePress}
                >
                  <LinearGradient
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={[styles.followBtn, styles.messageBtn]}
                    colors={[
                      "#8C8C8C",
                      "#525252",
                      "#212121",
                      "#363636",
                      "#2E2E2E",
                    ]}
                  >
                    <TouchableOpacity onPress={onMessagePress}>
                      <Text style={styles.followBtnText}>{t("Messages")}</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const Profile = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const modalizeRef = React.useRef();
  const modalizeProfileViewRef = React.useRef();
  const pagerRef = React.useRef();
  const [helpState, setHelpState] = useAtom(helpAtom);
  const [collectionsItem, setCollectionsItem] = React.useState(0);
  const tabsRef = React.useRef();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [sharedModal, setSharedModal] = React.useState(null);

  const [user, setUser] = useAtom(userAtom);
  const targetUserId = route.params ? route.params.userId : user._id;
  const isOtherUser = targetUserId !== user._id;

  const [profilePhoto, setProfilePhoto] = useState(false);

  const updateProfileMutation = useMutation(Queries.updateProfile, {
    onSuccess: (res) => {
      setUser(res);
      modalizeProfileViewRef.current?.close();
      queryClient.invalidateQueries(["PROFILE_X", targetUserId]);
    },
    onError: (err) => {
      console.log("err", err.response.data);
    },
  });

  const renderItemProfileViews = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={styles.profileImageItem}
        onPress={() => {
          updateProfileMutation.mutate({ profileShape: index });
        }}
      >
        <Image source={item.image} resizeMode="contain" style={styles.image} />
      </TouchableOpacity>
    );
  };

  const tabs = isOtherUser
    ? [
        {
          id: "babls",
          label: "Gönderiler",
          flex: 1,
          icon: require("../../../assets/icon1.png"),
        },
      ]
    : [
        {
          id: "babls",

          label: t("Sends"),
          flex: 1,
          icon: require("../../../assets/icon1.png"),
        },
        {
          id: "likes",
          label: t("Likeda"),
          flex: 0.5,
          icon: require("../../../assets/icon2.png"),
        },
      ];
  const [customFilter, setCustomFilter] = React.useState(tabs[0].id);

  const { data: profileData } = useQuery(
    ["PROFILE_X", targetUserId],
    async () => {
      const [profile, followInfo] = await Promise.all([
        Queries.getUserById(targetUserId),
        Queries.getFollowInfo(targetUserId),
      ]);

      return {
        profile,
        followInfo,
      };
    },
    {
      onSuccess: (res) => {
        setCurrentCount(res.followInfo?.followerCount);
      },
      onError: (err) => {
        console.log("err", err);
      },
      placeholderData: {
        profile: {},
        followInfo: {},
      },
    },
  );
  const profile = profileData.profile || {};
  const followInfo = profileData.followInfo || {};

  useFocusEffect(
    React.useCallback(() => {
      queryClient.invalidateQueries(["PROFILE"]);
      queryClient.invalidateQueries(["PROFILE_X"]);
    }, []),
  );

  const {
    actionStatus: followStatus,
    currentCount: followerCount,
    setCurrentCount,
    onNegativeAction,
    onPositiveAction,
  } = useActionStatus({
    initialCount: followInfo.followerCount,
    initialStatus: followInfo.followingStatus,
  });

  const followMutation = useMutation(Queries.follow, {
    onMutate: () => {
      onPositiveAction();
    },
    onError: (err) => {
      console.log("err", err);
    },
  });

  const unfollowMutation = useMutation(Queries.unfollow, {
    onMutate: () => {
      onNegativeAction();
    },
    onError: (err) => {},
  });

  const icons = [
    {
      icon: require("../../../assets/youtube.png"),
      link: user.socialMediaLinks?.facebook,
    },
    {
      icon: require("../../../assets/twitter.png"),
      link: user.socialMediaLinks?.twitter,
    },
    {
      icon: require("../../../assets/instagram.png"),
      link: user.socialMediaLinks?.instagram,
    },
  ];

  const onFollowPress = () => {
    if (unfollowMutation.isLoading || followMutation.isLoading) return null;

    if (followStatus) {
      unfollowMutation.mutate(targetUserId);
    } else {
      followMutation.mutate(targetUserId);
    }
  };

  const onMessagePress = () => {
    navigation.navigate(routes.MessageScreen, {
      item: {
        user: {
          _id: targetUserId,
          firstname: profile.firstname,
          username: profile.username,
          photo: profile.photo,
        },
      },
    });
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => {}} style={styles.item}>
        <View style={styles.row}>
          <Image source={item.image} style={styles.itemImage} />
          <View style={styles.left}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemType}>{item.type}</Text>
          </View>
        </View>
        <Image
          source={require("../../../assets/plus.png")}
          style={styles.plus}
        />
      </TouchableOpacity>
    );
  };
  const data = [
    {
      image: require("../../../assets/collections.png"),
      title: "Shop",
      type: "Private",
    },
    {
      image: require("../../../assets/collections.png"),
      title: "Shop",
      type: "Private",
    },
    {
      image: require("../../../assets/collections.png"),
      title: "Shop",
      type: "Private",
    },
    {
      image: require("../../../assets/collections.png"),
      title: "Shop",
      type: "Private",
    },
    {
      image: require("../../../assets/collections.png"),
      title: "Shop",
      type: "Private",
    },
    {
      image: require("../../../assets/collections.png"),
      title: "Shop",
      type: "Private",
    },
  ];

  const [isModalVisible, setIsModalVisible] = useState(false);

  const onPress = () => {
    setIsModalVisible(true);
  };
  const backMenu = route.name === routes.UserProfile;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#000",
      }}
    >
      <SharedModal
        visible={sharedModal}
        onClose={() => {
          setSharedModal(false);
        }}
      />

      {backMenu ? <ProfileHeader title={profile.username} /> : null}

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(routes.Pro);
          }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.proButton}
        >
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            colors={["#B5A0FF", "#755CCC"]}
            style={styles.proButton}
          >
            <Image
              style={styles.proStar}
              source={require("../../../assets/prostar.png")}
            />
            <Text style={[styles.proButtonText]}>{"Pro"}</Text>
          </LinearGradient>
        </TouchableOpacity>
        <Text style={styles.store}>{t("MyStore")}</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(routes.Notification);
          }}
        >
          <Image
            style={styles.notification}
            resizeMode="contain"
            source={require("../../../assets/notification.png")}
          />
        </TouchableOpacity>
      </View>

      <Tabs.Container
        ref={tabsRef}
        allowHeaderOverscroll
        renderTabBar={() => {
          return (
            <View>
              <View style={styles.borderBottom} />
              {!isOtherUser && (
                <View
                  style={{
                    // marginTop: 10,
                    justifyContent: "space-around",
                    flexDirection: "row",
                    alignSelf: "stretch",
                    backgroundColor: "#000",
                  }}
                >
                  {tabs.map((item, tabIndx) => {
                    const isSelected = customFilter === item.id;

                    return (
                      <View
                        style={{
                          justifyContent: "space-between",
                          alignItems: "center",
                          backgroundColor: "#000",
                        }}
                      >
                        {isSelected ? (
                          <LinearGradient
                            start={{ x: 1, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            style={[styles.tabItems]}
                            colors={["#B5A0FF", "#755CCC"]}
                          >
                            <TouchableOpacity
                              key={item.label}
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                              onPress={() => {
                                tabsRef.current.jumpToTab(item.id);
                              }}
                            >
                              <Image
                                source={item.icon}
                                resizeMode="contain"
                                style={{
                                  height: 17,
                                  width: 17,

                                  tintColor: isSelected ? "#FFF" : "#755CCC",
                                }}
                              />
                              <Text
                                style={{
                                  color: "#FFF",
                                  fontSize: 12,
                                  fontFamily: fonts.regular,
                                  marginLeft: 3,
                                }}
                              >
                                {item.label}
                              </Text>
                            </TouchableOpacity>
                          </LinearGradient>
                        ) : (
                          <TouchableOpacity
                            key={item.label}
                            style={[
                              styles.tabItems,
                              {
                                backgroundColor: "#212121",
                              },
                            ]}
                            onPress={() => {
                              tabsRef.current.jumpToTab(item.id);
                            }}
                          >
                            <Image
                              source={item.icon}
                              resizeMode="contain"
                              style={{
                                height: 17,
                                width: 17,

                                tintColor: isSelected ? "#FFF" : "#755CCC",
                              }}
                            />
                            <Text
                              style={{
                                color: "#FFF",
                                fontSize: 12,
                                fontFamily: fonts.regular,
                                marginLeft: 3,
                              }}
                            >
                              {item.label}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          );
        }}
        onTabChange={(data) => {
          setCustomFilter(data.tabName);
        }}
        renderHeader={() => {
          return (
            <ListHeader
              followerCount={followerCount}
              profile={profile}
              targetUserId={targetUserId}
              user={user}
              followInfo={followInfo}
              sharedModal={sharedModal}
              icons={icons}
              backMenu={backMenu}
              tabs={tabs}
              customFilter={customFilter}
              setCustomFilter={setCustomFilter}
              pagerRef={pagerRef}
              onFollowPress={onFollowPress}
              followLoading={
                unfollowMutation.isLoading || followMutation.isLoading
              }
              followStatus={followStatus}
              onMessagePress={onMessagePress}
              modalizeProfileViewRef={modalizeProfileViewRef}
              onOpenModal={() => {
                setProfilePhoto(true);
              }}
            />
          );
        }}
      >
        <Tabs.Tab name="babls">
          <Babls targetUserId={targetUserId} profile={profile} />
        </Tabs.Tab>

        {!isOtherUser && (
          <Tabs.Tab name="likes">
            <Likes targetUserId={targetUserId} />
          </Tabs.Tab>
        )}
      </Tabs.Container>

      <Modalize
        snapPoint={sizes.width * 1.2}
        overlayStyle={{
          opacity: 1,
        }}
        handlePosition="inside"
        modalStyle={{
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        }}
        ref={modalizeRef}
        contentContainerStyle={styles.container}
      >
        <TouchableOpacity onPress={() => {}} style={styles.item}>
          <View style={styles.row}>
            <Image source={collectionsItem.image} style={styles.itemImage} />
            <View style={styles.left}>
              <Text style={styles.itemTitle}>{collectionsItem.title}</Text>
              <Text style={styles.itemType}>{collectionsItem.type}</Text>
            </View>
          </View>
          <Image
            source={require("../../../assets/save.png")}
            style={styles.save}
          />
        </TouchableOpacity>

        <View style={styles.borderBottom} />

        <View style={styles.between}>
          <Text style={styles.title}>{t("Collections")}</Text>
          <TouchableOpacity style={styles.row}>
            <Image
              source={require("../../../assets/pluss.png")}
              style={styles.add}
            />
            <Text style={styles.pink}>{t("NewCollection")}</Text>
          </TouchableOpacity>
        </View>

        <FlatList data={data} renderItem={renderItem} />
      </Modalize>

      <Modalize
        snapPoint={sizes.width * 1.3}
        overlayStyle={{
          opacity: 1,
        }}
        handleStyle={{
          backgroundColor: "#2C2C2C",
        }}
        handlePosition="inside"
        modalStyle={{
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          backgroundColor: "#141414",
        }}
        ref={modalizeProfileViewRef}
        contentContainerStyle={styles.container}
      >
        <Text style={styles.title}>{t("profileView")}</Text>
        <View style={styles.viewProfileBorderBottom} />
        <FlatList
          numColumns={3}
          data={profileviews}
          renderItem={renderItemProfileViews}
          contentContainerStyle={styles.contentContainerStyleProfileView}
        />
      </Modalize>

      <ProfilePhotoModal
        visible={profilePhoto}
        ProfilePhoto={profile.photo}
        onClose={() => {
          setProfilePhoto(false);
        }}
      />

      {isModalVisible && (
        <CreateCollectionModal
          onClose={() => {
            setIsModalVisible(false);
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row",
    width: sizes.width / 1.09,
    marginTop: 20,
    marginBottom: 20,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  followerContainer: {
    alignItems: "center",
  },
  follower: {
    color: "#808080",
    fontSize: 12,
    fontFamily: fonts.medium,
  },
  pp: {
    width: 74.44,
    height: 74.44,
    borderRadius: 74,
  },

  followsContainer: {
    alignItems: "center",
    marginLeft: 10,
  },
  number: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: fonts.medium,
  },
  follows: {
    color: "#808080",
    fontSize: 12,
    fontFamily: fonts.medium,
  },
  name: {
    fontSize: 16,
    color: "#FFF",
    fontFamily: fonts.bold,
  },

  followBtnContainer: {
    marginLeft: 3,
    flexDirection: "row",
    alignItems: "center",

    gap: 5,
    paddingHorizontal: 30,
  },
  followBtn: {
    height: 27,
    borderRadius: 27,
    flex: 1,
    width: 90,
    marginLeft: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  followBtnText: {
    fontSize: 12,
    fontFamily: fonts.roboto,
    color: "#FFF",
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "#171717",
    width: sizes.width,
  },
  tabItems: {
    marginTop: 10,
    alignItems: "center",
    borderRadius: 51,
    padding: 10,
    flexDirection: "row",
    width: sizes.width / 2.2,
    justifyContent: "center",
    alignItems: "center",
  },
  between: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  title: {
    fontWeight: "bold",
    fontFamily: fonts.roboto,
    color: "#000",
    fontSize: 18,
  },

  left: {
    marginLeft: 7,
  },
  itemTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#000",
    fontFamily: fonts.roboto,
  },

  plus: {
    width: 22,
    height: 22,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 5,
    width: sizes.width / 1.1,
    alignSelf: "center",
    marginTop: 15,
  },
  add: {
    width: 12,
    height: 12,
    marginRight: 5,
    tintColor: "#7A7A7A",
  },

  proButton: {
    width: 56,
    height: 31,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  proButtonText: {
    color: "#FFF",
    fontFamily: fonts.medium,
    marginLeft: 3,
  },
  proStar: {
    tintColor: "#FFF",
    width: 10,
    height: 10,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    width: sizes.width / 1.09,
    alignSelf: "center",
  },
  store: {
    color: "#FFF",
    fontFamily: fonts.regular,
    fontSize: 16,
  },
  notification: {
    width: 46,
    height: 29,
  },
  top: {
    marginTop: 10,
  },
  addPr: {
    width: 14.76,
    height: 14.78,
  },
  linearAddProduct: {
    width: 121,
    justifyContent: "center",
    alignItems: "center",
    height: 26,
    marginLeft: 10,
    borderRadius: 8,
  },
  addProduct: {
    width: 111,
    justifyContent: "center",
    alignItems: "center",
    height: 26,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
  },
  addProductText: {
    color: "#FFF",
    fontSize: 13,
    fontFamily: fonts.medium,
    marginLeft: 5,
  },
});

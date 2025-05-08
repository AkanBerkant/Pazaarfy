import React from "react";
import {
  Alert,
  Image,
  Linking,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";

import {
  useNavigation,
  StackActions,
  useIsFocused,
} from "@react-navigation/native";
import { Share } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Asset } from "expo-asset";
import { useAtom, useAtomValue } from "jotai";
import { useTranslation } from "react-i18next";
import HapticFeedback from "react-native-haptic-feedback";
import { Modalize } from "react-native-modalize";
import ImagesSlider from "./ImagesSlider";

import CustomVideo from "../../../components/CustomVideo";
import routes from "../../../constants/routes";
import { useActionStatus } from "../../../hooks/useActionStatus";
import { sizes } from "../../../theme";
import fonts from "../../../theme/fonts";
import { helpAtom, userAtom } from "../../../utils/atoms";
import Emitter from "../../../utils/emitter";
import {
  getPlatformFromUrl,
  platformLogos,
} from "../../../utils/platform-colors";
import * as Queries from "../../../utils/queries";
import TwitterWidget from "../../BablContentList/TwitterWidget";

import Rebabls from "./Rebabls";
import TapToEnter from "./TapToEnter";
import BablContentModal from "../../BablContent/BablContentModal";
import { BackHeader } from "../../../components";

const backIcon = require("../../../assets/back.png");
const commentIcon = require("../../../assets/comments.png");
const fireIcon = require("../../../assets/firee.png");
const heartEmptyIcon = require("../../../assets/like.png");
const heartFillIcon = require("../../../assets/like.png");
const sendIcon = require("../../../assets/ned.png");
const reloadIcon = require("../../../assets/reload.png");
const savedIcon = require("../../../assets/saved.png");

const HotBablDetailContent = ({
  bablId,
  onPress,
  repostedBy,
  listenId,
  initialState = false,
  forcePlay = false,
  showBack = true,
  isEmbed,
  index,
  showIndex,
}) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [shouldPlayB, setShouldPlay] = React.useState(initialState);
  const [lock, setLock] = React.useState(false);
  const shouldPlay = (shouldPlayB || forcePlay) && !lock;
  const [helpState, setHelpState] = useAtom(helpAtom);

  const currentUser = useAtomValue(userAtom);
  const modalizeRef = React.useRef();

  const queryClient = useQueryClient();
  const [localAsset, setLocalAsset] = React.useState();

  const { t, i18n } = useTranslation();

  const { data } = useQuery(
    ["BABL", bablId],
    () => {
      return Queries.getBablById(bablId);
    },
    {
      onSuccess: (res) => {
        setCurrentCount(res.likeCount);
        setCurrentRebablCount(res.rebablCount);
      },
      placeholderData: {
        babl: {
          user: {},
        },
        stats: {
          boostedCoin: 0,
        },
        likeCount: 0,
        commentCount: 0,
        rebablCount: 0,
      },
      cacheTime: 0,
    },
  );

  const { _id, user, title, coverVideo, cover, coverItem } = data.babl;
  const { babl, commentCount } = data;

  const onShareBabl = async () => {
    try {
      await Share.share({
        message: `${title}\n\n${t("ShareLink")}: pazaarfy://babl/${babl?._id}`,
      });
    } catch (error) {}
  };

  React.useEffect(() => {
    if (coverVideo && !localAsset) {
      Asset.loadAsync([coverVideo]).then((res) => {
        setLocalAsset(res[0].localUri);
      });
    }
  }, [coverVideo]);

  React.useEffect(() => {
    if (shouldPlay) {
      Queries.viewBabl(_id);
    }
  }, [shouldPlay, _id]);

  React.useEffect(() => {
    const listener = Emitter.on("RUN_DETAIL", (p) => {
      setShouldPlay(p === listenId);
    });

    return () => {
      return listener.remove();
    };
  }, []);

  const {
    actionStatus: likeStatus,
    currentCount: likeCount,
    setCurrentCount,
    onNegativeAction,
    onPositiveAction,
  } = useActionStatus({
    initialCount: data.likeCount,
    initialStatus: data.likeStatus,
  });

  const {
    actionStatus: rebablStatus,
    currentCount: rebablCount,
    setCurrentCount: setCurrentRebablCount,
    onNegativeAction: onRebablNegativeAction,
    onPositiveAction: onRebablPositiveAction,
  } = useActionStatus({
    initialCount: data.rebablCount,
    initialStatus: data.rebablStatus,
  });

  const likeBablMutation = useMutation(
    () => {
      return Queries.likeBabl(bablId);
    },
    {
      onMutate: () => {
        onPositiveAction();
      },
      onSuccess: (res) => {
        queryClient.invalidateQueries(["LIKED_BABLS"]);
      },
      onError: (err) => {},
    },
  );

  const unlikeBablMutation = useMutation(
    () => {
      return Queries.unlikeBabl(bablId);
    },
    {
      onMutate: () => {
        onNegativeAction();
      },
      onSuccess: (res) => {
        queryClient.invalidateQueries(["LIKED_BABLS"]);
      },
      onError: (err) => {},
    },
  );

  const rebablMutation = useMutation(
    () => {
      return Queries.rebabl(bablId);
    },
    {
      onMutate: () => {
        onRebablPositiveAction();
      },
      onError: (err) => {},
    },
  );

  const undoRebablMutation = useMutation(
    () => {
      return Queries.undoRebabl(bablId);
    },
    {
      onMutate: () => {
        onRebablNegativeAction();
      },
      onError: (err) => {},
    },
  );

  const onLikePress = () => {
    if (unlikeBablMutation.isLoading || likeBablMutation.isLoading) return null;

    HapticFeedback.trigger("impactLight");

    if (likeStatus) {
      unlikeBablMutation.mutate();
    } else {
      likeBablMutation.mutate();
    }
  };

  const onRebablPress = () => {
    if (undoRebablMutation.isLoading || rebablMutation.isLoading) {
      return null;
    }

    HapticFeedback.trigger("impactLight");

    if (rebablStatus) {
      undoRebablMutation.mutate();
    } else {
      rebablMutation.mutate();
    }
  };

  const { datak } = useQuery(["BOOKMARKS"], Queries.listBookmarkedBabls, {
    placeholderData: [],
  });

  const bookmarkMutation = useMutation(Queries.bookmarkBabl, {
    onSuccess: (res) => {
      queryClient.invalidateQueries(["BOOKMARKS"]);
      notify({
        title: t("BablSaved"),
      });
    },
    onError: (err) => {},
  });

  const [visible, setVisible] = React.useState(null);
  const icons = [
    {
      image: likeStatus ? heartFillIcon : heartEmptyIcon,
      number: likeCount,
      width: 25.91,
      height: 23.16,
      tintColor: likeStatus ? "red" : "#FFF",
      onPress: onLikePress,
      onTextPress: () => {
        navigation.navigate(routes.BablLikes, { bablId });
      },
    },

    {
      image: commentIcon,
      number: commentCount,
      width: 25.91,
      height: 23.16,
      onPress: (e) => {
        navigation.navigate(routes.Comments, { bablId });
      },
    },
    {
      image: require("../../../assets/send.png"),
      number: data?.viewCount,
      width: 23.91,
      height: 27.81,
      tintColor: "#FFF",
      onPress: onShareBabl, // <-- Buraya değişiklik
    },
  ];

  const onUserPress = () => {
    navigation.dispatch(
      StackActions.push(routes.UserProfile, {
        userId: user?._id,
      }),
    );
  };

  const onRebablsClosePress = () => {
    modalizeRef.current?.close();
  };

  const followMutation = useMutation(Queries.follow, {
    onMutate: () => {
      onPositiveAction();
    },
    onError: (err) => {},
  });

  const unfollowMutation = useMutation(Queries.unfollow, {
    onMutate: () => {
      onNegativeAction();
    },
    onError: (err) => {},
  });

  const onMessagePress = () => {
    navigation.navigate(routes.MessageScreen, {
      item: {
        user: {
          _id: data?.babl?.user._id,
          firstname: data?.babl?.user.username,
          username: data?.babl?.user?.username,
          photo: data?.babl?.user?.photo,
        },
      },
    });
  };

  const videoItem = (
    <CustomVideo
      source={{ uri: localAsset }}
      style={[
        styles.image,
        isEmbed && {
          transform: [
            {
              translateY: -30,
            },
          ],
        },
      ]}
      ignoreSilentSwitch="ignore"
      resizeMode="contain"
      volume={0.5}
      shouldPlay={shouldPlay && isFocused}
      isLooping
      isMuted={false}
    />
  );

  const { data: profileData } = useQuery(
    ["PROFILE_X", data.babl.user._id],
    async () => {
      const [profile, followInfo] = await Promise.all([
        Queries.getUserById(data.babl.user._id),
        Queries.getFollowInfo(data.babl.user._id),
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
      onError: (err) => {},
      placeholderData: {
        profile: {},
        followInfo: {},
      },
    },
  );

  const profile = profileData?.profile || {};
  const followInfo = profileData?.followInfo || {};

  const { actionStatus: followStatus, currentCount: followerCount } =
    useActionStatus({
      initialCount: followInfo.followerCount,
      initialStatus: followInfo.followingStatus,
    });

  const onFollowPress = () => {
    if (unfollowMutation.isLoading || followMutation.isLoading) return null;

    if (followStatus) {
      unfollowMutation.mutate(data?.babl?.user?._id);
    } else {
      followMutation.mutate(data?.babl?.user?._id);
    }
  };

  const imgItem = (
    <ImagesSlider
      shouldPlay={shouldPlay && isFocused}
      followStatus={followStatus}
      items={data.babl.items}
      onMessagePress={onMessagePress}
      onFollowPress={onUserPress}
    />
  );

  const showedItem = imgItem;

  const [imageModal, setImageModal] = React.useState(null);

  <Text style={styles.title} numberOfLines={1}>
    {title?.length > 35 ? title?.substring(0, 35) + "..." : title}
  </Text>;
  return (
    <>
      <>
        <View
          style={styles.container}
          disabled={!onPress}
          onPress={onPress}
          activeOpacity={0.9}
          onLongPress={() => {
            return setLock(true);
          }}
          onPressOut={() => {
            return setLock(false);
          }}
        >
          <BackHeader
            title={t("LikedStore")}
            textBg={"#050608"}
            bg={"#0D0F15"}
          />

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#0D0F15",
              padding: 10,
            }}
          >
            <TouchableOpacity style={styles.marginRowTop} onPress={onUserPress}>
              <Image style={styles.pp} source={{ uri: user?.photo }} />
              <Text style={styles.name}>{user?.username}</Text>
            </TouchableOpacity>
            <View
              style={{
                backgroundColor: "#1D1E20",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 99,
                padding: 10,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontFamily: fonts.bold,
                  fontSize: 12,
                }}
              >
                İstanbul / Turkey
              </Text>
            </View>
          </View>

          <View>{showedItem}</View>

          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              width: sizes.width / 1.1,
              alignSelf: "center",
            }}
          >
            <BablContentModal
              bablId={bablId}
              bablContent={{ ...babl }}
              user={user}
              visible={visible}
              onClose={() => {
                setVisible(false);
              }}
            />

            <View
              style={{
                flexDirection: "row",
              }}
            >
              {icons.map((item, index) => {
                if (item.disabled) return null;

                return (
                  <TouchableOpacity
                    key={`detail_icon_${index}`}
                    onPress={item.onPress}
                    disabled={item.disabled}
                    style={styles.center}
                  >
                    <Image
                      source={item?.image}
                      resizeMode="contain"
                      style={[
                        styles.icon,
                        {
                          width: 25.91,
                          height: 22.16,
                          tintColor: item.tintColor,
                        },
                      ]}
                    />
                    <Text style={styles.number} onPress={item.onTextPress}>
                      {item?.number}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              onPress={() => {
                setVisible(!visible);
              }}
            >
              <Image
                style={{
                  width: 25.91,
                  height: 22.16,
                  marginTop: 10,
                }}
                resizeMode="contain"
                source={savedIcon}
              />
            </TouchableOpacity>
          </View>
          <Text
            style={{
              width: sizes.width / 1.1,
              alignSelf: "center",
              color: "#fff",
              marginTop: 30,
              fontFamily: fonts.medium,
            }}
          >
            {data?.babl?.title}
          </Text>
        </View>

        {shouldPlay && (
          <Modalize
            adjustToContentHeight
            handlePosition="inside"
            handleStyle={styles.handleStyle}
            modalStyle={styles.modalStyle}
            scrollViewProps={{
              scrollEnabled: false,
            }}
            ref={modalizeRef}
          >
            <Rebabls
              title={title}
              bablId={bablId}
              cover={cover}
              onClose={onRebablsClosePress}
            />
          </Modalize>
        )}
      </>
    </>
  );
};

export default HotBablDetailContent;

const stylesAndroid = StyleSheet.create({
  itemLeftBetween: {
    justifyContent: "space-between",
    height: (sizes.height + StatusBar.currentHeight) / 1.03,
    width: sizes.width / 1.2,
    padding: 15,
  },
  title: {
    color: "#FFF",
    width: sizes.width / 1.5,
    fontFamily: fonts.medium,
    zIndex: 99,

    fontSize: 20,
    marginTop: Platform.OS == "android" ? 25 : 30,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,

    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
      },
      android: {
        textShadowColor: "rgba(0, 0, 0, 0.8)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        elevation: 5, // Android'de gölge için
      },
    }),
    elevation: 2, // Sadece Android için gerekliadowColor: 'rgba(0, 0, 0, 0.5)',
  },
  image: {
    width: sizes.width,
    position: "absolute",
    height: sizes.height + StatusBar.currentHeight,
  },
  container: {
    flex: 1,
  },
  between: {
    justifyContent: "space-between",
    flexDirection: "row",
    width: sizes.width,
  },
  handleStyle: {
    backgroundColor: "#212121",
    height: 5,
    width: 36,
  },
  modalStyle: {
    borderTopRightRadius: 26,
    borderTopLeftRadius: 26,
    backgroundColor: "#101010",
    justifyContent: "space-between",
  },
  rebablButton: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 26,
    backgroundColor: "#5DFF77",
    justifyContent: "center",
    alignItems: "center",
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 18,
    alignSelf: "flex-start",
  },
  rebablButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFF",
    fontFamily: fonts.roboto,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
      },
      android: {
        textShadowColor: "rgba(0, 0, 0, 0.8)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        elevation: 5, // Android'de gölge için
      },
    }),
  },
  marginRowTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  pp: {
    width: 33,
    height: 33,
    borderRadius: 33,
    backgroundColor: "#CDCDCD",
    marginBottom: Platform.OS == "ios" ? 0 : 50,
  },
  name: {
    color: "#FFF",
    fontSize: 13,
    marginLeft: 12,
    marginBottom: Platform.OS == "ios" ? 0 : 50,
    fontFamily: fonts.medium,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
      },
      android: {
        textShadowColor: "rgba(0, 0, 0, 0.8)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        elevation: 5, // Android'de gölge için
      },
    }),
    elevation: 2, // Sadece Android için gerekliadowColor: 'rgba(0, 0, 0, 0.5)',
  },
  gallery: {
    width: 27,
    height: 24,
    marginLeft: 10,
  },
  itemRightBetween: {
    justifyContent: "space-between",

    padding: 15,
  },
  disableTitle: {
    color: "#FFF",
    fontWeight: "bold",
    zIndex: 99,
    fontSize: 26,
    width: sizes.width / 3,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  backImgContainer: {
    flexDirection: "row",

    marginTop: 10,
    width: sizes.width,
    justifyContent: "space-between",
  },
  backImg: {
    tintColor: "#FFF",
    width: 25,

    height: 25,

    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 0.1,

    elevation: 2, // Sadece Android için gerekliadowColor: 'rgba(0, 0, 0, 0.5)',
  },
  rankContainer: {
    backgroundColor: "#343535",
    justifyContent: "center",
    alignItems: "center",
    width: 32,
    height: 32,
    marginTop: 30,
    right: 25,
    borderRadius: 32,
  },
  rank: {
    fontFamily: fonts.roboto,
    fontSize: 19,
    color: "#FFF",
    textAlign: "center",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,

    elevation: 2, // Sadece Android için gerekliadowColor: 'rgba(0, 0, 0, 0.5)',
  },
  alignCenter: {
    alignItems: "center",
  },
  eye: {
    width: 29,
    height: 29,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    marginLeft: Platform.OS == "ios" ? 10 : 0,
    elevation: 2, // Sadece Android için gerekliadowColor: 'rgba(0, 0, 0, 0.5)',
  },
  eyeText: {
    color: "#FFF",
    fontFamily: fonts.roboto,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    marginLeft: 15,
    marginBottom: 50,
    shadowRadius: 2,
    marginTop: 5,
    elevation: 2, // Sadece Android için gerekliadowColor: 'rgba(0, 0, 0, 0.5)',
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
      },
      android: {
        textShadowColor: "rgba(0, 0, 0, 0.8)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        elevation: 5, // Android'de gölge için
      },
    }),
  },
});

const stylesApple = StyleSheet.create({
  itemLeftBetween: {
    justifyContent: "space-between",
    height: (sizes.height + StatusBar.currentHeight) / 1.03,
    width: sizes.width / 1.2,
    padding: 15,
  },
  title: {
    color: "#FFF",

    fontFamily: fonts.bold,
    zIndex: 99,

    fontSize: 16,
    marginTop: 30,
    width: sizes.width / 1.2,
    marginLeft: 5,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,

    elevation: 2, // Sadece Android için gerekliadowColor: 'rgba(0, 0, 0, 0.5)',
  },
  image: {
    width: sizes.width,
    position: "absolute",
    height: sizes.height + StatusBar.currentHeight,
  },
  container: {
    flex: 1,
  },
  between: {
    justifyContent: "space-between",
    flexDirection: "row",
    width: sizes.width,
  },
  handleStyle: {
    backgroundColor: "#212121",
    height: 5,
    width: 36,
  },
  modalStyle: {
    borderTopRightRadius: 26,
    borderTopLeftRadius: 26,
    backgroundColor: "#101010",
    justifyContent: "space-between",
  },
  rebablButton: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 26,
    backgroundColor: "#5DFF77",
    justifyContent: "center",
    alignItems: "center",
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 18,
    alignSelf: "flex-start",
  },
  rebablButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFF",
    fontFamily: fonts.roboto,
  },
  marginRowTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  pp: {
    width: 33,
    height: 33,
    borderRadius: 33,
    backgroundColor: "#CDCDCD",
  },
  name: {
    color: "#FFF",
    fontSize: 13,
    marginLeft: 12,
    fontFamily: fonts.medium,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,

    elevation: 2, // Sadece Android için gerekliadowColor: 'rgba(0, 0, 0, 0.5)',
  },
  gallery: {
    width: 27,
    height: 24,
    marginLeft: 10,
  },
  itemRightBetween: {
    justifyContent: "space-between",
    height: (sizes.height + StatusBar.currentHeight) / 1.01,
    padding: 15,
  },
  disableTitle: {
    color: "#FFF",
    fontWeight: "bold",
    zIndex: 99,
    fontSize: 26,
    width: sizes.width / 3,
  },
  center: {
    alignItems: "center",
    marginTop: 10,
    width: 45,
    justifyContent: "center",
    height: 45,
  },
  number: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
    fontFamily: fonts.roboto,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2, // Sadece Android için gerekli
  },
  icon: {
    marginBottom: 5,
    tintColor: "white",
    shadowOpacity: 10,
    shadowColor: "#000",
    elevation: 5, // Yükseklik değerini ayarlayın
    shadowOffset: { width: 0, height: -0.2 },

    shadowRadius: 0,
  },
  positionIcon: {
    position: "absolute",
    bottom: sizes.width / 5,
  },
  tapToEnter: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    position: "absolute",
    right: -60,
    zIndex: 99,
    top: sizes.width / 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  tapToEnterText: {
    position: "absolute",
    color: "#FFF",
    fontSize: 12,
    alignSelf: "center",
    fontFamily: fonts.georgiaPro,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,

    elevation: 2, // Sadece Android için gerekliadowColor: 'rgba(0, 0, 0, 0.5)',
  },
  backImgContainer: {
    flexDirection: "row",

    marginTop: 10,
    width: sizes.width,
    justifyContent: "space-between",
  },
  backImg: {
    tintColor: "#FFF",
    width: 12,
    marginTop: 30,
    height: 20,
    marginRight: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 0.1,

    elevation: 2, // Sadece Android için gerekliadowColor: 'rgba(0, 0, 0, 0.5)',
  },
  rankContainer: {
    backgroundColor: "#343535",
    justifyContent: "center",
    alignItems: "center",
    width: 32,
    height: 32,
    marginTop: 30,
    right: 25,
    borderRadius: 32,
  },
  rank: {
    fontFamily: fonts.roboto,
    fontSize: 19,
    color: "#FFF",
    textAlign: "center",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,

    elevation: 2, // Sadece Android için gerekliadowColor: 'rgba(0, 0, 0, 0.5)',
  },
  alignCenter: {
    alignItems: "center",
  },
  eye: {
    width: 29,
    height: 29,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    marginLeft: 10,
    elevation: 2, // Sadece Android için gerekliadowColor: 'rgba(0, 0, 0, 0.5)',
  },
  eyeText: {
    color: "#FFF",
    fontFamily: fonts.roboto,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    marginLeft: 10,
    marginBottom: 10,
    shadowRadius: 2,
    elevation: 2, // Sadece Android için gerekliadowColor: 'rgba(0, 0, 0, 0.5)',
  },
});

const styles = Platform.OS === "android" ? stylesAndroid : stylesApple;

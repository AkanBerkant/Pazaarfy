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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Asset } from "expo-asset";
import { useAtom, useAtomValue } from "jotai";
import { useTranslation } from "react-i18next";
import FastImage from "react-native-fast-image";
import HapticFeedback from "react-native-haptic-feedback";
import { Modalize } from "react-native-modalize";
import { BoxShadow } from "react-native-shadow";

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
      image: savedIcon,
      number: null,
      width: 23.91,
      height: 27.81,
      tintColor: "#FFF",
      onPress: () => {
        setVisible(!visible);
      },
    },

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
      image: reloadIcon,
      number: rebablCount,
      width: 25.91,
      height: 23.16,
      disabled: currentUser?._id === user?._id,
      tintColor: rebablStatus ? "#5DFF77" : "#FFF",
      onPress: onRebablPress,
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

  const imgItem = (
    <FastImage
      source={{ uri: cover }}
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
    />
  );

  const showedItem =
    coverItem?.resourceType === "TEXT_TWITTER" ? (
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          zIndex: -99,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TwitterWidget item={coverItem} shouldPlay={shouldPlay && isFocused} />
      </View>
    ) : localAsset ? (
      videoItem
    ) : (
      imgItem
    );

  const [imageModal, setImageModal] = React.useState(null);
  return (
    <>
      {Platform.OS == "ios" ? (
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
            {showedItem}

            <View style={styles.between}>
              <View
                style={[
                  styles.itemLeftBetween,
                  !showBack && {
                    height: (sizes.height + StatusBar.currentHeight) / 1.1,
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={navigation.goBack}
                  disabled={!showBack}
                  style={styles.backImgContainer}
                >
                  <View
                    style={{
                      justifyContent: "space-between",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    {showBack && (
                      <Image
                        resizeMode="contain"
                        source={backIcon}
                        style={styles.backImg}
                      />
                    )}
                    <Text style={styles.title} numberOfLines={1}>
                      {title?.length > 35
                        ? title?.substring(0, 35) + "..."
                        : title}
                    </Text>

                    <View style={styles.backImg} />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate(routes.ImagesSlider, { data: data });
                  }}
                  style={styles.tapToEnter}
                >
                  <TapToEnter />

                  <Text style={styles.tapToEnterText}>
                    {t("TapScreenToEnter")}
                  </Text>
                </TouchableOpacity>

                <View
                  style={
                    isEmbed
                      ? {
                          transform: [
                            {
                              translateY: -40,
                            },
                          ],
                        }
                      : {}
                  }
                >
                  <TouchableOpacity
                    style={styles.marginRowTop}
                    onPress={onUserPress}
                  >
                    <Image style={styles.pp} source={{ uri: user?.photo }} />
                    <Text style={styles.name}>{user?.username}</Text>
                  </TouchableOpacity>
                </View>
              </View>

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
                style={[
                  styles.itemRightBetween,
                  isEmbed
                    ? {
                        transform: [
                          {
                            translateY: -90,
                          },
                        ],
                      }
                    : {},
                ]}
              >
                <View style={styles.disableTitle} />

                <View style={styles.between}>
                  <View
                    style={[
                      styles.positionIcon,
                      {
                        bottom:
                          sizes.width > 375
                            ? sizes.width / 5
                            : sizes.width / 12,
                      },
                    ]}
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
                          <Text
                            style={styles.number}
                            onPress={item.onTextPress}
                          >
                            {item?.number}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  <View style={styles.alignCenter}>
                    <Image
                      resizeMode="contain"
                      style={styles.eye}
                      source={require("../../../assets/eyed.png")}
                    />
                    <Text style={styles.eyeText}>{data?.viewCount}</Text>
                  </View>
                </View>
              </View>
            </View>
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
      ) : (
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
            {showedItem}

            <View style={styles.between}>
              <View
                style={[
                  styles.itemLeftBetween,
                  !showBack && {
                    height: (sizes.height + StatusBar.currentHeight) / 1.1,
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={navigation.goBack}
                  disabled={!showBack}
                  style={styles.backImgContainer}
                >
                  <View
                    style={[
                      styles.row,
                      isEmbed && {
                        transform: [
                          {
                            translateY: -30,
                          },
                        ],
                      },
                    ]}
                  >
                    {showBack && (
                      <BoxShadow
                        setting={{
                          width: 20,
                          height: 20,
                          color: "#E5E5E5",
                          border: 10,
                          radius: 10,
                          opacity: 0.3,
                          x: 0,
                          y: 2,
                          style: {
                            marginTop: 25,
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: 10,
                          },
                        }}
                      >
                        <Image
                          resizeMode="contain"
                          source={backIcon}
                          style={styles.backImg}
                        />
                      </BoxShadow>
                    )}
                    <Text style={[styles.title]} numberOfLines={1}>
                      {title?.length > 35
                        ? title?.substring(0, 35) + "..."
                        : title}
                    </Text>
                  </View>
                </TouchableOpacity>

                <BablContentModal
                  bablId={bablId}
                  bablContent={{ ...babl }}
                  user={user}
                  visible={visible}
                  onClose={() => {
                    setVisible(false);
                  }}
                />

                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate(routes.ImagesSlider, { data: data });
                  }}
                  style={styles.tapToEnter}
                >
                  <TapToEnter />

                  <Text style={styles.tapToEnterText}>
                    {t("TapScreenToEnter")}
                  </Text>
                </TouchableOpacity>

                <View
                  style={
                    isEmbed
                      ? {
                          transform: [
                            {
                              translateY: -40,
                            },
                          ],
                        }
                      : {}
                  }
                >
                  <TouchableOpacity
                    style={styles.marginRowTop}
                    onPress={onUserPress}
                  >
                    <Image style={styles.pp} source={{ uri: user?.photo }} />
                    <Text style={styles.name}>{user?.username}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={[
                  styles.itemRightBetween,
                  isEmbed
                    ? {
                        transform: [
                          {
                            translateY: -90,
                          },
                        ],
                      }
                    : {},
                ]}
              >
                <View style={styles.disableTitle} />

                {!!data?.babl?.coverUrl &&
                  data?.babl?.coverUrl !== "MANUAL" && (
                    <TouchableOpacity
                      onPress={() => {
                        Alert.alert(t("goOrigin"), null, [
                          {
                            text: t("yes"),
                            onPress: () => {
                              Linking.openURL(data?.babl?.coverUrl);
                            },
                          },
                          {
                            text: t("no"),
                          },
                        ]);
                      }}
                    >
                      <Image
                        resizeMode="contain"
                        style={{
                          width: 30,
                          height: 30,
                          marginLeft: 7,
                          marginTop: 40,
                        }}
                        source={
                          platformLogos[
                            getPlatformFromUrl(data?.babl?.coverUrl)
                          ]
                        }
                      />
                    </TouchableOpacity>
                  )}

                <View style={styles.between}>
                  <View
                    style={[
                      styles.positionIcon,
                      {
                        bottom:
                          sizes.width > 375
                            ? sizes.width / 3.5
                            : sizes.width / 12,
                      },
                    ]}
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
                          <BoxShadow
                            setting={{
                              width: 20,
                              height: 20,
                              color: "#E5E5E5",
                              border: 10,
                              radius: 10,
                              opacity: 0.3,
                              x: 0,
                              y: 2,
                              style: {
                                justifyContent: "center",
                                alignItems: "center",
                                marginRight: 0,
                              },
                            }}
                          >
                            <Image
                              source={item?.image}
                              resizeMode="contain"
                              style={[
                                styles.icon,
                                {
                                  width: 25.91,
                                  height: 22.16,
                                  tintColor: item?.tintColor,
                                },
                              ]}
                            />
                          </BoxShadow>
                          <Text
                            style={styles.number}
                            onPress={item.onTextPress}
                          >
                            {item?.number}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  <View style={styles.alignCenter}>
                    <BoxShadow
                      setting={{
                        width: 20,
                        height: 20,
                        color: "#E5E5E5",
                        border: 10,
                        radius: 10,
                        opacity: 0.3,
                        x: 0,
                        y: 2,
                        style: {
                          justifyContent: "center",
                          alignItems: "center",

                          marginLeft: 15,
                        },
                      }}
                    >
                      <Image
                        resizeMode="contain"
                        style={styles.eye}
                        source={require("../../../assets/eyed.png")}
                      />
                    </BoxShadow>
                    <Text style={styles.eyeText}>{data?.viewCount}</Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      bottom: 15,
                      right: 20,
                    }}
                    onPress={() => {
                      Alert.alert(t("WouldYouLikeToGoOriginalContent"), null, [
                        {
                          text: t("no"),
                        },
                        {
                          text: t("yes"),
                          onPress: () => {
                            Linking.openURL(data?.babl?.coverUrl);
                          },
                        },
                      ]);
                    }}
                  >
                    <Image
                      source={
                        platformLogos[getPlatformFromUrl(data?.babl?.coverUrl)]
                      }
                      resizeMode="contain"
                      style={{
                        height: 36,
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </>
      )}
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
    justifyContent: "space-between",
  },
  between: {
    justifyContent: "space-between",
    flexDirection: "row",
    width: sizes.width,
    marginBottom: Platform.OS == "ios" ? 0 : 50,
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
    marginTop: 10,
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
  icon: {
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
    elevation: 2, // Sadece Android için gerekliadowColor: 'rgba(0, 0, 0, 0.5)'
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
    justifyContent: "space-between",
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
    marginTop: 10,
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

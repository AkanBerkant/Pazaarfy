/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/jsx-no-useless-fragment */
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  CommonActions,
  useNavigation,
  StackActions,
} from "@react-navigation/native";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useTranslation } from "react-i18next";
import HapticFeedback from "react-native-haptic-feedback";
import LinearGradient from "react-native-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import routes from "../../constants/routes";
import { useActionStatus } from "../../hooks/useActionStatus";
import { sizes } from "../../theme";
import fonts from "../../theme/fonts";
import { bablFormAtom, userAtom } from "../../utils/atoms";
import * as Queries from "../../utils/queries";

import BablContentModal from "./BablContentModal";
import BablHeaderAddIcon from "./BablHeaderAddIcon";
import BablHeaderBackIcon from "./BablHeaderBackIcon";
import BablHeaderCloseIcon from "./BablHeaderCloseIcon";
import BablHeaderOptionsIcon from "./BablHeaderOptionsIcon";
import InformationModal from "./InformationModal";

const BablHeader = (bablContent) => {
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();
  const currentUser = useAtomValue(userAtom);
  const { t, i18n } = useTranslation();
  const resetBablForm = useResetAtom(bablFormAtom);

  const {
    _id: bablId,
    title,
    user,
    isInteractionEnabled,
    allowedInteractionTypes,
    repostedBy,
    onCollectionPress,
  } = bablContent;

  const isRebabl = !!bablContent.rebabl;

  const history = navigation
    .getState()
    .routes.filter((item) => {
      return item.name === routes.BablContent;
    })
    .slice(-3);

  const bablContentHistory = history.reduce((prev, cur, curIndex, arr) => {
    if (curIndex < arr.length - 1) {
      return [
        ...prev,
        cur,
        {
          split: true,
        },
      ];
    }

    return [...prev, cur];
  }, []);

  const { data: followInfo } = useQuery(
    ["BABL_FOLLOW_STATE", bablId],
    () => {
      return Queries.getBablFollowInfo(bablId);
    },
    {
      onSuccess: (res) => {
        setCurrentCount(res.bablFollowerCount);
      },
      onError: (err) => {
        console.log("err", err);
      },
      placeholderData: {},
      enabled: !!bablId,
    },
  );

  const {
    actionStatus: followStatus,
    currentCount: followerCount,
    setCurrentCount,
    onNegativeAction,
    onPositiveAction,
  } = useActionStatus({
    initialCount: followInfo.bablFollowerCount,
    initialStatus: followInfo.bablFollowingStatus,
  });

  const followMutation = useMutation(Queries.bablFollow, {
    onMutate: () => {
      onPositiveAction();
    },
    onSuccess: (res) => {
      console.log("res", res);
    },
    onError: (err) => {
      console.log("err", err);
    },
  });

  const unfollowMutation = useMutation(Queries.bablUnfollow, {
    onMutate: () => {
      onNegativeAction();
    },
    onSuccess: (res) => {
      console.log("res", res);
    },
    onError: (err) => {
      console.log("err", err);
    },
  });

  const sendRequestMutation = useMutation(Queries.sendRequest, {
    onSuccess: (res) => {
      Alert.alert(t("requestSent"));
    },
    onError: (err) => {
      console.log("err", err);
    },
  });

  const onFollowPress = () => {
    HapticFeedback.trigger("impactLight");
    if (unfollowMutation.isLoading || followMutation.isLoading) return null;

    if (followStatus) {
      unfollowMutation.mutate(bablId);
    } else {
      followMutation.mutate(bablId);
    }
  };

  const [modal, setModal] = React.useState(null);

  const [visible, setVisible] = React.useState(false);

  return (
    <View
      style={{
        paddingTop: top,
        paddingBottom: 13,
        backgroundColor: "#191919",
        zIndex: 99,
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {bablContentHistory.length > 1 && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            paddingHorizontal: 12,
            paddingBottom: 22,
            borderBottomWidth: 1,
            borderBottomColor: "#232323",
          }}
        >
          <TouchableOpacity onPress={navigation.goBack}>
            <BablHeaderBackIcon />
          </TouchableOpacity>
          {bablContentHistory.map((item) => {
            if (item.split) {
              return (
                <Image
                  source={require("../../assets/linearsm.png")}
                  resizeMode="contain"
                  style={{
                    width: 7,
                    height: 2,
                  }}
                />
              );
            }

            return (
              <>
                {item.params.bablId === bablId ? (
                  <LinearGradient
                    style={{
                      height: 24,
                      flex: 1,
                      borderRadius: 24,
                      justifyContent: "center",
                      alignItems: "center",
                      overflow: "hidden",
                      padding: 1,
                    }}
                    colors={["#F9B092", "#D5D399", "#0AAFF6"]}
                  >
                    <TouchableOpacity
                      style={{
                        height: 20,
                        alignSelf: "stretch",
                        borderRadius: 24,
                        margin: 1,
                        backgroundColor: "#000",
                        overflow: "hidden",
                      }}
                      onPress={() => {
                        const routeIndex = navigation
                          .getState()
                          .routes.findIndex((r) => {
                            return r.key === item.key;
                          });

                        navigation.dispatch(
                          CommonActions.reset({
                            index: item.routeIndex,
                            routes: navigation
                              .getState()
                              .routes.slice(0, routeIndex + 1),
                          }),
                        );
                      }}
                    >
                      <ImageBackground
                        style={{
                          flex: 1,
                        }}
                        source={{
                          uri: item.params.coverCropped || item.params.cover,
                        }}
                      />
                    </TouchableOpacity>
                  </LinearGradient>
                ) : (
                  <TouchableOpacity
                    style={{
                      height: 24,
                      flex: 1,
                      borderRadius: 24,

                      overflow: "hidden",
                    }}
                    onPress={() => {
                      const routeIndex = navigation
                        .getState()
                        .routes.findIndex((r) => {
                          return r.key === item.key;
                        });

                      navigation.dispatch(
                        CommonActions.reset({
                          index: item.routeIndex,
                          routes: navigation
                            .getState()
                            .routes.slice(0, routeIndex + 1),
                        }),
                      );
                    }}
                  >
                    <ImageBackground
                      style={{
                        flex: 1,
                      }}
                      source={{ uri: item.params.cover }}
                    />
                  </TouchableOpacity>
                )}
              </>
            );
          })}
          <TouchableOpacity
            onPress={() => {
              const routeIndex = navigation.getState().routes.findIndex((r) => {
                return r.name === routes.BablContent;
              });

              navigation.dispatch(
                CommonActions.reset({
                  index: routeIndex - 1,
                  routes: navigation.getState().routes.slice(0, routeIndex),
                }),
              );
            }}
          >
            <BablHeaderCloseIcon />
          </TouchableOpacity>
        </View>
      )}

      <View
        style={{
          paddingTop: bablContentHistory.length > 1 ? 0 : 13,
          paddingHorizontal: bablContentHistory.length > 1 ? 10 : 4,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: sizes.width,
          alignSelf: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {bablContentHistory.length <= 1 && (
            <TouchableOpacity
              onPress={navigation.goBack}
              style={{
                width: 40,

                height: 30,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <BablHeaderBackIcon />
            </TouchableOpacity>
          )}

          <View
            style={{
              maxWidth: Dimensions.get("window").width * 0.5,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity onPress={navigation.goBack}>
                {repostedBy && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={require("../../assets/reb.png")}
                      style={{
                        width: 15,
                        height: 10,
                      }}
                    />
                    <Text
                      pointerEvents="none"
                      style={{
                        fontSize: 10,
                        fontFamily: "Roboto-Italic",
                        color: "#FFF",
                      }}
                    >
                      {i18n.language == "en" ? (
                        <>{`${t("rebabledby")} ${repostedBy.username}`}</>
                      ) : (
                        <>{`${repostedBy.username} ${t("rebabledby")}`}</>
                      )}
                    </Text>
                  </View>
                )}
                <Text
                  pointerEvents="none"
                  style={{
                    fontSize: 16,
                    fontFamily: fonts.roboto,
                    color: "#FFF",
                    marginTop: 2,
                    width: sizes.width / 2.4,
                  }}
                >
                  {title}
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.dispatch(
                  StackActions.push(routes.UserProfile, {
                    userId: user._id,
                  }),
                );
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 2,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: "Roboto-Italic",
                    color: "#FFF",
                  }}
                >
                  {`by ${user?.username}`}
                </Text>
                {!!bablContent.text && (
                  <TouchableOpacity
                    onPress={() => {
                      setVisible(!visible);
                    }}
                  >
                    <Image
                      resizeMode="contain"
                      source={require("../../assets/infok.png")}
                      style={{
                        width: 14,
                        height: 14,
                        marginLeft: 5,
                      }}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <BablContentModal
          onCollectionPress={onCollectionPress}
          bablId={bablId}
          isRebabl={isRebabl}
          bablContent={bablContent}
          user={user}
          visible={modal}
          onClose={() => {
            setModal(false);
          }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {isInteractionEnabled && (
            <TouchableOpacity
              style={{
                marginRight: 5,
                marginTop: 3,
              }}
              onPress={() => {
                resetBablForm();
                navigation.navigate(routes.CreateBablCategories, {
                  allowedCategories: allowedInteractionTypes,
                  onDone: (items) => {
                    const itemsArr = Object.values(items)
                      .reduce((prev, cur) => {
                        return [...prev, ...Object.values(cur)];
                      }, [])
                      .map((item) => {
                        return {
                          ...item,
                          type: item.resourceType,
                        };
                      });

                    if (!itemsArr.length) {
                      return Alert.alert(t("PleaseSelectContent"));
                    }

                    Alert.alert(
                      null,
                      `${itemsArr.length} ${t("YouWillSendARequestToAddContentAreYouSure")}`,
                      [
                        {
                          text: t("No"),
                        },
                        {
                          text: t("Yes"),
                          onPress: () => {
                            navigation.goBack();
                            sendRequestMutation.mutate({
                              bablId,
                              items: itemsArr,
                            });
                          },
                        },
                      ],
                    );
                  },
                });
              }}
            >
              <Image
                source={require("../../assets/grayplus.png")}
                style={{
                  width: 30,
                  height: 30,
                }}
              />
            </TouchableOpacity>
          )}

          {user && user._id !== currentUser._id && (
            <TouchableOpacity
              onPress={onFollowPress}
              style={{
                borderRadius: 27,
                backgroundColor: "#0AAFF6",
                padding: 7,
                alignItems: "center",
                justifyContent: "center",
                minWidth: 64,
              }}
            >
              {unfollowMutation.isLoading || followMutation.isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text
                  style={{
                    color: "#FFF",
                    textAlign: "center",
                    fontFamily: fonts.roboto,
                    fontSize: 11,
                  }}
                >
                  {!followStatus ? t("Follow") : t("Followingg")}
                </Text>
              )}
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => {
              navigation.navigate(routes.BablFollowers, {
                bablId,
              });
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: "#FFF",
                marginLeft: 7,
                fontFamily: fonts.roboto,
                marginRight: 7,
              }}
            >
              ({followerCount})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              marginRight: 5,
              width: 30,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              setModal(true);
            }}
          >
            <BablHeaderOptionsIcon />
          </TouchableOpacity>
        </View>
      </View>

      {visible ? (
        <ImageBackground
          resizeMode="contain"
          style={bablContent.text.length > 60 ? styles.pop : styles.minipop}
          source={
            bablContent.text.length > 60
              ? require("../../assets/infopop.png")
              : require("../../assets/minipop.png")
          }
        >
          <TouchableOpacity
            onPress={() => {
              setVisible(false);
            }}
          >
            <Image
              source={require("../../assets/close.png")}
              resizeMode="contain"
              style={{
                width: 16,
                height: 16,
                tintColor: "gray",
                alignSelf: "flex-end",
                marginRight: 50,
                top: 20,
              }}
            />
          </TouchableOpacity>
          <Text
            style={{
              color: "#FFF",
              width:
                bablContent.text.length > 60
                  ? sizes.width / 1.5
                  : sizes.width / 1.3,
              marginTop: 30,
              alignSelf: "center",
            }}
          >
            {bablContent.text}
          </Text>
        </ImageBackground>
      ) : null}
      {/* <InformationModal
        content={bablContent.text}
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
      /> */}
    </View>
  );
};

export default BablHeader;

const styles = StyleSheet.create({
  pop: {
    width: sizes.width,
    height: 250,
    zIndex: 99,
    position: "absolute",
    top: 120,
    left: 3,
  },
  minipop: {
    width: sizes.width,
    height: 120,
    zIndex: 99,
    position: "absolute",
    top: 120,
    left: 15,
  },
});

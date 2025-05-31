import React from "react";
import {
  Alert,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useTranslation } from "react-i18next";
import HapticFeedback from "react-native-haptic-feedback";
import { Modalize } from "react-native-modalize";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { BoxShadow } from "react-native-shadow";

import { ButtonLinear } from "../../components";
import routes from "../../constants/routes";
import { useActionStatus } from "../../hooks/useActionStatus";
import { useBablAnalytics } from "../../hooks/useBablAnalytics";
import { sizes } from "../../theme";
import fonts from "../../theme/fonts";
import { helpAtom, userAtom } from "../../utils/atoms";
import * as Queries from "../../utils/queries";
import { splitArrayIntoChunks } from "../../utils/split-array";
import { templateCategories } from "../EditBabl/template-categories";

import Rebabls from "../tab/HotBabls/Rebabls";

import BablHeader from "./BablHeader";
import CollectionsModal from "./CollectionsModal";

const commentIcon = require("../../assets/com.png");
const fireIcon = require("../../assets/firee.png");
const heartEmptyIcon = require("../../assets/hearted.png");
const heartFillIcon = require("../../assets/heartt.png");
const linearBorderImg = require("../../assets/linearborder.png");
const sendIcon = require("../../assets/ned.png");
const reloadIcon = require("../../assets/reload.png");

export const BablUrlContext = React.createContext();

const BablContent = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { bottom } = useSafeAreaInsets();
  const [user, setUser] = useAtom(userAtom);
  const queryClient = useQueryClient();
  const currentPosRef = React.useRef(0);
  const modalizeRef = React.useRef();
  const modalizeRefCollections = React.useRef();
  const translateX = useSharedValue(0);
  const { t } = useTranslation();
  const [helpState, setHelpState] = useAtom(helpAtom);
  const { bablId } = route.params;
  useBablAnalytics(bablId);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: withSpring(translateX.value) }],
    };
  });

  const unlockBablMutation = useMutation(Queries.unlockBabl, {
    onSuccess: (res) => {
      setUser(async (prev) => {
        return {
          ...(await prev),
          coin: res.coin,
        };
      });

      queryClient.invalidateQueries(["BABL"]);
    },
    onError: (err) => {
      if (err?.response?.data?.message === "NOT_ENOUGH_COIN") {
        return Alert.alert(
          t("dontHaveEnoughCoins"),
          t("wouldYouLikeToBuyCoins"),
          [
            {
              text: t("no"),
              style: "cancel",
            },
            {
              text: t("yes"),
              isPreferred: true,
              onPress: () => {
                navigation.navigate(routes.Deposit);
              },
            },
          ],
        );
      }

      Alert.alert(t("errorOccuredUnlockingBabl"));
    },
  });

  const { data } = useQuery(
    ["BABL", route.params.bablId],
    () => {
      return Queries.getBablById(route.params.bablId);
    },
    {
      onSuccess: (res) => {
        setCurrentCount(res.likeCount);
        setCurrentRebablCount(res.rebablCount);
      },
      onError: (err) => {
        navigation.goBack();
      },
      placeholderData: {
        babl: {
          user: {},
          items: [],
          templateCategory: 0,
          template: 0,
        },
        likeCount: 0,
        commentCount: 0,
        rebablCount: 0,
        unlockStatus: false,
      },
    },
  );

  const paginatedBablContentQuery = useInfiniteQuery(
    ["PAGINATED_BABL_CONTENT", data.babl],
    async ({ pageParam = 0 }) => {
      await new Promise((resolve) => {
        return setTimeout(resolve, 700);
      });

      const { chunkSize } =
        templateCategories?.[data.babl.templateCategory]?.[
          data.babl.template
        ] || templateCategories[0][0];
      const bufferSize = chunkSize * 2;
      const totalPage = Math.ceil(data.babl.items.length / bufferSize);

      return {
        nextPageCursor: totalPage > pageParam + 1 ? pageParam + 1 : null,
        page: data.babl.items.slice(
          pageParam * bufferSize,
          (pageParam + 1) * bufferSize,
        ),
      };
    },
    {
      placeholderData: {
        pages: [
          {
            nextPageCursor: 1,
            page: [],
          },
        ],
      },
      getNextPageParam: (lastPage) => {
        return lastPage.nextPageCursor;
      },
      cacheTime: 0,
    },
  );
  const items = paginatedBablContentQuery.data.pages.reduce((prev, cur) => {
    return [...prev, ...cur.page];
  }, []);

  const { babl, unlockStatus, commentCount } = data;

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
    // modalizeRef.current?.open();

    if (rebablStatus) {
      undoRebablMutation.mutate();
    } else {
      rebablMutation.mutate();
    }
  };

  const { template, templateCategory } = babl;

  const onCollectionPress = () => {
    modalizeRefCollections.current.open();
  };

  // React.useEffect(() => {
  //   navigation.setOptions({
  //     header: () => {
  //       return (
  //         <BablHeader
  //           {...babl}
  //           onCollectionPress={onCollectionPress}
  //           repostedBy={route.params.repostedBy}
  //         />
  //       );
  //     },
  //   });
  // }, [babl]);

  const {
    template: SelectedTemplate,
    height: templateHeight,
    chunkSize = Infinity,
    shouldReverse = false,
  } = templateCategories?.[templateCategory]?.[template] ||
  templateCategories?.[0]?.[0];

  const chunks = splitArrayIntoChunks(items, chunkSize);

  if (babl.isPrivate && !unlockStatus && babl.user._id !== user._id) {
    return (
      <View
        style={{
          flex: 1,
          paddingBottom: bottom,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000",
        }}
      >
        <Text style={styles.lockText}>
          {t("ThisOwner")} {babl.price} {t("WantToUnlockCoinsWrong")}
        </Text>

        <ButtonLinear
          title={t("Yes")}
          onPress={() => {
            if (user.coin < babl.price) {
              return Alert.alert(
                t("dontHaveEnoughCoins"),
                t("wouldYouLikeToBuyCoins"),
                [
                  {
                    text: t("no"),
                    style: "cancel",
                  },
                  {
                    text: t("yes"),
                    isPreferred: true,
                    onPress: () => {
                      navigation.navigate(routes.Deposit);
                    },
                  },
                ],
              );
            }

            return Alert.alert(t("AreYouBabl"), null, [
              {
                text: t("No"),
                style: "cancel",
              },
              {
                text: t("Yes"),
                isPreferred: true,
                onPress: () => {
                  unlockBablMutation.mutate(babl._id);
                },
              },
            ]);
          }}
        />
      </View>
    );
  }

  const icons = [
    {
      image: likeStatus ? heartFillIcon : heartEmptyIcon,
      number: likeCount,
      width: 25.91,
      height: 23.16,
      tintColor: likeStatus ? "red" : "#FFF",
      onPress: onLikePress,
    },
    {
      image: fireIcon,
      number: 0,
      width: 25.91,
      height: 23.16,
      onPress: () => {
        // modalizeRefSendBablCoin.current?.open();
        navigation.navigate(routes.SendBablCoin, {
          targetUser: babl.user,
          bablId: route.params.bablId,
        });
      },
    },
    {
      image: commentIcon,
      number: commentCount,
      width: 25.91,
      height: 23.16,
      onPress: (e) => {
        navigation.navigate(routes.Comments, { bablId: route.params.bablId });
      },
    },
    {
      image: reloadIcon,

      number: rebablCount,
      width: 25.91,
      height: 23.16,
      disabled: user._id === babl.user._id,
      tintColor: rebablStatus ? "#5DFF77" : "#FFF",
      onPress: onRebablPress,
    },
    {
      image: sendIcon,
      width: 25.91,
      height: 23.16,
      tintColor: "#FFF",
      onPress: () => {
        modalizeRef.current?.open();
      },
    },
  ];

  const onScroll = (event) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const dif = currentOffset - currentPosRef.current;

    if (currentOffset == 0) {
      translateX.value = 0;
    }

    if (Math.abs(dif) < 3) {
    } else if (dif < 0) {
      translateX.value = 0;
    } else {
      translateX.value = 50;
    }

    currentPosRef.current = currentOffset;
  };

  const onEndReached = () => {
    if (paginatedBablContentQuery.hasNextPage) {
      paginatedBablContentQuery.fetchNextPage();
    }
  };

  const chunkFlattened = chunks.reduce((prev, cur, curIndex) => {
    return [
      ...prev,
      ...(shouldReverse && curIndex % 2 === 1
        ? cur.flat(Infinity).reverse()
        : cur.flat(Infinity)),
    ];
  }, []);

  return (
    <>
      <BablUrlContext.Provider
        value={{
          bablId: babl._id,
          title: babl.title,
          user: babl.user,
          items,
          chunkFlattened,
          onNextPress: route.params.onNextPress,
          templateHeight,
        }}
      >
        <BablHeader
          {...babl}
          onCollectionPress={onCollectionPress}
          repostedBy={route.params.repostedBy}
        />
        <Image source={linearBorderImg} style={styles.linearBorderImg} />
        <SafeAreaView style={styles.chunkContainerParent} edges={[]}>
          <FlatList
            data={chunks}
            style={styles.chunkContainer}
            onScroll={onScroll}
            showsVerticalScrollIndicator={false}
            bounces
            removeClippedSubviews
            scrollEventThrottle={16}
            maxToRenderPerBatch={3}
            renderItem={({ item: chunk, index: chunkIndex }) => {
              const isReverseOrder = chunkIndex % 2 === 1 && shouldReverse;
              const chunkItems = isReverseOrder
                ? [
                    ...Array.from({ length: chunkSize - chunk.length }).fill(
                      null,
                    ),
                    ...chunk,
                  ]
                : chunk;

              return (
                <View
                  style={styles.templateContainer}
                  key={`chunk_${chunkIndex}`}
                >
                  <SelectedTemplate
                    items={chunkItems}
                    isReverseOrder={isReverseOrder}
                    chunkIndex={chunkIndex}
                  />
                </View>
              );
            }}
            onEndReached={onEndReached}
            ListFooterComponent={
              <>
                <View style={{ height: 40 }} />
                {paginatedBablContentQuery.isFetchingNextPage && (
                  <ActivityIndicator
                    size="large"
                    color="#FFF"
                    style={{
                      marginVertical: 16,
                    }}
                  />
                )}
              </>
            }
          />

          <Animated.View style={[styles.iconContainerParent, animatedStyles]}>
            {icons.map((item) => {
              if (item.disabled) return null;

              return (
                <TouchableOpacity
                  onPress={item.onPress}
                  style={styles.iconContainer}
                >
                  <Image
                    source={item.image}
                    resizeMode="contain"
                    style={[
                      styles.icon,
                      {
                        width: item.width,
                        height: item.height,
                        tintColor: item.tintColor,
                      },
                    ]}
                  />
                  <Text style={styles.number}>{item.number}</Text>
                </TouchableOpacity>
              );
            })}
          </Animated.View>
        </SafeAreaView>
      </BablUrlContext.Provider>

      <Modalize
        handlePosition="inside"
        handleStyle={styles.handleStyle}
        modalStyle={styles.modalStyle}
        snapPoint={sizes.width}
        scrollViewProps={{
          scrollEnabled: false,
        }}
        ref={modalizeRefCollections}
      >
        <CollectionsModal
          bablId={bablId}
          onClose={() => {
            modalizeRefCollections.current?.close();
          }}
        />
      </Modalize>

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
          title={babl.title}
          bablId={bablId}
          onClose={() => {
            modalizeRef.current?.close();
          }}
        />
      </Modalize>
    </>
  );
};

export default BablContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
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
  chunkContainerParent: { flex: 1, backgroundColor: "#121315" },
  chunkContainer: { flex: 1, gap: 12 },
  templateContainer: {
    marginBottom: 12,
    marginTop: 20,
    paddingHorizontal: 12,
  },
  iconContainerParent: {
    position: "absolute",
    zIndex: 99,
    bottom: sizes.width / 5,
    right: 0,
  },
  linearBorderImg: {
    width: sizes.width,
    height: 1,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 5,
    tintColor: "white",
  },
  icon: {
    marginBottom: 5,
    tintColor: "white",

    marginTop: 5,
  },
  number: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
    fontFamily: fonts.roboto,
  },
  lockText: {
    fontSize: 20,
    paddingHorizontal: 50,
    textAlign: "center",
    justifyContent: "center",
    marginBottom: 32,
    color: "#FFF",
  },
});

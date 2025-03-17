import React, { useState } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { t } from "i18next";
import LinearGradient from "react-native-linear-gradient";

import { ButtonLinear, Container } from "../../components";
import routes from "../../constants/routes";
import { sizes } from "../../theme";
import fonts from "../../theme/fonts";

import Paginator from "./Paginator";

const Carousel = ({}) => {
  const [pageNum, setPageNum] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);

  const onScrollEnd = (e) => {
    const { contentOffset } = e.nativeEvent;
    const viewSize = e.nativeEvent.layoutMeasurement;
    setPageNum(Math.floor(contentOffset.x / viewSize.width));
  };

  const navigation = useNavigation();

  const data = [{}, {}];

  const listInstrumentsQuery = [
    {
      label: t("il1"),
      description: t("id1"),
      _id: 1,
    },
    {
      label: t("il2"),
      description: t("id2"),
      _id: 2,
    },
    {
      label: t("il3"),
      description: t("id4"),
      _id: 3,
    },

    {
      label: t("il5"),
      description: t("id5"),
      _id: 5,
    },
    {
      label: t("il6"),
      description: t("id6"),
      _id: 6,
    },
  ];

  const listVideoQuery = [
    {
      title: t("sl1"),
      image: require("../../assets/videok.png"),
      bg: require("../../assets/whatdoyoulike/1.png"),
      _id: 1,
    },
    {
      title: t("sl2"),
      image: require("../../assets/videokk.png"),
      bg: require("../../assets/whatdoyoulike/2.png"),
      _id: 2,
    },
    {
      title: t("sl3"),
      image: require("../../assets/photok.png"),
      bg: require("../../assets/whatdoyoulike/3.png"),
      _id: 3,
    },
    {
      title: t("sl4"),
      image: require("../../assets/text3.png"),
      bg: require("../../assets/whatdoyoulike/4.png"),
      _id: 4,
    },

    {
      title: t("sl5"),
      image: require("../../assets/shopk.png"),
      bg: require("../../assets/whatdoyoulike/7.png"),
      _id: 7,
    },
    {
      title: t("sl6"),
      image: require("../../assets/netted.png"),
      bg: require("../../assets/8.png"),
      _id: 8,
    },
  ];

  const flatListRef = React.useRef();

  const renderItemVideo = ({ item, index }) => {
    return (
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        colors={["#B5A0FF", "#755CCC"]}
        style={{
          width: sizes.width / 2.1,
          height: sizes.width / 2.1,
          justifyContent: "center",
          alignItems: "center",
          margin: 3,
          borderRadius: 25,
        }}
      >
        <ImageBackground
          style={{
            width: sizes.width / 2.17,
            height: sizes.width / 2.17,

            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
          source={item.bg}
        >
          <TouchableOpacity
            style={{
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
              width: sizes.width / 2.17,
              height: sizes.width / 2.17,
            }}
            onPress={() => {
              if (selectedItems.includes(item._id)) {
                return setSelectedItems(
                  selectedItems.filter((e) => {
                    return e !== item._id;
                  }),
                );
              }

              setSelectedItems([...selectedItems, item._id]);
            }}
            key={item._id}
          >
            <Text
              style={{
                fontFamily: fonts.bold,
                color: "#FFF",
                fontSize: 18,
                textAlign: "center",
              }}
            >
              {item.title}
            </Text>
            {index == 0 || index == 1 ? (
              <View
                style={{
                  backgroundColor: "#222222",
                  width: 45,
                  height: 45,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 25,
                  marginTop: 10,
                }}
              >
                <Image
                  source={item.image}
                  resizeMode="contain"
                  style={{
                    width: 25,
                    height: index == 1 ? 20 : 25,
                  }}
                />
              </View>
            ) : (
              <View
                style={{
                  backgroundColor: "#222222",
                  width: 45,
                  height: 45,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 25,
                  marginTop: 10,
                }}
              >
                <Image
                  source={item.image}
                  resizeMode="contain"
                  style={{
                    width: 25,
                    height: index == 1 ? 20 : 25,
                  }}
                />
              </View>
            )}
            {selectedItems.includes(item._id) ? (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#6D6D6D",
                  width: 22.58,
                  height: 22.58,
                  borderRadius: 22.58,
                  width: 31,
                  height: 31,
                  position: "absolute",
                  zIndex: 99,
                  right: 5,
                  bottom: 5,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: "green",
                  }}
                  source={require("../../assets/echek.png")}
                />
              </View>
            ) : (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#6D6D6D",
                  width: 22.58,
                  height: 22.58,
                  borderRadius: 22.58,
                  width: 31,
                  height: 31,
                  position: "absolute",
                  zIndex: 99,
                  right: 5,
                  bottom: 5,
                }}
              ></View>
            )}
          </TouchableOpacity>
        </ImageBackground>
      </LinearGradient>
    );
  };

  const AreasOfInterest = () => {
    return (
      <Container>
        <View style={styles.betweenRow}>
          <View style={styles.thirdWidth} />
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(routes.OnBoarding);
            }}
            style={styles.row}
          >
            <Text style={styles.skip}>{t("Skip")}</Text>
            <Image
              source={require("../../assets/right.png")}
              style={styles.right}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.likeYourContent}>{t("WhatDoYouLike")}</Text>

        <View style={styles.borderBottom} />
        <View style={styles.listInstrumentsQuery}>
          {listInstrumentsQuery?.map((item) => {
            return (
              <>
                <TouchableOpacity
                  onPress={() => {
                    if (selectedItems.includes(item._id)) {
                      return setSelectedItems(
                        selectedItems.filter((e) => {
                          return e !== item._id;
                        }),
                      );
                    }

                    setSelectedItems([...selectedItems, item._id]);
                  }}
                  key={item._id}
                  style={[styles.item]}
                >
                  <View>
                    <Text
                      style={[
                        styles.itemTitle,
                        {
                          color: "#FFF",
                        },
                      ]}
                    >
                      {item.label}
                    </Text>
                    <Text style={[styles.itemDescription]}>
                      {item.description}
                    </Text>
                  </View>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: "#6D6D6D",
                      width: 22.58,
                      height: 22.58,
                      borderRadius: 22.58,
                    }}
                  >
                    {selectedItems.includes(item._id) && (
                      <Image
                        style={{
                          width: 20,
                          height: 20,
                          tintColor: "green",
                        }}
                        source={require("../../assets/echek.png")}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              </>
            );
          })}
        </View>
      </Container>
    );
  };

  const VideoStyle = () => {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.videoBetween}>
          <View style={styles.thirdWidth} />
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(routes.Tab);
            }}
            style={styles.row}
          >
            <Text style={styles.skip}>{t("Skip")}</Text>
            <Image
              source={require("../../assets/right.png")}
              style={styles.right}
            />
          </TouchableOpacity>
        </View>
        {/* <Text style={styles.which}>{t('Which')}</Text> */}
        <Text style={styles.likeYour}>{t("DoYouLikeTheContentStyle")}</Text>

        <View style={styles.videoBorderBottom} />
        <View style={styles.thirdTopCenter}>
          <FlatList
            numColumns={2}
            data={listVideoQuery}
            renderItem={renderItemVideo}
            ListFooterComponent={<View style={{ height: 100 }} />}
          />
          <View
            style={{
              marginBottom: sizes.width / 3,
            }}
          />
        </View>
      </SafeAreaView>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        horizontal
        ref={flatListRef}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        renderItem={({ item, index }) => {
          return (
            <View
              style={{
                width: sizes.width,
              }}
            >
              {index == 0
                ? AreasOfInterest()
                : index == 1
                  ? VideoStyle()
                  : null}

              <View style={styles.peginator}>
                <Paginator data={data} pageNum={pageNum} />
              </View>

              <View style={styles.marginBottomTwenty}>
                <ButtonLinear
                  onPress={() => {
                    if (pageNum === data.length - 1) {
                      navigation.navigate(routes.OnBoarding);
                    } else {
                      flatListRef.current.scrollToIndex({
                        index: pageNum + 1,
                        animated: true,
                      });
                    }
                  }}
                  title={t("Continue")}
                />
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#000",
  },

  peginator: {
    alignItems: "center",
    marginTop: 10,
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
  },
  item: {
    backgroundColor: "#101010",
    paddingHorizontal: 18,
    height: 92,
    borderRadius: 21,
    alignItems: "center",
    width: sizes.width / 1.1,
    borderColor: "#282828",

    justifyContent: "space-between",

    flexDirection: "row",
    margin: 5,
  },
  itemDescription: {
    color: "#888888",
    fontFamily: "Poppins-Light",
    fontSize: 14,
  },
  itemSelected: {
    backgroundColor: "#000",
    paddingHorizontal: 18,
    height: 38,
    borderRadius: 42,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#282828",
    justifyContent: "center",
  },
  itemTitle: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: "#FFF",
  },
  renderMusic: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    width: sizes.width / 1.1,
    alignSelf: "center",
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#181818",
    height: 76,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  margin: {
    margin: 5,
  },
  renderMusicImage: {
    width: 58,
    height: 56,
    borderRadius: 12,
  },
  renderMusicText: {
    marginLeft: 10,
    fontFamily: fonts.roboto,
    fontSize: 16,
    color: "#FFF",
  },
  icon: {
    width: 31,
    height: 31,
  },
  videoItem: {
    width: sizes.width / 2.2,
    height: sizes.width / 2.2,
  },
  renderVideoCheck: {
    width: 31,
    height: 31,
    position: "absolute",
    zIndex: 99,
    right: 5,
    bottom: 5,
  },
  betweenRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  thirdWidth: {
    width: 30,
  },
  skip: {
    fontFamily: fonts.roboto,
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  right: {
    height: 16,
    width: 9,
    tintColor: "#FFF",
    marginLeft: 5,
  },
  likeYour: {
    color: "#FFF",
    fontSize: 24,
    textAlign: "center",
    fontFamily: fonts.regular,
  },
  chooseInterest: {
    color: "#FFF",
    fontFamily: fonts.regular,
    fontSize: 24,
    textAlign: "center",
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "#181818",
    marginTop: 20,
  },
  listInstrumentsQuery: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 30,
  },
  videoBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  which: {
    color: "#FFF",
    fontFamily: fonts.roboto,
    fontSize: 24,
    textAlign: "center",
  },
  likeYourContent: {
    color: "#FFF",
    fontFamily: fonts.medium,
    fontSize: 20,
    width: sizes.width / 1.4,
    alignSelf: "center",
    textAlign: "center",
  },
  videoBorderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "#181818",
    marginTop: 20,
  },
  thirdTopCenter: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  musicContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  musicWhichText: {
    color: "#FFF",
    fontFamily: fonts.regular,
    fontSize: 24,
    textAlign: "center",
  },
  marginBottomTwenty: {
    marginBottom: 10,
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
  },
  linearGradient: {
    alignSelf: "flex-start",
    height: 42,
    borderRadius: 42,
    backgroundColor: "#000",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#282828",
    justifyContent: "center",
    paddingHorizontal: 2,
    marginRight: 16,
    marginBottom: 16,
  },
});

export default Carousel;

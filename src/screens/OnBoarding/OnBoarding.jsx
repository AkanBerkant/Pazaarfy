import React, { useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useMutation } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { useTranslation } from "react-i18next";

import { ButtonLinear, Container } from "../../components";
import Button from "../../components/buttons/Button";
import { notify } from "../../helpers/notify";
import { sizes } from "../../theme";
import fonts from "../../theme/fonts";
import { userAtom } from "../../utils/atoms";
import * as Queries from "../../utils/queries";

import Paginator from "./Paginator";

const Carousel = ({}) => {
  const [pageNum, setPageNum] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  const { t } = useTranslation();
  const setUser = useSetAtom(userAtom);

  const updateProfileMutation = useMutation(Queries.updateProfile, {
    onSuccess: (res) => {
      setUser(res);
      notify({
        title: t("Congratulations"),
      });
    },
    onError: (err) => {
      console.log("err", err.response.data);
    },
  });

  const onScrollEnd = (e) => {
    const { contentOffset } = e.nativeEvent;
    const viewSize = e.nativeEvent.layoutMeasurement;
    setPageNum(Math.floor(contentOffset.x / viewSize.width));
  };

  const data = [{}, {}, {}];

  const flatListRef = React.useRef();

  const onComplete = () => {
    updateProfileMutation.mutate({
      isOnboardingCompleted: true,
    });
  };

  const OnBoardOne = () => {
    return (
      <Container backgroundColor={"#F6F6F6"}>
        <View style={styles.videoBetween}>
          <Image
            source={require("../../assets/back.png")}
            resizeMode="contain"
            style={{
              width: 25,
              height: 25,
              tintColor: "#f6f6f6",
            }}
          />
          <Button
            title={t("Skip")}
            onPress={() => {
              onComplete();
            }}
          />
        </View>
        <View
          style={{
            alignItems: "center",
          }}
        >
          <Image
            source={require("../../assets/dark.png")}
            resizeMode="contain"
            style={{
              width: sizes.width / 1.5,
              height: 37,
            }}
          />
          <Image
            source={require("../../assets/001.png")}
            resizeMode="contain"
            style={{
              width: sizes.width / 1.1,
              alignSelf: "center",
              height: sizes.width,

              marginTop: 30,
            }}
          />
          <Text
            style={{
              color: "#000",
              fontFamily: fonts.regular,
              width: sizes.width / 1.1,
              textAlign: "center",
            }}
          >
            {t("OnBoardDescOne")}
          </Text>
        </View>
      </Container>
    );
  };

  const OnBoardTwo = () => {
    return (
      <Container backgroundColor={"#F6F6F6"}>
        <View style={styles.videoBetween}>
          <View style={styles.thirdWidth} />
          <Button
            title={t("Skip")}
            onPress={() => {
              onComplete();
            }}
          />
        </View>
        <View
          style={{
            alignItems: "center",
          }}
        >
          <Image
            source={require("../../assets/dark.png")}
            resizeMode="contain"
            style={{
              width: sizes.width / 1.5,
              height: 37,
            }}
          />
          <Image
            source={require("../../assets/002.png")}
            resizeMode="contain"
            style={{
              width: sizes.width,
              alignSelf: "center",
              height: sizes.width * 1.2,

              marginTop: 30,
            }}
          />
          <Text
            style={{
              color: "#000",
              fontFamily: fonts.regular,
              width: sizes.width / 1.1,
              textAlign: "center",
            }}
          >
            {t("OnBoardDescTwo")}
          </Text>
        </View>
      </Container>
    );
  };

  const OnBoardThree = () => {
    return (
      <Container backgroundColor={"#F6F6F6"}>
        <View style={styles.videoBetween}>
          <Image
            source={require("../../assets/back.png")}
            resizeMode="contain"
            style={{
              width: 25,
              height: 25,
              tintColor: "#f6f6f6",
            }}
          />
          <Button
            title={t("Skip")}
            onPress={() => {
              onComplete();
            }}
          />
        </View>
        <View
          style={{
            alignItems: "center",
          }}
        >
          <Image
            source={require("../../assets/dark.png")}
            resizeMode="contain"
            style={{
              width: sizes.width / 1.5,
              height: 37,
            }}
          />
          <Image
            source={require("../../assets/003.png")}
            resizeMode="contain"
            style={{
              width: sizes.width / 1.1,
              alignSelf: "center",
              height: sizes.width,

              marginTop: 30,
            }}
          />
          <Text
            style={{
              color: "#000",
              fontFamily: fonts.regular,
              width: sizes.width / 1.1,
              textAlign: "center",
            }}
          >
            {t("OnBoardThree")}
          </Text>
        </View>
      </Container>
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
                ? OnBoardOne()
                : index == 1
                  ? OnBoardTwo()
                  : index == 2
                    ? OnBoardThree()
                    : null}

              <View style={styles.peginator}>
                <Paginator data={data} pageNum={pageNum} />
              </View>

              <View style={styles.marginBottomTwenty}>
                <ButtonLinear
                  onPress={() => {
                    if (pageNum === data.length - 1) {
                      onComplete();
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
    backgroundColor: "#F6F6F6",
  },

  peginator: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  item: {
    backgroundColor: "#000",
    paddingHorizontal: 18,
    height: 38,
    borderRadius: 42,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#282828",
    justifyContent: "center",
    margin: 10,
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
    fontFamily: fonts.avenir,
    color: "#000",
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
    fontFamily: fonts.roboto,
    fontSize: 24,
    textAlign: "center",
  },
  videoBorderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "#181818",
    marginTop: 10,
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
    marginBottom: 20,
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

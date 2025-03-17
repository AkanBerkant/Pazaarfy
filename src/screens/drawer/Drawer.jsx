import React from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { BlurView } from "expo-blur";
import { useSetAtom } from "jotai";
import { useTranslation } from "react-i18next";

import ButtonLinear from "../../components/buttons/ButtonLinear";
import { sizes, colors } from "../../theme";
import fonts from "../../theme/fonts";
import { tabBarVisibleAtom } from "../../utils/atoms";
import { getBablCategories } from "../createbabl/CreateBabl";

const checkredIcon = require("../../assets/checkred.png");
const disableCheckIcon = require("../../assets/disablecheckkk.png");
const filterlineImg = require("../../assets/filterLine.png");

const Drawer = ({ onClose, initialRegion, initialCategories }) => {
  const [selectedCategories, setSelectedCategories] =
    React.useState(initialCategories);
  const [selectedRegion, setSelectedRegion] = React.useState(initialRegion);
  const { t } = useTranslation();
  const bablCategories = getBablCategories(t);

  const setTabBarVisible = useSetAtom(tabBarVisibleAtom);

  React.useEffect(() => {
    setTabBarVisible(false);
  }, [tabBarVisibleAtom]);

  const onItemPress = (item) => {
    setFilterStatus(true);
    if (selectedCategories.includes(item._id)) {
      if (item._id === "ALL") {
        setSelectedCategories([]);
      }

      return setSelectedCategories((prev) => {
        return prev.filter((e) => {
          return e !== item._id && e !== "ALL";
        });
      });
    }

    if (item._id === "ALL") {
      return setSelectedCategories(
        bablCategories.map((item) => {
          return item._id;
        }),
      );
    }

    setSelectedCategories((prev) => {
      const nextS = [...prev, item._id];

      if (nextS.length >= bablCategories.length - 1) {
        return bablCategories.map((item) => {
          return item._id;
        });
      }

      return nextS;
    });
  };

  const [filterStatus, setFilterStatus] = React.useState(null);
  const renderItem = ({ item, index }) => {
    return (
      <>
        {selectedCategories.includes(item._id) ? (
          <TouchableOpacity
            onPress={() => {
              return onItemPress(item);
            }}
            key={item._id}
          >
            <ImageBackground
              style={styles.filterLine}
              resizeMode="contain"
              source={filterlineImg}
            >
              <View style={styles.row}>
                <Image
                  resizeMode="contain"
                  source={item.icon}
                  style={styles.icon}
                />
                <Text style={styles.label}>{item.label}</Text>
              </View>
              <Image
                resizeMode="contain"
                source={checkredIcon}
                style={styles.check}
              />
            </ImageBackground>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              onItemPress(item);
            }}
            key={item._id}
          >
            <BlurView style={styles.item} tint="extraDark">
              <View style={styles.row}>
                <Image
                  resizeMode="contain"
                  source={item.icon}
                  style={styles.icon}
                />
                <Text style={styles.label}>{item.label}</Text>
              </View>
              <Image
                resizeMode="contain"
                source={disableCheckIcon}
                style={styles.check}
              />
            </BlurView>
          </TouchableOpacity>
        )}
      </>
    );
  };

  return (
    <ImageBackground
      style={styles.container}
      source={require("../../assets/drawerBg.png")}
    >
      <View style={styles.between}>
        {/* <Image
          resizeMode="contain"
          source={require('../../assets/logo.png')}
          style={styles.logo}
        /> */}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* <TouchableOpacity
            onPress={() => {
              navigation.navigate(routes.Notification);
            }}>
            <Image
              style={styles.notification}
              source={require('../../assets/notification.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(routes.Messages);
            }}>
            <Image
              resizeMode="contain"
              style={styles.message}
              source={require('../../assets/message.png')}
            />
          </TouchableOpacity> */}
          {/* <Image
            style={styles.ai}
            resizeMode="contain"
            source={require('../../assets/bab.png')}
          /> */}
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {selectedRegion === "GLOBAL" ? (
          <View
            onPress={() => {
              setSelectedRegion("TR");
            }}
            style={[styles.between, { width: sizes.width / 1.1 }, styles.top]}
          >
            <TouchableOpacity
              onPress={() => {
                setTabBarVisible(true);
                onClose({ selectedRegion, selectedCategories });
              }}
            >
              <Image
                style={styles.back}
                resizeMode="contain"
                source={require("../../assets/back.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSelectedRegion("TR");
              }}
              style={styles.row}
            >
              <Image
                style={styles.discover}
                source={require("../../assets/disco.png")}
              />
              <Text style={styles.text}>Global</Text>
              <Image
                style={styles.reload}
                source={require("../../assets/reload.png")}
              />
            </TouchableOpacity>
            <View style={styles.back} />
          </View>
        ) : (
          <View
            onPress={() => {
              setSelectedRegion("GLOBAL");
            }}
            style={[styles.between, { width: sizes.width / 1.1 }, styles.top]}
          >
            <TouchableOpacity
              onPress={() => {
                setTabBarVisible(true);
                onClose({ selectedRegion, selectedCategories });
              }}
            >
              <Image
                style={styles.back}
                resizeMode="contain"
                source={require("../../assets/back.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSelectedRegion("GLOBAL");
                setFilterStatus(true);
              }}
              style={styles.row}
            >
              <Image
                style={styles.location}
                source={require("../../assets/location.png")}
              />
              <Text style={styles.text}>Türkiye</Text>
              <Image
                style={styles.reload}
                source={require("../../assets/reload.png")}
              />
            </TouchableOpacity>
            <View style={styles.back} />
          </View>
        )}

        <FlatList
          data={bablCategories}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
        />
        <View
          style={{
            marginBottom: Platform.OS == "ios" ? 70 : 100,
          }}
        />
      </ScrollView>

      <View
        style={{
          padding: 12,

          position: "absolute",
          bottom: Platform.OS == "ios" ? 5 : 20,
        }}
      >
        <ButtonLinear
          title={t("Filter")}
          onPress={() => {
            setTabBarVisible(true);

            onClose({ selectedRegion, selectedCategories, filterStatus });
          }}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    height: sizes.height,
    zIndex: 99,
  },
  logo: {
    width: sizes.width / 3,
    height: 39,
  },
  between: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    marginTop: sizes.width > 375 ? 20 : 0,

    width: sizes.width,
    opacity: 0.9,
    padding: 10,
  },
  discover: {
    width: 21,
    height: 21,
  },
  reload: {
    tintColor: colors.white,
    width: 19,
    height: 19,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",

    justifyContent: "center",
  },
  top: {
    marginTop: 10,
    marginBottom: 10,
  },
  text: {
    color: "#FFF",
    marginLeft: 5,
    marginRight: 5,
    fontFamily: fonts.avenir,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#FFF",
    width: 326,
    marginBottom: 30,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    height: 53,
    borderRadius: 99,
  },
  linearGradient: {
    width: 321,
    height: 51,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 99,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontFamily: fonts.avenir,
  },
  item: {
    width: sizes.width / 1.1,
    alignSelf: "center",
    height: 56,
    marginTop: 5,
    overflow: "hidden",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 99,
  },

  icon: {
    width: 25,
    height: 25,
    tintColor: "#FFF",
    marginLeft: 7,
  },
  check: {
    width: 31,
    height: 31,
    marginRight: 7,
  },
  label: {
    color: "#FFF",
    fontFamily: fonts.avenir,
    marginLeft: 5,
  },
  location: {
    width: 16,
    height: 21,
    marginRight: 5,
  },
  notification: {
    width: 16,
    height: 18,
    tintColor: "#FFF",
  },
  message: {
    width: 20,
    height: 20,
    marginLeft: 15,
    tintColor: "#FFF",
  },
  ai: {
    width: 40,
    height: 35,
  },
  back: {
    width: 20,
    height: 20,
    tintColor: "#FFF",
  },
  filterLine: {
    width: sizes.width / 1.1,
    alignSelf: "center",
    height: 56,
    marginTop: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 29,
  },
});
export default Drawer;

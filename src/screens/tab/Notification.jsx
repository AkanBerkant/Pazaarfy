import React from "react";
import {
  Image,
  RefreshControl,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useNavigation, StackActions } from "@react-navigation/native";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import moment from "moment";
import { useTranslation } from "react-i18next";

import { Container } from "../../components";
import routes from "../../constants/routes";
import { sizes } from "../../theme";
import fonts from "../../theme/fonts";
import { getGiftsData } from "../../utils/gifts";
import * as Queries from "../../utils/queries";

const Notification = () => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const giftIcons = getGiftsData(t).reduce((prev, cur) => {
    return {
      ...prev,
      [cur.type]: cur.image,
    };
  }, {});

  const notificationsQuery = useQuery(
    ["NOTIFICATIONS"],
    Queries.getNotifications,
    {
      placeholderData: [],
    },
  );

  React.useEffect(() => {
    queryClient.setQueryData(["UNSEEN_NOTIFICATION_COUNT"], 0);
  }, []);

  const { data } = notificationsQuery;

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          if (item?.notificationPayload?.type === "INTERACTION_REQUEST") {
          } else if (
            [
              "NEW_CONTENT",
              "REQUEST_STATE",
              "BABL_PUBLISHED",
              "COIN_GIFT",
            ].includes(item?.notificationPayload?.type)
          ) {
          } else if (item?.notificationPayload?.type === "REBABL") {
            navigation.navigate(routes.Comments, { bablId: item.babl._id });
          } else if (item.comment) {
            navigation.navigate(routes.Comments, { bablId: item.babl._id });
          } else if (item.babl) {
          } else if (item?.notificationPayload?.type === "CHAT") {
            navigation.navigate(routes.MessageScreen, {
              item: {
                user: item.notificationPayload,
              },
            });
          } else if (item?.notificationPayload?.type === "GIFT") {
            return navigation.navigate(routes.Giff, {
              initialTab: "mygiff",
            });
          } else {
            navigation.dispatch(
              StackActions.push(routes.UserProfile, {
                userId: item.sender._id,
              }),
            );
          }
        }}
      >
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => {
              navigation.dispatch(
                StackActions.push(routes.UserProfile, {
                  userId: item.sender._id,
                }),
              );
            }}
          >
            <Image
              source={
                item?.sender?.photo
                  ? { uri: item?.sender?.photo }
                  : require("../../assets/person.png")
              }
              style={[
                styles.pp,
                {
                  tintColor: item?.sender?.photo ? null : "#FFF",
                },
              ]}
            />
          </TouchableOpacity>

          <View>
            <Text style={styles.notification}>{item.body}</Text>
            <Text style={styles.time}> {moment(item.fromNow).fromNow()}</Text>
          </View>
        </View>

        {item.babl && (
          <Image
            source={
              item?.babl?.cover
                ? { uri: item?.babl?.cover }
                : require("../../assets/person.png")
            }
            style={styles.photo}
          />
        )}

        {false && (
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor:
                  item.buttonType == "Following" ? "#EFEFEF" : "#0AAFF6",
              },
            ]}
          >
            <Text
              style={[
                styles.text,
                {
                  color: item.buttonType == "Following" ? "#000" : "#FFF",
                },
              ]}
            >
              {t("Follow")}
            </Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  const Header = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.between}>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Image
              source={require("../../assets/back.png")}
              style={styles.backIcon}
            />
            <Text
              style={{
                color: "#101010",
              }}
            >
              asışndkaslkşd
            </Text>
          </TouchableOpacity>

          <Text style={styles.title}>{t("Notifications")}</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#101010",
              }}
            >
              asışndkaslkşd
            </Text>
            <View
              source={require("../../assets/back.png")}
              style={styles.backIcon}
            />
          </View>
        </View>
      </View>
    );
  };

  const today = moment().format("DD.MM.YYYY");
  const yesterday = moment().subtract(1, "days").format("DD.MM.YYYY");

  return (
    <Container safearea={false} scrollview={false}>
      <Header />
      <View style={styles.borderBottom} />

      <SectionList
        contentContainerStyle={styles.items}
        sections={data}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={notificationsQuery.isFetching}
            tintColor={"#918E8D"}
            onRefresh={() => {
              queryClient.invalidateQueries(["NOTIFICATIONS"]);
            }}
          />
        }
        renderSectionHeader={({ section }) => {
          return (
            <Text
              style={[
                styles.currentTime,
                { backgroundColor: "#000", paddingVertical: 10 },
              ]}
            >
              {today === section.title
                ? t("Today")
                : yesterday === section.title
                  ? t("Yesterday")
                  : section.title}
            </Text>
          );
        }}
      />
    </Container>
  );
};

export default Notification;

const styles = StyleSheet.create({
  between: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    marginTop: 30,
  },
  headerContainer: {
    padding: 15,
    backgroundColor: "#101010",
    height: sizes.width / 4,
  },
  backIcon: {
    width: 12.43,
    height: 22,
    tintColor: "#FFFFFF",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  borderBottom: {
    backgroundColor: "#222222",
    width: sizes.width,
    height: 1,
  },
  title: {
    color: "#FFF",
    fontSize: 20,
    fontFamily: fonts.regular,

    alignSelf: "center",
  },
  pp: {
    width: 36,
    height: 36,
    borderRadius: 36,
  },
  item: {
    height: sizes.width / 4,
    padding: 10,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#181818",
    alignItems: "center",
    justifyContent: "space-between",
  },
  notification: {
    fontSize: 14,
    width: sizes.width / 2,
    marginLeft: 12,
    fontFamily: fonts.medium,
    color: "#FFF",
  },
  button: {
    width: 70,
    height: 27,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 13.5,
  },
  text: {
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: fonts.roboto,
  },
  time: {
    color: "#8B8B8B",
    fontFamily: fonts.medium,
    marginLeft: 12,
  },
  currentTime: {
    width: sizes.width,
    paddingHorizontal: 15,
    alignSelf: "center",
    fontSize: 18,
    color: "#747474",
    fontFamily: fonts.medium,
  },
  photo: {
    width: 44,
    height: 44,
    borderRadius: 10,
  },
  backContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

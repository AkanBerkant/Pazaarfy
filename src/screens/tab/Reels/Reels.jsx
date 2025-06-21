import React, { useRef, useState, useEffect } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Video from "react-native-video";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as Queries from "../../../utils/queries";
import { getBablCategories } from "../../createbabl/CreateBabl";
import { useTranslation } from "react-i18next";
import {
  useNavigation,
  useFocusEffect,
  useIsFocused,
} from "@react-navigation/native";
import routes from "../../../constants/routes";
import fonts from "../../../theme/fonts";

const { height, width } = Dimensions.get("window");

const ReelsOnlyVideoScreen = () => {
  const { t } = useTranslation();
  const [region] = useState("GLOBAL");
  const bablCategories = getBablCategories(t);
  const [categories] = useState(bablCategories.map((i) => i._id));
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const flatListRef = useRef();
  const isFocused = useIsFocused();

  const { data: { hotBablsOfMonth = [] } = {} } = useQuery(
    ["HOT_BABLS", region, categories],
    async () => {
      const [, , hotBablsOfMonth] = await Promise.all([
        Queries.getHotBablsOfDay(region, categories),
        Queries.getHotBablsOfWeek(region, categories),
        Queries.getHotBablsOfMonth(region, categories),
      ]);
      return {
        hotBablsOfMonth,
      };
    },
    {
      placeholderData: {
        hotBablsOfMonth: [],
      },
    },
  );

  useFocusEffect(
    React.useCallback(() => {
      queryClient.invalidateQueries(["HOT_BABLS", region, categories]);
    }, []),
  );

  const videos = hotBablsOfMonth.filter((item) => item.coverVideo);

  const likeBablMutation = useMutation((bablId) => Queries.likeBabl(bablId), {
    onSuccess: (_, variables) => {
      queryClient.setQueryData(["HOT_BABLS", region, categories], (oldData) => {
        if (!oldData) return oldData;
        const updated = oldData.hotBablsOfMonth.map((babl) => {
          if (babl._id === variables) {
            return {
              ...babl,
              likeStatus: true,
              likeCount: (babl.likeCount || 0) + 1,
            };
          }
          return babl;
        });
        return { ...oldData, hotBablsOfMonth: updated };
      });
      queryClient.invalidateQueries(["BABL", variables]);
    },
  });

  const unlikeBablMutation = useMutation(
    (bablId) => Queries.unlikeBabl(bablId),
    {
      onSuccess: (_, variables) => {
        queryClient.setQueryData(
          ["HOT_BABLS", region, categories],
          (oldData) => {
            if (!oldData) return oldData;
            const updated = oldData.hotBablsOfMonth.map((babl) => {
              if (babl._id === variables) {
                return {
                  ...babl,
                  likeStatus: false,
                  likeCount: Math.max((babl.likeCount || 1) - 1, 0),
                };
              }
              return babl;
            });
            return { ...oldData, hotBablsOfMonth: updated };
          },
        );
        queryClient.invalidateQueries(["BABL", variables]);
      },
    },
  );

  const handleLikePress = (item) => {
    if (item.likeStatus) {
      unlikeBablMutation.mutate(item._id);
    } else {
      likeBablMutation.mutate(item._id);
    }
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.videoContainer}>
      <Video
        source={{ uri: item.coverVideo }}
        style={styles.fullVideo}
        resizeMode="cover"
        repeat
        paused={!isFocused || currentIndex !== index}
        onError={(e) => console.error("Video error", e)}
      />
      <View style={styles.overlayLeft}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(routes.UserProfile, { userId: item.user._id })
          }
        >
          <Image source={{ uri: item.user.photo }} style={styles.avatar} />
        </TouchableOpacity>
        <Text style={styles.username}>@{item.user.username}</Text>
        <Text style={styles.title}>{item.title}</Text>
      </View>
      <View style={styles.actions}>
        {/* <TouchableOpacity
          style={styles.iconButton}
          onPress={() => handleLikePress(item)}
        >
          <Image
            source={require("../../../assets/heartt.png")}
            style={[
              styles.icon,
              { tintColor: item.likeStatus ? "red" : "white" },
            ]}
          />
          <Text style={styles.iconText}>{item.likeCount || 0}</Text>
        </TouchableOpacity> */}
        {/* <TouchableOpacity
          style={styles.iconButton}
          onPress={() =>
            navigation.navigate(routes.Comments, { bablId: item._id })
          }
        >
          <Image
            source={require("../../../assets/com.png")}
            style={styles.icon}
          />
          <Text style={styles.iconText}>{item.commentCount || 0}</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });

  return (
    <LinearGradient
      style={{ flex: 1 }}
      colors={["#190444", "#1D064F", "#070118"]}
    >
      <FlatList
        ref={flatListRef}
        data={videos}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={{ itemVisiblePercentThreshold: 80 }}
      />
    </LinearGradient>
  );
};

export default ReelsOnlyVideoScreen;

const styles = StyleSheet.create({
  videoContainer: {
    height,
    width,
    justifyContent: "center",
    alignItems: "center",
  },
  fullVideo: {
    width,
    height,
    position: "absolute",
  },
  overlayLeft: {
    position: "absolute",
    bottom: 100,
    left: 20,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 8,
  },
  username: {
    color: "white",
    fontFamily: fonts.medium,
    marginBottom: 4,
  },
  title: {
    color: "white",
    fontSize: 16,
    marginBottom: 12,
    width: width * 0.7,
    fontFamily: fonts.bold,
  },
  actions: {
    position: "absolute",
    right: 20,
    bottom: 100,
    alignItems: "center",
  },
  iconButton: {
    marginBottom: 16,
    alignItems: "center",
  },
  icon: {
    width: 28,
    height: 28,
    tintColor: "white",
  },
  iconText: {
    color: "white",
    fontSize: 12,
    marginTop: 4,
  },
});

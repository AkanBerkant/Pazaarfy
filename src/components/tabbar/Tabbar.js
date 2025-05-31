import React from "react";
import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";
import { useAtomValue } from "jotai";
import LinearGradient from "react-native-linear-gradient";
import Animated, {
  useSharedValue,
  Easing,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import routes from "../../constants/routes";
import { notify } from "../../helpers/notify";
import { sizes } from "../../theme";
import {
  autoBablAtom,
  drawerAtom,
  helpAtom,
  tabBarVisibleAtom,
} from "../../utils/atoms";
import Emitter from "../../utils/emitter";
import { navigationRef } from "../../utils/navigation-ref";
import { BlurView } from "expo-blur";

export const BOTTOM_TAB_HEIGHT = sizes.width / 3.2;

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

const duration = 2000;
const easing = Easing.bezier(0.25, -0.5, 0.25, 1);

const TabBar = () => {
  const navigation = useNavigation();
  const tabBarVisible = useAtomValue(tabBarVisibleAtom);
  const drawerVisible = useAtomValue(drawerAtom);
  const height = useSharedValue(0);
  const route = useRoute();
  const autoBablState = useAtomValue(autoBablAtom);
  const helpState = useAtomValue(helpAtom);

  const sv = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${sv.value * 360}deg` }],
    };
  });
  React.useEffect(() => {
    sv.value = withRepeat(withTiming(1, { duration, easing }), -1);
  }, []);

  /*
  React.useEffect(() => {
    if (tabBarVisible) {
      height.value = withTiming(0, {duration: 500});
    } else {
      height.value = withTiming(BOTTOM_TAB_HEIGHT, {duration: 500});
    }
  }, [tabBarVisible]); */

  const { name: activeRoute } = navigationRef.current?.getCurrentRoute() || {};

  const onHomePress = () => {
    Emitter.emit("RESET_HOT_BABLS");
    navigation.navigate(routes.Home);
  };

  const onMessagesScreen = () => {
    navigation.navigate(routes.Messages);
  };

  const onProfileScreen = () => {
    navigation.navigate(routes.Profile);
  };

  const onSettingsPress = () => {
    navigation.navigate(routes.Settings);
  };

  const onPazaar = () => {
    navigation.navigate(routes.Search);
  };

  return (
    <View
      resizeMode="contain"
      style={[
        {
          bottom: Platform.OS == "ios" ? -sizes.width / 9 : -sizes.width / 11,
          justifyContent: "space-between",
          width: sizes.width,
          height: BOTTOM_TAB_HEIGHT,
          backgroundColor: "#fff",
          backgroundColor: "#000",
          alignSelf: "center",
          position: "absolute",
        },
      ]}
    >
      <View
        style={{
          height: 79,
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
          width: sizes.width,
        }}
      >
        <TouchableOpacity
          onPress={onHomePress}
          style={{
            alignItems: "center",
            width: sizes.width / 5,
            height: 70,
            // shadowOpacity: activeRoute === routes.Home ? 1 : 0,
            // shadowColor: activeRoute === routes.Home ? '#FFF' : '#000',
            // shadowRadius: 10,
          }}
        >
          <Image
            resizeMode="contain"
            style={{
              width: 27,
              height: 70,
              tintColor: activeRoute === routes.Home ? "#9A84EA" : "#777777",
              // shadowColor: '#000',
              // shadowOpacity: 2,
            }}
            source={
              activeRoute === routes.Home
                ? require("../../assets/activeHome.png")
                : require("../../assets/home.png")
            }
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onMessagesScreen}
          style={{
            alignItems: "center",
            width: sizes.width / 5,
            height: 70,
            // shadowOpacity: activeRoute === routes.Home ? 1 : 0,
            // shadowColor: activeRoute === routes.Home ? '#FFF' : '#000',
            // shadowRadius: 10,
          }}
        >
          <Image
            resizeMode="contain"
            style={{
              width: 27,
              height: 70,
              tintColor:
                activeRoute === routes.Messages ? "#9A84EA" : "#777777",
            }}
            source={
              activeRoute === routes.Messages
                ? require("../../assets/activeMessage.png")
                : require("../../assets/disableMessage.png")
            }
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onPazaar}
          style={{
            alignItems: "center",
            height: 70,
            width: 70,
            bottom: 25,
            justifyContent: "center",
            backgroundColor: "#755CCC",
            borderRadius: 99,
          }}
        >
          <Image
            resizeMode="contain"
            style={{
              width: 27.35,
              height: 70,

              tintColor: activeRoute === routes.HotBabls ? "#9A84EA" : "#FFF",
            }}
            source={
              activeRoute === routes.HotBabls
                ? require("../../assets/activepazaar.png")
                : require("../../assets/disablepaz.png")
            }
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onProfileScreen}
          style={{
            alignItems: "center",
            width: sizes.width / 5,
            height: 70,
            // shadowOpacity: activeRoute === routes.Home ? 1 : 0,
            // shadowColor: activeRoute === routes.Home ? '#FFF' : '#000',
            // shadowRadius: 10,
          }}
        >
          <Image
            resizeMode="contain"
            style={{
              width: 20.45,
              height: 70,
              tintColor: activeRoute === routes.Profile ? "#9A84EA" : "#D3D3D3",
              // shadowColor: '#000',
              // shadowOpacity: 2,
            }}
            source={
              activeRoute === routes.Profile
                ? require("../../assets/activeProfile.png")
                : require("../../assets/disableProfile.png")
            }
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onSettingsPress}
          style={{
            alignItems: "center",
            width: sizes.width / 5,
            // shadowOpacity: activeRoute === routes.Profile ? 5 : 2,
            // shadowColor: activeRoute === routes.Profile ? '#FFF' : '#000',
            // shadowRadius: 10,
            height: 70,
          }}
        >
          <Image
            resizeMode="contain"
            style={{
              width: 26.49,
              height: 70,
              // shadowColor: '#000',
              // shadowOpacity: 2,
              tintColor:
                activeRoute === routes.Settings ? "#9A84EA" : "#D3D3D3",
            }}
            source={
              activeRoute === routes.Settings
                ? require("../../assets/settings.png")
                : require("../../assets/disableSettingss.png")
            }
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TabBar;

const styles = StyleSheet.create({
  icon: {
    width: 54,
    height: 54,
    borderRadius: 21,
    tintColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },
  linearGradient: {
    width: 64,
    height: 64,
    borderRadius: 64,
  },
});

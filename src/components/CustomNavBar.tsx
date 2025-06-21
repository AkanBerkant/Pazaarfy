import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import { useTranslation } from "react-i18next";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const PRIMARY_COLOR = "#130057";
const SECONDARY_COLOR = "#fff";

const CustomNavBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        if (["_sitemap", "+not-found"].includes(route.name)) return null;

        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <AnimatedTouchableOpacity
            layout={LinearTransition.springify().mass(0.5)}
            key={route.key}
            onPress={onPress}
            style={[
              styles.tabItem,
              { backgroundColor: isFocused ? SECONDARY_COLOR : "transparent" },
            ]}
          >
            {getIconByRouteName(
              route.name,
              isFocused ? PRIMARY_COLOR : SECONDARY_COLOR,
            )}
            {isFocused && (
              <Animated.Text
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(200)}
                style={styles.text}
              >
                {label as string}
              </Animated.Text>
            )}
          </AnimatedTouchableOpacity>
        );
      })}
    </View>
  );

  function getIconByRouteName(routeName: string, color: string) {
    const { t } = useTranslation();
    switch (routeName) {
      case t("Home"):
        return (
          <Image
            style={{
              width: 25.62,
              height: 23.44,
              tintColor: color,
            }}
            resizeMode="contain"
            source={require("../assets/home.png")}
          />
        );

      case t("Reels"):
        return (
          <Image
            source={require("../assets/clapper.png")}
            style={{
              width: 25.63,
              height: 23.08,
              tintColor: color,
            }}
            resizeMode="contain"
          />
        );

      case t("Search"):
        return (
          <Image
            resizeMode="contain"
            style={{
              width: 25.63,
              height: 23.08,
              tintColor: color,
            }}
            source={require("../assets/activepazaar.png")}
          />
        );

      case t("Profile"):
        return (
          <Image
            resizeMode="contain"
            style={{
              width: 23,
              height: 27,
              tintColor: color,
            }}
            source={require("../assets/activeProfile.png")}
          />
        );
      case t("settings"):
        return (
          <Image
            resizeMode="contain"
            style={{
              width: 25.63,
              height: 23.08,
              tintColor: color,
            }}
            source={require("../assets/settings.png")}
          />
        );

      default:
        return (
          <Image
            resizeMode="contain"
            style={{
              width: 23,
              height: 27,
              tintColor: color,
            }}
            source={require("../assets/home.png")}
          />
        );
    }
  }
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#755CCC",
    width: "90%",
    alignSelf: "center",
    bottom: 20,
    borderRadius: 40,
    paddingHorizontal: 12,
    paddingVertical: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  tabItem: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 36,
    paddingHorizontal: 13,
    borderRadius: 30,
  },
  text: {
    color: PRIMARY_COLOR,
    marginLeft: 8,
    fontWeight: "500",
  },
});

export default CustomNavBar;

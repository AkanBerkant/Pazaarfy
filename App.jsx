import React from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "./src/utils/i18n-setup";

import { NotifierWrapper } from "react-native-notifier";

import { ButtonLinear } from "./src/components";
import Listeners from "./src/Listeners";
import StackNavigation from "./src/navigation/StackNavigation";
import "moment/locale/tr";
import fonts from "./src/theme/fonts";

import storage from "@react-native-firebase/storage";

// use https://www.npmjs.com/package/react-native-global-props if need more default props
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

TextInput.defaultProps = Text.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;
TextInput.defaultProps.textContentType = "oneTimeCode";
TextInput.defaultProps.placeholderTextColor = "#A5A5A5";

TouchableOpacity.defaultProps = TouchableOpacity.defaultProps || {};
TouchableOpacity.defaultProps.activeOpacity = 0.7;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: false,
      useErrorBoundary: false,
      retry: false,
      cacheTime: 0,
    },
  },
});

const renderFallback = ({ resetError }) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#000",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
      }}
    >
      <Text
        style={{
          color: "#FFF",
          fontSize: 20,
          fontFamily: fonts.roboto,
          textAlign: "center",
        }}
      >
        {"Ooops!\nAn unexpected error occurred!"}
      </Text>
      <ButtonLinear title="Restart" onPress={resetError} />
    </View>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <React.Suspense fallback={<View style={styles.fallback} />}>
        <GestureHandlerRootView style={styles.gestureRoot}>
          <NotifierWrapper>
            <StatusBar
              barStyle="light-content"
              backgroundCoxwlor={Platform.OS === "ios" ? null : "#000"}
              hidden={true}
            />
            <StackNavigation />
            <Listeners />
          </NotifierWrapper>
        </GestureHandlerRootView>
      </React.Suspense>
    </QueryClientProvider>
  );
};

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    backgroundColor: "#000",
  },
  gestureRoot: { flex: 1, backgroundColor: "#000" },
});

export default App;

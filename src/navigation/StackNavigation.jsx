/* eslint-disable no-nested-ternary */
import * as React from "react";
import { PermissionsAndroid, Platform } from "react-native";

import { useNetInfo } from "@react-native-community/netinfo";
import messaging from "@react-native-firebase/messaging";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useAtomValue } from "jotai";
import moment from "moment";
import { useTranslation } from "react-i18next";

import { PathGradient } from "../../PathGradient";
import routes from "../constants/routes";
import About from "../screens/About/About";
import Contracts from "../screens/About/Contracts";
import VisionApi from "../screens/tab/Search/VisionApi";
import AllRequests from "../screens/AllRequest/AllRequest";
import AppNotifications from "../screens/AppNotifications/AppNotifications";
import AddUserName from "../screens/authentication/AddUserName";
import EnterYourNewPassword from "../screens/authentication/EnterYourNewPassword";
import ForgotPassword from "../screens/authentication/ForgotPassword";
import Login from "../screens/authentication/Login";
import Register from "../screens/authentication/Register";
import Splash from "../screens/authentication/Splash";
import WhatdoYouLike from "../screens/authentication/WhatdoYouLike";
import BablContent from "../screens/BablContent/BablContent";

import BablContentList from "../screens/BablContentList/BablContentList";
import BablFollowers from "../screens/BablFollowers/BablFollowers";
import BablLikes from "../screens/BablLikes/BablLikes";
import BablOptions from "../screens/BablOptions/BablOptions";
import Bookmarks from "../screens/Bookmarks/Bookmarks";
import ChangeLanguage from "../screens/ChangeLanguage/ChangeLanguage";
import CollectionDetail from "../screens/CollectionShare/CollectionDetail";
import CollectionShareAndroid from "../screens/CollectionShare/CollectionShareAndroid";
import CommentAnswers from "../screens/comments/CommentAnswers";
import Comments from "../screens/comments/Comments";
import Connection from "../screens/Connection/Connection";
import ControlPanel from "../screens/ControlPanel/ControlPanel";
import DetailScreen from "../screens/ControlPanel/Detai";
import CreateBablCategories from "../screens/createbabl/CreateBablCategories/CreateBablCategories";
import SharedLibrary from "../screens/createbabl/CreateBablCategories/Youtube/SharedLibrary";
import YoutubeLists from "../screens/createbabl/CreateBablCategories/Youtube/YoutubeLists";
import OtherCategories from "../screens/createbabl/OtherCategories/OtherCategories";
import CustomList from "../screens/CustomList/CustomList";
import EditBabl from "../screens/EditBabl/EditBabl";
import EditCover from "../screens/EditBabl/EditCover";
import SelectCover from "../screens/EditBabl/SelectCover";
import TextEditor from "../screens/Editor/TextEditor";
import VideoEditor from "../screens/Editor/VideoEditor";
import { FocusAnimation } from "../screens/FocusAnimation";
import Friends from "../screens/Friends/Friends";
import GptChat from "../screens/GptChat/GptChat";
import Faq from "../screens/HelpFeedback/Faq";
import Feedback from "../screens/HelpFeedback/Feedback";
import HelpFeedback from "../screens/HelpFeedback/HelpFeedback";
import MessageScreen from "../screens/messages/MessageDetail";
import OnBoarding from "../screens/OnBoarding/OnBoarding";
import CongratulationsPassword from "../screens/Password/CongratulationsPassword";
import EnterYourNewPasswordProfile from "../screens/Password/EnterYourNewPasswordProfile";
import MailScreen from "../screens/Password/MailScreen";
import PasswordCode from "../screens/Password/PasswordCode";
import Giff from "../screens/SendBablCoin/Giff";
import GiffBoost from "../screens/SendBablCoin/GiffBoost";
import Welcome from "../screens/Welcome/Welcome";
import SharedSavings from "../screens/SharedSavings/SharedSavings";
import Follower from "../screens/tab/Follower";
import Follows from "../screens/tab/Follows";
import DetailList from "../screens/tab/HotBabls/DetailList";
import HotBablDetail from "../screens/tab/HotBabls/HotBablDetail";
import Messages from "../screens/tab/Messages";
import Notification from "../screens/tab/Notification";
import PaymentCheck from "../screens/tab/PaymentCheck";
import Account from "../screens/tab/Profile/Account";
import BalanceMonetary from "../screens/tab/Profile/BalanceMonetary";
import ChangePassword from "../screens/tab/Profile/ChangePassword";
import Code from "../screens/tab/Profile/Code";
import DeleteAccountResponse from "../screens/tab/Profile/DeleteAccountResponse";
import Profile from "../screens/tab/Profile/Profile";
import Security from "../screens/tab/Profile/Security";
import Verification from "../screens/tab/Profile/Verification";
import YourActivity from "../screens/tab/Profile/YourActivity";
import ProfilSettings from "../screens/tab/ProfilSettings";
import Search from "../screens/tab/Search/Search";
import Shop from "../screens/tab/Shop";
import TemplateSelection from "../screens/TemplateSelection/TemplateSelection";
import Transactions from "../screens/Transactions/Transactions";
import ImagesSlider from "../screens/tab/HotBabls/ImagesSlider";
import { splashAtom, userAtom } from "../utils/atoms";
import { navigationRef } from "../utils/navigation-ref";
import * as Queries from "../utils/queries";

import BottomTabs from "./BottomTabs";
import PrivacyAgreement from "../screens/PrivacyAgreement/PrivacyAgreement";
import CreateBabl from "../screens/createbabl/CreateBabl";
import Pro from "../screens/Pro/Pro";
import PeopleSearch from "../screens/tab/Search/PeopleSearch";
import TermsScreen from "../screens/authentication/TermsScreen";
import GuestMode from "../screens/GuestMode/GuestMode";
import SearchGuest from "../screens/GuestMode/SearchGuest";
import GuestDetailContent from "../screens/GuestMode/GuestDetailContent";
import GuestDetail from "../screens/GuestMode/GuestDetail";
import PazaarfyPro from "../screens/PazaarfyPro/PazaarfyPro";
import Price from "../screens/PazaarfyPro/Price";
import PaymentPage from "../screens/PazaarfyPro/PaymentPage";

const Stack = createNativeStackNavigator();

const StackNavigation = () => {
  const user = useAtomValue(userAtom);
  const splashStatus = useAtomValue(splashAtom);
  const routeNameRef = React.useRef();
  const { i18n } = useTranslation();

  const netInfo = useNetInfo();

  React.useEffect(() => {
    moment.locale(i18n.language);
  }, [i18n.language]);

  React.useEffect(() => {
    if (user) {
      if (Platform.OS === "ios") {
        messaging()
          .requestPermission()
          .then(() => {
            messaging()
              .getToken()
              .then((notificationToken) => {
                Queries.setNotificationToken({
                  notificationToken,
                });
              });
          });
      } else {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        ).then((status) => {
          messaging()
            .getToken()
            .then((notificationToken) => {
              Queries.setNotificationToken({
                notificationToken,
              });
            });
        });
      }
    }
  }, [user]);

  return (
    <NavigationContainer
      ref={navigationRef}
      navigationInChildEnabled
      onReady={() => {
        routeNameRef.current = navigationRef.current.getCurrentRoute().name;
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current.getCurrentRoute().name;

        if (previousRouteName !== currentRouteName) {
        }
        routeNameRef.current = currentRouteName;
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {netInfo.isConnected === false ? (
          <Stack.Screen name={routes.Connection} component={Connection} />
        ) : splashStatus ? (
          <Stack.Screen name={routes.Splash} component={Splash} />
        ) : user ? (
          !user.isOnboardingCompleted ? (
            <>
              <Stack.Screen
                name={routes.WhatdoYouLike}
                component={WhatdoYouLike}
              />
              <Stack.Screen name={routes.OnBoarding} component={OnBoarding} />
            </>
          ) : user.email == "test@gmail.com" ? (
            <>
              <Stack.Screen name={routes.SearchGuest} component={SearchGuest} />
              <Stack.Screen name={routes.GuestDetail} component={GuestDetail} />
              <Stack.Screen
                name={routes.GuestDetailContent}
                component={GuestDetailContent}
              />
              <Stack.Screen
                name={routes.Login}
                component={Login}
                options={{
                  gestureEnabled: false,
                }}
              />

              <Stack.Screen name={routes.TermsScreen} component={TermsScreen} />
              <Stack.Screen name={routes.Register} component={Register} />
              <Stack.Screen name={routes.GuestMode} component={GuestMode} />
              <Stack.Screen
                name={routes.ForgotPassword}
                component={ForgotPassword}
              />
              <Stack.Screen
                name={routes.EnterYourNewPassword}
                component={EnterYourNewPassword}
              />

              <Stack.Screen
                name={routes.DeleteAccountResponse}
                component={DeleteAccountResponse}
              />
              <Stack.Screen name={routes.AddUserName} component={AddUserName} />
              <Stack.Screen name={routes.Code} component={Code} />
            </>
          ) : (
            <>
              <Stack.Screen name={routes.Tab} component={BottomTabs} />
              <Stack.Screen name={routes.Price} component={Price} />
              <Stack.Screen name={routes.PaymentPage} component={PaymentPage} />
              <Stack.Screen name={routes.PazaaryPro} component={PazaarfyPro} />
              <Stack.Screen
                name={routes.CollectionShareAndroid}
                component={CollectionShareAndroid}
              />
              <Stack.Screen name={routes.VideoEditor} component={VideoEditor} />
              <Stack.Screen name={routes.TextEditor} component={TextEditor} />
              <Stack.Screen name={routes.Feedback} component={Feedback} />

              <Stack.Screen
                name={routes.ImagesSlider}
                component={ImagesSlider}
              />
              <Stack.Screen name={routes.Faq} component={Faq} />
              <Stack.Screen
                name={routes.AppNotifications}
                component={AppNotifications}
                options={{
                  gestureEnabled: false,
                }}
              />
              <Stack.Screen name={routes.BablOptions} component={BablOptions} />

              <Stack.Screen
                options={{
                  headerShown: false,
                  animation: "slide_from_bottom",
                }}
                name={routes.BablLikes}
                component={BablLikes}
              />
              <Stack.Screen
                name={routes.Transactions}
                component={Transactions}
              />
              <Stack.Screen name={routes.VisionApi} component={VisionApi} />
              <Stack.Screen name={routes.CustomList} component={CustomList} />
              <Stack.Screen name={routes.UserProfile} component={Profile} />
              <Stack.Screen name={routes.MailScreen} component={MailScreen} />
              <Stack.Screen
                name={routes.HelpFeedback}
                component={HelpFeedback}
              />
              <Stack.Screen
                name={routes.EnterYourNewPasswordProfile}
                component={EnterYourNewPasswordProfile}
              />
              <Stack.Screen
                name={routes.CollectionDetail}
                component={CollectionDetail}
              />
              <Stack.Screen
                name={routes.PasswordCode}
                component={PasswordCode}
              />
              <Stack.Screen
                name={routes.ChangeLanguage}
                component={ChangeLanguage}
              />
              <Stack.Screen
                name={routes.EditBabl}
                component={EditBabl}
                options={{
                  gestureEnabled: false,
                }}
              />
              <Stack.Screen
                name={routes.ProfilSettings}
                component={ProfilSettings}
              />
              <Stack.Screen
                name={routes.PaymentCheck}
                component={PaymentCheck}
              />
              <Stack.Screen name={routes.Detail} component={DetailScreen} />
              <Stack.Screen
                name={routes.CommentAnswers}
                component={CommentAnswers}
              />
              <Stack.Screen
                options={{
                  headerShown: false,
                }}
                name={routes.HotBablDetail}
                component={HotBablDetail}
              />
              <Stack.Screen
                options={{
                  headerShown: false,
                }}
                name={routes.DetailList}
                component={DetailList}
              />
              <Stack.Screen
                name={routes.CreateBablCategories}
                component={CreateBablCategories}
              />
              <Stack.Screen name={routes.Shop} component={Shop} />

              <Stack.Screen
                name={routes.Notification}
                component={Notification}
              />

              <Stack.Screen name={routes.Comments} component={Comments} />
              <Stack.Screen name={routes.Friends} component={Friends} />
              <Stack.Screen
                name={routes.TemplateSelection}
                component={TemplateSelection}
              />
              <Stack.Screen name={routes.AllRequests} component={AllRequests} />
              <Stack.Screen name={routes.EditCover} component={EditCover} />
              <Stack.Screen
                name={routes.PeopleSearch}
                component={PeopleSearch}
              />
              <Stack.Screen
                name={routes.EnterYourNewPassword}
                component={EnterYourNewPassword}
              />
              <Stack.Screen
                name={routes.YoutubeLists}
                component={YoutubeLists}
              />
              <Stack.Screen
                name={routes.MessageScreen}
                component={MessageScreen}
              />
              <Stack.Screen name={routes.Contracts} component={Contracts} />
              <Stack.Screen name={routes.About} component={About} />
              <Stack.Screen name={routes.Follower} component={Follower} />
              <Stack.Screen name={routes.Follows} component={Follows} />
              <Stack.Screen
                name={routes.GiffBoost}
                component={GiffBoost}
                options={{
                  headerShown: false,
                  presentation: "transparentModal",
                }}
              />
              <Stack.Screen
                name={routes.ControlPanel}
                component={ControlPanel}
              />
              <Stack.Screen
                name={routes.BablContent}
                component={BablContent}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name={routes.BablContentList}
                component={BablContentList}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name={routes.CongratulationsPassword}
                component={CongratulationsPassword}
              />
              <Stack.Screen
                name={routes.SharedLibrary}
                component={SharedLibrary}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name={routes.PrivacyAgreement}
                component={PrivacyAgreement}
              />
              <Stack.Screen
                name={routes.GptChat}
                component={GptChat}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name={routes.FocusAnimation}
                component={FocusAnimation}
                options={{
                  headerShown: false,
                }}
              />

              <Stack.Screen name={routes.Pro} component={Pro} />

              <Stack.Screen
                name={routes.SharedSavings}
                component={SharedSavings}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name={routes.Bookmarks}
                component={Bookmarks}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name={routes.BablFollowers}
                component={BablFollowers}
              />
              <Stack.Screen name={routes.Account} component={Account} />
              <Stack.Screen
                name={routes.BalanceMonetary}
                component={BalanceMonetary}
              />
              <Stack.Screen name={routes.Security} component={Security} />
              <Stack.Screen
                name={routes.OtherCategories}
                component={OtherCategories}
              />
              <Stack.Screen name={routes.TermsScreen} component={TermsScreen} />
              <Stack.Screen
                name={routes.YourActivity}
                component={YourActivity}
              />
              <Stack.Screen
                name={routes.ChangePassword}
                component={ChangePassword}
              />
              <Stack.Screen
                name={routes.Verification}
                component={Verification}
              />
              <Stack.Screen name={routes.Code} component={Code} />
              <Stack.Screen
                options={{
                  headerShown: false,
                  animation: "slide_from_bottom",
                }}
                name={routes.SelectCover}
                component={SelectCover}
              />

              <Stack.Screen name={routes.CreateBabl} component={CreateBabl} />
              <Stack.Screen
                name={routes.PathGradient}
                component={PathGradient}
              />
              <Stack.Screen
                name={routes.Giff}
                component={Giff}
                options={{
                  headerShown: false,
                  presentation: "transparentModal",
                }}
              />

              <Stack.Screen
                name={routes.DeleteAccountResponse}
                component={DeleteAccountResponse}
              />
            </>
          )
        ) : (
          <>
            <Stack.Screen
              name={routes.Login}
              component={Login}
              options={{
                gestureEnabled: false,
              }}
            />

            <Stack.Screen name={routes.TermsScreen} component={TermsScreen} />
            <Stack.Screen name={routes.Register} component={Register} />
            <Stack.Screen name={routes.GuestMode} component={GuestMode} />
            <Stack.Screen
              name={routes.ForgotPassword}
              component={ForgotPassword}
            />
            <Stack.Screen
              name={routes.EnterYourNewPassword}
              component={EnterYourNewPassword}
            />

            <Stack.Screen
              name={routes.DeleteAccountResponse}
              component={DeleteAccountResponse}
            />
            <Stack.Screen name={routes.AddUserName} component={AddUserName} />
            <Stack.Screen name={routes.Code} component={Code} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigation;

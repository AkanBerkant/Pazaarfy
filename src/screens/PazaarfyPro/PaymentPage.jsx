import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import { WebView } from "react-native-webview";
import { sizes } from "../../theme";
import routes from "../../constants/routes";
import * as Queries from "../../utils/queries";
import { BackHeader } from "../../components";
import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { userAtom } from "../../utils/atoms";
import { Notifier } from "react-native-notifier";

const PaymentPage = ({ navigation, route }) => {
  const [showIFrame, setShowIFrame] = useState(false);
  const [token, setToken] = useState("");

  const [user, setUser] = useAtom(userAtom);

  const webviewRef = React.useRef(null);

  const { time, price, id } = route.params || {};

  const initPaymentMutation = useMutation(Queries.paytrPayment, {
    onSuccess: (data) => {
      setShowIFrame(true);

      setToken(data?.token);
    },
    onError: (error) => {
      Notifier.showNotification({
        title: "Hata",
        description: "Lütfen bilgileri eksiksiz doldurunuz.",
        duration: 5000,
        showAnimationDuration: 800,
        showEasing: "ease",
      });
    },
  });

  const handlePurchase = async () => {
    initPaymentMutation.mutate({
      email: user?.email,
      payment_amount: price,
      user_basket: JSON.stringify([
        {
          productId: id,
          price: price,
          packageDay: time,
          type: "package_purchase_for_product",
        },
      ]),
      user_name: user?.username,
    });
  };

  console.log({
    email: user?.email,
    payment_amount: price,
    user_basket: JSON.stringify([
      {
        product: id,
        price: price,
        packageDay: time,
      },
    ]),
    user_name: user?.username,
  });
  React.useEffect(() => {
    handlePurchase();
  }, []);

  const handleNavigationStateChange = (navState) => {
    const { url } = navState;

    if (!url) {
      return;
    }

    if (
      url == "https://oyster-app-4semj.ondigitalocean.app/payment/paytrSuccess"
    ) {
      Notifier.showNotification({
        title: "Siparişiniz başarılı bir şekilde oluşturuldu",
        duration: 3000,
      });
      navigation.navigate(routes.Tab);
      webviewRef.current.stopLoading();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      <BackHeader />
      <WebView
        ref={webviewRef}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, width: sizes.width, height: sizes.height }}
        source={{ uri: `https://www.paytr.com/odeme/guvenli/${token}` }}
        startInLoadingState
        renderLoading={() => (
          <View style={{ flex: 1 }}>
            <ActivityIndicator size="large" color={"gray"} />
          </View>
        )}
        onNavigationStateChange={handleNavigationStateChange} // WebView'den mesajları dinler
      />
    </View>
  );
};

export default PaymentPage;

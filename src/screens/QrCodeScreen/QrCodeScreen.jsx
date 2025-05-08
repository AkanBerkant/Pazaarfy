import React, { useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Share } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useAtomValue } from "jotai";
import { userAtom } from "../../utils/atoms";
import { BackHeader } from "../../components";
import { useTranslation } from "react-i18next";

const QrCodeScreen = () => {
  const user = useAtomValue(userAtom);
  const qrRef = useRef(null);

  const deepLink = `pazaarfy://profile/${user._id}`;

  const onShare = () => {
    qrRef.current?.toDataURL((dataURL) => {
      Share.share({
        message: `Profilime ulaşmak için bu kodu tara veya bağlantıyı aç: ${deepLink}`,
        url: `data:image/png;base64,${dataURL}`,
      });
    });
  };

  const { t } = useTranslation();
  return (
    <View
      style={{
        backgroundColor: "#000",
        flex: 1,
      }}
    >
      <BackHeader title={t("GenerateQR")} />
      <View style={styles.container}>
        <QRCode
          value={deepLink}
          size={240}
          backgroundColor="black"
          color="white"
          getRef={(c) => (qrRef.current = c)}
        />
        <Text style={styles.link}>{deepLink}</Text>
        <TouchableOpacity style={styles.button} onPress={onShare}>
          <Text style={styles.buttonText}>{t("Share")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default QrCodeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 0.7,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    color: "#fff",
    marginBottom: 30,
    fontWeight: "bold",
  },
  link: {
    color: "#ccc",
    marginTop: 16,
    fontSize: 12,
  },
  button: {
    marginTop: 32,
    backgroundColor: "#755CCC",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

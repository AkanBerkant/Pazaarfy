import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

import { useTranslation } from "react-i18next";

import { BackHeader } from "../../components";
import { sizes } from "../../theme";
import fonts from "../../theme/fonts";
import AgreementHeader from "../../components/header/AgreementHeader";

const PrivacyAgreement = ({ navigation }) => {
  const { t } = useTranslation();

  const privacyText = `
1. Giriş
Bu Gizlilik Sözleşmesi, Pazaarfy uygulamasını ("Uygulama") kullanan kullanıcıların kişisel verilerinin
toplanması, kullanılması, saklanması ve korunması ile ilgili esasları belirlemek amacıyla hazırlanmıştır.
Pazaarfy, kullanıcıların gizliliğini korumaya büyük önem vermektedir.

2. Toplanan Veriler
Pazaarfy, kullanıcılarından aşağıdaki kişisel verileri toplayabilir:
- Ad, soyad, e-posta adresi, telefon numarası
- Adres ve ödeme bilgileri
- Kullanıcı adı ve şifre gibi hesap bilgileri
- Kullanıcıların uygulama içindeki etkileşimleri ve alışveriş geçmişi
- Cihaz ve bağlantı bilgileri (IP adresi, tarayıcı türü, işletim sistemi vb.)

3. Kişisel Verilerin Kullanımı
Toplanan veriler aşağıdaki amaçlarla kullanılabilir:
- Kullanıcı hesaplarının oluşturulması ve yönetilmesi
- Siparişlerin işlenmesi ve teslimat süreçlerinin yürütülmesi
- Kullanıcılara müşteri desteği sağlanması
- Uygulama deneyiminin iyileştirilmesi ve güvenliğin artırılması
- Pazarlama ve reklam faaliyetlerinin yürütülmesi
- Yasal yükümlülüklerin yerine getirilmesi


`;

  return (
    <View style={styles.container}>
      <AgreementHeader title={t("Gizlilik Sözleşmesi")} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.privacyText}>{privacyText}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContainer: {
    padding: 16,
  },
  privacyText: {
    fontFamily: fonts.regular,
    color: "#828282",
    fontSize: 14,
    lineHeight: 22,
    width: sizes.width / 1.07,
    alignSelf: "center",
  },
});

export default PrivacyAgreement;

import React from "react";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

const TermsScreen = () => {
  const navigation = useNavigation();

  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{t("kv1")}</Text>

        <Text style={styles.paragraph}>{t("kv2")}</Text>

        <Text style={styles.subtitle}>{t("kv3")}</Text>
        <Text style={styles.paragraph}>{t("kv4")}</Text>

        <Text style={styles.subtitle}>{t("kv5")}</Text>
        <Text style={styles.paragraph}>{t("kv6")}</Text>

        <Text style={styles.subtitle}>{t("kv7")}</Text>
        <Text style={styles.paragraph}>{t("kv8")}</Text>

        <Text style={styles.subtitle}>{t("kv9")}</Text>
        <Text style={styles.paragraph}>{t("kv10")}</Text>

        <Text style={styles.subtitle}> {t("kv11")}</Text>
        <Text style={styles.paragraph}>{t("kv12")}</Text>

        <Text style={styles.subtitle}> {t("kv13")}</Text>
        <Text style={styles.paragraph}>{t("kv14")}</Text>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          <Text style={styles.buttonText}>{t("Back")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scroll: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 0,
  },
  subtitle: {
    fontSize: 16,
    color: "#B5A0FF",
    fontWeight: "600",
    marginTop: 15,
  },
  paragraph: {
    color: "#ccc",
    fontSize: 14,
    marginTop: 5,
  },
  button: {
    marginTop: 15,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#755CCC",
  },
  buttonText: {
    color: "#755CCC",
    fontWeight: "600",
  },
});

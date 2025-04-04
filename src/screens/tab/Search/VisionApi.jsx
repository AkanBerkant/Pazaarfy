import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import MasonryList from "@react-native-seoul/masonry-list";
import LinearGradient from "react-native-linear-gradient";
import { BackHeader } from "../../../components";
import { useTranslation } from "react-i18next";
import { sizes } from "../../../theme";
import routes from "../../../constants/routes";

const GOOGLE_VISION_API_KEY = "AIzaSyDpFoQINJdBr8MXwx5K26qmk3dYAWoovxM"; // API ; // 📌 Vision API Key buraya
const GOOGLE_TRANSLATE_API_KEY = "AIzaSyDpFoQINJdBr8MXwx5K26qmk3dYAWoovxM"; // 📌 Translate API Key buraya

const Search = ({ route }) => {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const { data } = route.params || {};

  const [imageUri, setImageUri] = useState(null);
  const [labels, setLabels] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  // 📸 Galeriden Görsel Seç
  const pickImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
    })
      .then((image) => {
        setImageUri(image.path);
        analyzeImage(image.data);
      })
      .catch(() => Alert.alert("Hata", "Görsel seçme işlemi iptal edildi."));
  };

  // 📷 Kamera ile Fotoğraf Çek
  const takePhoto = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
    })
      .then((image) => {
        setImageUri(image.path);
        analyzeImage(image.data);
      })
      .catch(() => Alert.alert("Hata", "Kamera ile çekim iptal edildi."));
  };

  // 🔍 Görseli Google Vision API ile Analiz Et
  const analyzeImage = async (base64Image) => {
    try {
      const body = {
        requests: [
          {
            image: { content: base64Image },
            features: [{ type: "LABEL_DETECTION", maxResults: 5 }],
          },
        ],
      };

      const response = await axios.post(
        `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`,
        body,
        { headers: { "Content-Type": "application/json" } },
      );

      console.log(
        "Google Vision API Yanıtı:",
        JSON.stringify(response.data, null, 2),
      );

      const labels =
        response.data.responses[0]?.labelAnnotations?.map(
          (label) => label.description,
        ) || [];

      // 🚀 İngilizce etiketleri Türkçeye çevir
      const translatedLabels = await translateText(labels);
      console.log("Türkçeye Çevrilen Etiketler:", translatedLabels);

      setLabels(translatedLabels);
      filterResults(translatedLabels);
    } catch (error) {
      console.error("Görsel analizi başarısız oldu:", error);
      Alert.alert("Hata", "Görsel analizi başarısız oldu.");
    }
  };

  // 🌍 Google Translate API ile Çeviri
  const translateText = async (texts, targetLang = i18n.language) => {
    try {
      const response = await axios.post(
        `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`,
        {
          q: texts, // API dizi formatında alıyor
          target: targetLang,
          format: "text",
        },
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      return response.data.data.translations.map((t) =>
        t.translatedText.toLowerCase(),
      );
    } catch (error) {
      console.error("Çeviri başarısız oldu:", error?.response?.data || error);
      return texts; // Çeviri başarısız olursa orijinal metinleri kullan
    }
  };

  // 🏷️ Etiketlere Göre Filtreleme
  const filterResults = (labels) => {
    if (!labels.length) {
      setFilteredData([]);
      return;
    }

    const filtered = data?.filter((item) => {
      const itemTitle = item.title.toLowerCase();
      return labels.some((label) => itemTitle.includes(label));
    });

    setFilteredData(filtered);
  };

  const numColumns = 3;
  const screenWidth = Dimensions.get("window").width;
  const columnWidth = screenWidth / numColumns - 4;

  return (
    <View style={styles.container}>
      <BackHeader title={t("PazaarfyAI")} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={pickImage} style={styles.button}>
          <LinearGradient colors={["#B5A0FF", "#755CCC"]} style={styles.button}>
            <Text style={styles.buttonText}>{t("SelectFromGallery")}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={takePhoto} style={styles.button}>
          <LinearGradient colors={["#B5A0FF", "#755CCC"]} style={styles.button}>
            <Text style={styles.buttonText}>{t("OpenCamera")}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <MasonryList
        data={filteredData}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        contentContainerStyle={{
          width: sizes.width / 1.08,
          alignSelf: "center",
        }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(routes.HotBablDetail, item);
            }}
          >
            <Image
              source={{ uri: item.cover }}
              style={{
                width: columnWidth,
                height: 150, // 🔥 Dinamik yükseklik eklendi
                margin: 2,
                borderRadius: 1,
              }}
              resizeMode={"cover"}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Search;

// 🎨 Stil Tanımları
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  button: {
    paddingVertical: 10,
    width: sizes.width / 2.2,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

import React, { useState, useRef } from "react";
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
import { useNavigation, useRoute } from "@react-navigation/native";
import MasonryList from "@react-native-seoul/masonry-list";
import LinearGradient from "react-native-linear-gradient";
import { BackHeader } from "../../../components";
import { useTranslation } from "react-i18next";
import { sizes } from "../../../theme";
import routes from "../../../constants/routes";
const GOOGLE_VISION_API_KEY = "AIzaSyDpFoQINJdBr8MXwx5K26qmk3dYAWoovxM"; // API anahtarını buraya ekle

const Search = ({ route }) => {
  const navigation = useNavigation();

  const [imageUri, setImageUri] = useState(null);
  const [labels, setLabels] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const { data } = route.params || {};

  // 📸 Fotoğraf Seçme Fonksiyonu (Galeri)
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
      .catch((error) =>
        Alert.alert("Hata", "Görsel seçme işlemi iptal edildi."),
      );
  };

  // 📷 Kamera ile Fotoğraf Çekme
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
      .catch((error) => Alert.alert("Hata", "Kamera ile çekim iptal edildi."));
  };

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

      const labels =
        response.data.responses[0]?.labelAnnotations?.map((label) =>
          label.description.toLowerCase(),
        ) || [];
      setLabels(labels);
      filterResults(labels);

      console.log("AKO", labels);
    } catch (error) {
      Alert.alert("Hata", "Görsel analizi başarısız oldu.");
    }
  };

  // 🏷️ Google Vision'dan Gelen Sonuçlara Göre Filtreleme

  // 🔄 Liste Elemanı
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate("DetailScreen", { item })}
    >
      <Image source={{ uri: item.cover }} style={styles.image} />
      <Text style={styles.itemTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  const { t } = useTranslation();

  const numColumns = 3;
  const screenWidth = Dimensions.get("window").width;
  const columnWidth = screenWidth / numColumns - 4;

  const heights = [130, 130, 265, 130, 130, 130];

  const updatedData = data?.map((item, index) => ({
    ...item,
    height: heights[index % heights.length], // Döngüsel olarak yükseklikleri ata
  }));

  const filterResults = (labels) => {
    if (!labels.length) {
      setFilteredData([]);
      return;
    }

    const filtered = updatedData.filter((item) => {
      const itemTitle = item.title.toLowerCase();
      return labels.some((label) => itemTitle.includes(label));
    });

    setFilteredData(filtered);
  };

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
                height: item.height, // Yüksekliği dinamik olarak ekledik
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
  previewImage: {
    width: "100%",
    height: 200,
    marginVertical: 10,
    borderRadius: 10,
  },
  labelText: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 16,
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#171717",
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  itemTitle: {
    color: "#FFF",
    fontSize: 16,
  },
  noResult: {
    color: "#BBB",
    textAlign: "center",
    marginTop: 20,
  },
});

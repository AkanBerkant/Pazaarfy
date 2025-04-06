import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  FlatList,
} from "react-native";
import fonts from "../../theme/fonts";
import { sizes } from "../../theme";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import LinearGradient from "react-native-linear-gradient";
import routes from "../../constants/routes";
const mockItems = [
  { id: "1", uri: require("../../assets/1.png") },
  { id: "2", uri: require("../../assets/2.png") },
  { id: "3", uri: require("../../assets/3.png") },
  { id: "4", uri: require("../../assets/44.png") },
  { id: "5", uri: require("../../assets/5.png") },
  { id: "6", uri: require("../../assets/6.png") },
];

export default function Price({ route, navigation }) {
  const { item } = route.params || {
    item: [
      {
        title: "Özel Seramik Varlen Vazo",
        cover: "https://link/to/featured-image.jpg",
      },
    ],
  };

  const [selectedId, setSelectedId] = useState(item[0]?.id);

  const [time, setTime] = React.useState(null);
  const [priced, setPriced] = React.useState(null);

  const [id, setId] = React.useState(item[0]._id);

  const renderItem = ({ item }) => {
    const selected = selectedId === item.id;
    return (
      <TouchableOpacity
        style={styles.gridItem}
        onPress={() => {
          setSelectedId(item.id);
        }}
        activeOpacity={0.8}
      >
        <Image source={item.uri} style={styles.gridImage} />
        <View style={[styles.radio, selected && styles.radioSelected]} />
      </TouchableOpacity>
    );
  };

  const data = [
    {
      label: "Daha fazla öne çıkın 🔥",
    },
    {
      label: "Satış fırsatınızı arttırın 🎁",
    },
    {
      label: "Daha fazla müşteri  💬",
    },
    {
      label: "Aralıksız yayınlanma 📊",
    },
    {
      label: "Popüler Mağaza Olun 🛒",
    },
  ];

  const price = [
    {
      label: "24 saat",
      price: 49,
      time: "1Day",
    },
    {
      label: "3 gün",
      price: 99,
      time: "3Day",
    },
    {
      label: "7 gün",
      price: 199,
      time: "7Day",
    },
  ];

  const [selected, setSelected] = React.useState(1);
  return (
    <ImageBackground
      source={require("../../assets/promode.png")}
      style={styles.container}
    >
      <BlurView
        intensity={10}
        style={{
          position: "absolute",
          zIndex: 99,
          backgroundColor: "rgba(0,0,0,0.5)",
          width: sizes.width,
          height: sizes.height,

          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: sizes.width / 1.2,
            justifyContent: "space-between",
            marginTop: 30,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Image
              style={{
                width: 32,
                height: 32,
              }}
              source={require("../../assets/Subtract.png")}
            />
          </TouchableOpacity>

          <Text
            style={{
              color: "#FFF",
              fontSize: 30,
              fontFamily: fonts.bold,
              marginTop: 50,
            }}
          >
            Pazaarfy Pro
          </Text>

          <View
            style={{
              width: 32,
              height: 32,
            }}
            source={require("../../assets/Subtract.png")}
          />
        </View>
        <View
          style={{
            marginTop: 50,
          }}
        >
          {data.map((item, index) => {
            return (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 20,
                  width: sizes.width / 1.3,
                  alignSelf: "center",
                }}
              >
                <View>
                  <Image
                    resizeMode="contain"
                    style={{
                      width: 17,
                      height: 12,
                    }}
                    source={require("../../assets/checkea.png")}
                  />
                </View>
                <Text
                  style={{
                    marginLeft: 5,
                    fontSize: 17,
                    color: "#fff",
                    fontFamily: fonts.medium,
                  }}
                >
                  {item.label}
                </Text>
              </View>
            );
          })}
        </View>

        {price.map((item, index) => {
          const isSelected = selected === index;

          return (
            <TouchableOpacity
              onPress={() => {
                setSelected(index);
                setTime(item.time);
                setPriced(item.price);
              }}
              style={{
                height: 88,
                borderWidth: 3,
                borderColor: isSelected ? "#9480DC" : "#554B55",
                width: sizes.width / 1.3,
                alignSelf: "center",
                marginTop: 10,
                borderRadius: 23,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <BlurView
                intensity={30}
                style={{
                  height: 82,

                  width: sizes.width / 1.33,
                  alignSelf: "center",
                  overflow: "hidden",
                  borderRadius: 23,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: 10,
                  }}
                >
                  <Text
                    style={{
                      color: "#FFF",
                      fontFamily: fonts.bold,
                      fontSize: 14,
                    }}
                  >
                    {item.label}
                  </Text>
                  <View
                    style={{
                      backgroundColor: "#BA67ED",
                      borderRadius: 12,
                      height: 23,
                      width: 99,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#FFF",
                        fontFamily: index == 1 ? fonts.bold : fonts.medium,
                      }}
                    >
                      {index == 1 ? "Popüler" : "Ekonomik"}
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    padding: 10,

                    fontFamily: fonts.regular,
                    color: "#FFF",
                    fontSize: 16,
                  }}
                >
                  {item.price} / {item.label}
                </Text>
              </BlurView>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          onPress={() => {
            navigation.navigate(routes.PaymentPage, {
              time: time,
              price: priced,
              id: id,
            });
          }}
          style={styles.buttonWrapper}
        >
          <LinearGradient
            colors={["#A168F8", "#7F53E9"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <Text style={styles.buttonText}>Ürünü Yayınla</Text>
          </LinearGradient>
        </TouchableOpacity>
      </BlurView>
      <SafeAreaView />

      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ürününüzü Öne Çıkarın</Text>
        <TouchableOpacity></TouchableOpacity>
      </View>

      <Image style={styles.image} source={{ uri: item[0].cover }} />
      <Text style={styles.title}>{item[0].title}</Text>

      <View style={styles.titleBackContainer}>
        <Text style={styles.gridTitle}>Mağazanızdan ürün seçin</Text>
      </View>

      <FlatList
        data={mockItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    width: "90%",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 16,
    fontFamily: fonts.bold,
  },
  headerAction: {
    color: "#A58EFF",
    fontSize: 14,
    fontFamily: fonts.medium,
  },
  image: {
    width: sizes.width / 1.2,
    height: 352,
    borderRadius: 32,
  },
  title: {
    color: "#FFF",
    fontFamily: fonts.regular,
    fontSize: 16,

    marginTop: 16,
    marginBottom: 16,
    width: sizes.width / 1.2,
  },
  gridTitle: {
    color: "#fff",
    fontSize: 16,
    fontFamily: fonts.bold,
    width: sizes.width / 1.2,
    alignSelf: "center",
  },
  gridContainer: {
    paddingBottom: 40,
  },
  gridItem: {
    width: sizes.width / 3,
    height: 130,
  },
  gridImage: {
    width: sizes.width / 3,
    height: 130,
  },
  radio: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "transparent",
  },
  radioSelected: {
    backgroundColor: "#A58EFF",
  },
  titleBackContainer: {
    backgroundColor: "#000",
    width: sizes.width,
    height: 54,

    justifyContent: "center",
  },
  buttonWrapper: {
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 12,
    alignSelf: "center",
  },
  gradient: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 250,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "System", // veya kendi fontun
  },
});

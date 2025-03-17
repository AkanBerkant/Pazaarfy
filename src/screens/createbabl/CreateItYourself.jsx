import React from "react";
import {
  View,
  StyleSheet,
  Button,
  Text,
  Image,
  Modal,
  Animated,
  TouchableOpacity,
} from "react-native";

import { useTranslation } from "react-i18next";
import LinearGradient from "react-native-linear-gradient";

import { sizes } from "../../theme";
import fonts from "../../theme/fonts";
import { BlurView } from "expo-blur";

const CreateItYourself = ({
  visible,
  onVideoPress,
  onPhotoPress,
  onClose,
  onTextPress,
}) => {
  const [showModal, setShowModal] = React.useState(visible);
  const scaleValue = React.useRef(new Animated.Value(0)).current;
  const { t } = useTranslation();

  React.useEffect(() => {
    toggleModal();
  }, [visible]);

  const toggleModal = () => {
    if (visible) {
      setShowModal(true);
      Animated.spring(scaleValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      setTimeout(() => {
        return setShowModal(false);
      }, 200);
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const data = [
    {
      label: t("videoAndShortVideo"),
      icon: require("../../assets/docs.png"),
      onPress: onVideoPress,
    },
    {
      label: t("Photo"),
      icon: require("../../assets/camera.png"),
      onPress: onPhotoPress,
    },
  ];

  return (
    <Modal transparent visible={showModal}>
      <View style={styles.modalBackGround}>
        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ scale: scaleValue }] },
          ]}
        >
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            colors={["#B5A0FF", "#755CCC"]}
            style={[
              {
                width: 37,
                backgroundColor: "#000",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 20,
                height: 37,
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "flex-end",

                position: "absolute",
                zIndex: 99,
                top: -15,
              },
            ]}
          >
            <TouchableOpacity
              style={{
                zIndex: 99,
                width: 33,
                height: 33,
                borderRadius: 20,
              }}
              onPress={onClose}
            >
              <Image
                source={require("../../assets/clos.png")}
                style={{
                  width: 33,
                  height: 33,
                  borderRadius: 20,
                }}
              />
            </TouchableOpacity>
          </LinearGradient>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            colors={["#B5A0FF", "#755CCC"]}
            style={[
              styles.linearGradient,
              {
                width: sizes.width / 1.4,
                backgroundColor: "#000",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 20,
                elevation: 20,
                padding: 5,
              },
            ]}
          >
            <BlurView
              tint="light"
              style={[
                styles.modalContainer,
                {
                  borderRadius: 20,
                  overflow: "hidden",
                  padding: 5,
                },
              ]}
            >
              {data.map((item, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      item.onPress();
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",

                        width: sizes.width / 1.7,
                        alignSelf: "center",
                        marginTop: 10,
                        padding: 5,
                      }}
                    >
                      <Image
                        source={item.icon}
                        style={[
                          styles.icon,
                          {
                            tintColor: index == 0 ? "#755CCC " : "#FFF",
                          },
                        ]}
                        resizeMode="contain"
                      />
                      <Text style={styles.label}>{item.label}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </BlurView>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackGround: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: sizes.width / 1.43,
    backgroundColor: "#000",
    elevation: 20,
    borderRadius: 20,
  },

  label: {
    color: "#FFF",
    fontFamily: fonts.roboto,
    marginLeft: 7,
  },

  icon: {
    width: 20,
    height: 20,
    tintColor: "#FFF",
  },
  close: {
    width: 30,
    height: 30,
  },
});

export default CreateItYourself;

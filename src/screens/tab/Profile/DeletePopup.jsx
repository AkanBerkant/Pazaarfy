import React from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  StyleSheet,
  Button,
  Modal,
  Image,
  Text,
  TouchableOpacity,
  Animated,
} from "react-native";
import fonts from "../../../theme/fonts";
import { sizes } from "../../../theme";

const DeletePopup = ({ visible, onExitPress, onClose }) => {
  const [showModal, setShowModal] = React.useState(visible);
  const scaleValue = React.useRef(new Animated.Value(0)).current;
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
      setTimeout(() => setShowModal(false), 200);
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const { t } = useTranslation();
  return (
    <Modal transparent visible={showModal}>
      <View style={styles.modalBackGround}>
        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ scale: scaleValue }] },
          ]}
        >
          <TouchableOpacity onPress={onClose}>
            <Image
              style={styles.closed}
              source={require("../../../assets/closed.png")}
            />
          </TouchableOpacity>
          <Image
            style={styles.icon}
            resizeMode="contain"
            source={require("../../../assets/deletek.png")}
          />
          <Text style={styles.text}>{t("sureToDeleteAccount")}</Text>
          <View style={styles.row}>
            <TouchableOpacity onPress={onClose} style={styles.cancel}>
              <Text style={styles.buttonText}>{t("Cancel")}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onExitPress} style={styles.button}>
              <Text style={styles.buttonText}>{t("Confirm")}</Text>
            </TouchableOpacity>
          </View>
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
    width: "80%",
    backgroundColor: "#161616",
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 20,
  },
  header: {
    width: "100%",
    height: 40,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  closed: {
    width: 31,
    height: 31,
    alignSelf: "flex-end",
  },
  icon: {
    width: 75,
    height: 75,
    alignSelf: "center",
  },
  text: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 14,
    width: sizes.width / 2,
    fontFamily: fonts.bold,
    alignSelf: "center",
    marginTop: 30,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },
  cancel: {
    height: 47,
    borderRadius: 10,
    backgroundColor: "#B5A0FF",
    borderWidth: 1,
    width: 127,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    margin: 5,
  },
  button: {
    height: 47,
    borderRadius: 10,
    borderColor: "#3D3D3D",
    borderWidth: 1,
    width: 127,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    margin: 5,
  },
  buttonText: {
    color: "#fff",
    fontFamily: fonts.medium,
    fontSize: 16,
  },
});

export default DeletePopup;

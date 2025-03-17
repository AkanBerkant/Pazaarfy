import React from "react";
import {
  View,
  StyleSheet,
  Button,
  Modal,
  Image,
  Text,
  Animated,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { t } from "i18next";

import { ButtonLinear } from "../../components";
import routes from "../../constants/routes";
import { sizes } from "../../theme";
import fonts from "../../theme/fonts";

const ForgotPasswordModal = ({ visible, onClose }) => {
  const [showModal, setShowModal] = React.useState(visible);
  const scaleValue = React.useRef(new Animated.Value(0)).current;

  const navigation = useNavigation();
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
  return (
    <Modal transparent visible={showModal}>
      <View style={styles.modalBackGround}>
        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ scale: scaleValue }] },
          ]}
        >
          <Image
            style={styles.bigBabl}
            source={require("../../assets/b.png")}
          />
          <Text style={styles.congratulations}>{t("CONGRATULATIONS")}</Text>
          <Text style={styles.desc}>{t("YourNewPasswordSuccessfully")}</Text>
          <View style={styles.top} />
          <ButtonLinear
            title={t("Login")}
            onPress={() => {
              navigation.navigate(routes.Login);
              onClose();
            }}
            width={sizes.width / 1.34}
            linearWidth={sizes.width / 1.36}
          />
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
    width: "90%",
    backgroundColor: "#080808",
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    width: "100%",
    height: 40,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  bigBabl: {
    width: 133,
    height: 133,
  },
  congratulations: {
    color: "#FFF",
    fontFamily: fonts.roboto,
    marginTop: 20,
    fontSize: 24,
  },
  desc: {
    fontSize: 16,
    color: "#7A7A7A",
    fontFamily: fonts.regular,
    marginTop: 5,
  },
  top: {
    marginTop: 30,
  },
});

export default ForgotPasswordModal;

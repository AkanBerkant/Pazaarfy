import React from "react";
import {
  View,
  StyleSheet,
  Button,
  Modal,
  Text,
  Animated,
  TextInput,
  Alert,
} from "react-native";

import { t } from "i18next";

import fonts from "../../theme/fonts";

const Other = ({ visible, onClose, onSendPress }) => {
  const [messageContent, setMessageContent] = React.useState("");
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
          <Text style={styles.title}>{t("Report")}</Text>
          <TextInput
            placeholder={t("SendYourComplaint")}
            multiline
            style={styles.input}
            value={messageContent}
            onChangeText={setMessageContent}
          />
          <View
            style={{
              flexDirection: "row",
              alignSelf: "flex-end",
            }}
          >
            <Button title={t("Close")} onPress={onClose} color="#4b9fe3" />
            <Button
              title={t("Send")}
              color="#8A8A8A"
              onPress={() => {
                if (!messageContent.length) {
                  return Alert.alert(t("PleaseEnterYourMessage"));
                }

                onSendPress(messageContent);
              }}
            />
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
    width: "75%",
    backgroundColor: "#212121",
    paddingHorizontal: 20,
    paddingVertical: 30,

    elevation: 20,
  },
  title: {
    color: "#FFF",
    fontFamily: fonts.roboto,
    fontSize: 18,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  label: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: "#FFF",
    marginLeft: 8,
  },
  input: {
    borderBottomWidth: 1,
    marginTop: 10,
    color: "#fff",
    borderBottomColor: "#8A8A8A",
    fontFamily: fonts.regular,
  },
});

export default Other;

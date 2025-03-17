import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Touchable,
  TouchableOpacity,
} from "react-native";
import { ButtonBorder, ButtonLinear } from "../../components";
import routes from "../../constants/routes";

const Welcome = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View
        style={{
          height: 74,
        }}
      />
      <Image source={require("../../assets/logo.png")} style={styles.logo} />

      <View>
        <ButtonBorder
          onPress={() => {
            navigation.navigate(routes.Register);
          }}
          title={"Kayıt Ol"}
        />
        <ButtonLinear
          onPress={() => {
            navigation.navigate(routes.Login);
          }}
          title={"Giriş Yap"}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 50,
  },
  logo: {
    width: 187,
    height: 74,
  },
});

export default Welcome;

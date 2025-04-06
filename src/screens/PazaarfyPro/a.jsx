import React from "react";
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
  StyleSheet,
  Text,
  ImageBackground,
  FlatList,
  ScrollView,
  TextInput,
} from "react-native";
import { sizes } from "../../theme/theme";
// import Eft from './Eft';
import CreditCard from "./CreditCard";
import routes from "../../constants/routes";
import { paymentCreate, getBonusSetting } from "../../utils/queries";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "react-query";
import { useAtomValue } from "jotai";
import { colorsAtom, generalSettingAtom, userAtom } from "../../utils/atoms";
import { Notifier } from "react-native-notifier";
import MainHeader from "../../components/MainHeader";
import { useFontFamily } from "../../utils/customHook";
import { formatPrice } from "../../utils/helper";

const schema = yup.object().shape({
  price: yup.number().required("Miktar giriniz"),
});

// const tabs = [
//   {
//     time: 'Kredi Kartı',
//     _id: 'credit',
//   },
//   // {
//   //   time: 'Havale / Eft',
//   //   _id: 'eft',
//   // },
// ];

const buttons = [
  {
    withdrawn_price: 10,
  },
  {
    withdrawn_price: 25,
  },
  {
    withdrawn_price: 50,
  },
  {
    withdrawn_price: 100,
  },
  {
    withdrawn_price: 250,
  },
  {
    withdrawn_price: 1000,
  },
];

const AddBalance = ({ navigation }) => {
  // const [customFilter, setCustomFilter] = React.useState(tabs[0]._id);
  // const [selected, setSelected] = React.useState(0);

  const colors = useAtomValue(colorsAtom);

  const { data: bonusData } = useQuery("bonusSetting", getBonusSetting);

  const fontFamily = useFontFamily();

  const user = useAtomValue(userAtom);
  const setting = useAtomValue(generalSettingAtom);

  const { handleSubmit, watch, reset, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      price: buttons[0].withdrawn_price,
    },
  });

  const total = watch("price");

  // const onSubmit = data => {
  //   if (data.price < 6) {
  //     Notifier.showNotification({
  //       title: 'Hata',
  //       description: 'Minimum 6 TL yükleme yapabilirsiniz',
  //       duration: 5000,
  //     });
  //     return;
  //   }
  //   const newData = {
  //     withdrawn_price: data.price,
  //     // loaded_price: data.price.loaded_price,
  //     email: user.email,
  //     phone: user.phone,
  //     fullname: user.fullname,
  //     user_id: user._id,
  //   };

  //   mutation.mutate(newData);
  // };

  // const onError = errors => {
  //   console.error(errors);
  // };

  const mutation = useMutation(paymentCreate, {
    onSuccess: (data) => {
      navigation.navigate(routes.PaymentPage, {
        token: data.token,
      });
      reset({
        price: buttons[0].withdrawn_price,
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleInputChange = (text) => {
    // Remove any non-numeric characters
    const filteredText = text.replace(/[^0-9]/g, "");
    setValue("price", Number(filteredText));
  };

  const renderItem = ({ item }) => {
    const isSelected = total === item.withdrawn_price;

    const isLevelTwo =
      bonusData?.level_two && item.withdrawn_price >= bonusData.level_two;
    const isLevelOne =
      !isLevelTwo &&
      bonusData?.level_one &&
      item.withdrawn_price >= bonusData.level_one;

    const percentage = isLevelTwo
      ? bonusData.level_two_percentage
      : isLevelOne
        ? bonusData.level_one_percentage
        : null;

    return (
      <TouchableOpacity
        onPress={() => setValue("price", item.withdrawn_price)}
        style={[
          styles.button,
          {
            height: 88,

            justifyContent: "center",
            borderWidth: 1,
            borderColor: isSelected ? colors.primary : "#EDEDED",
            position: "relative",
          },
        ]}
      >
        <View>
          <Text
            style={[
              styles.label,
              {
                color: isSelected ? colors.primary : "#000",
                fontFamily: fontFamily.regular,
              },
            ]}
          >
            {formatPrice(item.withdrawn_price, setting.currency_format)}
          </Text>

          {percentage && (
            <View
              style={[
                styles.percentageBadge,
                {
                  backgroundColor: colors.primary,
                },
              ]}
            >
              <Text
                style={[
                  styles.percentageText,
                  {
                    fontFamily: fontFamily.regular,
                  },
                ]}
              >{`${percentage}%`}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <MainHeader top={60} title={"Bakiye Yükle"} />

      <View
        style={{ backgroundColor: "#F7F8FA", width: sizes.width, height: 10 }}
      />

      <View
        style={{
          backgroundColor: "#FFF",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: sizes.width / 1.13,
            alignSelf: "center",
            marginTop: 20,
          }}
        >
          <Image
            style={{
              width: 22,
              height: 21,
            }}
            source={require("../../../assets/wall.png")}
          />
          <Text
            style={{
              color: "#272835",
              fontSize: 18,
              fontFamily: "SFProText-Medium",
              marginLeft: 10,
              fontFamily: fontFamily.regular,
            }}
          >
            Yüklenecek Tutarı Seçin
          </Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <FlatList
            renderItem={renderItem}
            data={buttons}
            numColumns={3}
            contentContainerStyle={styles.center}
            scrollEnabled={false}
          />
          <View style={styles.amountContainer}>
            <Text
              style={[
                styles.amount,
                {
                  fontFamily: fontFamily.regular,
                },
              ]}
            >
              {"Miktar"}
            </Text>
            <View>
              <TextInput
                style={{
                  color: "#818898",

                  width: sizes.width / 1.1,
                  height: 52,
                  backgroundColor: "#F8F9FA",
                  borderRadius: 16,
                  padding: 10,
                  fontWeight: "600",
                  fontFamily: fontFamily.regular,
                }}
                onChangeText={(text) => handleInputChange(text)}
                keyboardType="numeric"
                placeholderTextColor="#818898"
                value={total.toString()}
              />
            </View>
          </View>

          {/* {customFilter == 'credit' ? (
          <CreditCard onPress={handleSubmit(onSubmit, onError)} total={total} />
        ) : customFilter == 'eft' ? (
          <Eft />
        ) : null} */}
          <CreditCard
            balance={true}
            // onPress={handleSubmit(onSubmit, onError)}
            total={total}
            isLoading={mutation.isLoading}
            reset={reset}
          />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },
  back: {
    width: 12,
    height: 22,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  added: {
    color: "#000",
    fontSize: 18,
    fontFamily: "Montserrat-Bold",
    marginLeft: 7,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: sizes.width / 1.1,
    alignSelf: "center",
  },
  clock: {
    width: 21,
    height: 22,
  },
  past: {
    fontSize: 16,
    // color: '#FF5501',
    fontFamily: "Montserrat",
    marginRight: 7,
  },
  linearBg: {
    height: 69,
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  position: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  wallet: {
    width: 34,
    height: 34,
  },
  walletText: {
    color: "#FFF",
    fontSize: 14,
    fontFamily: "Montserrat",
    marginLeft: 4,
  },
  price: {
    fontFamily: "Montserrat-Bold",
    color: "#FFF",
    marginLeft: 4,
  },
  addedWallet: {
    color: "#000",
    fontSize: 18,
    fontFamily: "Montserrat-Bold",
    textAlign: "center",
    marginTop: 20,
  },
  addedWalletDesc: {
    color: "#000",
    fontFamily: "Montserrat",
    textAlign: "center",
    marginTop: 7,
  },
  center: {
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    width: sizes.width / 3.6,
    borderWidth: 1,
    borderColor: "#E2E2E2",
    borderRadius: 16,
    height: 54,
    justifyContent: "center",
    alignItems: "center",
    margin: 7,
  },
  label: {
    color: "#000",
    fontFamily: "Montserrat-Bold",
    fontSize: 16,
  },
  percentageBadge: {
    position: "absolute",
    top: -40,
    right: -30,
    // backgroundColor: '#FF5501',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  percentageText: {
    color: "#FFF",
    fontFamily: "Montserrat-Bold",
    fontSize: 10,
  },
  discountContainer: {
    // backgroundColor: '#FF5501',
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9,
    height: 36,
    width: 36,
  },
  discount: {
    color: "#FFF",
    fontFamily: "Montserrat-Bold",
  },
  amount: {
    color: "#273C4C",
    fontFamily: "SFProText-Bold",
    marginTop: 10,
    fontWeight: "500",
    marginBottom: 10,
  },
  input: {
    width: sizes.width / 1.1,
    alignSelf: "center",
    backgroundColor: "#ECECEC",
    height: 52,

    borderRadius: 100,
    padding: 10,
    justifyContent: "center",
  },
  amountContainer: {
    width: sizes.width / 1.1,
    alignSelf: "center",
  },
  pager: {
    justifyContent: "center",
    width: sizes.width,
    alignSelf: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#F7F7F7",
    marginTop: 30,
    height: 60,
  },
  menu: {
    alignItems: "center",
    margin: 15,
  },
});

export default AddBalance;

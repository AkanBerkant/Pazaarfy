import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import { sizes } from '../../theme';
import fonts from '../../theme/fonts';

const AllRequests = ({ navigation }) => {
  const data = [
    {
      label: 'Para Transferi ve Döviz Al Ha...',
      desription: 'Alıcıya 500 tl gönderdim ama bana geri...',
      status: 'Talebin devam ediyor',
      id: '#94335',
      statusType: 'Pending',
    },
    {
      label: 'Para Transferi ve Döviz Al Ha...',
      desription: 'Alıcıya 500 tl gönderdim ama bana geri...',
      status: 'Talebin devam ediyor',
      id: '#94335',
      statusType: 'active',
    },
    {
      label: 'Para Transferi ve Döviz Al Ha...',
      desription: 'Alıcıya 500 tl gönderdim ama bana geri...',
      status: 'Talebin devam ediyor',
      id: '#94335',
      statusType: 'Pending',
    },
  ];

  const renderItem = ({ item }) => {
    return (
      <View style={styles.item}>
        <Text style={styles.label}>{item.label}</Text>
        <Text style={styles.description}>{item.desription}</Text>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: '#2F2F2F',
            marginTop: 30,
            width: sizes.width / 1.1,
            alignSelf: 'center',
          }}
        />
        <View
          style={[
            styles.between,
            {
              width: sizes.width / 1.2,
              alignSelf: 'center',
            },
          ]}
        >
          <View style={styles.row}>
            <View
              style={{
                backgroundColor:
                  item.statusType == 'Pending' ? '#F39200' : '#01A29C',
                width: 11,
                height: 11,
                borderRadius: 11,
              }}
            />
            <Text
              style={[
                styles.statusType,
                {
                  color: item.statusType == 'Pending' ? '#F39200' : '#01A29C',
                },
              ]}
            >
              {item.status}
            </Text>
          </View>
          <Text style={styles.id}>{item.id}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.row}
        >
          <Image
            source={require('../../assets/bgg.png')}
            resizeMode="contain"
            style={styles.back}
          />
          <Text style={styles.dark}>asdıubasdbasd</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Tüm Talepler</Text>
        <View style={styles.row}>
          <Text style={styles.dark}>asdıubasdbasd</Text>
          <Image
            source={require('../../assets/adde.png')}
            resizeMode="contain"
            style={styles.back}
          />
        </View>
      </View>
      <View style={styles.borderBottom} />

      <FlatList
        data={data}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          marginTop: 30,
        }}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#000',
  },
  back: {
    width: 23,
    height: 23,
  },
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    width: sizes.width / 1.1,
    alignSelf: 'center',
  },
  title: {
    color: '#FFF',
    fontFamily: fonts.roboto,
    fontSize: 18,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#171717',
    width: sizes.width,
    marginTop: 25,
  },

  request: {
    fontSize: 18,
    color: '#FFF',
    fontFamily: fonts.roboto,
  },
  all: {
    color: '#01A29C',
    fontSize: 16,
    fontFamily: fonts.roboto,
  },
  between: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: sizes.width / 1.1,
    marginTop: 20,
  },
  label: {
    color: '#FFF',
    fontFamily: fonts.roboto,
    fontSize: 18,
    marginLeft: 10,
    marginTop: 10,
  },
  item: {
    width: sizes.width / 1.07,
    marginTop: 10,
    backgroundColor: '#0D0D0D',
    height: 168,
    borderRadius: 15,
    padding: 10,
    margin: 10,
  },
  description: {
    color: '#575757',
    fontFamily: fonts.roboto,
    marginTop: 10,
    marginLeft: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusType: {
    fontSize: 14,
    fontFamily: fonts.roboto,
    marginLeft: 13,
  },
  id: {
    color: '#B7B7B7',
    fontFamily: fonts.regular,
  },
  dark: {
    color: '#000',
  },
});

export default AllRequests;

import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import { useAtomValue } from 'jotai';
import LinearGradient from 'react-native-linear-gradient';

import routes from '../../../constants/routes';
import { sizes } from '../../../theme';

const CategoryOptions = ({ data, counts, newItemSession }) => {
  const navigation = useNavigation();
  const route = useRoute();

  const renderItem = ({ item }) => {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          colors={['#F9B092', '#D5D399', '#0AAFF6']}
          style={[
            styles.linearGradient,
            {
              width: sizes.width / 2.1,
              height: sizes.width / 2.1,
              justifyContent: 'center',
              alignItems: 'center',
              margin: 3,
              borderRadius: 25,
            },
          ]}
        >
          <View style={styles.linearContainerCard}>
            <TouchableOpacity
              onPress={() => {
                if (item.onPress) {
                  return item.onPress();
                }

                navigation.navigate(routes.YoutubeLists, {
                  item,
                  bablId: route.params?.bablId,
                  newItemSession,
                });
              }}
            >
              {counts[item.type] && !newItemSession ? (
                <LinearGradient
                  start={{ x: 1, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  colors={['#F9B092', '#D5D399', '#0AAFF6']}
                  style={styles.linearGradient}
                >
                  <View style={styles.linearGradientContainer}>
                    <Text style={styles.buttonText}>{counts[item.type]}</Text>
                  </View>
                </LinearGradient>
              ) : (
                <View
                  style={{
                    width: 42,
                    height: 42,
                    width: sizes.width / 2.2,
                  }}
                />
              )}
              <View style={styles.center}>
                <Image
                  source={item.icon}
                  style={styles.icon}
                  resizeMode="contain"
                />
                <Text style={styles.white}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
              </View>
              {/* <Image
                source={require('../../../assets/plus.png')}
                style={styles.plus}
              /> */}
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  };

  return (
    <View style={styles.top}>
      <FlatList
        scrollEnabled={false}
        data={data}
        numColumns={2}
        renderItem={renderItem}
        contentContainerStyle={styles.contentContainerStyle}
        ListFooterComponent={<View style={{ height: 100 }} />}
      />
    </View>
  );
};

export default CategoryOptions;

const styles = StyleSheet.create({
  card: {
    borderColor: '#EE558F',
    borderRadius: 20,
    width: sizes.width / 2.07,
    borderWidth: 2,
    margin: 3,
    height: sizes.width / 2.07,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 7,
  },
  linearContainerCard: {
    backgroundColor: '#000',

    borderRadius: 20,

    width: sizes.width / 2.17,
    height: sizes.width / 2.17,
  },
  icon: {
    width: 34,
    height: 34,
  },
  white: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 10,
  },
  linearGradient: {
    width: 35,
    height: 35,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  linearGradientContainer: {
    width: 30,
    height: 30,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#000',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  description: {
    color: '#FFF',
    fontSize: 9,
    marginTop: 5,
    textAlign: 'center',
  },
  plus: {
    width: 29,
    height: 29,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  top: {
    marginTop: 10,
    alignItems: 'center',
    width: sizes.width,
  },
  center: {
    alignItems: 'center',
  },
  contentContainerStyle: {
    width: sizes.width,
    alignItems: 'center',
    alignSelf: 'center',
  },
});

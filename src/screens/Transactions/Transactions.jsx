import React from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useQuery } from '@tanstack/react-query';
import { t } from 'i18next';
import { useAtomValue } from 'jotai';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import { Modalize } from 'react-native-modalize';

import { BackHeader } from '../../components';
import routes from '../../constants/routes';
import { sizes } from '../../theme';
import fonts from '../../theme/fonts';
import { userAtom } from '../../utils/atoms';
import * as Queries from '../../utils/queries';

import Pull from './Pull';

const Transactions = ({ navigation }) => {
  const user = useAtomValue(userAtom);

  const icons = [
    {
      icon: require('../../assets/added.png'),
      label: t('Deposit'),
      onPress: () => {
        navigation.navigate(routes.Deposit);
      },
    },
    {
      icon: require('../../assets/negat.png'),
      label: t('Withdraw'),
      onPress: () => {
        modalizeRef.current.open();
      },
    },
    {
      icon: require('../../assets/gift.png'),
      label: t('Gifts'),
      onPress: () => {
        navigation.navigate(routes.Giff, { buy: true });
      },
    },
  ];

  const withdrawRequestsQuery = useQuery(['W_REQUESTS'], Queries.withdrawRequests, {
    placeholderData: [],
  });

  const { data } = withdrawRequestsQuery;

  const modalizeRef = React.useRef();

  const [inputFocus, setInputFocus] = React.useState(null);

  const renderItem = ({ item }) => {
    return (
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={['#2A2A2A', '#000000', '#383838']}
        style={styles.item}
      >
        <View style={styles.row}>
          <Image
            style={styles.type}
            source={
              item.type == 'plus' || true
                ? require('../../assets/green.png')
                : require('../../assets/upper.png')
            }
          />
          <View style={styles.left}>
            <Text style={styles.itemLabel}>{t('WithdrawalProcess')}</Text>
            <Text style={styles.itemDate}>{moment(item.createdAt).format('MMM Do YY')}</Text>
          </View>
        </View>
        <Text
          style={[
            styles.price,
            {
              color: item.type == 'plus' || true ? '#7BFF4C' : '#FF7171',
            },
          ]}
        >
          {`+ ${item.amount.toFixed(2)}$`}
        </Text>
      </LinearGradient>
    );
  };
  return (
    <View
      style={{
        backgroundColor: '#000',
        flex: 1,
      }}
    >
      <View style={styles.container}>
        <BackHeader title={t('Transactions')} />
        <ScrollView>
          {/* <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            colors={['#2A2A2A', '#000000', '#383838']}
            style={styles.linearGradient}
          >
            <Text style={styles.title}>Total Assets</Text>

            <View style={styles.row}>
              <Image source={require('../../assets/sendbabl.png')} style={styles.logo} />
              <Text style={styles.bold}>{user.coin || 0}</Text>
            </View>
            <View
              style={[
                styles.row,
                {
                  marginTop: 0,
                },
              ]}
            >
              <View
                style={{
                  marginLeft: 20,
                }}
              />
              <View style={styles.icons}>
                {icons.map((item, index) => {
                  return (
                    <TouchableOpacity onPress={item.onPress} style={styles.center}>
                      <Image source={item.icon} style={styles.icon} />
                      <Text style={styles.iconLabel}>{item.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </LinearGradient> */}

          {false && (
            <View
              style={[
                styles.between,
                {
                  width: sizes.width / 1.1,
                  alignSelf: 'center',
                },
              ]}
            >
              <View style={styles.inputContainer}>
                <Image style={styles.search} source={require('../../assets/search.png')} />
                <TextInput
                  placeholder={t('SearchTransaction')}
                  placeholderTextColor="#555555"
                  style={styles.input}
                />
              </View>

              <Image style={styles.filter} source={require('../../assets/filtered.png')} />
            </View>
          )}

          <View
            style={[
              styles.between,
              {
                width: sizes.width / 1.1,
                alignSelf: 'center',
              },
            ]}
          >
            <Text style={styles.month}>{t('ThisMonth')}</Text>
            {/* {false && <Text style={styles.date}>Refresh at Today, 11.20</Text>} */}
          </View>

          <FlatList data={data} renderItem={renderItem} />
        </ScrollView>
      </View>
      <Modalize
        snapPoint={inputFocus ? sizes.width * 2.1 : sizes.width * 1.9}
        handlePosition="inside"
        handleStyle={styles.handleStyle}
        modalStyle={styles.modalStyle}
        scrollViewProps={{
          scrollEnabled: false,
        }}
        ref={modalizeRef}
      >
        <Pull
          onFocus={() => {
            setInputFocus(true);
          }}
          onBlur={() => {
            setInputFocus(false);
          }}
        />
      </Modalize>
    </View>
  );
};

export default Transactions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  card: {
    width: sizes.width / 1.1,
    alignSelf: 'center',
    backgroundColor: '#181818',
    marginTop: 10,
    elevation: 5,
    borderRadius: 10,
    height: 65,
    justifyContent: 'center',
  },
  label: {
    marginLeft: 20,
    color: '#FFF',
    fontFamily: fonts.roboto,
    fontWeight: 'bold',
    fontSize: 16,
  },
  linearGradient: {
    borderRadius: 18,
    width: sizes.width / 1.1,
    alignSelf: 'center',
    height: 189,
    marginTop: 20,
  },
  title: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: fonts.roboto,
    marginTop: 30,
  },
  logo: {
    width: 43,
    height: 43,
  },
  bold: {
    fontWeight: 'bold',
    fontSize: 43,
    color: '#FFF',
    fontFamily: fonts.roboto,
    marginLeft: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 15,
  },
  icon: {
    width: 22,
    height: 22,
  },
  iconLabel: {
    color: '#FFF',
    fontWeight: 'bold',
    fontFamily: fonts.roboto,
    marginTop: 5,
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
    margin: 20,
  },
  top: {
    marginTop: 15,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
    width: sizes.width / 1.1,
    alignSelf: 'center',
    height: 73,
    borderRadius: 18,
    marginTop: 12,
  },
  type: {
    width: 40,
    height: 40,
  },
  itemLabel: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: '#FFF',
  },
  itemDate: {
    fontSize: 13,
    fontFamily: fonts.roboto,
    color: '#666666',
  },
  left: {
    marginLeft: 15,
  },
  price: {
    color: '#7BFF4C',
    fontFamily: fonts.roboto,
    marginRight: 10,
  },
  between: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    width: sizes.width / 1.1,
    alignSelf: 'center',
  },
  month: {
    fontSize: 13,
    color: '#666666',
    fontFamily: fonts.regular,
  },
  date: {
    fontSize: 13,
    color: '#666666',
    fontFamily: 'Roboto-Italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: sizes.width / 1.22,
    backgroundColor: '#0F0F0F',
    height: 45,
    borderRadius: 10,
    padding: 10,
    fontFamily: fonts.roboto,
  },
  input: {
    marginLeft: 5,
    width: sizes.width / 1.5,
    color: '#FFF',
  },
  filter: {
    width: 30,
    height: 30,
  },
  search: {
    width: 23,
    height: 23,
    tintColor: '#555555',
  },
  handleStyle: {
    backgroundColor: '#111111',
    height: 5,
    width: 36,
  },
  modalStyle: {
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    backgroundColor: '#111111',
    justifyContent: 'space-between',
    flex: 0.9,
  },
});

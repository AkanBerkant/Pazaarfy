import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useQuery } from '@tanstack/react-query';
import { t } from 'i18next';
import { useAtomValue } from 'jotai';
import LinearGradient from 'react-native-linear-gradient';
import { Modalize } from 'react-native-modalize';

import { BackHeader } from '../../../components';
import routes from '../../../constants/routes';
import { sizes } from '../../../theme';
import fonts from '../../../theme/fonts';
import { userAtom } from '../../../utils/atoms';
import * as Queries from '../../../utils/queries';
import Pull from '../../Transactions/Pull';

const BalanceMonetary = ({ navigation }) => {
  const sections = [
    {
      label: t('Transactions'),
      onPress: () => {
        navigation.navigate(routes.Transactions);
      },
    },
    // {
    //   label: 'Help and Feedback',
    //   onPress: () => {
    //     navigation.navigate(routes.HelpFeedback);
    //   },
    // },
    /* {
      label: 'Security',
      onPress: () => {
        navigation.navigate(routes.Contracts, {
          contracts:
            'On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammeled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.',
          title: 'Privacy Policy',
        });
      },
    }, */
  ];

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={item.onPress} style={styles.items}>
        <Text style={styles.label}>{item.label}</Text>
        <Image source={require('../../../assets/arrowr.png')} style={styles.arrowR} />
      </TouchableOpacity>
    );
  };

  const user = useAtomValue(userAtom);

  const modalizeRef = React.useRef();

  const [inputFocus, setInputFocus] = React.useState(null);

  const icons = [
    {
      icon: require('../../../assets/added.png'),
      label: t('Deposit'),
      onPress: () => {
        navigation.navigate(routes.Deposit);
      },
    },
    {
      icon: require('../../../assets/negat.png'),
      label: t('Withdraw'),
      onPress: () => {
        modalizeRef.current.open();
      },
    },
    {
      icon: require('../../../assets/gift.png'),
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

  return (
    <View style={styles.container}>
      <BackHeader title={t('Payment')} />

      <ScrollView>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={['#2A2A2A', '#000000', '#383838']}
          style={styles.linearGradient}
        >
          <Text style={styles.title}>{t('TotalAssets')}</Text>

          <View style={styles.row}>
            <Image source={require('../../../assets/sendbabl.png')} style={styles.logo} />
            <Text style={styles.bold}>{(user.coin || 0).toFixed(2)}</Text>
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
        </LinearGradient>

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
              <Image style={styles.search} source={require('../../../assets/search.png')} />
              <TextInput
                placeholder={t('SearchTransaction')}
                placeholderTextColor="#555555"
                style={styles.input}
              />
            </View>

            <Image style={styles.filter} source={require('../../../assets/filtered.png')} />
          </View>
        )}
        <FlatList data={sections} renderItem={renderItem} />
      </ScrollView>

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

export default BalanceMonetary;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  arrowR: {
    width: 10,
    height: 16,
    tintColor: '#FFF',
  },

  label: {
    fontFamily: fonts.roboto,
    color: '#FFF',
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

  between: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    width: sizes.width / 1.1,
    alignSelf: 'center',
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
  items: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: sizes.width / 1.07,
    height: 67,
    alignSelf: 'center',
    padding: 10,
    borderRadius: 14,
    backgroundColor: '#101010',
    marginTop: 10,
  },
});

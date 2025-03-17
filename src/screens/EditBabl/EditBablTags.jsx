import React from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';

import { sizes } from '../../theme';
import fonts from '../../theme/fonts';
import { bablFormAtom } from '../../utils/atoms';

const EditBablTags = ({ edited }) => {
  const [bablForm, setBablForm] = useAtom(bablFormAtom);
  const { t } = useTranslation();

  const [hashtagText, setHashtagText] = React.useState('');

  const renderItemTickets = ({ item }) => {
    return (
      <View style={styles.itemTickets}>
        <Text style={styles.label}>
          #
          {item}
        </Text>
        <TouchableOpacity
          onPress={() => {
            setBablForm((prev) => {
              return {
                ...prev,
                hashtags: prev.hashtags.filter((prevHashtag) => {
                  return prevHashtag !== item;
                }),
              };
            });
          }}
        >
          <Image source={require('../../assets/closes.png')} style={styles.closes} />
        </TouchableOpacity>
      </View>
    );
  };

  const onSubmitEditing = () => {
    setBablForm((prev) => {
      return {
        ...prev,
        hashtags: [...prev.hashtags, hashtagText],
      };
    });
  };

  return (
    <View>
      <TextInput
        placeholderTextColor="#AEAEAE"
        style={styles.input}
        value={hashtagText}
        onChangeText={setHashtagText}
        onSubmitEditing={onSubmitEditing}
        placeholder={t('enterHashtag')}
      />
      <View style={styles.top} />
      {!edited && (
        <FlatList
          contentContainerStyle={styles.items}
          numColumns={3}
          data={bablForm.hashtags}
          renderItem={renderItemTickets}
        />
      )}

      <View style={{ height: 230 }} />
    </View>
  );
};

export default EditBablTags;

const styles = StyleSheet.create({
  title: {
    color: '#676767',
    fontSize: 18,
    marginLeft: 10,
    fontFamily: fonts.roboto,
  },
  items: {
    alignSelf: 'center',
  },
  input: {
    color: '#FFF',
    backgroundColor: '#232323',
    width: sizes.width / 1.1,
    alignSelf: 'center',
    borderRadius: 14,
    height: 67,
    marginTop: 20,
    padding: 10,
    fontSize: 16,
    fontFamily: fonts.robotoRegular,
  },
  headerBackground: {
    justifyContent: 'center',

    backgroundColor: '#000',
    padding: 5,
  },
  edited: {
    width: 23,
    position: 'absolute',
    right: 5,
    top: 5,
    zIndex: 99,
    height: 23,
  },
  editInput: {
    position: 'absolute',
    width: 99,
    height: 33,
    borderRadius: 10,
    padding: 10,
  },
  container: {
    backgroundColor: '#000',
    justifyContent: 'space-between',
    flex: 1,
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  absolute: {
    position: 'absolute',
    width: 99,
    height: 33,
    borderRadius: 10,
  },
  itemTickets: {
    borderWidth: 1,
    borderColor: '#4A4A4A',
    borderRadius: 99,
    height: 43,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 5,
    padding: 5,
    backgroundColor: '#232323',
  },
  closes: {
    width: 29,
    height: 29,
    margin: 0,
    borderRadius: 29,
  },
  label: {
    margin: 5,
    fontSize: 16,
    fontFamily: fonts.regular,
    color: '#FFF',
  },
  top: {
    marginTop: 20,
  },
});

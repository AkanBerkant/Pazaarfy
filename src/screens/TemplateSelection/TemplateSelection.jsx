import React from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';

import { ButtonLinear } from '../../components';
import { fonts } from '../../constants/fonts';
import routes from '../../constants/routes';
import { notify } from '../../helpers/notify';
import { sizes } from '../../theme';
import { bablFormAtom } from '../../utils/atoms';
import CreateBablHeader from '../createbabl/CreateBablHeader';

import CreatingBablModal from './CreatingBablModal';

const TemplateSelection = () => {
  const [bablForm, setBablForm] = useAtom(bablFormAtom);
  const [showModal, setShowModal] = React.useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { t } = useTranslation();
  const { title } = bablForm;
  const { change = false } = route.params || {};

  const templatesData = [
    {
      icon: require('../../assets/template2.png'),
      title: t('BablFocusedNoSlide'),
      description: t('Temp1Desc'),
    },
    {
      icon: require('../../assets/template1.png'),
      title: t('BablFocusedSlider'),
      description: t('Temp2Desc'),
    },
    {
      icon: require('../../assets/template4.png'),
      title: t('BackgroundFocusedNoSlider'),
      description: t('Temp3Desc'),
    },
    {
      icon: require('../../assets/template3.png'),
      title: t('BackgroundFocusedWithSlider'),
      description: t('Temp4Desc'),
    },
    {
      icon: require('../../assets/template5.png'),
      title: t('ModernDesign'),
      description: t('Temp5Desc'),
    },
    {
      icon: require('../../assets/template6.png'),
      title: t('EasyToConsume'),
      description: t('Temp6Desc'),
    },
  ];

  const renderItem = ({ item, index }) => {
    const isSelected = bablForm.templateCategory === index;

    const Wrapper = isSelected ? LinearGradient : View;
    const wrapperProps = isSelected
      ? {
        colors: ['#F9B092', '#EC4CA3'],
      }
      : {};

    return (
      <TouchableOpacity
        onPress={() => {
          setBablForm((prev) => {
            return {
              ...prev,
              templateCategory: index,
            };
          });
        }}
      >
        {isSelected ? (
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            colors={['#FF5406', '#D5D399', '#0AAFF6']}
            style={styles.itemWrapper}
          >
            <View style={styles.item}>
              <View
                style={{
                  aspectRatio: 1,

                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 12,
                }}
              >
                <Image source={item.icon} resizeMode="contain" style={styles.templatePreview} />
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
              </View>
            </View>
          </LinearGradient>
        ) : (
          <View style={styles.itemWrapper} {...wrapperProps}>
            <View style={styles.item}>
              <View
                style={{
                  aspectRatio: 1,

                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 12,
                }}
              >
                <Image source={item.icon} resizeMode="contain" style={styles.templatePreview} />
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
              </View>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const onContinuePress = () => {
    if (!bablForm.templateCategory && bablForm.templateCategory !== 0) {
      return notify({
        title: t('pleaseSelectTemplate'),
      });
    }

    if (change) {
      return navigation.goBack();
    }

    setShowModal(true);

    setTimeout(() => {
      navigation.navigate(routes.EditBabl, { title });
      setShowModal(false);
    }, 2500);
  };

  return (
    <>
      <View style={styles.container}>
        <CreateBablHeader bg="#141414" title={t('templateSelection')} />
        <View style={styles.top} />
        <FlatList
          data={templatesData}
          renderItem={renderItem}
          keyExtractor={(item) => {
            return item.title;
          }}
        />

        <View
          style={{
            paddingVertical: 20,
            borderTopLeftRadius: 29,
            borderTopRightRadius: 29,
            backgroundColor: '#1A1A1A',
          }}
        >
          <ButtonLinear title={t('continue')} onPress={onContinuePress} />
        </View>
      </View>
      {showModal && <CreatingBablModal />}
    </>
  );
};

export default TemplateSelection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  itemWrapper: {
    width: sizes.width / 1.09,
    alignSelf: 'center',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',

    marginTop: 5,
    height: 150,
  },
  item: {
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#000',
    width: sizes.width / 1.1,
    height: 145,
    justifyContent: 'space-between',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 15,
    paddingVertical: 26,
    paddingRight: 2,
  },
  itemTitle: {
    fontSize: 15,
    color: '#FFF',
    fontFamily: fonts.robotoBold,
  },
  itemDescription: {
    marginTop: 10,
    fontSize: 12,
    color: '#626262',
    fontFamily: fonts.robotoRegular,
    width: sizes.width / 2,
  },
  templatePreview: {
    width: 83,
    height: 77,
  },
  top: {
    marginTop: 10,
  },
});

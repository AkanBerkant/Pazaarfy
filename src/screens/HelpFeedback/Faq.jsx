import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image,
} from 'react-native';

import { useTranslation } from 'react-i18next';

import { BackHeader } from '../../components';
import { sizes } from '../../theme';
import fonts from '../../theme/fonts';

const Faq = () => {
  const { t } = useTranslation();
  const [expandedIndex, setExpandedIndex] = useState(null);

  const faqData = [
    {
      question: t('fq1'),
      answer: t('fqd1'),
    },
    {
      question: t('fq2'),
      answer: t('fqd2'),
    },
    {
      question: t('fq3'),
      answer: t('fqd3'),
    },
    {
      question: t('fq4'),
      answer: t('fqd4'),
    },
    {
      question: t('fq5'),
      answer: t('fqd5'),
    },
  ];

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <View style={styles.container}>
      <BackHeader title={t('help')} />

      <View
        style={{
          marginTop: 40,
        }}
      />
      {faqData.map((item, index) => {
        return (
          <View key={index} style={styles.faqItem}>
            <TouchableOpacity
              onPress={() => {
                return toggleExpand(index);
              }}
              style={styles.questionRow}
            >
              <Text style={styles.questionText}>{item.question}</Text>
              <Image
                source={require('../../assets/right.png')}
                resizeMode="contain"
                style={[
                  styles.icon,
                  { transform: expandedIndex === index ? [{ rotate: '90deg' }] : [{ rotate: '0deg' }] },
                ]}
              />
            </TouchableOpacity>
            {expandedIndex === index && <Text style={styles.answerText}>{item.answer}</Text>}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  faqItem: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 10,
    width: sizes.width / 1.07,
    alignSelf: 'center',
  },
  questionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionText: {
    fontSize: 18,
    fontFamily: fonts.roboto,
    color: '#fff',
    width: sizes.width / 1.2,
  },
  answerText: {
    marginTop: 10,
    color: '#ccc',
    fontSize: 16,
    fontFamily: fonts.regular,
    width: sizes.width / 1.2,
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
});

export default Faq;

import React from 'react';
import {
  View,
  StyleSheet,
  Button,
  Modal,
  Text,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';

import { useMutation } from '@tanstack/react-query';
import { t } from 'i18next';

import { notify } from '../../helpers/notify';
import fonts from '../../theme/fonts';
import * as Queries from '../../utils/queries';

import Other from './Other';

const BablWarnModal = ({ bablId, visible, onClose }) => {
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

  const [selected, setSelected] = React.useState(0);

  const [other, setOther] = React.useState(null);

  const sections = [
    {
      id: 'SEXUAL_CONTENT',
      label: t('SexualContent'),
    },
    {
      id: 'VIOLENT_CONTENT',
      label: t('ViolentOrRepulsiveContent'),
    },
    {
      id: 'HATEFUL_CONTENT',
      label: t('HatefulOrAbusiveContent'),
    },
    {
      id: 'HARASSMENT',
      label: t('HarassmentOrBullying'),
    },
    {
      id: 'HARMFUL_ACTS',
      label: t('HarmfulOrDangerousActs'),
    },
    {
      id: 'MISINFORMATION',
      label: t('Misinformation'),
    },
    {
      id: 'CHILD_ABUSE',
      label: t('ChildAbuse'),
    },
    {
      id: 'LEGAL_ISSUE',
      label: t('LegalIssue'),
    },
    {
      id: 'PROMOTES_TERRORISM',
      label: t('PromotesTerrorism'),
    },
    {
      id: 'SPAM',
      label: t('SpamOrMisleading'),
    },
    {
      id: 'OTHER',
      label: t('Other'),
    },
  ];

  const reportMutation = useMutation(Queries.createReport, {
    onSuccess: () => {
      onClose();

      notify({
        title: t('YourReportSent'),
      });
    },
  });

  const onSendPress = (text) => {
    reportMutation.mutate({ title: text, babl: bablId });
  };

  return (
    <Modal transparent visible={showModal}>
      <View style={styles.modalBackGround}>
        <Animated.View style={[styles.modalContainer, { transform: [{ scale: scaleValue }] }]}>
          <View
            style={{
              display: !other ? 'flex' : 'none',
            }}
          >
            <Text style={styles.title}>{t('Report')}</Text>
            {sections.map((item) => {
              const isSelected = selected === item.id;
              return (
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => {
                    setSelected(item.id);
                  }}
                >
                  <View
                    style={{
                      width: 23,
                      height: 23,
                      borderRadius: 23,
                      borderWidth: 1,
                      borderColor: '#FFF',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {isSelected ? (
                      <View
                        style={{
                          backgroundColor: '#FFF',
                          width: 18,
                          height: 18,
                          borderRadius: 18,
                        }}
                      />
                    ) : null}
                  </View>
                  <Text style={styles.label}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'flex-end',
              }}
            >
              <Button title="Close" onPress={onClose} color="#4b9fe3" />
              <Button
                title="Report"
                color="#8A8A8A"
                onPress={() => {
                  if (!selected) {
                    return Alert.alert(t('PleaseSelectOption'));
                  }

                  if (selected === 'OTHER') {
                    setOther(true);
                  } else {
                    onSendPress(
                      sections.find((item) => {
                        return item.id === selected;
                      }).label,
                    );
                  }
                }}
              />
            </View>
          </View>

          <Other
            visible={other}
            onClose={() => {
              setOther(false);
            }}
            onSendPress={onSendPress}
          />
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackGround: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#212121',
    paddingHorizontal: 20,
    paddingVertical: 30,

    elevation: 20,
  },
  title: {
    color: '#FFF',
    fontFamily: fonts.roboto,
    fontSize: 18,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  label: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: '#FFF',
    marginLeft: 8,
  },
});

export default BablWarnModal;

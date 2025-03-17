import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { useTranslation } from 'react-i18next';

import {
  BackHeader, ButtonBorder, ButtonLinear, Container,
} from '../../components';
import { notify } from '../../helpers/notify';
import { commonStyles, sizes } from '../../theme';
import { userAtom } from '../../utils/atoms';
import * as Queries from '../../utils/queries';
import { categoryOptionsData } from '../createbabl/CreateBablCategories/category-options-data';
import CategoryOptions from '../createbabl/CreateBablCategories/CategoryOptions';

const BablOptions = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const user = useAtomValue(userAtom);
  const { t } = useTranslation();
  const { _id, babls, types } = route.params;
  const [state, setState] = React.useState(
    babls.reduce((prev, cur) => {
      return { ...prev, [cur._id]: true };
    }, {}),
  );
  const [typesState, setTypesState] = React.useState(types);
  const queryClient = useQueryClient();

  const updateCollectionMutation = useMutation(
    (data) => {
      return Queries.updateCollection(_id, data);
    },
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries(['COLLECTION_DETAIL']);
        navigation.goBack();
      },
    },
  );

  const bablEmbedCallback = (babl, cb) => {
    setTypesState((prev) => {
      if (prev[babl._id]) {
        const { [babl._id]: extractedItem, ...rest } = prev;

        cb(false);
        return rest;
      }

      cb(true);
      return {
        ...prev,
        [babl._id]: babl.type,
      };
    });

    setState((prev) => {
      if (prev[babl._id]) {
        const { [babl._id]: extractedItem, ...rest } = prev;

        return rest;
      }

      return { ...prev, [babl._id]: true };
    });
  };

  const onSavePress = () => {
    updateCollectionMutation.mutate({
      babls: Object.keys(state),
      types: typesState,
    });
  };

  const isChecked = (type, id, cb) => {
    return typesState?.[id] === type;
  };

  return (
    <Container header={<BackHeader title={t('ManageBabls')} />}>
      <CategoryOptions
        data={categoryOptionsData.BABL(navigation, bablEmbedCallback, user._id, isChecked)}
        counts={Object.entries(typesState).reduce((prev, [k, v]) => {
          return {
            ...prev,
            [v]: (prev[v] || 0) + 1,
          };
        }, {})}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <ButtonLinear title={t('Save')} width={sizes.width / 1.07} onPress={onSavePress} />
      </View>
    </Container>
  );
};

export default BablOptions;

const styles = StyleSheet.create({});

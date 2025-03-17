import React from 'react';

import { useNavigation, useRoute } from '@react-navigation/native';

import CollectionShareContent from './CollectionShareContent';

const CollectionShareAndroid = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const getData = async () => {
    return route.params.item;
  };

  return (
    <CollectionShareContent
      getData={getData}
      dismissExtension={() => {
        navigation.goBack();
      }}
    />
  );
};

export default CollectionShareAndroid;

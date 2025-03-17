import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';

import { useAtomValue, useSetAtom } from 'jotai';

import { Loading } from '../../components';
import { splashAtom, userAtom } from '../../utils/atoms';

const Splash = () => {
  const user = useAtomValue(userAtom);
  const setSplashStatus = useSetAtom(splashAtom);

  useEffect(() => {
    setTimeout(() => {
      setSplashStatus(false);
    }, 2000);
  }, [user]);

  return <Loading />;
};

export default Splash;

const styles = StyleSheet.create({});

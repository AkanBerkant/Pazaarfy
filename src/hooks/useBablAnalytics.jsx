import React from 'react';

import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

import * as Queries from '../utils/queries';

export const useBablAnalytics = (bablId) => {
  const navigation = useNavigation();

  const analyticsSessionIdRef = React.useRef(moment().unix());

  const sendAnalytics = () => {
    Queries.sendAnalytics({
      babl: bablId,
      duration: moment().diff(moment.unix(analyticsSessionIdRef.current), 'seconds'),
    });
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      analyticsSessionIdRef.current = moment().unix();
    });

    const unsubscribe2 = navigation.addListener('blur', () => {
      sendAnalytics();
    });

    return () => {
      unsubscribe();
      unsubscribe2();
    };
  }, [navigation]);

  React.useEffect(() => {
    return () => {
      sendAnalytics();
    };
  }, []);
};

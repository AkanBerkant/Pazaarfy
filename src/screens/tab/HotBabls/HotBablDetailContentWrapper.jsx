import React from 'react';

import {useQuery} from '@tanstack/react-query';

import * as Queries from '../../../utils/queries';

import HotBablDetailContent from './HotBablDetailContent';

const HotBablDetailContentWrapper = ({bablId, lowerChapter, ...props}) => {
  /*
  const { data } = useQuery(['BABL', bablId], () => { return Queries.getBablById(bablId); }, {
    placeholderData: {
      babl: {
        user: {},
      },
      likeCount: 0,
      commentCount: 0,
      rebablCount: 0,
    },
    cacheTime: 0,
  });

  if (!data) return null; */

  return (
    <HotBablDetailContent
      lowerChapter={lowerChapter}
      bablId={bablId}
      // data={data.babl}
      {...props}
    />
  );
};

export default HotBablDetailContentWrapper;

import * as React from 'react';

import Svg, { Mask, Path } from 'react-native-svg';

const VideoIcon = (props) => {
  return (
    <Svg
      width={75}
      height={85}
      viewBox="0 0 75 85"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Mask id="a" fill="#fff">
        <Path d="M69.9 34.39L16.94 2.44A10.687 10.687 0 0011.642.92a10.706 10.706 0 00-5.355 1.312 10.306 10.306 0 00-3.919 3.777 9.91 9.91 0 00-1.388 5.187v63.63c0 2.69 1.102 5.27 3.062 7.173 1.96 1.902 4.619 2.97 7.391 2.97 1.932.041 3.838-.439 5.505-1.386L69.9 51.768a10.282 10.282 0 003.627-3.688 9.91 9.91 0 001.32-4.933 9.91 9.91 0 00-1.32-4.934 10.283 10.283 0 00-3.626-3.688v-.135z" />
      </Mask>
      <Path
        d="M69.9 34.39L16.94 2.44A10.687 10.687 0 0011.642.92a10.706 10.706 0 00-5.355 1.312 10.306 10.306 0 00-3.919 3.777 9.91 9.91 0 00-1.388 5.187v63.63c0 2.69 1.102 5.27 3.062 7.173 1.96 1.902 4.619 2.97 7.391 2.97 1.932.041 3.838-.439 5.505-1.386L69.9 51.768a10.282 10.282 0 003.627-3.688 9.91 9.91 0 001.32-4.933 9.91 9.91 0 00-1.32-4.934 10.283 10.283 0 00-3.626-3.688v-.135z"
        stroke="#EBE9E9"
        strokeWidth={18}
        mask="url(#a)"
      />
    </Svg>
  );
};

export default VideoIcon;

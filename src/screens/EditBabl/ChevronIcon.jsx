import * as React from 'react';

import Svg, { Path } from 'react-native-svg';

const ChevronIcon = (props) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      className="ionicon"
      viewBox="0 0 512 512"
      {...props}
    >
      <Path
        d="M256 64C150 64 64 150 64 256s86 192 192 192 192-86 192-192S362 64 256 64z"
        fill="none"
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={32}
      />
      <Path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
        d="M296 352l-96-96 96-96"
      />
    </Svg>
  );
};

export default ChevronIcon;

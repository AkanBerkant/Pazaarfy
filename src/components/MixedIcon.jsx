import * as React from 'react';

import Svg, { Path } from 'react-native-svg';

const MixedIcon = (props) => {
  return (
    <Svg
      width={67}
      height={57}
      viewBox="0 0 67 57"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M.17 4.711A4.71 4.71 0 014.877.002h56.51a4.71 4.71 0 010 9.418H4.878A4.71 4.71 0 01.17 4.711zm0 23.546a4.71 4.71 0 014.708-4.71h56.51a4.71 4.71 0 110 9.419H4.878a4.71 4.71 0 01-4.709-4.71zM.169 52.287a4.709 4.709 0 014.71-4.71h56.508a4.71 4.71 0 010 9.42H4.878a4.71 4.71 0 01-4.71-4.71z"
        fill="#fff"
      />
    </Svg>
  );
};

export default MixedIcon;

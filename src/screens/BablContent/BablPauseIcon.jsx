import * as React from 'react';

import Svg, { G, Path } from 'react-native-svg';

const BablPauseIcon = (props) => {
  return (
    <Svg
      width="64px"
      height="64px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G fill="#000">
        <Path d="M11 7H8v10h3V7zM13 17h3V7h-3v10z" />
      </G>
    </Svg>
  );
};

export default BablPauseIcon;

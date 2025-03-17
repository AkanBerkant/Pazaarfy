import * as React from 'react';

import Svg, {
  Circle, Defs, G, Path,
} from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: filter */

const BablPlayIcon = (props) => {
  return (
    <Svg
      width={27}
      height={27}
      viewBox="0 0 27 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G filter="url(#filter0_b_838_14427)">
        <Circle
          cx={13.1289}
          cy={13.1289}
          r={13.1289}
          fill="#4F4F4F"
          fillOpacity={0.2}
        />
      </G>
      <Path
        d="M18.379 11.74l-6.931-4.182a1.399 1.399 0 00-1.394-.027c-.214.117-.39.288-.513.495-.122.206-.185.44-.181.678v8.328c0 .352.144.69.4.938.257.25.605.39.967.39.253.004.503-.058.72-.182l6.932-4.164c.198-.119.361-.285.474-.483a1.296 1.296 0 000-1.29 1.345 1.345 0 00-.474-.483v-.018z"
        fill="#fff"
      />
      <Defs />
    </Svg>
  );
};

export default BablPlayIcon;

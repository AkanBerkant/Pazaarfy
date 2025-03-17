import * as React from 'react';

import Svg, {
  Defs, LinearGradient, Path, Rect, Stop,
} from 'react-native-svg';

const BablHeaderCloseIcon = (props) => {
  return (
    <Svg
      width={26}
      height={26}
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Rect
        x={-0.336302}
        y={13}
        width={18.8603}
        height={18.8603}
        rx={9.43013}
        transform="rotate(-45 -.336 13)"
        fill="url(#paint0_linear_1393_45277)"
        stroke="#FFF"
        strokeWidth={0.475603}
      />
      <Path
        d="M16.49 10.79l-2.115 2.116 2.21 2.21a.95.95 0 01-1.342 1.343l-2.21-2.21-2.06 2.058a.95.95 0 01-1.342-1.343l2.058-2.058-1.962-1.962A.95.95 0 1111.07 9.6l1.962 1.962 2.115-2.114a.949.949 0 111.342 1.342z"
        fill="#FFFFFF"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_1393_45277"
          x1={9.19233}
          y1={13}
          x2={9.19233}
          y2={31.3847}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#C2C2C2" />
          <Stop offset={0.526042} stopColor="#191919" />
          <Stop offset={1} stopColor="#191919" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
};

export default BablHeaderCloseIcon;

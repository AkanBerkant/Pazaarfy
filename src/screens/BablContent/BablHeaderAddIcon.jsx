import * as React from 'react';

import Svg, {
  Defs, LinearGradient, Path, Rect, Stop,
} from 'react-native-svg';

const BablHeaderAddIcon = (props) => {
  return (
    <Svg
      width={29}
      height={29}
      viewBox="0 0 29 29"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Rect
        x={0.650761}
        y={0.650761}
        width={27.6985}
        height={27.6985}
        rx={13.8492}
        fill="url(#paint0_linear_1393_45271)"
        stroke="#FFF"
        strokeWidth={0.698479}
      />
      <Path
        d="M20.419 15.829h-4.392v4.591a1.394 1.394 0 11-2.789 0V15.83H8.963a1.395 1.395 0 010-2.79h4.275V8.966a1.394 1.394 0 112.789 0v4.075h4.391a1.394 1.394 0 110 2.789z"
        fill="#FFF"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_1393_45271"
          x1={14.5}
          y1={1}
          x2={14.5}
          y2={28}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FFE8AD" />
          <Stop offset={0.526042} stopColor="#F1656E" />
          <Stop offset={1} stopColor="#EA45AF" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
};

export default BablHeaderAddIcon;

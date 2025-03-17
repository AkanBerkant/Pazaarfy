import * as React from 'react';

import Svg, {
  Circle, Defs, LinearGradient, Path, Stop,
} from 'react-native-svg';

const EditGradientIcon = (props) => {
  return (
    <Svg
      width={27}
      height={27}
      viewBox="0 0 27 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Circle
        cx={13.5}
        cy={13.5}
        r={12.1808}
        fill="url(#paint0_linear_1245_4374)"
        stroke="#fff"
        strokeWidth={1.36157}
      />
      <Path
        d="M19.553 9.47l-2.055-2.062a1.498 1.498 0 00-1.995-.053l-6.75 6.775a1.508 1.508 0 00-.427.91l-.323 3.14a.755.755 0 00.462.764c.092.038.19.057.288.056h.068l3.127-.286c.343-.034.663-.186.908-.43l6.75-6.773a1.448 1.448 0 00-.053-2.04zm-7.74 7.739l-2.25.21.203-2.258 4.237-4.2 2.025 2.032-4.215 4.216zm5.19-5.224l-2.01-2.018 1.463-1.505 2.047 2.055-1.5 1.468z"
        fill="#fff"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_1245_4374"
          x1={15.5738}
          y1={-8.98507}
          x2={-1.89854}
          y2={22.8665}
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

export default EditGradientIcon;

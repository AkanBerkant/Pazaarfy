import * as React from 'react';

import Svg, { Circle } from 'react-native-svg';

const BablHeaderOptionsIcon = (props) => {
  return (
    <Svg
      width={28}
      height={6}
      viewBox="0 0 28 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Circle cx={3} cy={3} r={3} fill="#C2C2C2" />
      <Circle cx={14} cy={3} r={3} fill="#C2C2C2" />
      <Circle cx={25} cy={3} r={3} fill="#C2C2C2" />
    </Svg>
  );
};

export default BablHeaderOptionsIcon;

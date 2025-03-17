import * as React from 'react';

import Svg, { Path } from 'react-native-svg';

const TwitterIconSvg = (props) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 50 50"
      width="100px"
      height="100px"
      fill="#FFF"
      {...props}
    >
      <Path d="M5.92 6l14.662 21.375L6.23 44h3.18l12.576-14.578 10 14.578H44L28.682 21.67 42.199 6h-3.17L27.275 19.617 17.934 6H5.92zm3.797 2h7.164l23.322 34H33.04L9.717 8z" />
    </Svg>
  );
};

export default TwitterIconSvg;

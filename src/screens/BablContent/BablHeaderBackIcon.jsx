import * as React from 'react';

import Svg, { Path } from 'react-native-svg';

const BablHeaderBackIcon = (props) => {
  return (
    <Svg
      width={13}
      height={22}
      viewBox="0 0 13 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M.521 9.785L9.67.487A1.614 1.614 0 0110.816 0a1.59 1.59 0 011.148.487c.3.308.47.725.47 1.16 0 .435-.17.852-.47 1.16l-8 8.229 8 8.146c.3.308.47.725.47 1.16a1.661 1.661 0 01-.995 1.524 1.59 1.59 0 01-.623.13 1.59 1.59 0 01-1.147-.494L.52 12.204a1.645 1.645 0 01-.52-1.21 1.671 1.671 0 01.52-1.21z"
        fill="#8C8C8C"
      />
    </Svg>
  );
};

export default BablHeaderBackIcon;

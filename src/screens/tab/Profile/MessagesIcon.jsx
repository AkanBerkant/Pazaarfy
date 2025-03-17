import * as React from 'react';

import { useAtomValue } from 'jotai';
import Svg, { Path } from 'react-native-svg';

import { unseenMessageCountAtom } from '../../../utils/atoms';

const MessagesIcon = ({ showDotBorder = false, ...props }) => {
  const showDot = useAtomValue(unseenMessageCountAtom);

  return (
    <Svg
      width={32}
      height={25}
      viewBox="0 0 32 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.66 10.752a.901.901 0 011.254-.222l5.49 3.843 5.49-3.843a.901.901 0 011.034 1.477l-6.007 4.205a.901.901 0 01-1.033 0L6.88 12.007a.901.901 0 01-.222-1.255z"
        fill="#C5C5C5"
        fillOpacity={0.52}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.792 7.365c-.83 0-1.502.672-1.502 1.501v12.015c0 .83.673 1.502 1.502 1.502h19.223c.83 0 1.502-.673 1.502-1.502V8.866c0-.829-.673-1.501-1.502-1.501H3.792zM.488 8.866a3.304 3.304 0 013.304-3.303h19.223a3.304 3.304 0 013.304 3.303v12.015a3.304 3.304 0 01-3.304 3.304H3.792A3.304 3.304 0 01.488 20.88V8.866z"
        fill="#C5C5C5"
        fillOpacity={0.52}
      />
      {showDot && (
        <Path
          d="M25.89 10.124a3.554 3.554 0 100-7.108 3.554 3.554 0 000 7.108z"
          fill="#FD6160"
        />
      )}
      {showDot && showDotBorder && (
        <Path
          d="M25.89 11.139a4.57 4.57 0 100-9.139 4.57 4.57 0 000 9.139z"
          stroke="#000"
          strokeWidth={2.03088}
        />
      )}
    </Svg>
  );
};

export default MessagesIcon;

import React from "react";
import { Dimensions } from "react-native";

import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg";

const { height, width } = Dimensions.get("window");

const TapToEnter = (props) => {
  // Calculate sizes based on height
  const svgHeight = height * 0.05; // 20% of the screen height
  const svgWidth = width * 0.44; // Aspect ratio of 2:1
  const borderRadius = svgHeight * 0.2; // 5% of the SVG height

  return (
    <Svg height={svgHeight} width={svgWidth} {...props}>
      <Defs>
        <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop stopColor="#B5A0FF" offset="0%" stopOpacity="1" />
          <Stop stopColor="#755CCC" offset="20%" stopOpacity="1" />
          <Stop stopColor="#B5A0FF" offset="40%" stopOpacity="1" />
          <Stop stopColor="#755CCC" offset="60%" stopOpacity="1" />
          <Stop stopColor="#4D4D4D" offset="80%" stopOpacity="1" />
          <Stop stopColor="#4D4D4D" offset="100%" stopOpacity="1" />
        </LinearGradient>
      </Defs>
      <Rect
        x="5"
        y="5"
        width={svgWidth - 10}
        height={svgHeight - 10}
        rx={borderRadius}
        ry={borderRadius}
        stroke="url(#grad)"
        strokeWidth="2"
        fill="none"
      />
    </Svg>
  );
};

export default TapToEnter;

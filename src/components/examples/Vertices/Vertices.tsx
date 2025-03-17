import React, { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

import {
  Canvas,
  vec,
  Vertices,
  Skia,
  isEdge,
  useClock,
} from '@shopify/react-native-skia';
import cdt2d from 'cdt2d';
import { useDerivedValue } from 'react-native-reanimated';

import { getSeed, perlin } from './Animations';

const N = 3;
const n = new Array(N + 1).fill(0).map((_, i) => { return i; });

const F = 2000;
const palette = ['#61DAFB', '#fb61da', '#dafb61', '#61fbcf'];

export const Demo = () => {
  const { width, height } = useWindowDimensions();

  const window = useMemo(
    () => { return Skia.XYWHRect(0, 0, width, height); },
    [height, width],
  );

  const hSize = width / N;
  const vSize = height / N;
  const AX = hSize * 0.45;
  const AY = vSize * 0.45;

  const defaultVertices = useMemo(() => {
    return n.map((col) => { return n.map((row) => { return vec(col * hSize, row * vSize); }); }).flat();
  }, [hSize, vSize]);

  const triangles = useMemo(
    () => { return cdt2d(defaultVertices.map(({ x, y }) => { return [x, y]; })); },
    [defaultVertices],
  );

  const indices = useMemo(() => { return triangles.flat(); }, [triangles]);
  const colors = useMemo(
    () => { return indices.map((i) => { return palette[i % palette.length]; }); },
    [indices],
  );

  const clock = useClock();
  const seeds = new Array(defaultVertices.length).fill(0).map(() => { return getSeed(); });

  const vertices = useDerivedValue(
    () => {
      return defaultVertices.map((vertex, i) => {
        if (isEdge(vertex, window)) {
          return vertex;
        }
        return {
          x: vertex.x + AX * perlin(seeds[i], clock.value / F, 0),
          y: vertex.y + AY * perlin(seeds[i], 0, clock.value / F),
        };
      });
    },
    [clock],
  );

  return (
    <Canvas style={{ width, height }}>
      <Vertices
        vertices={vertices}
        indices={indices}
        textures={defaultVertices}
        colors={colors}
      />
      {/* <Points points={vertices} style="stroke" color="white" strokeWidth={1} />
      <Triangles vertices={vertices} triangles={triangles} /> */}
    </Canvas>
  );
};

import { useId } from 'react';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

import {
  calculateDoubleMFillBounds,
  DOUBLE_M_PATHS,
  DOUBLE_M_VIEWBOX_SIZE,
} from './doubleMGeometry';

type DoubleMLogoProps = {
  fillColor?: string;
  outlineColor?: string;
  outlineWidth?: number;
  progress?: number;
  size: number;
};

export function DoubleMLogo({
  fillColor = '#FFFFFF',
  outlineColor = '#F5F5F2',
  outlineWidth = 1.5,
  progress = 1,
  size,
}: DoubleMLogoProps) {
  const clipPathId = `double-m-fill-${useId().replace(/:/g, '')}`;
  const fill = calculateDoubleMFillBounds(progress);

  return (
    <Svg
      height={size}
      viewBox={`0 0 ${DOUBLE_M_VIEWBOX_SIZE} ${DOUBLE_M_VIEWBOX_SIZE}`}
      width={size}
    >
      <Defs>
        <ClipPath id={clipPathId}>
          <Rect height={fill.height} width={DOUBLE_M_VIEWBOX_SIZE} x={0} y={fill.y} />
        </ClipPath>
      </Defs>

      <G fill="none" stroke={outlineColor} strokeLinejoin="round" strokeWidth={outlineWidth}>
        {DOUBLE_M_PATHS.map((path) => (
          <Path d={path} key={`outline-${path}`} />
        ))}
      </G>

      <G clipPath={`url(#${clipPathId})`} fill={fillColor}>
        {DOUBLE_M_PATHS.map((path) => (
          <Path d={path} key={`fill-${path}`} />
        ))}
      </G>
    </Svg>
  );
}

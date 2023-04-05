import React from 'react';
import { DotProps } from './types';

const Dot = ({
  sizeForDefaultDot = 12,
  slideIndex,
  index,
  activeDotColor = 'black',
  dotColor = '#c7c7c7',
}: DotProps): JSX.Element => (
  <div
    style={{
      aspectRatio: '1 / 1',
      width: sizeForDefaultDot,
      backgroundColor: slideIndex === index ? activeDotColor : dotColor,
      borderRadius: '50%',
      cursor: 'pointer',
    }}
  />
);

export default Dot;

import React from 'react';
import { DotProps } from 'UI/types';

const Dot = ({
  sizeForDefaultDot,
  slideIndex,
  index,
  activeDotColor,
  dotColor,
}: DotProps): JSX.Element => (
  <div
    style={{
      aspectRatio: '1 / 1',
      width: `${sizeForDefaultDot || 12}px`,
      backgroundColor: `${
        slideIndex === index ? activeDotColor || 'black' : dotColor || '#c7c7c7'
      }`,
      borderRadius: '50%',
      cursor: 'pointer',
    }}
  />
);

export default Dot;

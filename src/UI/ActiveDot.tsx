import React from 'react';
import { ActiveDotProps } from './types';

const ActiveDot = ({
  sizeForDefaultActiveDot,
  activeDotColor,
}: ActiveDotProps): JSX.Element => (
  <div
    style={{
      aspectRatio: '1 / 1',
      width: `${sizeForDefaultActiveDot}px`,
      backgroundColor: activeDotColor || 'black',
      borderRadius: '50%',
      cursor: 'pointer',
    }}
  />
);

export default ActiveDot;

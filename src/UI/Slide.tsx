import React from 'react';
import { SlideProps } from './types';

export const Slide = ({
  slideWidth,
  spaceBetween,
  children,
  isAnimation = false,
  animation = {}
}: SlideProps): JSX.Element => {
  return (
    <div
      style={{
        boxSizing: 'border-box',
        width: `${slideWidth}px`,
        paddingRight: `${spaceBetween}px`,
        ...(isAnimation && animation)
      }}
    >
      {children}
    </div>
  );
};

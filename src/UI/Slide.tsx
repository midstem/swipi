import React from 'react';
import { SlideProps } from './types';

export const Slide = ({
  slideWidth,
  spaceBetween,
  children,
  animation = {}
}: SlideProps): JSX.Element => {
  return (
    <div
      style={{
        boxSizing: 'border-box',
        width: `${slideWidth}px`,
        paddingRight: `${spaceBetween}px`,
        ...animation
      }}
    >
      {children}
    </div>
  );
};

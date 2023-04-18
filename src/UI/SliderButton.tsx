import React, { forwardRef, RefObject } from 'react';
import { SliderButtonProps } from './types';

const SliderButton = forwardRef<HTMLButtonElement, SliderButtonProps>(
  ({ children, onClick, className }, ref): JSX.Element => (
    <button
      className={className}
      ref={ref as RefObject<HTMLButtonElement>}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  )
);

export default SliderButton;

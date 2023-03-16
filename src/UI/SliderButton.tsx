/* eslint-disable react/display-name */
import React, { forwardRef, RefObject } from 'react';
import { SliderButtonProps } from 'UI/types';

const SliderButton = forwardRef<HTMLButtonElement, SliderButtonProps>(
  ({ children, onClick }, ref): JSX.Element => (
    <button
      ref={ref as RefObject<HTMLButtonElement>}
      onClick={onClick}
      type="button"
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        outline: 'none',
      }}
    >
      {children}
    </button>
  )
);

export default SliderButton;

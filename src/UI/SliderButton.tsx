import React from 'react';
import { SliderButtonProps } from 'UI/types';

const SliderButton = ({
  children,
  onClick,
}: SliderButtonProps): JSX.Element => (
  <button
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
);
export default SliderButton;

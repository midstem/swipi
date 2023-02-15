import React from 'react';
import { SliderButtonProps } from './types';

const SliderButton = ({
  children,
  nextButton,
  nextImg,
  prevImg,
}: SliderButtonProps) => {
  const handleClick = () => {
    if (children === nextButton) return nextImg();

    return prevImg();
  };

  return (
    <button
      onClick={handleClick}
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
};
export default SliderButton;

import { Dots } from '../types';
import { ReactNode } from 'react';

export const useDots = ({
  setTransform,
  setSlideIndex,
  slideIndex,
  slideWidth,
  customActiveDot,
  customDot,
}: Dots) => {
  const handleDotClick = (index: number): void => {
    setTransform(-index * slideWidth);
    setSlideIndex(index);
  };

  const returnCustomDots = (index: number): ReactNode =>
    slideIndex === index ? customActiveDot : customDot;

  return { handleDotClick, returnCustomDots };
};

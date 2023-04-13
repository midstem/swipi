import { AnimationsTypes } from '../types';
import { calculateSlideIndex } from '../helpers';
import { useState, useCallback } from 'react';
import Default from '../../DotsAnimations/Default';
import Sliding from '../../DotsAnimations/Sliding';

export const useAnimation = (dotsAnimation: string) => {
  const [animation, setAnimation] = useState<boolean>(false);
  const [slideIndex, setSlideIndex] = useState(0);

  const ANIMATIONS: AnimationsTypes = {
    default: Default,
    sliding: Sliding,
  };

  const Dots = ANIMATIONS[dotsAnimation];

  const nextDot = useCallback(
    (prev: number, slideWidth: number, children: JSX.Element[]): void => {
      setSlideIndex(
        calculateSlideIndex(prev - slideWidth, slideWidth, children)
      );
    },
    []
  );

  const previousDot = useCallback(
    (prev: number, slideWidth: number, children: JSX.Element[]): void => {
      setSlideIndex(
        calculateSlideIndex(prev + slideWidth, slideWidth, children)
      );
    },
    []
  );

  return {
    animation,
    setAnimation,
    slideIndex,
    setSlideIndex,
    nextDot,
    previousDot,
    Dots,
  };
};

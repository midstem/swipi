import { Navigation } from '../types';
import { useCallback } from 'react';

export const useNavigation = ({
  putInTheInitialPosition,
  nextDot,
  previousDot,
  checkSliderCorner,
  setTransform,
  slideWidth,
  children,
}: Navigation) => {
  const nextImg = useCallback(() => {
    setTransform((prev) => {
      nextDot(prev, slideWidth, children);

      return prev - slideWidth;
    });

    if (checkSliderCorner()) {
      putInTheInitialPosition(() =>
        setTransform((prev) => {
          nextDot(prev, slideWidth, children);
          return prev - slideWidth;
        })
      );
    }
  }, [
    setTransform,
    slideWidth,
    children,
    checkSliderCorner,
    putInTheInitialPosition,
    nextDot,
  ]);

  const prevImg = useCallback(() => {
    setTransform((prev) => {
      previousDot(prev, slideWidth, children);
      return prev + slideWidth;
    });

    if (checkSliderCorner()) {
      putInTheInitialPosition(() =>
        setTransform((prev) => {
          previousDot(prev, slideWidth, children);
          return prev + slideWidth;
        })
      );
    }
  }, [
    setTransform,
    slideWidth,
    children,
    checkSliderCorner,
    putInTheInitialPosition,
    previousDot,
  ]);

  return { nextImg, prevImg };
};

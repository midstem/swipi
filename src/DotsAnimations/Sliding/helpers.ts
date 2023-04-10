import { MutableRefObject } from 'react';
import { DotsCoordinatesTypes } from './types';

export const getFirstPosition = (
  slideIndex: number,
  dotWidth: number
): number => (slideIndex === 0 ? 0 : dotWidth / 2);

export const getWidthDifference = (
  dotWidth: number,
  activeDotWidth: number
): number => (dotWidth - activeDotWidth) / 2;

export const getDotsCoordinates = (
  dotsRef: MutableRefObject<(HTMLDivElement | null)[]>
): DotsCoordinatesTypes[] =>
  dotsRef.current?.map(
    (dot) =>
      dot && {
        left: dot.offsetLeft,
        width: dot.offsetWidth,
        top: dot.offsetTop,
      }
  ) as DotsCoordinatesTypes[];

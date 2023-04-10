import { MutableRefObject } from 'react';
import { DotsCoordinatesTypes } from './types';

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
      }
  ) as DotsCoordinatesTypes[];

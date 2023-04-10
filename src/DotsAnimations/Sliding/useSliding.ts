import { useRef, useState, useEffect, useCallback } from 'react';
import {
  getFirstPosition,
  getWidthDifference,
  getDotsCoordinates,
} from './helpers';
import { FirstDotType, DotsCoordinatesTypes } from './types';

const useSliding = (slideIndex: number) => {
  const dotsRef = useRef<(HTMLDivElement | null)[]>([]);
  const activeDotRef = useRef<HTMLDivElement>(null);
  const [activeDotLeft, setActiveDotLeft] = useState<number>(0);
  const [firstDot, setFirstDot] = useState<FirstDotType>({ left: 0 });
  const [dotWidth, setDotWidth] = useState<number>(0);
  const [activeDotWidth, setActiveDotWidth] = useState<number>(0);
  const [dotsCoordinates, setDotsCoordinates] = useState<
    DotsCoordinatesTypes[]
  >([{ left: 0, width: 0 }]);

  const initializeData = (): void => {
    setDotsCoordinates(getDotsCoordinates(dotsRef));
    setFirstDot(getDotsCoordinates(dotsRef)[0]);
    setDotWidth(dotsRef.current[0]?.clientWidth ?? 0);
    setActiveDotWidth(activeDotRef.current?.clientWidth ?? 0);
  };

  const moveActiveDot = useCallback(() => {
    const activeDotIndent = dotsCoordinates[slideIndex].left;
    const dotAlignment = getWidthDifference(dotWidth, activeDotWidth);
    const stepSize = activeDotIndent - firstDot.left;

    if (!slideIndex) return setActiveDotLeft(activeDotIndent + dotAlignment);

    setActiveDotLeft(stepSize + dotAlignment);
  }, [activeDotWidth, dotWidth, dotsCoordinates, firstDot.left, slideIndex]);

  useEffect(() => {
    initializeData();
  }, []);

  useEffect(() => {
    moveActiveDot();
  }, [moveActiveDot]);

  return { dotsRef, activeDotRef, activeDotLeft };
};

export default useSliding;

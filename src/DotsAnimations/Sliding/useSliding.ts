import { useRef, useState, useEffect, useCallback } from 'react';
import { getWidthDifference, getDotsCoordinates } from './helpers';
import { DotsCoordinatesTypes } from './types';

const useSliding = (slideIndex: number) => {
  const dotsRef = useRef<(HTMLDivElement | null)[]>([]);
  const activeDotRef = useRef<HTMLDivElement>(null);
  const [activeDotLeft, setActiveDotLeft] = useState<number>(0);
  const [dotWidth, setDotWidth] = useState<number>(0);
  const [activeDotWidth, setActiveDotWidth] = useState<number>(0);
  const [dotsCoordinates, setDotsCoordinates] = useState<
    DotsCoordinatesTypes[]
  >([{ left: 0 }]);

  const initializeData = (): void => {
    console.log(getDotsCoordinates(dotsRef)[0]);
    setDotsCoordinates(getDotsCoordinates(dotsRef));
    setDotWidth(dotsRef.current[0]?.clientWidth ?? 0);
    setActiveDotWidth(activeDotRef.current?.clientWidth ?? 0);
  };

  const moveActiveDot = useCallback(() => {
    const activeDotIndent = dotsCoordinates[slideIndex].left;
    const dotAlignment = getWidthDifference(dotWidth, activeDotWidth);

    if (!slideIndex) return setActiveDotLeft(activeDotIndent + dotAlignment);

    setActiveDotLeft(activeDotIndent + dotAlignment);
  }, [activeDotWidth, dotWidth, dotsCoordinates, slideIndex]);

  useEffect(() => {
    initializeData();
  }, []);

  useEffect(() => {
    moveActiveDot();
  }, [moveActiveDot]);

  return { dotsRef, activeDotRef, activeDotLeft };
};

export default useSliding;

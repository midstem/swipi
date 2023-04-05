import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { getFirstPosition, getWidthDifference } from './helpers';

const useSliding = (slideIndex: number) => {
  const dotsRef = useRef<(HTMLDivElement | null)[]>([]);
  const activeDotRef = useRef<HTMLDivElement>(null);
  const [activeDotLeft, setActiveDotLeft] = useState<number>();
  const [firstDot, setFirstDot] = useState({ left: 0 });
  const [dotWidth, setDotWidth] = useState(0);
  const [activeDotWidth, setActiveDotWidth] = useState(0);
  const [dotsCoordinates, setDotsCoordinates] = useState<(DOMRect | null)[]>(
    []
  );
  const emptyCoordinates = useMemo(() => ({ left: 0, width: 0 }), []);

  const initializeData = () => {
    const coordinates = dotsRef.current?.map(
      (dot) => dot && dot.getBoundingClientRect()
    );

    setDotsCoordinates(coordinates);
    setFirstDot(coordinates[0] ?? { left: 0 });
    setDotWidth(dotsRef.current[0]?.clientWidth ?? 0);
    setActiveDotWidth(activeDotRef.current?.clientWidth ?? 0);
  };

  const moveActiveDot = useCallback(() => {
    const activeDotCoordinates =
      dotsCoordinates[slideIndex] ?? emptyCoordinates;

    setActiveDotLeft(
      activeDotCoordinates.left -
        firstDot.left +
        getWidthDifference(dotWidth, activeDotWidth) +
        getFirstPosition(slideIndex, dotWidth)
    );
  }, [
    activeDotWidth,
    dotWidth,
    dotsCoordinates,
    emptyCoordinates,
    firstDot.left,
    slideIndex,
  ]);

  useEffect(() => {
    initializeData();
  }, []);

  useEffect(() => {
    moveActiveDot();
  }, [dotsCoordinates, moveActiveDot, slideIndex]);

  return { dotsRef, activeDotRef, activeDotLeft };
};

export default useSliding;

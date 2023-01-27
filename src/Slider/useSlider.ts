import { useEffect, useRef, useState, useMemo } from "react";
import { reduceSlide } from "./constants";
import { 
  returnSlideWidthType,
  sliderUpdateType,
  NextPrevDotType 
} from "./types";
import {
  addUniqueId,
  isCornerSlide,
  returnCountSlides,
  returnSlideWidth,
  returnSpaceBetween,
  calculateSlideIndex,
} from "./helpers";

export const useSlider = (
  defaultCountSlides: number,
  children: JSX.Element[],
  sliderUpdates: sliderUpdateType[],
  defaultSpaceBetween: number
) => {
  const [animation, setAnimation] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [endX, setEndX] = useState<number>(0);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const [movePath, setMovePath] = useState<number>(0);
  const [transform, setTransform] = useState<number>(0);
  const [current, setCurrent] = useState<HTMLDivElement | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [mouseDown, setMouseDown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const visibleCountSlides = returnCountSlides(
    defaultCountSlides,
    sliderUpdates,
    windowWidth
  );

  const spaceBetween = returnSpaceBetween(
    defaultSpaceBetween,
    sliderUpdates,
    windowWidth
  );

  const isButton = children.length > visibleCountSlides;

  const returnSlideWidthArgs: returnSlideWidthType = {
    visibleCountSlides,
    spaceBetween,
    current: current,
  };

  const slideWidth = isCornerSlide(sliderUpdates, windowWidth)
    ? returnSlideWidth(returnSlideWidthArgs) * reduceSlide
    : returnSlideWidth(returnSlideWidthArgs);

  const slides = useMemo(() => isButton
  ? addUniqueId([...children, ...children, ...children])
  : addUniqueId(children), [isButton, children]);

  const startTransform = -slideWidth * children.length;

  const resetCoordinates = (): void => {
    setEndX(0);
    setMovePath(0);
    setStartX(0);
  };

  const checkSliderCorner = (): boolean =>
    transform <= startTransform * 2 + slideWidth / 2 ||
    transform >= -slideWidth / 2;

  const checkAreaWithoutSlides = (): boolean =>
    transform <= startTransform * 2 - slideWidth || transform >= slideWidth / 2;

  const putInTheInitialPosition = (callback?: () => void): (() => void) => {
    setTransform(startTransform);
    setAnimation(false);
    const timer = setTimeout(() => {
      callback?.();
      setAnimation(true);
    }, 1);
    return () => clearTimeout(timer);
  };

  const turnInitialPositionByTouched = () => {
    setAnimation(false);
    setTransform((transform) =>
      transform ? transform - startTransform : startTransform
    );
  };

  const moveSlides = (): void => {
    const pathTaken = endX && startX - endX;
    setTransform((prev) => prev - pathTaken + movePath);
    setMovePath(pathTaken);
  };

  const jumpToTheLastSlide = (): void => {
    const lineLengthOfSlides = slideWidth * slides.length;
    const numberOfSlidesBack =
      visibleCountSlides === 1 ? 2 : visibleCountSlides;
    const rightJump = -(lineLengthOfSlides - slideWidth * numberOfSlidesBack);
    setTransform(movePath > 0 ? rightJump : 0);
  };

  const nextDot = (args: NextPrevDotType) =>
    setSlideIndex(
      calculateSlideIndex(
        args.prev - args.slideWidth,
        args.slideWidth,
        args.children
      )
    );

  const previousDot = (args: NextPrevDotType) => 
    setSlideIndex(
      calculateSlideIndex(
        args.prev + args.slideWidth,
        args.slideWidth,
        args.children
      )
    );

  const nextImg = (): void => {
    setTransform((prev) => {
      nextDot({prev, slideWidth, children});

      return prev - slideWidth
    });

    setAnimation(true);
    checkSliderCorner() &&
    putInTheInitialPosition(() => setTransform((prev) => {
      nextDot({prev, slideWidth, children});
      return prev - slideWidth
    }));
  };

  const prevImg = (): void => {
    setTransform((prev) =>  {
      previousDot({prev, slideWidth, children});
      return prev + slideWidth
    });

    setAnimation(true);
    checkSliderCorner() &&
      putInTheInitialPosition(() => setTransform((prev) =>  {
        previousDot({prev, slideWidth, children});
        return prev + slideWidth
      }));
  };

  const onSwipe = (): void => {
    setTransform(
      (transform) => Math.round(transform / slideWidth) * slideWidth
    );
  };

  const startTouchByScreen = (startX: number): void => {
    checkSliderCorner() && turnInitialPositionByTouched();
    setStartX(startX);
    setMouseDown(true);
  };

  const moveTouchScreen = (endX: number): void => {
    if (!mouseDown) return 
      setAnimation(false);
      moveSlides();
      setEndX(endX);
      setSlideIndex(calculateSlideIndex(transform, slideWidth, children));
  };

  const endTouchScreen = (): void => {
    setAnimation(true);
    onSwipe();
    checkAreaWithoutSlides() && jumpToTheLastSlide();
    resetCoordinates();
    setMouseDown(false);
  };

  const resizeHandler = (): void => {
    setWindowWidth(window.innerWidth);
    setAnimation(false);
  };

  const handleDotClick = (index: number) => {
    setAnimation(true);  
    setTransform(-index * slideWidth);
    setSlideIndex(index)
  };

  useEffect(() => {
    setCurrent(ref.current);
    window.addEventListener("resize", resizeHandler);
  }, []);

  return {
    animation,
    slides,
    transform,
    slideWidth,
    ref,
    isButton,
    spaceBetween,
    slideIndex,
    nextImg,
    prevImg,
    setTransform, 
    setAnimation,
    handleDotClick,
    endTouchScreen,
    moveTouchScreen: isButton ? moveTouchScreen : () => {},
    startTouchByScreen: isButton ? startTouchByScreen : () => {},
  };
};

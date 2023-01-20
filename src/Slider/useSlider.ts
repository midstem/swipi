import { useEffect, useRef, useState } from "react";
import { useMemo } from "react";
import { returnSlideWidthType, sliderUpdateType } from "./types";
import { reduceSlide } from "./constants";

import {
  addUniqueId,
  isCornerSlide,
  returnCountSlides,
  returnSlideWidth,
  returnSpaceBetween,
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
    current: ref.current,
  };

  const slideWidth = isCornerSlide(sliderUpdates, windowWidth)
    ? returnSlideWidth(returnSlideWidthArgs) * reduceSlide
    : returnSlideWidth(returnSlideWidthArgs);

  const startTransform = useMemo(
    () => -slideWidth * children.length,
    [slideWidth, children.length]
  );

  const slides = useMemo(
    () =>
      isButton
        ? addUniqueId([...children, ...children, ...children])
        : addUniqueId(children),
    [children, isButton]
  );

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

  const nextImg = (): void => {
    setTransform((prev) => prev - slideWidth);
    setAnimation(true);

    checkSliderCorner() &&
      putInTheInitialPosition(() => setTransform((prev) => prev - slideWidth));
  };

  const prevImg = (): void => {
    setTransform((prev) => prev + slideWidth);
    setAnimation(true);

    checkSliderCorner() &&
      putInTheInitialPosition(() => setTransform((prev) => prev + slideWidth));
  };

  const onSwipe = (): void => {
    setTransform(
      (transform) => Math.round(transform / slideWidth) * slideWidth
    );
  };

  const startTouchByScreen = (startX: number): void => {
    checkSliderCorner() && turnInitialPositionByTouched();
    setStartX(startX);
  };

  const moveTouchScreen = (endX: number): void => {
    setAnimation(false);
    moveSlides();
    setEndX(endX);
  };

  const endTouchScreen = (): void => {
    setAnimation(true);
    onSwipe();
    checkAreaWithoutSlides() && jumpToTheLastSlide();
    resetCoordinates();
  };

  const resizeHandler = (): void => {
    setWindowWidth(window.innerWidth);
    setTransform(0);
    setAnimation(false);
  };

  useEffect(() => {
    window.addEventListener("resize", resizeHandler);
  }, []);

  return {
    nextImg,
    prevImg,
    animation,
    slides,
    transform,
    slideWidth,
    ref,
    moveTouchScreen: isButton ? moveTouchScreen : () => {},
    endTouchScreen,
    startTouchByScreen: isButton ? startTouchByScreen : () => {},
    isButton,
    spaceBetween,
  };
};

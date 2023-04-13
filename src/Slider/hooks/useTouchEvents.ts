import { TouchEvents } from '../types';
import { calculateSlideIndex } from '../helpers';
import { useState } from 'react';

export const useTouchEvents = ({
  isButton,
  transform,
  slideWidth,
  children,
  slides,
  visibleCountSlides,
  startTransform,
  setAnimation,
  setTransform,
  setSlideIndex,
  checkSliderCorner,
}: TouchEvents) => {
  const [startX, setStartX] = useState<number>(0);
  const [endX, setEndX] = useState<number>(0);
  const [movePath, setMovePath] = useState<number>(0);
  const [mouseDown, setMouseDown] = useState(false);

  const resetCoordinates = (): void => {
    setEndX(0);
    setMovePath(0);
    setStartX(0);
  };

  const checkAreaWithoutSlides = (): boolean =>
    transform <= startTransform * 2 - slideWidth || transform >= slideWidth / 2;

  const turnInitialPositionByTouched = (): void => {
    setAnimation(false);
    setTransform((prev) => (prev ? prev - startTransform : startTransform));
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

  const onSwipe = (): void => {
    setTransform((prev) => Math.round(prev / slideWidth) * slideWidth);
  };

  const startTouchByScreen = (X: number): void => {
    checkSliderCorner() && turnInitialPositionByTouched();
    setStartX(X);
    setMouseDown(true);
  };

  const moveTouchScreen = (X: number): void => {
    if (!mouseDown) return;
    setAnimation(false);
    moveSlides();
    setEndX(X);
    setSlideIndex(calculateSlideIndex(transform, slideWidth, children));
  };

  const endTouchScreen = (): void => {
    setAnimation(true);
    onSwipe();
    checkAreaWithoutSlides() && jumpToTheLastSlide();
    resetCoordinates();
    setMouseDown(false);
  };

  return {
    startTouchByScreen: isButton ? startTouchByScreen : () => {},
    moveTouchScreen: isButton ? moveTouchScreen : () => {},
    endTouchScreen,
  };
};

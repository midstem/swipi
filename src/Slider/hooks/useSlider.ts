import { useEffect, useRef, useState, useCallback } from 'react';
import { ConfigType } from '../types';
import { useTransform } from './useTransform';
import { useAnimation } from './useAnimation';
import { useWindowResize } from './useWindowResize';
import { useAutoplay } from './useAutoplay';
import { returnCountSlides } from '../helpers';
import { useTouchEvents } from './useTouchEvents';
import { useDots } from './useDots';
import { useNavigation } from './useNavigation';

export const useSlider = (
  children: JSX.Element[],
  config: ConfigType[],
  customActiveDot: JSX.Element | undefined,
  customDot: JSX.Element | undefined,
  slidesNumber: number,
  spaceBetweenSlides: number,
  autoplay: boolean,
  autoplaySpeed: number,
  dotsAnimation: string
) => {
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const [currentRef, setCurrentRef] = useState<HTMLDivElement | null>(null);
  const slidesWrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useWindowResize(() => {
    setWindowWidth(window.innerWidth);
    setAnimation(false);
    setSlideIndex(0);
    setTransform(0);
  });

  useAutoplay(autoplay, autoplaySpeed, buttonRef);

  const {
    isButton,
    setTransform,
    slideWidth,
    slides,
    spaceBetween,
    transform,
  } = useTransform({
    children,
    config,
    windowWidth,
    slidesNumber,
    spaceBetweenSlides,
    currentRef,
  });

  const {
    animation,
    nextDot,
    previousDot,
    setAnimation,
    setSlideIndex,
    slideIndex,
    Dots,
  } = useAnimation(dotsAnimation);

  const { handleDotClick, returnCustomDots } = useDots({
    setTransform,
    setSlideIndex,
    slideIndex,
    slideWidth,
    customActiveDot,
    customDot,
  });

  const visibleCountSlides = returnCountSlides(
    config,
    windowWidth,
    slidesNumber
  );

  const startTransform = -slideWidth * children.length;

  const checkSliderCorner = useCallback(
    (): boolean =>
      transform <= startTransform * 2 + slideWidth / 2 ||
      transform >= -slideWidth / 2,
    [transform, slideWidth, startTransform]
  );

  const putInTheInitialPosition = useCallback(
    (callback?: () => void): (() => void) => {
      setTransform(startTransform);
      setAnimation(false);

      const timer = setTimeout(() => {
        callback?.();
        setAnimation(true);
      }, 1);

      return () => clearTimeout(timer);
    },
    [startTransform, setAnimation, setTransform]
  );

  const { startTouchByScreen, moveTouchScreen, endTouchScreen } =
    useTouchEvents({
      isButton,
      transform,
      slideWidth,
      children,
      slides,
      startTransform,
      visibleCountSlides,
      setAnimation,
      setTransform,
      setSlideIndex,
      checkSliderCorner,
    });

  const { nextImg, prevImg } = useNavigation({
    putInTheInitialPosition,
    nextDot,
    previousDot,
    checkSliderCorner,
    setTransform,
    slideWidth,
    children,
  });

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    setCurrentRef(slidesWrapperRef.current);
  }, []);

  return {
    animation,
    slides,
    transform,
    slideWidth,
    slidesWrapperRef,
    isButton,
    spaceBetween,
    slideIndex,
    buttonRef,
    Dots,
    nextImg,
    prevImg,
    setTransform,
    setAnimation,
    handleDotClick,
    endTouchScreen,
    returnCustomDots,
    moveTouchScreen,
    startTouchByScreen,
  };
};

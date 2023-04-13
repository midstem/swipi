import { FunctionComponent, ReactNode } from 'react';
import { DotsTypes } from 'types';

export type AddUniqueIdReturnType = Array<{ id: string } & JSX.Element>;

export type ConfigType = {
  slidesNumber: number;
  maxWidth: number;
  biasRight?: boolean;
  spaceBetween?: number;
};

export type SliderProps = {
  spaceBetweenSlides?: number;
  slidesNumber?: number;
  nextButton?: ReactNode;
  prevButton?: ReactNode;
  children: JSX.Element[];
  config?: ConfigType[];
  showDots?: boolean;
  customDot?: JSX.Element;
  customActiveDot?: JSX.Element;
  dotColor?: string;
  activeDotColor?: string;
  sizeForDefaultDot?: number;
  sizeForDefaultActiveDot?: number;
  autoplay?: boolean;
  autoplaySpeed?: number;
  animationSpeed?: number;
  dotsAnimation?: string;
};

export type ReturnSlideWidthType = {
  visibleCountSlides: number;
  spaceBetween: number;
  current: HTMLDivElement | null;
};

export type NextPrevDotType = {
  prev: number;
  slideWidth: number;
  children: JSX.Element[];
};

export type AnimationsTypes = {
  [key: string]: FunctionComponent<DotsTypes>;
};

export type SetWithPrev = (value: number | ((prev: number) => number)) => void;

export type TouchEvents = {
  isButton: boolean;
  transform: number;
  slideWidth: number;
  startTransform: number;
  visibleCountSlides: number;
  slides: AddUniqueIdReturnType;
  children: JSX.Element[];
  setAnimation: (animation: boolean) => void;
  setTransform: SetWithPrev;
  setSlideIndex: (index: number) => void;
  checkSliderCorner: () => boolean;
};

export type Transform = {
  children: JSX.Element[];
  config: ConfigType[];
  windowWidth: number;
  slidesNumber: number;
  spaceBetweenSlides: number;
  currentRef: HTMLDivElement | null;
};

export type Navigation = {
  putInTheInitialPosition: (callback?: () => void) => () => void;
  nextDot: (prev: number, slideWidth: number, children: JSX.Element[]) => void;
  previousDot: (
    prev: number,
    slideWidth: number,
    children: JSX.Element[]
  ) => void;
  checkSliderCorner: () => boolean;
  setTransform: SetWithPrev;
  slideWidth: number;
  children: JSX.Element[];
};

export type Dots = {
  setTransform: SetWithPrev;
  setSlideIndex: SetWithPrev;
  slideIndex: number;
  slideWidth: number;
  customActiveDot?: JSX.Element;
  customDot?: JSX.Element;
};

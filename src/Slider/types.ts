import { ReactNode } from 'react';

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
  defaultSliderUpdates?: ConfigType[];
  defaultSpaceBetween?: number;
  showDots?: boolean;
  customDot?: JSX.Element;
  customActiveDot?: JSX.Element;
  dotColor?: string;
  activeDotColor?: string;
  sizeForDefaultDot?: number;
  autoplay?: boolean;
  autoplaySpeed?: number;
  animationSpeed?: number;
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

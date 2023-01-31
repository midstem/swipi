import { ReactNode } from 'react';
import { CSSProperties } from 'styled-components';

export type AddUniqueIdReturnType = Array<{ id: string } & JSX.Element>;

export type ConfigType = {
  slidesNumber: number;
  maxWidth: number;
  biasRight?: boolean;
  spaceBetween?: number;
};

export type SliderProps = {
  sx?: CSSProperties;
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
};

export type SlidesContainerType = {
  transform: number;
  animation: boolean;
};

export type ReturnSlideWidthType = {
  visibleCountSlides: number;
  spaceBetween: number;
  current: HTMLDivElement | null;
};

export type DotType = {
  slideIndex: number;
  index: number;
  dotColor?: string;
  activeDotColor?: string;
  sizeForDefaultDot?: number;
};

export type NextPrevDotType = {
  prev: number;
  slideWidth: number;
  children: JSX.Element[];
};

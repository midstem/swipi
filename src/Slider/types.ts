import { CSSProperties } from 'styled-components';

export type AddUniqueIdReturnType = Array<{ id: string } & JSX.Element>;

export type SliderUpdateType = {
  countSlide: number;
  maxWidth: number;
  isSlideCornerRight?: boolean;
  spaceBetween?: number;
};

export type SliderProps = {
  sx?: CSSProperties;
  nextButton?: JSX.Element;
  prevButton?: JSX.Element;
  children: JSX.Element[];
  sliderUpdates?: SliderUpdateType[];
  defaultSliderUpdates?: SliderUpdateType[];
  defaultSpaceBetween?: number;
  showDots?: boolean;
  customDot?: JSX.Element;
  customActiveDot?: JSX.Element;
  colorForDefaultDot?: string;
  colorForDefaultActiveDot?: string;
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
  colorForDefaultDot?: string;
  colorForDefaultActiveDot?: string;
  sizeForDefaultDot?: number;
};

export type NextPrevDotType = {
  prev: number;
  slideWidth: number;
  children: JSX.Element[];
};

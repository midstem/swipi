import { ReactNode } from "react";
import { CSSProperties } from "styled-components";

export type addUniqueIdReturnType = Array<{ id: string } & JSX.Element>;

export type sliderUpdateType = {
  countSlide: number;
  maxWidth: number;
  isSlideCornerRight?: boolean;
  spaceBetween?: number;
};

export type SliderProps = {
  defaultCountSlides?: number;
  sx?: CSSProperties;
  nextButton?: ReactNode;
  prevButton?: ReactNode;
  children: JSX.Element[];
  sliderUpdates?: sliderUpdateType[];
  defaultSpaceBetween?: number;
  showDots?: boolean;
  customDot?: JSX.Element;
  customActiveDot?: JSX.Element;
  defaultDotColor?: string;
  defaultDotActiveColor?: string;
  defaultDotSize?: number;
};

export type SlidesContainerType = {
  transform: number;
  animation: boolean;
};

export type returnSlideWidthType = {
  visibleCountSlides: number;
  spaceBetween: number;
  current: HTMLDivElement | null;
};

export type DotType = {
  slideIndex: number;
  index: number;
  defaultDotColor?: string;
  defaultDotActiveColor?: string;
  defaultDotSize?: number;
}

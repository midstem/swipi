import { FunctionComponent, ReactNode } from 'react';
import { DotsTypes, SlidesAnimation } from 'types';

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
  dotsAnimation?: DotsAnimation;
  slidesAnimation?: SlidesAnimation;
};

export type DotsAnimation = 'default' | 'sliding';

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
  [key in DotsAnimation]: FunctionComponent<DotsTypes>;
};

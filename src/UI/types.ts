import { ReactNode, RefObject } from 'react';

export type ComponentBasicProps = {
  children: React.ReactNode;
};

export type SliderButtonProps = {
  children: ReactNode;
  onClick: () => void;
  ref?: React.MutableRefObject<HTMLButtonElement>;
};

export type SlidesWrapperProps = {
  children: ReactNode;
  slidesWrapperRef: RefObject<HTMLDivElement>;
  startTouchByScreen: (a: number) => void;
  moveTouchScreen: (a: number) => void;
  endTouchScreen: () => void;
};

export type SlidesContainerProps = {
  children: ReactNode;
  animation: boolean;
  transform: number;
};

export type DotProps = {
  sizeForDefaultDot?: number;
  slideIndex: number;
  index: number;
  activeDotColor?: string;
  dotColor?: string;
};

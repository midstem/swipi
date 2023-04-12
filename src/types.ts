export type DotsTypes = {
  children: JSX.Element[];
  customDot?: JSX.Element;
  slideIndex: number;
  customActiveDot?: JSX.Element;
  sizeForDefaultDot?: number;
  sizeForDefaultActiveDot: number;
  activeDotColor?: string;
  dotColor?: string;
  animationSpeed: number;
  handleDotClick: (index: number) => void;
  returnDots: (index: number) => React.ReactNode;
};

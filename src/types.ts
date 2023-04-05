export type DotsTypes = {
  children: JSX.Element[];
  customDot: JSX.Element | undefined;
  slideIndex: number;
  customActiveDot: JSX.Element | undefined;
  sizeForDefaultDot: number | undefined;
  sizeForDefaultActiveDot: number;
  activeDotColor: string | undefined;
  dotColor: string | undefined;
  animationSpeed: number;
  handleDotClick: (index: number) => void;
  returnCustomDots: (index: number) => React.ReactNode;
};

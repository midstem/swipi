import { ConfigType } from 'Slider/types';

const BREAKPOINTS = {
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
};

export const defaultSliderWidth = 934;
export const reduceSlide = 0.75;

export const defaultConfig: ConfigType[] = [
  { slidesNumber: 2, maxWidth: BREAKPOINTS.lg },
  { slidesNumber: 1, maxWidth: 450, biasRight: true },
];

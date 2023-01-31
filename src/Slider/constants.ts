import { BREAKPOINTS } from '../constants';
import { ConfigType } from './types';

export const defaultSliderWidth = 934;
export const reduceSlide = 0.75;

export const defaultConfig: ConfigType[] = [
  { slidesNumber: 2, maxWidth: BREAKPOINTS.lg },
  { slidesNumber: 1, maxWidth: 450, biasRight: true },
];

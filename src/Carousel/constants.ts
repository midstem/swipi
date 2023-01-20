import { BREAKPOINTS } from "./../constants";
import { sliderUpdateType } from "./../Slider/types";

export const sliderUpdates: sliderUpdateType[] = [
  { countSlide: 2, maxWidth: BREAKPOINTS.lg },
  { countSlide: 1, maxWidth: 450, isSlideCornerRight: true, spaceBetween: 3 },
];

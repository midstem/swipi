import { BREAKPOINTS } from "../constants"
import { sliderUpdateType } from "./types";

export const defaultSliderWidth = 934
export const reduceSlide = 0.75

export const defaultSliderUpdates: sliderUpdateType[] = [
    { countSlide: 2, maxWidth: BREAKPOINTS.lg },
    { countSlide: 1, maxWidth: 450, isSlideCornerRight: true, spaceBetween: 3 },
  ];

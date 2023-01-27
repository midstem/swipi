import { v4 as uuid } from "uuid";
import {
  addUniqueIdReturnType,
  returnSlideWidthType,
  sliderUpdateType,
} from "./types";
import { defaultSliderWidth } from "./constants";

export const getSliderWidth = (current: HTMLDivElement | null): number =>
  current?.getBoundingClientRect().width ?? defaultSliderWidth;

export const addUniqueId = (slides: JSX.Element[]): addUniqueIdReturnType =>
  slides.map((slide) => ({ ...slide, id: uuid() }));

export const getSliderUpdatesParam = <T extends keyof sliderUpdateType>(
  sliderUpdates: sliderUpdateType[],
  windowWidth: number,
  param: T
): sliderUpdateType[T] | undefined =>
  sliderUpdates.filter((item) => item.maxWidth >= windowWidth).at(-1)?.[param];

export const isCornerSlide = (
  sliderUpdates: sliderUpdateType[],
  windowWidth: number
): boolean =>
  !!getSliderUpdatesParam(sliderUpdates, windowWidth, "isSlideCornerRight");

export const returnCountSlides = (
  defaultCountSlides: number,
  sliderUpdates: sliderUpdateType[],
  windowWidth: number
): number =>
  getSliderUpdatesParam(sliderUpdates, windowWidth, "countSlide") ||
  defaultCountSlides;

export const returnSpaceBetween = (
  defaultSpaceBetween: number,
  sliderUpdates: sliderUpdateType[],
  windowWidth: number
): number =>
  getSliderUpdatesParam(sliderUpdates, windowWidth, "spaceBetween") ||
  defaultSpaceBetween;

export const returnSlideWidth = ({
  visibleCountSlides,
  current,
  spaceBetween,
}: returnSlideWidthType): number =>
  (getSliderWidth(current) + spaceBetween) / visibleCountSlides;

export const calculateSlideIndex = (
  transform: number,
  slideWidth: number,
  children: JSX.Element[],
): number => {
  const result = Math.round(Math.abs(transform / slideWidth));

  return Math.abs(result % children.length)
};

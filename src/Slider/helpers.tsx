import { v4 as uuid } from 'uuid';
import {
  AddUniqueIdReturnType,
  ReturnSlideWidthType,
  SliderUpdateType,
} from './types';
import { defaultSliderWidth } from './constants';

export const getSliderWidth = (current: HTMLDivElement | null): number =>
  current?.getBoundingClientRect().width ?? defaultSliderWidth;

export const addUniqueId = (slides: JSX.Element[]): AddUniqueIdReturnType =>
  slides.map((slide) => ({ ...slide, id: uuid() }));

export const getSliderUpdatesParam = <T extends keyof SliderUpdateType>(
  sliderUpdates: SliderUpdateType[],
  windowWidth: number,
  param: T
): SliderUpdateType[T] | undefined =>
  sliderUpdates.filter((item) => item.maxWidth >= windowWidth).at(-1)?.[param];

export const isCornerSlide = (
  sliderUpdates: SliderUpdateType[],
  windowWidth: number
): boolean =>
  !!getSliderUpdatesParam(sliderUpdates, windowWidth, 'isSlideCornerRight');

export const returnCountSlides = (
  sliderUpdates: SliderUpdateType[],
  windowWidth: number
): number =>
  getSliderUpdatesParam(sliderUpdates, windowWidth, 'countSlide') || 3;

export const returnSpaceBetween = (
  sliderUpdates: SliderUpdateType[],
  windowWidth: number
): number =>
  getSliderUpdatesParam(sliderUpdates, windowWidth, 'spaceBetween') || 3;

export const returnSlideWidth = ({
  visibleCountSlides,
  current,
  spaceBetween,
}: ReturnSlideWidthType): number =>
  (getSliderWidth(current) + spaceBetween) / visibleCountSlides;

export const calculateSlideIndex = (
  transform: number,
  slideWidth: number,
  children: JSX.Element[]
): number => {
  const result = Math.round(Math.abs(transform / slideWidth));

  return Math.abs(result % children.length);
};

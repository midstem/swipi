import uniqid from 'uniqid';
import {
  AddUniqueIdReturnType,
  ReturnSlideWidthType,
  ConfigType,
} from 'Slider/types';
import { defaultSliderWidth } from 'Slider/constants';

export const getSliderWidth = (current: HTMLDivElement | null): number =>
  current?.getBoundingClientRect().width ?? defaultSliderWidth;

export const addUniqueId = (slides: JSX.Element[]): AddUniqueIdReturnType =>
  slides.map((slide) => ({ ...slide, id: uniqid() }));

export const getSliderUpdatesParam = <T extends keyof ConfigType>(
  config: ConfigType[],
  windowWidth: number,
  param: T
): ConfigType[T] | undefined =>
  config.filter((item) => item.maxWidth >= windowWidth).at(-1)?.[param];

export const isCornerSlide = (
  config: ConfigType[],
  windowWidth: number
): boolean => !!getSliderUpdatesParam(config, windowWidth, 'biasRight');

export const returnCountSlides = (
  config: ConfigType[],
  windowWidth: number,
  slidesNumber: number
): number =>
  getSliderUpdatesParam(config, windowWidth, 'slidesNumber') || slidesNumber;

export const returnSpaceBetween = (
  config: ConfigType[],
  windowWidth: number,
  spaceBetweenSlides: number
): number =>
  getSliderUpdatesParam(config, windowWidth, 'spaceBetween') ||
  spaceBetweenSlides;

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
export const startAutoplay = (
  autoplaySpeed: number,
  buttonRef: React.RefObject<HTMLButtonElement>
) => {
  setInterval(() => {
    buttonRef.current?.click();
  }, autoplaySpeed);
};

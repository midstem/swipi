import { SlidesAnimation } from '../types';
import { defaultSliderWidth } from './constants';
import {
  AddUniqueIdReturnType,
  ReturnSlideWidthType,
  ConfigType
} from './types';
import { fadeIn } from '../SlidesAnimation/FadeIn';

const generateUniqueID = () => {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return characters
    .split('')
    .map(() => characters.charAt(Math.floor(Math.random() * characters.length)))
    .join('');
};

export const getSliderWidth = (current: HTMLDivElement | null): number =>
  current?.getBoundingClientRect().width ?? defaultSliderWidth;

export const addUniqueId = (slides: JSX.Element[]): AddUniqueIdReturnType =>
  slides.map((slide) => ({ ...slide, id: generateUniqueID() }));

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
  spaceBetween
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
  timeout: React.MutableRefObject<NodeJS.Timeout | undefined>,
  nextImg: () => void
) => {
  timeout.current = setTimeout(() => {
    nextImg();
  }, autoplaySpeed);
};

export const setKeyToChildren = (children: JSX.Element[]): JSX.Element[] => {
  return children.map((child, index) => ({ ...child, key: index }));
};

export const isSlidesAnimation = (visibleCountSlides: number): boolean => {
  return visibleCountSlides === 1;
};

export const returnSlidesAnimation = (
  animation: SlidesAnimation,
  isVisible: boolean
) => {
  switch (animation) {
    case 'fade-in':
      return fadeIn(isVisible);
    default:
      return {};
  }
};

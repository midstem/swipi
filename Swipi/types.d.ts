import { FunctionComponent, ReactNode } from 'react';
import { DotsTypes, SlidesAnimation, ValueOf } from '../types';
import { SwipeDirections } from './constants';
export type AddUniqueIdReturnType = Array<{
    id: string;
} & JSX.Element>;
export type ConfigType = {
    maxWidth: number;
    biasRight?: boolean;
    slidesNumber: number;
    spaceBetween?: number;
};
export type UseSwipiType = {
    autoplay: boolean;
    dotColor?: string;
    showArrows: boolean;
    config: ConfigType[];
    slidesNumber: number;
    autoplaySpeed: number;
    children: JSX.Element[];
    activeDotColor?: string;
    customDot?: JSX.Element;
    spaceBetweenSlides: number;
    dotsAnimation: DotsAnimation;
    customActiveDot?: JSX.Element;
    slidesAnimation: ValueOf<SlidesAnimation>;
    loop: boolean;
};
export type SwipiProps = {
    dotColor?: string;
    showDots?: boolean;
    autoplay?: boolean;
    className?: string;
    showArrows?: boolean;
    slidesNumber?: number;
    config?: ConfigType[];
    nextButton?: ReactNode;
    prevButton?: ReactNode;
    autoplaySpeed?: number;
    children: JSX.Element[];
    customDot?: JSX.Element;
    animationSpeed?: number;
    activeDotColor?: string;
    sizeForDefaultDot?: number;
    spaceBetweenSlides?: number;
    customActiveDot?: JSX.Element;
    dotsAnimation?: DotsAnimation;
    sizeForDefaultActiveDot?: number;
    slidesAnimation?: ValueOf<SlidesAnimation>;
    loop?: boolean;
};
export type DotsAnimation = 'default' | 'sliding';
export type ReturnSlideWidthType = {
    current?: number;
    spaceBetween: number;
    visibleCountSlides: number;
};
export type NextPrevDotType = {
    prev: number;
    slideWidth: number;
    children: JSX.Element[];
};
export type AnimationsTypes = {
    [key in DotsAnimation]: FunctionComponent<DotsTypes>;
};
export type SetWithPrev = (value: number | ((prev: number) => number)) => void;
export type TouchCoordsType = {
    touchStartX: number;
    touchEndX: number;
};
export type CalculateSliderTransformT = {
    transform: number;
    slideWidth: number;
    swipedSide: SwipeDirections | null;
    timeTouch: Date;
    isDisableMove: boolean;
};

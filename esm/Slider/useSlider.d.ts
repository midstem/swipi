/// <reference types="react" />
import { ConfigType, DotsAnimation } from './types';
import { SlidesAnimation, ValueOf } from '../types';
export type Slider = {
    children: JSX.Element[];
    config: ConfigType[];
    customActiveDot: JSX.Element | undefined;
    customDot: JSX.Element | undefined;
    slidesNumber: number;
    spaceBetweenSlides: number;
    autoplay: boolean;
    autoplaySpeed: number;
    dotsAnimation: DotsAnimation;
    slidesAnimation: ValueOf<SlidesAnimation>;
    dotColor?: string;
    activeDotColor?: string;
};
export declare const useSlider: ({ children, config, customActiveDot, customDot, slidesNumber, spaceBetweenSlides, autoplay, autoplaySpeed, dotsAnimation, slidesAnimation, dotColor, activeDotColor }: Slider) => {
    animation: boolean;
    slides: import("./types").AddUniqueIdReturnType;
    transform: number;
    slideWidth: number;
    slidesWrapperRef: import("react").RefObject<HTMLDivElement>;
    isButton: boolean;
    spaceBetween: number;
    slideIndex: number;
    Dots: import("react").FunctionComponent<import("../types").DotsTypes>;
    returnDots: (index: number) => import("react").ReactNode;
    nextImg: () => void;
    prevImg: () => void;
    setTransform: import("react").Dispatch<import("react").SetStateAction<number>>;
    setAnimation: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    handleDotClick: (index: number) => void;
    onEnd: () => void;
    onMove: (X: number) => void;
    onStart: (X: number) => void;
};

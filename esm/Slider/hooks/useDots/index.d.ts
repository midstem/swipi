import { ReactNode } from 'react';
import { DotsProps } from './types';
export declare const useDots: ({ setTransform, slideWidth, customActiveDot, customDot, setAnimation, activeDotColor, dotColor }: DotsProps) => {
    handleDotClick: (index: number) => void;
    returnDots: (index: number) => ReactNode;
    slideIndex: number;
    setSlideIndex: import("react").Dispatch<import("react").SetStateAction<number>>;
    nextDot: (transform: number, children: JSX.Element[]) => void;
    prevDot: (transform: number, children: JSX.Element[]) => void;
};

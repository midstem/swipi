/// <reference types="react" />
export type DotsTypes = {
    children: JSX.Element[];
    customDot?: JSX.Element;
    slideIndex: number;
    customActiveDot?: JSX.Element;
    sizeForDefaultDot?: number;
    sizeForDefaultActiveDot: number;
    activeDotColor?: string;
    dotColor?: string;
    animationSpeed: number;
    handleDotClick: (index: number) => void;
    returnDots: (index: number) => React.ReactNode;
};
export declare enum SlidesAnimation {
    DEFAULT = "default",
    FADE_IN = "fade-in"
}
export type ValueOf<T extends string> = `${T}`;

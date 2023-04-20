/// <reference types="react" />
import { Slides } from './types';
export declare const useSlides: ({ children, config, windowWidth, currentRef, slidesNumber, spaceBetweenSlides, startX, endX, movePath, setMovePath, slidesAnimation }: Slides) => {
    transform: number;
    setTransform: import("react").Dispatch<import("react").SetStateAction<number>>;
    slideWidth: number;
    spaceBetween: number;
    isButton: boolean;
    slides: import("../../types").AddUniqueIdReturnType;
    checkAreaBeyondSlider: () => boolean;
    jumpToTheLastSlide: () => void;
    moveSlides: () => void;
    startTransform: number;
};

import { TouchEvents } from './types';
export declare const useEvents: ({ isButton, transform, slideWidth, startTransform, children, setAnimation, setTransform, setSlideIndex, checkSliderCorner, checkAreaBeyondSlider, jumpToTheLastSlide, moveSlides, setStartX, setEndX, setMovePath }: TouchEvents) => {
    onStart: (X: number) => void;
    onMove: (X: number) => void;
    onEnd: () => void;
};

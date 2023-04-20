/// <reference types="react" />
declare const useSliding: (slideIndex: number) => {
    dotsRef: import("react").MutableRefObject<(HTMLDivElement | null)[]>;
    activeDotRef: import("react").RefObject<HTMLDivElement>;
    activeDotLeft: number;
};
export default useSliding;

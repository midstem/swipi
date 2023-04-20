/// <reference types="react" />
import { Navigation } from './types';
export declare const useNavigation: ({ putInTheInitialPosition, checkSliderCorner, setTransform, setAnimation, slideWidth, children }: Navigation) => {
    nextImg: (callback: (transform: number, children: JSX.Element[]) => void) => void;
    prevImg: (callback: (transform: number, children: JSX.Element[]) => void) => void;
};

/// <reference types="node" />
/// <reference types="styled-components" />
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import { CSSProperties, MutableRefObject } from 'react';
import { AddUniqueIdReturnType, ReturnSlideWidthType } from '../types';
import { SlidesAnimation, ValueOf } from '../../types';
export declare const getSliderWidth: (current: HTMLDivElement | null) => number;
export declare const addUniqueId: (slides: JSX.Element[]) => AddUniqueIdReturnType;
export declare const returnSlideWidth: ({ visibleCountSlides, current, spaceBetween }: ReturnSlideWidthType) => number;
export declare const calculateSlideIndex: (transform: number, slideWidth: number, children: JSX.Element[]) => number;
export declare const startAutoplay: (autoplaySpeed: number, timeout: MutableRefObject<NodeJS.Timeout | undefined>, nextImg: () => void) => void;
export declare const isButtonFn: (children: JSX.Element[], visibleCountSlides: number) => boolean;
export declare const setKeyToChildren: (children: JSX.Element[]) => JSX.Element[];
export declare const returnSlidesAnimation: (animation: ValueOf<SlidesAnimation>, isVisible: boolean) => CSSProperties;
export declare const isFadeInAnimation: (animation: ValueOf<SlidesAnimation>) => boolean;

import { MutableRefObject } from 'react';
import { DotsLeftOffsetsTypes } from '../types';
export declare const getWidthDifference: (dotWidth: number, activeDotWidth: number) => number;
export declare const getDotsLeftOffsets: (dotsRef: MutableRefObject<(HTMLDivElement | null)[]>) => DotsLeftOffsetsTypes[];

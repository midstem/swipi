/// <reference types="node" />
import { MutableRefObject } from 'react';
export type Autoplay = {
    autoplay: boolean;
    autoplaySpeed: number;
    slideIndex: number;
    nextImg: () => void;
    timeout: MutableRefObject<NodeJS.Timeout | undefined>;
};

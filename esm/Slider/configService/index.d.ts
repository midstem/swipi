import { SlidesAnimation, ValueOf } from '../../types';
import { ConfigType } from '../types';
export declare const ConfigService: (config: ConfigType[], windowWidth: number) => {
    getSliderUpdatesParam: <T extends keyof ConfigType>(param: T) => ConfigType[T] | undefined;
    returnCountSlides: (slidesNumber: number) => number;
    returnSpaceBetween: (spaceBetweenSlides: number) => number;
    getRightSlidesCount: (slidesNumber: number, animation: ValueOf<SlidesAnimation>) => number;
};

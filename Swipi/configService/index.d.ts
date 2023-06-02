import { SlidesAnimation, ValueOf } from '../../types';
import { ConfigType } from '../types';
export declare const ConfigService: (config: ConfigType[], windowWidth: number) => {
    returnCountSlides: (slidesNumber: number) => number;
    returnSpaceBetween: (spaceBetweenSlides: number) => number;
    getRightSlidesCount: (slidesNumber: number, animation: ValueOf<SlidesAnimation>) => number;
    getSwipiUpdatesParam: <T extends keyof ConfigType>(param: T) => ConfigType[T] | undefined;
};

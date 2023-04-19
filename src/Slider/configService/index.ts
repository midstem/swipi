import { SlidesAnimation, ValueOf } from '../../types'
import { isFadeInAnimation } from '../helpers'
import { ConfigType } from '../types'

export const ConfigService = (config: ConfigType[], windowWidth: number) => {
  const getSliderUpdatesParam = <T extends keyof ConfigType>(
    param: T
  ): ConfigType[T] | undefined =>
    config.filter((item) => item.maxWidth >= windowWidth).at(-1)?.[param]

  const returnCountSlides = (slidesNumber: number): number =>
    getSliderUpdatesParam('slidesNumber') || slidesNumber

  const returnSpaceBetween = (spaceBetweenSlides: number): number =>
    getSliderUpdatesParam('spaceBetween') || spaceBetweenSlides

  const getRightSlidesCount = (
    slidesNumber: number,
    animation: ValueOf<SlidesAnimation>
  ) => {
    if (isFadeInAnimation(animation)) return 1

    return returnCountSlides(slidesNumber)
  }

  return {
    getSliderUpdatesParam,
    returnCountSlides,
    returnSpaceBetween,
    getRightSlidesCount
  }
}

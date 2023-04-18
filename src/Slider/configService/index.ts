import { ConfigType } from 'src/Slider/types'

export const ConfigService = (config: ConfigType[], windowWidth: number) => {
  const getSliderUpdatesParam = <T extends keyof ConfigType>(
    param: T
  ): ConfigType[T] | undefined =>
    config.filter((item) => item.maxWidth >= windowWidth).at(-1)?.[param]

  const returnCountSlides = (slidesNumber: number): number =>
    getSliderUpdatesParam('slidesNumber') || slidesNumber

  const returnSpaceBetween = (spaceBetweenSlides: number): number =>
    getSliderUpdatesParam('spaceBetween') || spaceBetweenSlides

  return {
    getSliderUpdatesParam,
    returnCountSlides,
    returnSpaceBetween
  }
}

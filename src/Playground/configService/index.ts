import { ConfigType } from '../types'

export const ConfigService = (config: ConfigType[], windowWidth: number) => {
  const getSwipiUpdatesParam = <T extends keyof ConfigType>(
    param: T
  ): ConfigType[T] | undefined =>
    config.filter((item) => item.maxWidth >= windowWidth).at(-1)?.[param]

  const returnCountSlides = (slidesNumber: number): number =>
    getSwipiUpdatesParam('slidesNumber') || slidesNumber

  const returnSpaceBetween = (spaceBetween: number): number =>
    getSwipiUpdatesParam('spaceBetween') || spaceBetween

  return {
    returnCountSlides,
    returnSpaceBetween,
    getSwipiUpdatesParam
  }
}

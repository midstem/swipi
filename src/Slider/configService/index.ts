import { SlidesAnimation, ValueOf } from '../../types'
import { getSliderBorders, isFadeInAnimation } from '../helpers'
import { NavigationAllowed } from '../helpers/types'
import { ConfigType } from '../types'

export const ConfigService = (
  config: ConfigType[],
  windowWidth: number,
  children: JSX.Element[]
) => {
  const getSliderUpdatesParam = <T extends keyof ConfigType>(
    param: T
  ): ConfigType[T] | undefined =>
    config.filter((item) => item.maxWidth >= windowWidth).at(-1)?.[param]

  const returnCountSlides = (slidesNumber: number): number =>
    getSliderUpdatesParam('slidesNumber') || slidesNumber

  const returnSpaceBetween = (spaceBetweenSlides: number): number =>
    getSliderUpdatesParam('spaceBetween') || spaceBetweenSlides

  const getFiniteSlides = () => {
    const endIndex = children.length - returnCountSlides(children.length) + 1
    return children.slice(0, endIndex)
  }

  const getRightSlidesCount = (
    slidesNumber: number,
    animation: ValueOf<SlidesAnimation>
  ) => {
    if (isFadeInAnimation(animation)) return 1

    return returnCountSlides(slidesNumber)
  }

  const isNavigationAllowed: NavigationAllowed =
    (loop, transform, slideWidth) => (isGrab, nextSlide) => {
      let newTransform = transform

      if (!isGrab) {
        newTransform = nextSlide
          ? transform - slideWidth
          : transform + slideWidth
      }

      const { left, right } = getSliderBorders(
        slideWidth,
        children.length,
        returnCountSlides(children.length)
      )

      if (loop) return true
      if (transform === 0 && nextSlide) return true
      if (newTransform <= left && newTransform >= right) return true

      return false
    }

  return {
    getSliderUpdatesParam,
    returnCountSlides,
    returnSpaceBetween,
    getRightSlidesCount,
    isNavigationAllowed,
    getFiniteSlides
  }
}

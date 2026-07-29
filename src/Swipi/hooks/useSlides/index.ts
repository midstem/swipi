import { useMemo } from 'react'
import { ConfigService } from '../../configService'
import { SlidesAnimation } from '../../../types'
import {
  calculateSlideWidthWithCorner,
  isHideArrowsFn,
  returnSlideWidth
} from '../../helpers'
import { FIRST_SLIDE_INDEX } from '../../constants'
import { Slides, UseSlidesReturn } from './types'

export const useSlides = ({
  config,
  loop,
  biasRight,
  windowWidth,
  slidesCount,
  containerWidth,
  slidesNumber,
  slidesAnimation,
  spaceBetweenSlides
}: Slides): UseSlidesReturn => {
  const { returnSpaceBetween, getSwipiUpdatesParam, getRightSlidesCount } =
    ConfigService(config, windowWidth)

  const visibleCountSlides = getRightSlidesCount(slidesNumber, slidesAnimation)
  const spaceBetween = returnSpaceBetween(spaceBetweenSlides)
  const isHideArrows = isHideArrowsFn(slidesCount, visibleCountSlides)
  const isCornerSlide =
    slidesAnimation === SlidesAnimation.DEFAULT
      ? (getSwipiUpdatesParam('biasRight') ?? biasRight)
      : false

  const updateSlideWidthArgs = useMemo(
    () => ({
      visibleCountSlides,
      spaceBetween,
      current: containerWidth
    }),
    [spaceBetween, visibleCountSlides, containerWidth]
  )

  const slideWidth = useMemo(() => {
    const width = returnSlideWidth(updateSlideWidthArgs)

    return isCornerSlide
      ? calculateSlideWidthWithCorner(width, visibleCountSlides)
      : width
  }, [isCornerSlide, updateSlideWidthArgs, visibleCountSlides])

  const isLoop = loop && isHideArrows

  const lastIndex = isLoop
    ? slidesCount - 1
    : Math.max(slidesCount - visibleCountSlides, FIRST_SLIDE_INDEX)

  return {
    isLoop,
    lastIndex,
    slideWidth,
    isHideArrows,
    spaceBetween,
    visibleCountSlides
  }
}

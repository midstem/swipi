import { useMemo } from 'react'
import { ConfigService } from '../../configService'
import {
  calculateSlideWidthWithCorner,
  hasSlidesOverflow,
  returnCountOfDots,
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
  spaceBetweenSlides
}: Slides): UseSlidesReturn => {
  const { returnSpaceBetween, getSwipiUpdatesParam, returnCountSlides } =
    ConfigService(config, windowWidth)

  const visibleCountSlides = returnCountSlides(slidesNumber)
  const spaceBetween = returnSpaceBetween(spaceBetweenSlides)
  const hasOverflow = hasSlidesOverflow(slidesCount, visibleCountSlides)
  const isCornerSlide = getSwipiUpdatesParam('biasRight') ?? biasRight

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

  const isLoop = loop && hasOverflow

  const lastIndex = isLoop
    ? slidesCount - 1
    : Math.max(slidesCount - visibleCountSlides, FIRST_SLIDE_INDEX)

  return {
    isLoop,
    lastIndex,
    slideWidth,
    hasOverflow,
    spaceBetween,
    countShowDots: returnCountOfDots(slidesCount, visibleCountSlides, isLoop)
  }
}

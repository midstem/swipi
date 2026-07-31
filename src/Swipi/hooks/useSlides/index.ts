import { useMemo } from 'react'
import { ConfigService } from '../../configService'
import {
  calculateSlideWidthWithCorner,
  hasSlidesOverflow,
  returnSlideWidth
} from '../../helpers'
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

  return {
    slideWidth,
    hasOverflow,
    spaceBetween,
    isLoop: loop && hasOverflow
  }
}

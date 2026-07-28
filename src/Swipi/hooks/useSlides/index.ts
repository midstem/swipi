import { useMemo } from 'react'
import { ConfigService } from '../../configService'
import { SlidesAnimation } from '../../../types'
import {
  calculateSlideWidthWithCorner,
  getSlideOffsets,
  isHideArrowsFn,
  returnSlideWidth
} from '../../helpers'
import { FIRST_SLIDE_INDEX } from '../../constants'
import { Slides, UseSlidesReturn } from './types'

export const useSlides = ({
  config,
  loop,
  children,
  biasRight,
  transform,
  currentRef,
  windowWidth,
  slidesNumber,
  slidesAnimation,
  spaceBetweenSlides
}: Slides): UseSlidesReturn => {
  const { returnSpaceBetween, getSwipiUpdatesParam, getRightSlidesCount } =
    ConfigService(config, windowWidth)

  const slidesCount = children.length
  const visibleCountSlides = getRightSlidesCount(slidesNumber, slidesAnimation)
  const spaceBetween = returnSpaceBetween(spaceBetweenSlides)
  const isHideArrows = isHideArrowsFn(slidesCount, visibleCountSlides)
  const isCornerSlide =
    slidesAnimation === SlidesAnimation.DEFAULT
      ? (getSwipiUpdatesParam('biasRight') ?? biasRight)
      : false

  const currentRefWidth = currentRef?.clientWidth

  const updateSlideWidthArgs = useMemo(
    () => ({
      visibleCountSlides,
      spaceBetween,
      current: currentRefWidth
    }),
    [spaceBetween, visibleCountSlides, currentRefWidth]
  )

  const slideWidth = useMemo(() => {
    const width = returnSlideWidth(updateSlideWidthArgs)

    return isCornerSlide
      ? calculateSlideWidthWithCorner(width, visibleCountSlides)
      : width
  }, [isCornerSlide, updateSlideWidthArgs, visibleCountSlides])

  /**
   * Looping a carousel that already shows every slide at once has nothing to
   * recycle, so it silently falls back to a bounded track.
   */
  const isLoop = loop && isHideArrows

  const lastIndex = isLoop
    ? slidesCount - 1
    : Math.max(slidesCount - visibleCountSlides, FIRST_SLIDE_INDEX)

  const slideOffsets = useMemo(
    () => getSlideOffsets({ transform, slideWidth, slidesCount, loop: isLoop }),
    [transform, slideWidth, slidesCount, isLoop]
  )

  return {
    isLoop,
    lastIndex,
    slideWidth,
    isHideArrows,
    spaceBetween,
    slideOffsets,
    visibleCountSlides
  }
}

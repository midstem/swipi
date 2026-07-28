import { CSSProperties, MutableRefObject } from 'react'
import {
  CalculateSlideIndexType,
  ClampTransformType,
  ReturnSlideWidthType,
  SlideOffsetsType,
  SlidePositions,
  SnapToSlideType,
  TouchCoordsType
} from '../types'
import { returnTimeDifference } from '../../helpers'
import { SlidesAnimation, ValueOf } from '../../types'
import { fadeIn } from '../../SlidesAnimation/FadeIn'
import {
  DISTANCE,
  FIRST_SLIDE_IDENTIFIER,
  DEFAULT_SWIPI_WIDTH,
  FAST_SWIPE_TIME,
  ONE_SLIDE,
  REDUCE_SLIDE,
  ONE_STEP,
  FIRST_SLIDE,
  FIRST_SLIDE_INDEX,
  HALF
} from '../constants'
import { SwipeDirections } from '../constants'

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max)

export const normalizeIndex = (index: number, slidesCount: number): number =>
  ((index % slidesCount) + slidesCount) % slidesCount

export const returnSlideWidth = ({
  visibleCountSlides,
  current,
  spaceBetween
}: ReturnSlideWidthType): number =>
  ((current || DEFAULT_SWIPI_WIDTH) + spaceBetween) / visibleCountSlides

export const getTrackPosition = (
  transform: number,
  slideWidth: number
): number => (slideWidth > 0 ? -transform / slideWidth : 0)

export const calculateSlideIndex = ({
  transform,
  slideWidth,
  slidesCount,
  lastIndex,
  loop
}: CalculateSlideIndexType): number => {
  if (slideWidth <= 0 || slidesCount <= 0) return FIRST_SLIDE_INDEX

  const index = Math.round(getTrackPosition(transform, slideWidth))

  return loop
    ? normalizeIndex(index, slidesCount)
    : clamp(index, FIRST_SLIDE_INDEX, lastIndex)
}

export const clampTransform = ({
  transform,
  slideWidth,
  lastIndex,
  loop
}: ClampTransformType): number =>
  loop ? transform : clamp(transform, -lastIndex * slideWidth, 0)

export const getSlideOffsets = ({
  transform,
  slideWidth,
  slidesCount,
  loop
}: SlideOffsetsType): number[] => {
  const contentSize = slidesCount * slideWidth

  if (!loop || contentSize <= 0) {
    return Array.from({ length: slidesCount }, () => 0)
  }

  return Array.from({ length: slidesCount }, (_, index) => {
    const position = index * slideWidth + transform
    const laps = Math.floor((position + slideWidth) / contentSize)

    return laps ? -laps * contentSize : 0
  })
}

export const getShortestLoopStep = (
  from: number,
  to: number,
  slidesCount: number
): number => {
  const step = normalizeIndex(to - from, slidesCount)

  return step > slidesCount * HALF ? step - slidesCount : step
}

export const startAutoplay = (
  autoplaySpeed: number,
  timeout: MutableRefObject<ReturnType<typeof setTimeout> | undefined>,
  nextImg: () => void
) => {
  timeout.current = setTimeout(() => {
    nextImg()
  }, autoplaySpeed)
}

export const isHideArrowsFn = (
  slidesCount: number,
  visibleCountSlides: number
) => slidesCount > visibleCountSlides

export const returnSlidesAnimation = (
  animation: ValueOf<SlidesAnimation>,
  isVisible: boolean
): CSSProperties => {
  switch (animation) {
    case SlidesAnimation.FADE_IN:
      return fadeIn(isVisible)
    default:
      return {}
  }
}

export const isFadeInAnimation = (animation: ValueOf<SlidesAnimation>) => {
  return animation === SlidesAnimation.FADE_IN
}

export const getSwipeDirection = ({
  touchEndX,
  touchStartX
}: TouchCoordsType): SwipeDirections | null => {
  if (touchEndX - touchStartX > DISTANCE) return SwipeDirections.RIGHT

  if (touchStartX - touchEndX > DISTANCE) return SwipeDirections.LEFT

  return null
}

export const returnCountOfDots = (
  slidesCount: number,
  visibleCountSlides: number,
  loop: boolean
): number => {
  if (slidesCount === visibleCountSlides) return ONE_SLIDE

  if (loop) return slidesCount

  if (visibleCountSlides === ONE_SLIDE) return slidesCount

  return Math.max(
    slidesCount - visibleCountSlides + FIRST_SLIDE_IDENTIFIER,
    ONE_SLIDE
  )
}

export const snapToSlide = ({
  transform,
  slideWidth,
  swipedSide,
  timeTouch
}: SnapToSlideType): number => {
  const position = getTrackPosition(transform, slideWidth)
  const isFastSwipe =
    returnTimeDifference(timeTouch, new Date()) <= FAST_SWIPE_TIME

  if (isFastSwipe && swipedSide === SwipeDirections.LEFT) {
    return -Math.ceil(position) * slideWidth
  }

  if (isFastSwipe && swipedSide === SwipeDirections.RIGHT) {
    return -Math.floor(position) * slideWidth
  }

  return -Math.round(position) * slideWidth
}

const getLoopSlidePositions = (
  slideIndex: number,
  dotsCount: number
): SlidePositions => {
  const prev = slideIndex <= FIRST_SLIDE ? dotsCount : slideIndex - ONE_STEP
  const next = slideIndex < dotsCount ? slideIndex + ONE_STEP : FIRST_SLIDE

  return { current: slideIndex, next, prev }
}

const getRegularSlidePositions = (
  slideIndex: number,
  dotsCount: number
): SlidePositions => {
  const prev = slideIndex <= FIRST_SLIDE ? FIRST_SLIDE : slideIndex - ONE_STEP
  const next = slideIndex < dotsCount ? slideIndex + ONE_STEP : dotsCount

  return { current: slideIndex, next, prev }
}

export const getSlidePositions = (
  slideIndex: number,
  dotsCount: number,
  loop: boolean
): SlidePositions => {
  if (loop) {
    return getLoopSlidePositions(slideIndex + 1, dotsCount)
  }

  return getRegularSlidePositions(slideIndex + 1, dotsCount)
}

export const calculateSlideWidthWithCorner = (
  width: number,
  visibleCountSlides: number
): number => {
  return width - (REDUCE_SLIDE * width) / visibleCountSlides
}

export const easeOutCubic = (progress: number): number =>
  1 - Math.pow(1 - progress, 3)

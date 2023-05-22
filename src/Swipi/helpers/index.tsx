import { CSSProperties, MutableRefObject } from 'react'
import {
  AddUniqueIdReturnType,
  CalculateSliderTransformT,
  ReturnSlideWidthType,
  TouchCoordsType
} from '../types'
import { generateUniqueID, returnTimeDifference } from '../../helpers'
import { SlidesAnimation, ValueOf } from '../../types'
import { fadeIn } from '../../SlidesAnimation/FadeIn'
import {
  DISTANCE,
  FIRST_SLIDE_IDENTIFIER,
  DEFAULT_SWIPI_WIDTH,
  FAST_SWIPE_TIME
} from '../constants'
import { SwipeDirections } from '../constants'

export const addUniqueId = (slides: JSX.Element[]): AddUniqueIdReturnType =>
  slides.map((slide) => ({ ...slide, id: generateUniqueID() }))

export const returnSlideWidth = ({
  visibleCountSlides,
  current = DEFAULT_SWIPI_WIDTH,
  spaceBetween
}: ReturnSlideWidthType): number =>
  (current + spaceBetween) / visibleCountSlides

export const calculateSlideIndex = (
  transform: number,
  slideWidth: number,
  children: JSX.Element[]
): number => {
  const result = Math.round(Math.abs(transform / slideWidth))

  return Math.abs(result % children.length)
}

export const startAutoplay = (
  autoplaySpeed: number,
  timeout: MutableRefObject<NodeJS.Timeout | undefined>,
  nextImg: () => void
) => {
  timeout.current = setTimeout(() => {
    nextImg()
  }, autoplaySpeed)
}

export const isShowArrowsFn = (
  children: JSX.Element[],
  visibleCountSlides: number,
  showArrows: boolean
) => (showArrows ? children.length > visibleCountSlides : showArrows)

export const setKeyToChildren = (children: JSX.Element[]): JSX.Element[] => {
  return children.map((child, index) => ({ ...child, key: index }))
}

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
  children: JSX.Element[],
  visibleCountSlides: number,
  loop: boolean
): number => {
  if (loop || visibleCountSlides === 1) return children.length

  return (
    Math.round(children.length / visibleCountSlides) + FIRST_SLIDE_IDENTIFIER
  )
}

export const calculateSliderTransform = ({
  transform,
  slideWidth,
  swipedSide,
  timeTouch,
  isDisableMove
}: CalculateSliderTransformT): number => {
  const currentSlide = transform / slideWidth
  const currentTransform = Math.round(currentSlide) * slideWidth

  if (isDisableMove) {
    return currentTransform
  }

  if (returnTimeDifference(timeTouch, new Date()) > FAST_SWIPE_TIME) {
    return currentTransform
  }

  if (swipedSide === SwipeDirections.LEFT) {
    return Math.floor(currentSlide) * slideWidth
  }

  if (swipedSide === SwipeDirections.RIGHT)
    return Math.ceil(currentSlide) * slideWidth

  return currentTransform
}

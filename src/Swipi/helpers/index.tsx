import {
  CSSProperties,
  isValidElement,
  Key,
  MutableRefObject,
  ReactNode
} from 'react'
import {
  ConfigType,
  DragVelocityType,
  MomentumDurationType,
  ReturnSlideWidthType,
  SlidePositions
} from '../types'
import { SlidesAnimation, ValueOf } from '../../types'
import { fadeIn } from '../../SlidesAnimation/FadeIn'
import {
  DEFAULT_SWIPI_WIDTH,
  EASE_SPEED_FACTOR,
  FIRST_SLIDE,
  MAX_DRAG_VELOCITY,
  MAX_MOMENTUM_DURATION,
  MIN_MOMENTUM_DURATION,
  MIN_SAMPLE_TIME,
  ONE_SLIDE,
  ONE_STEP,
  REDUCE_SLIDE
} from '../constants'

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

export const startAutoplay = (
  autoplaySpeed: number,
  timeout: MutableRefObject<ReturnType<typeof setTimeout> | undefined>,
  nextImg: () => void
) => {
  timeout.current = setTimeout(() => {
    nextImg()
  }, autoplaySpeed)
}

export const hasSlidesOverflow = (
  slidesCount: number,
  visibleCountSlides: number
): boolean => slidesCount > visibleCountSlides

const NO_ANIMATION: CSSProperties = {}

export const returnSlidesAnimation = (
  animation: ValueOf<SlidesAnimation>,
  isVisible: boolean
): CSSProperties => {
  switch (animation) {
    case SlidesAnimation.FADE_IN:
      return fadeIn(isVisible)
    default:
      return NO_ANIMATION
  }
}

export const isFadeInAnimation = (animation: ValueOf<SlidesAnimation>) => {
  return animation === SlidesAnimation.FADE_IN
}

export const toCoreConfig = (
  config: ConfigType[],
  animation: ValueOf<SlidesAnimation>
): ConfigType[] =>
  isFadeInAnimation(animation)
    ? config.map((entry) => ({
        ...entry,
        slidesNumber: ONE_SLIDE,
        biasRight: false
      }))
    : config

export const getDragVelocity = ({
  distance,
  duration
}: DragVelocityType): number =>
  clamp(
    distance / Math.max(duration, MIN_SAMPLE_TIME),
    -MAX_DRAG_VELOCITY,
    MAX_DRAG_VELOCITY
  )

export const getMomentumDuration = ({
  distance,
  velocity,
  animationSpeed
}: MomentumDurationType): number => {
  if (!velocity) return animationSpeed

  return clamp(
    (EASE_SPEED_FACTOR * Math.abs(distance)) / Math.abs(velocity),
    MIN_MOMENTUM_DURATION,
    MAX_MOMENTUM_DURATION
  )
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

export const getSlideKey = (slide: ReactNode, index: number): Key =>
  isValidElement(slide) ? (slide.key ?? index) : index

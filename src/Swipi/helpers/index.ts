import { MutableRefObject } from 'react'
import {
  DragVelocityType,
  MomentumDurationType,
  SlidePositions
} from '../types'
import {
  EASE_SPEED_FACTOR,
  FIRST_SLIDE_INDEX,
  MAX_DRAG_VELOCITY,
  MAX_MOMENTUM_DURATION,
  MIN_MOMENTUM_DURATION,
  MIN_SAMPLE_TIME,
  ONE_STEP
} from '../constants'

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max)

export const normalizeIndex = (index: number, slidesCount: number): number =>
  ((index % slidesCount) + slidesCount) % slidesCount

export const startAutoplay = (
  autoplaySpeed: number,
  timeout: MutableRefObject<ReturnType<typeof setTimeout> | undefined>,
  nextImg: () => void
) => {
  timeout.current = setTimeout(() => {
    if (typeof document !== 'undefined' && document.hidden) {
      startAutoplay(autoplaySpeed, timeout, nextImg)
      return
    }

    nextImg()
  }, autoplaySpeed)
}

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
): SlidePositions => ({
  prev: normalizeIndex(slideIndex - ONE_STEP, dotsCount),
  current: slideIndex,
  next: normalizeIndex(slideIndex + ONE_STEP, dotsCount)
})

const getRegularSlidePositions = (
  slideIndex: number,
  dotsCount: number
): SlidePositions => {
  const lastIndex = dotsCount - ONE_STEP

  return {
    prev: clamp(slideIndex - ONE_STEP, FIRST_SLIDE_INDEX, lastIndex),
    current: slideIndex,
    next: clamp(slideIndex + ONE_STEP, FIRST_SLIDE_INDEX, lastIndex)
  }
}

export const getSlidePositions = (
  slideIndex: number,
  dotsCount: number,
  loop: boolean
): SlidePositions => {
  if (loop) {
    return getLoopSlidePositions(slideIndex, dotsCount)
  }

  return getRegularSlidePositions(slideIndex, dotsCount)
}

export const easeOutCubic = (progress: number): number =>
  1 - Math.pow(1 - progress, 3)

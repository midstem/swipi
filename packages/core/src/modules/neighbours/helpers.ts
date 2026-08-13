import { FIRST_SLIDE_INDEX, ONE_STEP } from '#src/constants'
import { clamp, normalizeIndex } from '#src/modules/math'
import { SlidePositions } from '#src/types'

export const getLoopSlidePositions = (
  slideIndex: number,
  dotsCount: number
): SlidePositions => ({
  prev: normalizeIndex(slideIndex - ONE_STEP, dotsCount),
  current: slideIndex,
  next: normalizeIndex(slideIndex + ONE_STEP, dotsCount)
})

export const getRegularSlidePositions = (
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

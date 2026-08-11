import { SlidePositions } from '../types'
import { getLoopSlidePositions, getRegularSlidePositions } from './helpers'

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

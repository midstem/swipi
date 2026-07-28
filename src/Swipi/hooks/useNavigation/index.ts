import { useCallback } from 'react'
import {
  clamp,
  clampTransform,
  getShortestLoopStep,
  getTrackPosition,
  normalizeIndex
} from '../../helpers'
import { FIRST_SLIDE_INDEX, ONE_STEP } from '../../constants'
import { Navigation, UseNavigationReturn } from './types'

export const useNavigation = ({
  isLoop,
  lastIndex,
  targetRef,
  animateTo,
  slideWidth,
  slidesCount,
  canScrollNext,
  canScrollPrev
}: Navigation): UseNavigationReturn => {
  const scrollBy = useCallback(
    (step: number): void => {
      const transform = targetRef.current - step * slideWidth

      animateTo(
        clampTransform({ transform, slideWidth, lastIndex, loop: isLoop })
      )
    },
    [animateTo, isLoop, lastIndex, slideWidth, targetRef]
  )

  const nextImg = useCallback((): void => {
    if (!canScrollNext) return

    scrollBy(ONE_STEP)
  }, [canScrollNext, scrollBy])

  const prevImg = useCallback((): void => {
    if (!canScrollPrev) return

    scrollBy(-ONE_STEP)
  }, [canScrollPrev, scrollBy])

  const scrollTo = useCallback(
    (index: number): void => {
      if (!isLoop) {
        animateTo(-clamp(index, FIRST_SLIDE_INDEX, lastIndex) * slideWidth)
        return
      }

      const position = Math.round(
        getTrackPosition(targetRef.current, slideWidth)
      )
      const step = getShortestLoopStep(
        normalizeIndex(position, slidesCount),
        normalizeIndex(index, slidesCount),
        slidesCount
      )

      animateTo(-(position + step) * slideWidth)
    },
    [animateTo, isLoop, lastIndex, slideWidth, slidesCount, targetRef]
  )

  return { nextImg, prevImg, scrollTo }
}

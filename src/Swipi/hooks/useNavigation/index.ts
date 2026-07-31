import { useCallback } from 'react'
import { clampToSnaps, getScrollToTarget, getStepTarget } from '../../geometry'
import { ONE_STEP } from '../../constants'
import { Navigation, UseNavigationReturn } from './types'

export const useNavigation = ({
  isLoop,
  geometry,
  targetRef,
  animateTo,
  canScrollNext,
  canScrollPrev
}: Navigation): UseNavigationReturn => {
  const scrollBy = useCallback(
    (step: number): void => {
      const transform = getStepTarget(targetRef.current, geometry, isLoop, step)

      animateTo(clampToSnaps(transform, geometry, isLoop))
    },
    [animateTo, isLoop, geometry, targetRef]
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
      animateTo(getScrollToTarget(targetRef.current, geometry, isLoop, index))
    },
    [animateTo, isLoop, geometry, targetRef]
  )

  return { nextImg, prevImg, scrollTo }
}

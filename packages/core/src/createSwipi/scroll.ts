import {
  clampToSnaps,
  getScrollToTarget,
  getStepTarget
} from '../modules/geometry'
import { ONE_STEP } from '../constants'
import { SlidesGeometry } from '../types'

export type SetupScrollProps = {
  getCanScrollNext: () => boolean
  getCanScrollPrev: () => boolean
  getTarget: () => number
  getGeometry: () => SlidesGeometry
  getIsLoop: () => boolean
  getAnimationSpeed: () => number
  getPrefersReducedMotion: () => boolean
  animateTo: (
    value: number,
    duration: number,
    prefersReducedMotion: boolean
  ) => void
}

export const setupScroll = ({
  getCanScrollNext,
  getCanScrollPrev,
  getTarget,
  getGeometry,
  getIsLoop,
  getAnimationSpeed,
  getPrefersReducedMotion,
  animateTo
}: SetupScrollProps) => {
  const scrollNext = () => {
    if (!getCanScrollNext()) return
    const isLoop = getIsLoop()
    const geometry = getGeometry()
    const transformValue = getStepTarget(
      getTarget(),
      geometry,
      isLoop,
      ONE_STEP
    )

    animateTo(
      clampToSnaps(transformValue, geometry, isLoop),
      getAnimationSpeed(),
      getPrefersReducedMotion()
    )
  }

  const scrollPrev = () => {
    if (!getCanScrollPrev()) return
    const isLoop = getIsLoop()
    const geometry = getGeometry()
    const transformValue = getStepTarget(
      getTarget(),
      geometry,
      isLoop,
      -ONE_STEP
    )

    animateTo(
      clampToSnaps(transformValue, geometry, isLoop),
      getAnimationSpeed(),
      getPrefersReducedMotion()
    )
  }

  const scrollTo = (index: number) => {
    const isLoop = getIsLoop()
    const geometry = getGeometry()
    const transformValue = getScrollToTarget(
      getTarget(),
      geometry,
      isLoop,
      index
    )

    animateTo(transformValue, getAnimationSpeed(), getPrefersReducedMotion())
  }

  return { scrollNext, scrollPrev, scrollTo }
}

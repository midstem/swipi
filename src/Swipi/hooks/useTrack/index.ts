import { useRef } from 'react'
import { EMPTY_TRANSFORM } from '../../constants'
import { getSlideOffset } from '../../helpers'
import { UseTrackProps, UseTrackReturn } from './types'

const toTranslate = (value: number): string =>
  value ? `translate3d(${value}px, 0, 0)` : EMPTY_TRANSFORM

export const useTrack = ({
  loop,
  slideWidth,
  slidesCount
}: UseTrackProps): UseTrackReturn => {
  const trackRef = useRef<HTMLDivElement>(null)
  const slidesRef = useRef<(HTMLDivElement | null)[]>([])
  const appliedOffsetsRef = useRef(new WeakMap<HTMLDivElement, number>())
  const hasAppliedOffsetsRef = useRef(false)

  const renderTrack = (transform: number): void => {
    if (!trackRef.current) return

    trackRef.current.style.transform = toTranslate(transform)
  }

  const renderSlideOffsets = (transform: number): void => {
    const appliedOffsets = appliedOffsetsRef.current

    slidesRef.current.forEach((slide, index) => {
      if (!slide) return

      const offset = getSlideOffset({
        index,
        transform,
        slideWidth,
        slidesCount,
        loop
      })

      if (appliedOffsets.get(slide) === offset) return

      appliedOffsets.set(slide, offset)
      hasAppliedOffsetsRef.current = true
      slide.style.transform = toTranslate(offset)
    })
  }

  const resetSlideOffsets = (): void => {
    if (!hasAppliedOffsetsRef.current) return

    slidesRef.current.forEach((slide) => {
      if (!slide) return

      slide.style.transform = EMPTY_TRANSFORM
    })

    appliedOffsetsRef.current = new WeakMap()
    hasAppliedOffsetsRef.current = false
  }

  const render = (transform: number): void => {
    renderTrack(transform)

    if (!loop) {
      resetSlideOffsets()
      return
    }

    renderSlideOffsets(transform)
  }

  return { trackRef, slidesRef, render }
}

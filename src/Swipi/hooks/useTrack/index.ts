import { useRef } from 'react'
import { EMPTY_TRANSFORM, NO_OFFSET } from '../../constants'
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

  const render = (transform: number): void => {
    if (trackRef.current) {
      trackRef.current.style.transform = toTranslate(transform)
    }

    slidesRef.current.forEach((slide, index) => {
      if (!slide) return

      const offset = loop
        ? getSlideOffset({ index, transform, slideWidth, slidesCount, loop })
        : NO_OFFSET

      slide.style.transform = toTranslate(offset)
    })
  }

  return { trackRef, slidesRef, render }
}

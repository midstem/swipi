import { useLayoutEffect, useRef } from 'react'
import {
  EMPTY_TRANSFORM,
  SLIDE_GAP_VARIABLE,
  SLIDE_WIDTH_VARIABLE
} from '../../constants'
import { getSlideOffset } from '../../helpers'
import { UseTrackProps, UseTrackReturn } from './types'

const toTranslate = (value: number): string =>
  value ? `translate3d(${value}px, 0, 0)` : EMPTY_TRANSFORM

const toPixels = (value: number): string => `${value}px`

const forEachSlide = (
  track: HTMLElement,
  visit: (slide: HTMLElement, index: number) => void
): void => {
  const { children } = track

  for (let index = 0; index < children.length; index += 1) {
    visit(children[index] as HTMLElement, index)
  }
}

export const useTrack = ({
  loop,
  trackRef,
  slideWidth,
  slidesCount,
  spaceBetween
}: UseTrackProps): UseTrackReturn => {
  const appliedOffsetsRef = useRef(new WeakMap<HTMLElement, number>())
  const hasAppliedOffsetsRef = useRef(false)

  const renderSlideOffsets = (track: HTMLElement, transform: number): void => {
    const appliedOffsets = appliedOffsetsRef.current

    forEachSlide(track, (slide, index) => {
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

  const resetSlideOffsets = (track: HTMLElement): void => {
    if (!hasAppliedOffsetsRef.current) return

    forEachSlide(track, (slide) => {
      slide.style.transform = EMPTY_TRANSFORM
    })

    appliedOffsetsRef.current = new WeakMap()
    hasAppliedOffsetsRef.current = false
  }

  const render = (transform: number): void => {
    const track = trackRef.current

    if (!track) return

    track.style.transform = toTranslate(transform)

    if (!loop) {
      resetSlideOffsets(track)
      return
    }

    renderSlideOffsets(track, transform)
  }

  useLayoutEffect(() => {
    const track = trackRef.current

    if (!track) return

    track.style.setProperty(SLIDE_WIDTH_VARIABLE, toPixels(slideWidth))
    track.style.setProperty(SLIDE_GAP_VARIABLE, toPixels(spaceBetween))
  }, [trackRef, slideWidth, spaceBetween])

  return { render }
}

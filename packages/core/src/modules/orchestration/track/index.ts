import {
  EMPTY_TRANSFORM,
  SLIDE_GAP_VARIABLE,
  SLIDE_WIDTH_VARIABLE
} from '../../../constants'
import { SlidesGeometry, SlideOffsets } from '../../../types'
import { getSlideLap } from '../../geometry'
import { toTranslate, forEachSlide } from './helpers'
import { RenderTrackProps } from './types'

export const writeVariable = (
  track: HTMLElement,
  variable: string,
  value?: number
): void => {
  if (value === undefined) {
    track.style.removeProperty(variable)
    return
  }
  track.style.setProperty(variable, `${value}px`)
}

export const applyTrackVariables = (
  track: HTMLElement,
  slideWidth?: number,
  spaceBetween?: number
): void => {
  writeVariable(track, SLIDE_WIDTH_VARIABLE, slideWidth)
  writeVariable(track, SLIDE_GAP_VARIABLE, spaceBetween)
}

export const removeTrackVariables = (track: HTMLElement): void => {
  track.style.removeProperty(SLIDE_WIDTH_VARIABLE)
  track.style.removeProperty(SLIDE_GAP_VARIABLE)
}

export const renderSlideOffsets = (
  track: HTMLElement,
  transform: number,
  geometry: SlidesGeometry,
  offsets: SlideOffsets
): boolean => {
  let hasApplied = false

  forEachSlide(track, (slide, index) => {
    const offset = getSlideLap(index, transform, geometry)

    if (offsets.get(slide) === offset) return

    offsets.set(slide, offset)
    hasApplied = true
    slide.style.transform = toTranslate(offset)
  })

  return hasApplied
}

export const resetSlideOffsets = (track: HTMLElement): void => {
  forEachSlide(track, (slide) => {
    slide.style.transform = EMPTY_TRANSFORM
  })
}

export const renderTrack = ({
  track,
  transform,
  loop,
  geometry,
  offsets,
  hasAppliedOffsets
}: RenderTrackProps): boolean => {
  track.style.transform = toTranslate(transform)

  if (!loop) {
    if (hasAppliedOffsets) resetSlideOffsets(track)

    return false
  }

  return (
    renderSlideOffsets(track, transform, geometry, offsets) || hasAppliedOffsets
  )
}

export const clearTrackTransform = (track: HTMLElement): void => {
  track.style.transform = EMPTY_TRANSFORM
}

export type { RenderTrackProps }

import {
  EMPTY_TRANSFORM,
  getSlideLap,
  SlidesGeometry,
  SlideOffsets,
  SLIDE_GAP_VARIABLE,
  SLIDE_WIDTH_VARIABLE
} from '../../../index'
import { toTranslate, forEachSlide } from './helpers'

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
  offsets: SlideOffsets,
  onOffsetApplied: () => void
): void => {
  forEachSlide(track, (slide, index) => {
    const offset = getSlideLap(index, transform, geometry)

    if (offsets.get(slide) === offset) return

    offsets.set(slide, offset)
    onOffsetApplied()
    slide.style.transform = toTranslate(offset)
  })
}

export const resetSlideOffsets = (
  track: HTMLElement,
  onReset: () => void
): void => {
  forEachSlide(track, (slide) => {
    slide.style.transform = EMPTY_TRANSFORM
  })
  onReset()
}

export const renderTrack = (
  track: HTMLElement,
  transform: number,
  loop: boolean,
  geometry: SlidesGeometry,
  offsets: SlideOffsets,
  hasAppliedOffsets: boolean,
  onOffsetApplied: () => void,
  onResetOffsets: () => void
): void => {
  track.style.transform = toTranslate(transform)

  if (!loop) {
    if (hasAppliedOffsets) {
      resetSlideOffsets(track, onResetOffsets)
    }
    return
  }

  renderSlideOffsets(track, transform, geometry, offsets, onOffsetApplied)
}

export const clearTrackTransform = (track: HTMLElement): void => {
  track.style.transform = EMPTY_TRANSFORM
}

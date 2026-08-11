import { FIRST_SLIDE_INDEX, NO_SLIDES } from '../constants'
import { clamp } from '../modules/math'
import { SlidesGeometry, SlidesMeasurement, SwipiOptions } from '../types'
import { EMPTY_MEASUREMENT } from '../modules/orchestration/observers'
import { toSnaps, getSnapIndex } from '../modules/geometry'

export type GeometryState = {
  slideIndex: number
  containerWidth: number
  measurement: SlidesMeasurement
  geometry: SlidesGeometry
  hasOverflow: boolean
  isLoop: boolean
  canScrollNext: boolean
  canScrollPrev: boolean
  countShowDots: number
  lastIndex: number
  isMeasured: boolean
  isStartIndexApplied: boolean
}

export type SetupGeometrySyncProps = {
  getOptions: () => SwipiOptions
  syncStateAndNotify: (state: GeometryState) => void
  moveTo: (target: number) => void
  restartAutoplay: () => void
}

export const setupGeometrySync = ({
  getOptions,
  syncStateAndNotify,
  moveTo,
  restartAutoplay
}: SetupGeometrySyncProps) => {
  const state: GeometryState = {
    slideIndex: FIRST_SLIDE_INDEX,
    containerWidth: 0,
    measurement: EMPTY_MEASUREMENT,
    geometry: { ...EMPTY_MEASUREMENT, snaps: [] },
    hasOverflow: false,
    isLoop: false,
    canScrollNext: false,
    canScrollPrev: false,
    countShowDots: 0,
    lastIndex: FIRST_SLIDE_INDEX,
    isMeasured: false,
    isStartIndexApplied: false
  }

  const syncGeometry = (width: number, measure: SlidesMeasurement) => {
    state.containerWidth = width
    state.measurement = measure
    const slidesCount = state.measurement.sizes.length
    state.isMeasured = slidesCount > NO_SLIDES

    state.hasOverflow = state.measurement.contentSize > state.containerWidth
    state.isLoop = !!getOptions().loop && state.hasOverflow

    state.geometry = {
      ...state.measurement,
      snaps: toSnaps({
        ...state.measurement,
        viewportWidth: state.containerWidth,
        loop: state.isLoop
      })
    }

    state.countShowDots = state.geometry.snaps.length
    state.lastIndex = Math.max(state.countShowDots - 1, FIRST_SLIDE_INDEX)

    state.canScrollNext = state.isLoop || state.slideIndex < state.lastIndex
    state.canScrollPrev = state.isLoop || state.slideIndex > FIRST_SLIDE_INDEX

    syncStateAndNotify(state)

    if (state.isMeasured) {
      if (!state.isStartIndexApplied) {
        state.isStartIndexApplied = true
        const startIndex = getOptions().startIndex ?? FIRST_SLIDE_INDEX
        moveTo(
          state.geometry.snaps[
            clamp(startIndex, FIRST_SLIDE_INDEX, state.lastIndex)
          ] ?? 0
        )
      } else {
        moveTo(
          state.geometry.snaps[clamp(state.slideIndex, 0, state.lastIndex)] ?? 0
        )
      }
    }
  }

  const syncSlideIndex = (target: number): void => {
    const index = getSnapIndex(target, state.geometry, state.isLoop)
    if (state.slideIndex !== index) {
      state.slideIndex = index
      state.canScrollNext = state.isLoop || state.slideIndex < state.lastIndex
      state.canScrollPrev = state.isLoop || state.slideIndex > FIRST_SLIDE_INDEX

      restartAutoplay()
      syncStateAndNotify(state)
    }
  }

  return { state, syncGeometry, syncSlideIndex }
}

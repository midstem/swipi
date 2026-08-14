import {
  ResolvedSwipiOptions,
  SwipiOptions,
  SwipiApi,
  SlideOffsets,
  SlidesMeasurement
} from '#src/types'
import { measureSlides } from '#src/modules/geometry'
import { getSlidePositions } from '#src/modules/neighbours'
import {
  applyTrackVariables,
  removeTrackVariables,
  renderTrack,
  clearTrackTransform,
  resetSlideOffsets
} from '#src/modules/orchestration/track'
import { setupTransform } from '#src/modules/orchestration/transform'
import { setupEvents } from '#src/modules/orchestration/events'
import { setupObservers } from '#src/modules/orchestration/observers'
import { setupAutoplay } from '#src/modules/orchestration/autoplay'
import { setupPrefersReducedMotion } from '#src/modules/orchestration/prefersReducedMotion'

import { MISSING_TRACK_ERROR } from './constants'
import { resolveOptions } from './options'
import { toStoreState } from './helpers'
import { setupStore } from './store'
import { setupScroll } from './scroll'
import { createGeometryState, setupGeometrySync } from './geometrySync'

export const createSwipi = (
  viewport: HTMLElement,
  options: SwipiOptions = {}
): SwipiApi => {
  const track = viewport.firstElementChild as HTMLElement | null
  if (!track) throw new Error(MISSING_TRACK_ERROR)

  let currentOptions: ResolvedSwipiOptions = resolveOptions(options)
  let prefersReducedMotion = false

  const offsets: SlideOffsets = new WeakMap()
  let hasAppliedOffsets = false

  const watchReducedMotion = (): (() => void) =>
    setupPrefersReducedMotion((reduced) => {
      prefersReducedMotion = currentOptions.respectReducedMotion
        ? reduced
        : false
    })

  const state = createGeometryState()

  const store = setupStore({
    onChange: (positions) => currentOptions.onChange?.(positions),
    onSelect: (selection) => currentOptions.onSelect?.(selection),
    getSlidePositions,
    getIsMeasured: () => state.isMeasured,
    getIsLoop: () => state.isLoop
  })

  const sync = setupGeometrySync({
    state,
    getOptions: () => currentOptions,
    onState: (next) => store.updateSnapshot(toStoreState(next))
  })

  const render = (transformValue: number): void => {
    hasAppliedOffsets = renderTrack({
      track,
      transform: transformValue,
      axis: currentOptions.axis,
      loop: state.isLoop,
      geometry: state.geometry,
      offsets,
      hasAppliedOffsets
    })
  }

  const autoplayApi = setupAutoplay({
    getAutoplay: () => currentOptions.autoplay,
    getAutoplaySpeed: () => currentOptions.autoplaySpeed,
    onTick: () => scrollApi.scrollNext()
  })

  const syncSlideIndex = (target: number): void => {
    if (sync.syncSlideIndex(target)) autoplayApi.restart()
  }

  const transformApi = setupTransform({ render, onTarget: syncSlideIndex })

  const syncGeometry = (
    width: number,
    measurement: SlidesMeasurement
  ): void => {
    const target = sync.syncGeometry(width, measurement)

    if (target !== null) transformApi.moveTo(target)
  }

  const scrollApi = setupScroll({
    getCanScrollNext: () => state.canScrollNext,
    getCanScrollPrev: () => state.canScrollPrev,
    getTarget: () => transformApi.getContext().target,
    getGeometry: () => state.geometry,
    getIsLoop: () => state.isLoop,
    getAnimationSpeed: () => currentOptions.animationSpeed,
    getPrefersReducedMotion: () => prefersReducedMotion,
    animateTo: transformApi.animateTo
  })

  const destroyEvents = setupEvents({
    viewport,
    getAxis: () => currentOptions.axis,
    getIsLoop: () => state.isLoop,
    getDragFree: () => currentOptions.dragFree,
    getGeometry: () => state.geometry,
    getHasOverflow: () => state.hasOverflow,
    getAnimationSpeed: () => currentOptions.animationSpeed,
    getTransform: () => transformApi.getContext().transform,
    moveTo: transformApi.moveTo,
    animateTo: (value, duration) =>
      transformApi.animateTo(
        value,
        duration ?? currentOptions.animationSpeed,
        prefersReducedMotion
      )
  })

  autoplayApi.restart()

  let destroyPrefersReducedMotion = watchReducedMotion()

  applyTrackVariables(
    track,
    currentOptions.slideWidth,
    currentOptions.spaceBetween
  )

  const observers = setupObservers({
    track,
    offsets,
    getAxis: () => currentOptions.axis,
    onMeasure: syncGeometry
  })

  return {
    scrollNext: scrollApi.scrollNext,
    scrollPrev: scrollApi.scrollPrev,
    scrollTo: scrollApi.scrollTo,
    getSnapshot: () => store.getSnapshot(toStoreState(state)),
    subscribe: store.subscribe,
    update: (newOptions) => {
      const prevOptions = currentOptions
      currentOptions = resolveOptions({ ...currentOptions, ...newOptions })

      if (prevOptions.axis !== currentOptions.axis) {
        resetSlideOffsets(track, offsets)
        hasAppliedOffsets = false
        clearTrackTransform(track)
        applyTrackVariables(
          track,
          currentOptions.slideWidth,
          currentOptions.spaceBetween
        )
        observers.remeasure()
        render(transformApi.getContext().transform)
      } else if (
        prevOptions.slideWidth !== currentOptions.slideWidth ||
        prevOptions.spaceBetween !== currentOptions.spaceBetween
      ) {
        applyTrackVariables(
          track,
          currentOptions.slideWidth,
          currentOptions.spaceBetween
        )
        syncGeometry(
          state.containerWidth,
          measureSlides(track, offsets, currentOptions.axis)
        )
        render(transformApi.getContext().transform)
      } else if (prevOptions.loop !== currentOptions.loop) {
        syncGeometry(state.containerWidth, state.measurement)
        render(transformApi.getContext().transform)
      }

      if (
        prevOptions.autoplay !== currentOptions.autoplay ||
        prevOptions.autoplaySpeed !== currentOptions.autoplaySpeed
      ) {
        autoplayApi.restart()
      }

      if (
        prevOptions.respectReducedMotion !== currentOptions.respectReducedMotion
      ) {
        destroyPrefersReducedMotion()
        destroyPrefersReducedMotion = watchReducedMotion()
      }
    },
    measure: observers.measure,
    sync: () => {
      render(transformApi.getContext().transform)
      syncSlideIndex(transformApi.getContext().target)
    },
    destroy: () => {
      destroyEvents()
      observers.destroy()
      destroyPrefersReducedMotion()
      autoplayApi.destroy()
      transformApi.destroy()
      removeTrackVariables(track)
      clearTrackTransform(track)
      resetSlideOffsets(track)
      hasAppliedOffsets = false
    }
  }
}
